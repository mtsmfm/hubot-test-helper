/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Fs    = require('fs');
const Path  = require('path');
const Hubot = require('hubot');

process.setMaxListeners(0);

class MockResponse extends Hubot.Response {
  sendPrivate(...strings) {
    return this.robot.adapter.sendPrivate(this.envelope, ...Array.from(strings));
  }
}

class MockRobot extends Hubot.Robot {
  constructor(httpd) {
    if (httpd == null) { httpd = true; }
    super(null, null, httpd, 'hubot');

    this.Response = MockResponse;
  }

  loadAdapter() {
    return this.adapter = new Room(this);
  }
}

class Room extends Hubot.Adapter {
  constructor(robot) {
    {
      // Hack: trick Babel/TypeScript into allowing this before super.
      if (false) { super(); }
      let thisFn = (() => { this; }).toString();
      let thisName = thisFn.slice(thisFn.indexOf('{') + 1, thisFn.indexOf(';')).trim();
      eval(`${thisName} = this;`);
    }
    this.robot = robot;
    this.messages = [];

    this.privateMessages = {};

    this.user = {
      say: (userName, message, userParams) => {
        return this.receive(userName, message, userParams);
      },

      enter: (userName, userParams) => {
        return this.enter(userName, userParams);
      },

      leave: (userName, userParams) => {
        return this.leave(userName, userParams);
      }
    };
  }

  receive(userName, message, userParams) {
    if (userParams == null) { userParams = {}; }
    return new Promise(resolve => {
      let textMessage = null;
      if ((typeof message === 'object') && message) {
        textMessage = message;
      } else {
        userParams.room = this.name;
        const user = new Hubot.User(userName, userParams);
        textMessage = new Hubot.TextMessage(user, message);
      }

      this.messages.push([userName, textMessage.text]);
      return this.robot.receive(textMessage, resolve);
    });
  }

  destroy() {
    if (this.robot.server) { return this.robot.server.close(); }
  }

  reply(envelope, ...strings) {
    return Array.from(strings).map((str) => this.messages.push(['hubot', `@${envelope.user.name} ${str}`]));
  }

  send(envelope, ...strings) {
    return Array.from(strings).map((str) => this.messages.push(['hubot', str]));
  }

  sendPrivate(envelope, ...strings) {
    if (!(envelope.user.name in this.privateMessages)) {
      this.privateMessages[envelope.user.name] = [];
    }
    return Array.from(strings).map((str) => this.privateMessages[envelope.user.name].push(['hubot', str]));
  }

  robotEvent() {
    return this.robot.emit.apply(this.robot, arguments);
  }

  enter(userName, userParams) {
    if (userParams == null) { userParams = {}; }
    return new Promise(resolve => {
      userParams.room = this.name;
      const user = new Hubot.User(userName, userParams);
      return this.robot.receive(new Hubot.EnterMessage(user), resolve);
    });
  }

  leave(userName, userParams) {
    if (userParams == null) { userParams = {}; }
    return new Promise(resolve => {
      userParams.room = this.name;
      const user = new Hubot.User(userName, userParams);
      return this.robot.receive(new Hubot.LeaveMessage(user), resolve);
    });
  }
}

class Helper {
  static initClass() {
    this.Response = MockResponse;
  }

  constructor(scriptsPaths) {
    if (!Array.isArray(scriptsPaths)) {
      scriptsPaths = [scriptsPaths];
    }
    this.scriptsPaths = scriptsPaths;
  }

  createRoom(options) {
    if (options == null) { options = {}; }
    const robot = new MockRobot(options.httpd);

    if ('response' in options) {
      robot.Response = options.response;
    }

    for (let script of Array.from(this.scriptsPaths)) {
      script = Path.resolve(Path.dirname(module.parent.filename), script);
      if (Fs.statSync(script).isDirectory()) {
        for (let file of Array.from(Fs.readdirSync(script).sort())) {
          robot.loadFile(script, file);
        }
      } else {
        robot.loadFile(Path.dirname(script), Path.basename(script));
      }
    }

    robot.brain.emit('loaded');

    robot.adapter.name = options.name || 'room1';
    return robot.adapter;
  }
}
Helper.initClass();

module.exports = Helper;

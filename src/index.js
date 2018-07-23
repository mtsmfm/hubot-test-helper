'use strict'

const Fs    = require('fs');
const Path  = require('path');
const Hubot = require('hubot/es2015');

process.setMaxListeners(0);

class SlackClient {

  constructor(robot) {
    this.robot = robot;
  }

  fetchUserByName(name) {
    return this.robot.brain.userForName(name);
  }

  fetchUserById(id) {
    return this.robot.brain.userForId(id);
  }
}

class SlackUser extends Hubot.User {

  constructor(id, options) {
    super(id, options);
    this.info = {}
  }
}

class SlackMessage extends Hubot.TextMessage {

  constructor(user, message) {
    super(user, message);
    this.mentions = [];
  }

  static get MENTION_REGEX() {
    return /([@#!])([^\s|]+)/g;
  }

  static get RAW_MENTION_REGEX() {
    return /<([@#!])?([^>|]+)>/g;
  }

  static buildSlackMessage(client, user, message) {
    const slackMessage = new SlackMessage(user, message);
    slackMessage.replaceLinks(client, slackMessage.text)
    return slackMessage;
  }

  replaceLinks(client, text) {
    const regex = SlackMessage.MENTION_REGEX;
    regex.lastIndex = 0;
    let cursor = 0;
    let result = null;

    while (result = regex.exec(text)) {
      const [m, type, link] = result;
      switch (type) {
        case '@':
          const user = client.fetchUserByName(link);
          if (user) {
            this.mentions.push(new SlackMention(user.id, 'user', user));
          }
          break;
        case '#':
          console.log('# link is not supported yet');
          break;
        case '!':
          console.log('! link is not supported yet');
          break;
      }
      cursor = regex.lastIndex;
      if (result[0].length == 0) {
        regex.lastIndex++
      }
    }
    return text;
  }

  static deferMessage(client, text) {
    const regex = SlackMessage.RAW_MENTION_REGEX;
    regex.lastIndex = 0;
    let cursor = 0;
    let result = null;
    const parts = [];

    while (result = regex.exec(text)) {
      const [m, type, link] = result;
      switch (type) {
        case '@':
          parts.push('@' + text.slice(cursor, result.index), SlackMessage.replaceUser(client, link));
          break;
        case '#':
          console.log('# link is not supported yet');
          break;
        case '!':
          console.log('! link is not supported yet');
          break;
      }
      cursor = regex.lastIndex;
      if (result[0].length == 0) {
        regex.lastIndex++
      }
    }
    parts.push(text.slice(cursor));
    return parts.join('');
  }

  static replaceUser(client, id) {
    const user = client.fetchUserById(id);
    if (user) {
      return `${user.name}`;
    }
    console.error(`Error getting user info ${id}: ${error.message}`);
    return `<@${id}>`;
  }
}

class SlackMention {

  constructor(id, type, info) {
    this.id = id;
    this.type = type;
    this.info = info;
  }
}

class MockResponse extends Hubot.Response {
  sendPrivate(/* ...strings*/) {
    const strings = [].slice.call(arguments, 0);

    this.robot.adapter.sendPrivate.apply(this.robot.adapter, [this.envelope].concat(strings));
  }
}

class MockRobot extends Hubot.Robot {
  constructor(httpd) {
    if (httpd == null) { httpd = true; }
    super(null, null, httpd, 'hubot');

    this.messagesTo = {};

    this.Response = MockResponse;
  }

  messageRoom(roomName, str) {
    if (roomName == this.adapter.name) {
      this.adapter.messages.push(['hubot', str]);
    } else {
      if (!(roomName in this.messagesTo)) {
        this.messagesTo[roomName] = [];
      }
      this.messagesTo[roomName].push(['hubot', str]);
    }
  }

  loadAdapter() {
    this.adapter = new Room(this);
  }
}

class Room extends Hubot.Adapter {
  // XXX: https://github.com/hubotio/hubot/pull/1390
  static messages(obj) {
    if (obj instanceof MockRobot) {
      return obj.adapter.messages;
    } else {
      return obj.messages;
    }
  }

  constructor(robot) {
    super();
    this.robot = robot;
    this.client = new SlackClient(this.robot);

    this.messages = [];
    this.privateMessages = {};

    this.user = {
      say: (userName, message, userParams) => this.receive(userName, message, userParams),
      enter: (userName, userParams) => this.enter(userName, userParams),
      leave: (userName, userParams) => this.leave(userName, userParams)
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
        const user = new SlackUser(userName, userParams);
        textMessage = SlackMessage.buildSlackMessage(this.client, user, message);
      }

      this.messages.push([userName, textMessage.text]);
      this.robot.receive(textMessage, resolve);
    });
  }

  destroy() {
    if (this.robot.server) { this.robot.server.close(); }
  }

  reply(envelope/*, ...strings*/) {
    const strings = [].slice.call(arguments, 1);

    strings.forEach((str) => {
      const msg = SlackMessage.deferMessage(this.client, str);
      Room.messages(this).push(['hubot', `@${envelope.user.name} ${msg}`]) 
    });
  }

  send(envelope/*, ...strings*/) {
    const strings = [].slice.call(arguments, 1);

    strings.forEach((str) => {
      const msg = SlackMessage.deferMessage(this.client, str);
      Room.messages(this).push(['hubot', msg])
    });
  }

  sendPrivate(envelope/*, ...strings*/) {
    const strings = [].slice.call(arguments, 1);

    if (!(envelope.user.name in this.privateMessages)) {
      this.privateMessages[envelope.user.name] = [];
    }
    strings.forEach((str) => {
      const msg = SlackMessage.deferMessage(this.client, str);
      this.privateMessages[envelope.user.name].push(['hubot', msg])
    });
  }

  robotEvent() {
    this.robot.emit.apply(this.robot, arguments);
  }

  enter(userName, userParams) {
    if (userParams == null) { userParams = {}; }
    return new Promise(resolve => {
      userParams.room = this.name;
      const user = new Hubot.User(userName, userParams);
      this.robot.receive(new Hubot.EnterMessage(user), resolve);
    });
  }

  leave(userName, userParams) {
    if (userParams == null) { userParams = {}; }
    return new Promise(resolve => {
      userParams.room = this.name;
      const user = new Hubot.User(userName, userParams);
      this.robot.receive(new Hubot.LeaveMessage(user), resolve);
    });
  }
}

class Helper {
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

    for (let script of this.scriptsPaths) {
      script = Path.resolve(Path.dirname(module.parent.filename), script);
      if (Fs.statSync(script).isDirectory()) {
        for (let file of Fs.readdirSync(script).sort()) {
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
Helper.Response = MockResponse;

module.exports = Helper;

'use strict'

const Fs    = require('fs');
const Path  = require('path');
const Hubot = require('hubot/es2015');

process.setMaxListeners(0);

class MockResponse extends Hubot.Response {
  sendPrivate(...strings) {
    this.robot.adapter.sendPrivate(this.envelope, ...strings);
  }
}

class MockRobot extends Hubot.Robot {
  constructor(httpd = false, botName = null, roomName = null) {
    super('test', httpd ?? false, botName ?? 'hubot', null);

    this.roomName = roomName ?? 'room1';
    this.messagesTo = {};

    this.Response = MockResponse;
  }

  async messageRoom(room, ...strings) {
    if (room === this.adapter.name) {
      strings.forEach((str) => this.adapter.messages.push([this.name, str]));
    } else {
      if (!(room in this.messagesTo)) {
        this.messagesTo[room] = [];
      }
      strings.forEach((str) => this.messagesTo[room].push([this.name, str]));
    }

    return Promise.resolve();
  }

  async loadAdapter(adapterPath = null) {
    this.adapter = new Room(this, this.roomName);
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

  constructor(robot, name) {
    super();
    this.robot = robot;
    this.name = name;
    this.messages = [];

    this.privateMessages = {};

    this.user = {
      say: (userName, message, userParams) => this.receive(userName, message, userParams),
      enter: (userName, userParams) => this.enter(userName, userParams),
      leave: (userName, userParams) => this.leave(userName, userParams)
    };
  }

  async receive(userName, message, userParams) {
    let textMessage = null;
    if ((typeof message === 'object') && message) {
      textMessage = message;
    } else {
      const user = new Hubot.User(userName, {room: this.name, ...userParams});
      textMessage = new Hubot.TextMessage(user, message);
    }

    this.messages.push([userName, textMessage.text]);
    return await this.robot.receive(textMessage);
  }

  destroy() {
    if (this.robot.server) { this.robot.server.close(); }
  }

  reply(envelope, ...strings) {
    strings.forEach((str) => Room.messages(this).push([this.robot.name, `@${envelope.user.name} ${str}`]));
  }

  send(envelope, ...strings) {
    strings.forEach((str) => Room.messages(this).push([this.robot.name, str]));
  }

  sendPrivate(envelope, ...strings) {
    if (!(envelope.user.name in this.privateMessages)) {
      this.privateMessages[envelope.user.name] = [];
    }
    strings.forEach((str) => this.privateMessages[envelope.user.name].push([this.robot.name, str]));
  }

  robotEvent(event, ...args) {
    return this.robot.emit(event, ...args);
  }

  async enter(userName, userParams) {
    const user = new Hubot.User(userName, {room: this.name, ...userParams});
    return this.robot.receive(new Hubot.EnterMessage(user));
  }

  async leave(userName, userParams) {
    const user = new Hubot.User(userName, {room: this.name, ...userParams});
    return this.robot.receive(new Hubot.LeaveMessage(user));
  }
}

class Helper {
  constructor(scriptsPaths) {
    if (!Array.isArray(scriptsPaths)) {
      scriptsPaths = [scriptsPaths];
    }
    this.scriptsPaths = scriptsPaths;
  }

  async createRoom(options = null) {
    const robot = new MockRobot(options?.httpd ?? false, options?.name ?? null, options?.room ?? null);

    if (options?.response) {
      robot.Response = options.response;
    }

    await robot.loadAdapter();

    if (robot.shouldEnableHttpd){
      await robot.setupExpress();
    }

    const filePromises = [];
    for (let script of this.scriptsPaths) {
      let scriptPath = script;
      if(!Path.isAbsolute(scriptPath)) {
        scriptPath = Path.resolve(Path.dirname(module.parent.filename), scriptPath);
      }

      if (Fs.statSync(scriptPath).isDirectory()) {
        for (let file of Fs.readdirSync(scriptPath).sort()) {
          filePromises.push(robot.loadFile(scriptPath, file));
        }
      } else {
        filePromises.push(robot.loadFile(Path.dirname(scriptPath), Path.basename(scriptPath)));
      }
    }

    await Promise.all(filePromises);

    robot.brain.emit('loaded');

    return robot.adapter;
  }
}

Helper.Response = MockResponse;

module.exports = Helper;

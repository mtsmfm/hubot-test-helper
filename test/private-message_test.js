'use strict';

const Helper = require('../src/index');

const { expect } = require('chai');

const helper = new Helper('./scripts/private-message.js');

describe('private-message', () => {
  let room;

  beforeEach(async () => {
    room = await helper.createRoom();
  });

  context('user asks hubot for a secret', () => {
    beforeEach(async () => {
      await room.user.say('alice', '@hubot tell me a secret');
    });

    it('should not post to the public channel', () => {
      expect(room.messages).to.eql([
        ['alice', '@hubot tell me a secret']
      ]);
    });

    it('should private message user', () => {
      expect(room.privateMessages).to.eql({
        'alice': [
          ['hubot', 'whisper whisper whisper']
        ]
      });
    });
  });
});

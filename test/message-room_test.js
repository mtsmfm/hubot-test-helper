'use strict';

const Helper = require('../src/index');

const { expect } = require('chai');

const helper = new Helper('./scripts/message-room.js');

describe('message-room', () => {
  let room;

  beforeEach(async () => {
    room = await helper.createRoom();
  });

  context('user asks hubot to announce something', () => {
    beforeEach(async () => {
      await room.user.say('alice', '@hubot announce otherRoom: I love hubot!');
    });

    it('should not post to this channel', () => {
      expect(room.messages).to.eql([
        ['alice', '@hubot announce otherRoom: I love hubot!']
      ]);
    });

    it('should post to the other channel', () => {
      expect(room.robot.messagesTo['otherRoom']).to.eql([
        ['hubot', '@alice says: I love hubot!']
      ]);
    });
  });
});

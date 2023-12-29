'use strict';

const Helper = require('../src/index');

const { expect } = require('chai');

const helper = new Helper('./scripts/hello-world-listener.js');

describe('hello-world', () => {
  let room;

  beforeEach(async () => {
    room = await helper.createRoom();
  });

  context('user says hi to hubot', () => {
    beforeEach(async () => {
      await room.user.say('alice', '@hubot hi');
      await room.user.say('bob',   '@hubot hi');
    });

    it('should reply to user', () => {
      expect(room.messages).to.eql([
        ['alice', '@hubot hi'],
        ['bob',   '@hubot hi'],
        ['hubot', '@bob hi']
      ]);
    });
  });
});

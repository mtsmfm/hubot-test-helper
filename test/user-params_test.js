'use strict';

const Helper = require('../src/index');

const { expect } = require('chai');

const helper = new Helper('./scripts/user-params.js');

describe('enter-leave', () => {
  let room;

  beforeEach(async () => {
    room = await helper.createRoom();
  });

  context('user entering, leaving the room and sending a message', () => {
    const params = { id: 1, name: 2, profile: 3 };
    beforeEach(async () => {
      await room.user.enter('user1', params);
      await room.user.say('user1', 'Hi', params);
      await room.user.leave('user1', params);
    });

    it('sends back', () => {
      for (const msg of room.messages) {
        if (msg[0] === 'hubot') {
          expect(JSON.parse(msg[1])).to.include(params)
        }
      }
    });
  });
});

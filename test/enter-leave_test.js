'use strict';

const Helper = require('../src/index');

const { expect } = require('chai');

const helper = new Helper('./scripts/enter-leave.js');

describe('enter-leave', () => {
  let room;

  beforeEach(async () => {
    room = await helper.createRoom();
  });

  context('user entering then leaving the room', () => {
    beforeEach(async () => {
      await room.user.enter('user1');
      await room.user.leave('user1');
    });

    it('greets the user', () => {
      expect(room.messages).to.eql([
        ['hubot', 'Hi user1!'],
        ['hubot', 'Bye user1!']
      ]);
    });
  });
});

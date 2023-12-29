'use strict';

const Helper = require('../src/index');

const { expect } = require('chai');

const helper = new Helper('./scripts/mock-response.js');

class NewMockResponse extends Helper.Response {
  random(items) {
    return 3;
  }
}

describe('mock-response', function() {
  let room;

  beforeEach(async () => {
    room = await helper.createRoom({response: NewMockResponse});
  });

  context('user says "give me a random" number to hubot', () => {
    beforeEach(async () => {
      await room.user.say('alice', '@hubot give me a random number');
      await room.user.say('bob',   '@hubot give me a random number');
    });

    it('should reply to user with a random number', () => {
      expect(room.messages).to.eql([
        ['alice', '@hubot give me a random number'],
        ['hubot', '@alice 3'],
        ['bob',   '@hubot give me a random number'],
        ['hubot', '@bob 3']
      ]);
    });
  });
});

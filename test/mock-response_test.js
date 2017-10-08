'use strict'

const Helper = require('../src/index');
const helper = new Helper('./scripts/mock-response.js');

const co     = require('co');
const expect = require('chai').expect;

class NewMockResponse extends Helper.Response {
  random(items) {
    return 3;
  }
}

describe('mock-response', function() {
  beforeEach(function() {
    this.room = helper.createRoom({response: NewMockResponse, httpd: false});
  });

  context('user says "give me a random" number to hubot', function() {
    beforeEach(function() {
      return co(function*() {
        yield this.room.user.say('alice', '@hubot give me a random number');
        yield this.room.user.say('bob',   '@hubot give me a random number');
      }.bind(this));
    });

    it('should reply to user with a random number', function() {
      expect(this.room.messages).to.eql([
        ['alice', '@hubot give me a random number'],
        ['hubot', '@alice 3'],
        ['bob',   '@hubot give me a random number'],
        ['hubot', '@bob 3']
      ]);
    });
  });
});

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Helper = require('../src/index');
const helper = new Helper('./scripts/mock-response.coffee');

const co     = require('co');
const { expect } = require('chai');

class NewMockResponse extends Helper.Response {
  random(items) {
    return 3;
  }
}

describe('mock-response', function() {
  beforeEach(function() {
    return this.room = helper.createRoom({response: NewMockResponse, httpd: false});
  });

  return context('user says "give me a random" number to hubot', function() {
    beforeEach(function() {
      return co(function*() {
        yield this.room.user.say('alice', '@hubot give me a random number');
        return yield this.room.user.say('bob',   '@hubot give me a random number');
      }.bind(this));
    });

    return it('should reply to user with a random number', function() {
      return expect(this.room.messages).to.eql([
        ['alice', '@hubot give me a random number'],
        ['hubot', '@alice 3'],
        ['bob',   '@hubot give me a random number'],
        ['hubot', '@bob 3']
      ]);
  });
});
});

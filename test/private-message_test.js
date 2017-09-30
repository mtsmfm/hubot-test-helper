/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Helper = require('../src/index');
const helper = new Helper('./scripts/private-message.coffee');

const co     = require('co');
const { expect } = require('chai');

describe('private-message', function() {
  beforeEach(function() {
    return this.room = helper.createRoom({httpd: false});
  });

  return context('user asks hubot for a secret', function() {
    beforeEach(function() {
      return co(function*() {
        return yield this.room.user.say('alice', '@hubot tell me a secret');
      }.bind(this));
    });

    it('should not post to the public channel', function() {
      return expect(this.room.messages).to.eql([
        ['alice', '@hubot tell me a secret']
      ]);
  });

    return it('should private message user', function() {
      return expect(this.room.privateMessages).to.eql({
        'alice': [
          ['hubot', 'whisper whisper whisper']
        ]
      });
  });
});
});

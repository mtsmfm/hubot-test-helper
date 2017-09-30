'use strict'

const Helper = require('../src/index');
const helper = new Helper('./scripts/private-message.js');

const co     = require('co');
const expect = require('chai').expect;

describe('private-message', function() {
  beforeEach(function() {
    this.room = helper.createRoom({httpd: false});
  });

  context('user asks hubot for a secret', function() {
    beforeEach(function() {
      return co(function*() {
        yield this.room.user.say('alice', '@hubot tell me a secret');
      }.bind(this));
    });

    it('should not post to the public channel', function() {
      expect(this.room.messages).to.eql([
        ['alice', '@hubot tell me a secret']
      ]);
    });

    it('should private message user', function() {
      expect(this.room.privateMessages).to.eql({
        'alice': [
          ['hubot', 'whisper whisper whisper']
        ]
      });
    });
  });
});

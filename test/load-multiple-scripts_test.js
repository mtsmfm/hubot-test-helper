'use strict'

const Helper = require('../src/index');
const helper = new Helper(['./scripts/hello-world.js', './scripts/bye.js']);

const co     = require('co');
const expect = require('chai').expect;

describe('hello-world', function() {
  beforeEach(function() {
    this.room = helper.createRoom({httpd: false});
  });

  context('user says hi to hubot', function() {
    beforeEach(function() {
      return co(function*() {
        yield this.room.user.say('alice', '@hubot hi');
        yield this.room.user.say('bob',   '@hubot bye');
      }.bind(this));
    });

    it('should reply to user', function() {
      expect(this.room.messages).to.eql([
        ['alice', '@hubot hi'],
        ['hubot', '@alice hi'],
        ['bob',   '@hubot bye'],
        ['hubot', '@bob bye']
      ]);
    });
  });
});

var Helper, co, expect, helper;

Helper = require('../src/index');

helper = new Helper('./scripts/hello-world.coffee');

co = require('co');

expect = require('chai').expect;

describe('hello-world-js', function() {
  beforeEach(function() {
    return this.room = helper.createRoom({
      httpd: false
    });
  });
  return context('user says hi to hubot', function() {
    beforeEach(function() {
      return co((function(_this) {
        return function*() {
          (yield _this.room.user.say('alice', '@hubot hi'));
          return (yield _this.room.user.say('bob', '@hubot hi'));
        };
      })(this));
    });
    return it('should reply to user', function() {
      return expect(this.room.messages).to.eql([
        ['alice', '@hubot hi'],
        ['hubot', '@alice hi'],
        ['bob', '@hubot hi'],
        ['hubot', '@bob hi']]);
    });
  });
});
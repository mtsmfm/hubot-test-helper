/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Helper = require('../src/index');
const helper = new Helper('./scripts/hello-world.coffee');

const co     = require('co');
const { expect } = require('chai');

describe('hello-world', function() {
  beforeEach(function() {
    return this.room = helper.createRoom({httpd: false});
  });
  afterEach(function() {
    return this.room.destroy();
  });

  return context('user says hi to hubot', function() {
    beforeEach(function() {
      return co(function*() {
        yield this.room.user.say('alice', '@hubot hi');
        return yield this.room.user.say('bob',   '@hubot hi');
      }.bind(this));
    });

    return it('should reply to user', function() {
      return expect(this.room.messages).to.eql([
        ['alice', '@hubot hi'],
        ['hubot', '@alice hi'],
        ['bob',   '@hubot hi'],
        ['hubot', '@bob hi']
      ]);
  });
});
});

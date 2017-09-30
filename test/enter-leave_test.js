/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Helper = require('../src/index');
const helper = new Helper('./scripts/enter-leave.coffee');

const co     = require('co');
const { expect } = require('chai');

describe('enter-leave', function() {
  beforeEach(function() {
    return this.room = helper.createRoom({httpd: false});
  });

  return context('user entering then leaving the room', function() {
    beforeEach(function() {
      return co(function*() {
        yield this.room.user.enter('user1');
        return yield this.room.user.leave('user1');
      }.bind(this));
    });

    return it('greets the user', function() {
      return expect(this.room.messages).to.eql([
        ['hubot', 'Hi user1!'],
        ['hubot', 'Bye user1!']
      ]);
  });
});
});

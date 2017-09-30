'use strict'

const Helper = require('../src/index');
const helper = new Helper('./scripts/enter-leave.js');

const co     = require('co');
const expect = require('chai').expect;

describe('enter-leave', function() {
  beforeEach(function() {
    this.room = helper.createRoom({httpd: false});
  });

  context('user entering then leaving the room', function() {
    beforeEach(function() {
      return co(function*() {
        yield this.room.user.enter('user1');
        yield this.room.user.leave('user1');
      }.bind(this));
    });

    it('greets the user', function() {
      expect(this.room.messages).to.eql([
        ['hubot', 'Hi user1!'],
        ['hubot', 'Bye user1!']
      ]);
    });
  });
});

'use strict'

const Helper = require('../src/index');
const helper = new Helper('./scripts/user-params.js');

const co     = require('co');
const expect = require('chai').expect;

describe('enter-leave', function() {
  beforeEach(function() {
    this.room = helper.createRoom({httpd: false});
  });

  context('user entering, leaving the room and sending a message', function() {
    const params = { id: 1, name: 2, profile: 3 };
    beforeEach(function() {
      return co(function*() {
        yield this.room.user.enter('user1', params);
        yield this.room.user.say('user1', 'Hi', params);
        yield this.room.user.leave('user1', params);
      }.bind(this));
    });

    it('sends back', function() {
      for (let msg of this.room.messages) {
        if (msg[0] === 'hubot') {
          expect(JSON.parse(msg[1])).to.include(params)
        }
      }
    });
  });
});

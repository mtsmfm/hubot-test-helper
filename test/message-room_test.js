'use strict'

const Helper = require('../src/index');
const helper = new Helper('./scripts/message-room.js');

const co     = require('co');
const expect = require('chai').expect;

describe('message-room', function() {
  beforeEach(function() {
    this.room = helper.createRoom({name: 'room', httpd: false});
  });

  context('user asks hubot to announce something', function() {
    beforeEach(function() {
      return co(function*() {
        yield this.room.user.say('alice', '@hubot announce otherRoom: I love hubot!');
      }.bind(this));
    });

    it('should not post to this channel', function() {
      expect(this.room.messages).to.eql([
        ['alice', '@hubot announce otherRoom: I love hubot!']
      ]);
    });

    it('should post to the other channel', function() {
      expect(this.room.robot.messagesTo['otherRoom']).to.eql([
        ['hubot', '@alice says: I love hubot!']
      ]);
    });
  });
});

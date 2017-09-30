const Helper = require('../src/index');
const helper = new Helper('./scripts/custom-text-message.js');
const Hubot = require('hubot');

const co     = require('co');
const expect = require('chai').expect;

describe('custom-text-message', function() {
  beforeEach(function() {
    this.room = helper.createRoom({httpd: false});
  });

  context('Passing a custom text message object', function() {
    beforeEach(function() {
      return co(function*() {
        const textMessage = new Hubot.TextMessage({}, '');
        textMessage.isCustom = true;
        textMessage.custom = 'custom';
        yield this.room.user.say('user', textMessage);
      }.bind(this));
    });

    it('sends back', function() {
      expect(this.room.messages[1][1]).to.be.equal('custom');
    });
  });
});

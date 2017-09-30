/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Helper = require('../src/index');
const helper = new Helper('./scripts/custom-text-message.coffee');
const Hubot = require('hubot');

const co     = require('co');
const { expect } = require('chai');

describe('custom-text-message', function() {
  beforeEach(function() {
    return this.room = helper.createRoom({httpd: false});
  });

  return context('Passing a custom text message object', function() {
    beforeEach(function() {
      return co(function*() {
        const textMessage = new Hubot.TextMessage({}, '');
        textMessage.isCustom = true;
        textMessage.custom = 'custom';
        return yield this.room.user.say('user', textMessage);
      }.bind(this));
    });

    return it('sends back', function() {
      return expect(this.room.messages[1][1]).to.be.equal('custom');
    });
  });
});

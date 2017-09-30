/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Helper = require('../src/index');
const helper = new Helper('./scripts/user-params.coffee');

const co     = require('co');
const { expect } = require('chai');

describe('enter-leave', function() {
  beforeEach(function() {
    return this.room = helper.createRoom({httpd: false});
  });

  return context('user entering, leaving the room and sending a message', function() {
    const params = { id: 1, name: 2, profile: 3 };
    beforeEach(function() {
      return co(function*() {
        yield this.room.user.enter('user1', params);
        yield this.room.user.say('user1', 'Hi', params);
        return yield this.room.user.leave('user1', params);
      }.bind(this));
    });

    return it('sends back', function() {
      return (() => {
        const result = [];
        for (let msg of Array.from(this.room.messages)) {
          if (msg[0] === 'hubot') {
            result.push(expect(JSON.parse(msg[1])).to.include(params));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    });
  });
});

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Helper = require('../src/index');
const helper = new Helper('./scripts/events.coffee');

const co     = require('co');
const { expect } = require('chai');

describe('events', function() {
  beforeEach(function() {
    return this.room = helper.createRoom({httpd: false});
  });

  context('should post on an event', function() {
    beforeEach(function() {
      return this.room.robotEvent('some-event', 'event', 'data');
    });

    return it('should reply to user', function() {
      return expect(this.room.messages).to.eql([
        ['hubot', 'got event with event data']
      ]);
  });
});

  return context('should hear events emitted by responses', () =>


    it('should trigger an event', function() {
      let response = null;
      this.room.robot.on('response-event', event => response = event.content);

      return this.room.user.say('bob', '@hubot send event').then(() => {
        return expect(response).to.eql('hello');
      });
    })
  );
});

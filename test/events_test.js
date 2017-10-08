'use strict'

const Helper = require('../src/index');
const helper = new Helper('./scripts/events.js');

const co     = require('co');
const expect = require('chai').expect;

describe('events', function() {
  beforeEach(function() {
    this.room = helper.createRoom({httpd: false});
  });

  context('should post on an event', function() {
    beforeEach(function() {
      this.room.robotEvent('some-event', 'event', 'data');
    });

    it('should reply to user', function() {
      expect(this.room.messages).to.eql([
        ['hubot', 'got event with event data']
      ]);
    });
  });

  context('should hear events emitted by responses', () =>
    it('should trigger an event', function() {
      let response = null;
      this.room.robot.on('response-event', event => response = event.content);

      this.room.user.say('bob', '@hubot send event').then(() => {
        expect(response).to.eql('hello');
      });
    })
  );
});

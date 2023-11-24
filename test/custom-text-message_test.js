'use strict';

const Helper = require('../src/index');
const Hubot = require('hubot/es2015');

const { expect } = require('chai');

const helper = new Helper('./scripts/custom-text-message.js');

describe('custom-text-message', () => {
  let room;

  beforeEach(async () => {
    room = await helper.createRoom();
  });

  context('Passing a custom text message object', () => {
    beforeEach(async () => {
      const textMessage = new Hubot.TextMessage({}, '');
      textMessage.isCustom = true;
      textMessage.custom = 'custom';
      await room.user.say('user', textMessage);
    });

    it('sends back', () => {
      expect(room.messages[1][1]).to.be.equal('custom');
    });
  });
});

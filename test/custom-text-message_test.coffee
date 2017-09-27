Helper = require('../src/index')
helper = new Helper('./scripts/custom-text-message.coffee')
Hubot = require('hubot')

co     = require('co')
expect = require('chai').expect

describe 'custom-text-message', ->
  beforeEach ->
    @room = helper.createRoom(httpd: false)

  context 'Passing a custom text message object', ->
    beforeEach ->
      co =>
        textMessage = new Hubot.TextMessage({}, '')
        textMessage.isCustom = true
        textMessage.custom = 'custom'
        yield @room.user.say 'user', textMessage

    it 'sends back', ->
      expect(@room.messages[1][1]).to.be.equal('custom')

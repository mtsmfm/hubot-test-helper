Helper = require('../src/index')
helper = new Helper('./scripts/private-message.coffee')

co     = require('co')
expect = require('chai').expect

describe 'private-message', ->
  beforeEach ->
    @room = helper.createRoom(httpd: false)

  context 'user asks hubot for a secret', ->
    beforeEach ->
      co =>
        yield @room.user.say 'alice', '@hubot tell me a secret'

    it 'should not post to the public channel', ->
      expect(@room.messages).to.eql [
        ['alice', '@hubot tell me a secret']
      ]

    it 'should private message user', ->
      expect(@room.privateMessages).to.eql {
        'alice': [
          ['hubot', 'whisper whisper whisper']
        ]
      }

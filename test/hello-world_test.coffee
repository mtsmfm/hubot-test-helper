Helper = require('../src/index')
helper = new Helper(require './scripts/hello-world')

expect = require('chai').expect

describe 'hello-world', ->
  room = null

  beforeEach ->
    room = helper.createRoom()

  context 'user says hi to hubot', ->
    beforeEach ->
      room.user.say 'hubot: hi'

    it 'should reply to user', ->
      expect(room.messages).to.eql [
        {user:  'hubot: hi'}
        {hubot: 'user: hi'}
      ]

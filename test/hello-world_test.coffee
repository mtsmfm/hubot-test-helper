Helper = require('../src/index')
helper = new Helper('./scripts/hello-world.coffee')

expect = require('chai').expect

describe 'hello-world', ->
  room = null

  beforeEach ->
    room = helper.createRoom()

  context 'user says hi to hubot', ->
    beforeEach ->
      room.user.say 'alice', '@hubot hi'
      room.user.say 'bob',   '@hubot hi'

    it 'should reply to user', ->
      expect(room.messages).to.eql [
        ['alice', '@hubot hi']
        ['hubot', '@alice hi']
        ['bob',   '@hubot hi']
        ['hubot', '@bob hi']
      ]

Helper = require('../src/index')
helper = new Helper('./scripts/hello-world-listener.coffee')

co     = require('co')
expect = require('chai').expect

describe 'hello-world', ->
  beforeEach ->
    @room = helper.createRoom(httpd: false)

  context 'user says hi to hubot', ->
    beforeEach ->
      co =>
        yield @room.user.say 'alice', '@hubot hi'
        yield @room.user.say 'bob',   '@hubot hi'

    it 'should reply to user', ->
      expect(@room.messages).to.eql [
        ['alice', '@hubot hi']
        ['bob',   '@hubot hi']
        ['hubot', '@bob hi']
      ]

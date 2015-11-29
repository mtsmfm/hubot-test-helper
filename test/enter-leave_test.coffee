Helper = require('../src/index')
helper = new Helper('./scripts/enter-leave.coffee')

co     = require('co')
expect = require('chai').expect

describe 'enter-leave', ->
  beforeEach ->
    @room = helper.createRoom(httpd: false)

  context 'user entering then leaving the room', ->
    beforeEach ->
      co =>
        yield @room.user.enter 'user1'
        yield @room.user.leave 'user1'

    it 'greets the user', ->
      expect(@room.messages).to.eql [
        ['hubot', 'Hi user1!']
        ['hubot', 'Bye user1!']
      ]

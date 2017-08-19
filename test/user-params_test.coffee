Helper = require('../src/index')
helper = new Helper('./scripts/user-params.coffee')

co     = require('co')
expect = require('chai').expect

describe 'enter-leave', ->
  beforeEach ->
    @room = helper.createRoom(httpd: false)

  context 'user entering, leaving the room and sending a message', ->
    params = { id: 1, name: 2, profile: 3 }
    beforeEach ->
      co =>
        yield @room.user.enter 'user1', params
        yield @room.user.say 'user1', 'Hi', params
        yield @room.user.leave 'user1', params

    it 'sends back', ->
      for msg in @room.messages
        if msg[0] is 'hubot'
          expect(JSON.parse msg[1]).to.include(params)

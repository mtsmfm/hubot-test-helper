Helper = require('../src/index')
helper = new Helper('./scripts/events.coffee')

co     = require('co')
expect = require('chai').expect

describe 'events', ->

  beforeEach ->
    @room = helper.createRoom(httpd: false)

  context 'should post on an event', ->
    beforeEach ->
      @room.robotEvent 'some-event', 'event', 'data'

    it 'should reply to user', ->
      expect(@room.messages).to.eql [
        ['hubot', 'got event with event data']
      ]


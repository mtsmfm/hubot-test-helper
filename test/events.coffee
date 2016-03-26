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

  context 'should hear events emitted by responses', ->


    it 'should trigger an event', ->
      response = null
      @room.robot.on 'response-event', (event) ->
        response = event.content

      @room.user.say('bob', '@hubot send event').then =>
        expect(response).to.eql('hello')

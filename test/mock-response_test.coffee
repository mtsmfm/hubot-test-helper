Helper = require('../src/index')
helper = new Helper('./scripts/mock-response.coffee')

co     = require('co')
expect = require('chai').expect

class NewMockResponse extends Helper.Response
  random: (items) ->
    3

describe 'mock-response', ->
  beforeEach ->
    @room = helper.createRoom(response: NewMockResponse, httpd: false)

  context 'user says "give me a random" number to hubot', ->
    beforeEach ->
      co =>
        yield @room.user.say 'alice', '@hubot give me a random number'
        yield @room.user.say 'bob',   '@hubot give me a random number'

    it 'should reply to user with a random number', ->
      expect(@room.messages).to.eql [
        ['alice', '@hubot give me a random number']
        ['hubot', '@alice 3']
        ['bob',   '@hubot give me a random number']
        ['hubot', '@bob 3']
      ]

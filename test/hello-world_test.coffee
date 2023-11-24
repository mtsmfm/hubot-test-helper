Helper = require('../src/index')

{ expect } = require('chai')

helper = new Helper('./scripts/hello-world.coffee');

describe 'hello-world', ->
  beforeEach ->
    @room = await helper.createRoom()
  afterEach ->
    @room.destroy()

  context 'user says hi to hubot', ->
    beforeEach ->
      await @room.user.say 'alice', '@hubot hi'
      await @room.user.say 'bob',   '@hubot hi'

    it 'should reply to user', ->
      expect(@room.messages).to.eql [
        ['alice', '@hubot hi']
        ['hubot', '@alice hi']
        ['bob',   '@hubot hi']
        ['hubot', '@bob hi']
      ]

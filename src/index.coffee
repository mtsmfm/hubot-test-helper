Hubot = require('hubot')

class MockRobot extends Hubot.Robot
  constructor: ->
    super null, null, false, 'hubot'

  loadAdapter: ->
    @adapter = new Room(@)

class Room extends Hubot.Adapter
  constructor: (@robot) ->
    @messages = []

    @user =
      say: (userName, message) =>
        @receive(userName, message)

  receive: (userName, message) ->
    @messages.push [userName, message]

    user = new Hubot.User(userName)
    super new Hubot.TextMessage(user, message)

  reply: (envelope, strings...) ->
    @messages.push ['hubot', "@#{envelope.user.name} #{str}"] for str in strings

  send: (envelope, strings...) ->
    @messages.push ['hubot', str] for str in strings

class Helper
  constructor: (module) ->
    @module = module

  createRoom: ->
    robot = new MockRobot
    @module robot
    robot.adapter

module.exports = Helper

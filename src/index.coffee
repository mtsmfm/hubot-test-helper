Fs    = require('fs')
Path  = require('path')
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
  constructor: (scriptsPath) ->
    @scriptsPath = Path.resolve(Path.dirname(module.parent.filename), scriptsPath)

  createRoom: ->
    robot = new MockRobot
    # XXX robot.load load scripts async
    for file in Fs.readdirSync(@scriptsPath).sort()
      robot.loadFile @scriptsPath, file

    robot.adapter

module.exports = Helper

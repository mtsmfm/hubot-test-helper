Fs    = require('fs')
Path  = require('path')
Hubot = require('hubot')

process.setMaxListeners(0)

class MockResponse extends Hubot.Response
  sendPrivate: (strings...) ->
    @robot.adapter.sendPrivate @envelope, strings...

class MockRobot extends Hubot.Robot
  constructor: (httpd=true) ->
    super null, null, httpd, 'hubot'

    @Response = MockResponse

  loadAdapter: ->
    @adapter = new Room(@)

class Room extends Hubot.Adapter
  constructor: (@robot) ->
    @messages = []

    @privateMessages = {}

    @user =
      say: (userName, message) =>
        @receive(userName, message)

  receive: (userName, message) ->
    new Promise (resolve) =>
      @messages.push [userName, message]
      user = new Hubot.User(userName, { room: @name })
      @robot.receive(new Hubot.TextMessage(user, message), resolve)

  destroy: ->
    @robot.server.close()

  reply: (envelope, strings...) ->
    @messages.push ['hubot', "@#{envelope.user.name} #{str}"] for str in strings

  send: (envelope, strings...) ->
    @messages.push ['hubot', str] for str in strings

  sendPrivate: (envelope, strings...) ->
    if envelope.user.name not of @privateMessages
      @privateMessages[envelope.user.name] = []
    @privateMessages[envelope.user.name].push ['hubot', str] for str in strings

class Helper
  @Response = MockResponse

  constructor: (scriptsPath) ->
    @scriptsPath = Path.resolve(Path.dirname(module.parent.filename), scriptsPath)

  createRoom: (options={}) ->
    robot = new MockRobot(options.httpd)

    if 'response' of options
      robot.Response = options.response

    if Fs.statSync(@scriptsPath).isDirectory()
      for file in Fs.readdirSync(@scriptsPath).sort()
        robot.loadFile @scriptsPath, file
    else
      robot.loadFile Path.dirname(@scriptsPath), Path.basename(@scriptsPath)

    robot.brain.emit 'loaded'

    robot.adapter.name = options.name or 'room1'
    robot.adapter

module.exports = Helper

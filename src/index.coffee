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

      enter: (userName) =>
        @enter(userName)

      leave: (userName) =>
        @leave(userName)

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

  robotEvent: () ->
    @robot.emit.apply(@robot, arguments)

  enter: (userName) ->
    new Promise (resolve) =>
      user = new Hubot.User(userName, { room: @name })
      @robot.receive(new Hubot.EnterMessage(user), resolve)

  leave: (userName) ->
    new Promise (resolve) =>
      user = new Hubot.User(userName, { room: @name })
      @robot.receive(new Hubot.LeaveMessage(user), resolve)

class Helper
  @Response = MockResponse

  constructor: (scriptsPath) ->
    if not Array.isArray(scriptsPath)
      scriptsPath = [scriptsPath]
    @scriptsPath = scriptsPath

  createRoom: (options={}) ->
    robot = new MockRobot(options.httpd)

    if 'response' of options
      robot.Response = options.response

    for script in @scriptsPath
      script = Path.resolve(Path.dirname(module.parent.filename), script)
      if Fs.statSync(script).isDirectory()
        for file in Fs.readdirSync(script).sort()
          robot.loadFile script, file
      else
        robot.loadFile Path.dirname(script), Path.basename(script)

    robot.brain.emit 'loaded'

    robot.adapter.name = options.name or 'room1'
    robot.adapter

module.exports = Helper

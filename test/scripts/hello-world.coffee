module.exports = (robot) ->
  robot.respond /hi$/i, (msg) ->
    msg.reply 'hi'

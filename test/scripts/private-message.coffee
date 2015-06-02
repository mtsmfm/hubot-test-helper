# Description:
#   Test script
module.exports = (robot) ->
  robot.respond /tell me a secret$/i, (msg) ->
    msg.sendPrivate 'whisper whisper whisper'

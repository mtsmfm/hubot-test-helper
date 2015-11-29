# Description:
#   Test script
module.exports = (robot) ->
  robot.enter (res) ->
    res.send "Hi #{res.message.user.name}!"

  robot.leave (res) ->
    res.send "Bye #{res.message.user.name}!"

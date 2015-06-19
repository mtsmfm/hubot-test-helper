# Description:
#   Test script
module.exports = (robot) ->
  robot.respond /give me a random number$/i, (msg) ->
    randomNumber = msg.random [1, 2, 3, 4, 5]
    msg.reply randomNumber

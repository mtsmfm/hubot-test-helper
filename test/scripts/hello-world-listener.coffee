# Description:
#   Test script
module.exports = (robot) ->
  robot.listen(
    (message) ->
      message.user.name is 'bob'
    (response) ->
      response.reply 'hi'
  )

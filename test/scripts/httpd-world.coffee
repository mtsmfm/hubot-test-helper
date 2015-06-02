# Description:
#   Test script
module.exports = (robot) ->
  robot.router.get "/hello/world", (req, res) ->
    res.status(200).send("Hello World!")

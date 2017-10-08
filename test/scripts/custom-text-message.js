// Description:
//   Test script
module.exports = robot =>
  robot.listen(
    message => message.isCustom,
    response => response.send(response.message.custom))
;

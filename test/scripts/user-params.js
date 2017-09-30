// Description:
//   Test script
module.exports = robot =>
  robot.listen(
    () => true,
    response => response.send(JSON.stringify(response.message.user)))
;

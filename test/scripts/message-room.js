// Description:
//   Test script
module.exports = robot =>
  robot.respond(/announce otherRoom: (.+)$/i, msg => {
    robot.messageRoom('otherRoom', '@' + msg.envelope.user.name + ' says: ' + msg.match[1]);
  })

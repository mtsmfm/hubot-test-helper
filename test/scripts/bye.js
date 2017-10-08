// Description:
//   Test script
module.exports = robot =>
  robot.respond(/bye$/i, msg => msg.reply('bye'))
;

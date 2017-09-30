// Description:
//   Test script
module.exports = robot =>
  robot.listen(message => message.user.name === 'bob', response => response.reply('hi'))

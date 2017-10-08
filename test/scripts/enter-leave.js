// Description:
//   Test script
module.exports = function(robot) {
  robot.enter(res => res.send(`Hi ${res.message.user.name}!`));

  return robot.leave(res => res.send(`Bye ${res.message.user.name}!`));
};

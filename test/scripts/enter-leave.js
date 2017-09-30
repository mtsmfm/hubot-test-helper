/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Description:
//   Test script
module.exports = function(robot) {
  robot.enter(res => res.send(`Hi ${res.message.user.name}!`));

  return robot.leave(res => res.send(`Bye ${res.message.user.name}!`));
};

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Description:
//   Test script
module.exports = robot =>
  robot.respond(/give me a random number$/i, function(msg) {
    const randomNumber = msg.random([1, 2, 3, 4, 5]);
    return msg.reply(randomNumber);
  })
;

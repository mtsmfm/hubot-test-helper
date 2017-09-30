/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Description:
//   Test script
module.exports = function(robot) {
  robot.on('some-event', (some, data) => robot.messageRoom('room1', `got event with ${some} ${data}`));

  return robot.respond(/send event$/i, msg =>
    robot.emit('response-event',
      {content: 'hello'})
  );
};

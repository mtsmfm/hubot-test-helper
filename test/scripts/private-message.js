/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Description:
//   Test script
module.exports = robot =>
  robot.respond(/tell me a secret$/i, msg => msg.sendPrivate('whisper whisper whisper'))
;

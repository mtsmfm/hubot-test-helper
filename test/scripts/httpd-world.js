/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Description:
//   Test script
module.exports = robot =>
  robot.router.get("/hello/world", (req, res) => res.status(200).send("Hello World!"))
;

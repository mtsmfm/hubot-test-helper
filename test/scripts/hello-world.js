// Description:
//   Test script
module.exports = function(robot) {
	// ping to test connection
	robot.respond(/hi$/i, function(msg){
		msg.reply('hi')
	})
}

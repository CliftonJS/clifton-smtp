var smtpserver = require("./smtp-server.js")

/**
 * Create an Smtp server with the desired options to listen for incoming mail
 * from other servers.
 *
 * @param {Object} options The options for this server, as a JSON Object
 * @returns {SmtpServer} A server instance based on the options, else the
 *                         default options.
 */
exports.createServer = function (options) {
	var server = new smtpserver(options);
	server.listen(25, {}, function(err) { 	});
}

/**
 * Send the SMTP Object to it's recipients via SMTP.
 *
 * @param {Message} message The message to send, containing all required details
 *                          	needed to send the message.
 * @returns {SendProgress} An Object containing metadata and firing events
 *                            related to the progress in sending the message.
 */
exports.sendMessage = function (message) {
	throw new Error("Method not implemented");
}

var util = require('util');
var EventEmitter = require('events').EventEmitter;

/**
 * A server that listens for incoming mail via SMTP with the options provided,
 * else the default options.
 *
 * @param {Object} options The options for the server, as a JSON Object
 * @constructor
 */
function SmtpServer(options) {
	this.options = options;

	throw new Error("Class not implemented");
}

util.inherits(SmtpServer, EventEmitter);

module.exports = exports = SmtpServer;

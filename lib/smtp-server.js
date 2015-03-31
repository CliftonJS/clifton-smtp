var util = require('util');
var EventEmitter = require('events').EventEmitter;

function SmtpServer(options) {
	this.options = options;

	throw new Error("Class not implemented");
}

util.inherits(SmtpServer, EventEmitter);

module.exports = exports = SmtpServer;

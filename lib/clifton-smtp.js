//@Authors: Oliver Barnwell(ob6160) Harry Dalton(Hoolean)

//Requires
var net = require("net");
var util = require("util");
var EventEmitter = require("event").EventEmitter;

//Exports
module.exports = function(options) {
	return new clifton-smtp(options);
}


function clifton-smtp(options) {
	EventEmitter.call(this);
	this.server = net.createServer(function(s) {
		//Bind event handlers here			
	}.bind(this));
}

clifton-smtp.prototype.listen = function(port, options, callback) {
	this.server.listen(port, function() { })

} 

util.Inherits(clifton-smtp, EventEmitter);


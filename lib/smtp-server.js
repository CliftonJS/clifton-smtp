var util = require('util');
var net = require('net');
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
	this.ip = options["ip"];
	this.server = net.createServer(this.createClient.bind(this));
}

util.inherits(SmtpServer, EventEmitter);

//Create a new instance of a client
SmtpServer.prototype.createClient = function(c) {
	//      Server  Client
	new Client(this, c);
}

SmtpServer.prototype.listen = function(port, options, callback) {
	this.server.listen(port, callback);
}

function Client(smtpServer, client) {

	//Parent
	this.parent = smtpServer;

	//Net Server Instance (net.Server)
	this.netServer = this.parent.server;

	//Socket instance (net.Socket)
	this.client = client;

	//TODO: Harry you need to add to the template
	this.email = {


	}

	//TODO: Move responses to a separate module	
	this.responses = {
		READY : "220:  Why hello :}\n",
		HELO : "250: 127.0.0.1\n"
	}

	this.connectHandler();

	this.config({encoding: 'utf8'});

	this.bindEvents();
}

Client.prototype.config = function(options) {
	this.client.setEncoding(options["encoding"]);	
}

Client.prototype.bindEvents = function() {
	this.client.on("data", this.data.bind(this));	
}

Client.prototype.respond = function(code) {
	var response = this.responses[code];
	if(!response) { 
		this.write("500: Command contained an error ;{\n");
		return false;
	} else {
		this.write(this.responses[code]);
	} 
};

Client.prototype.write = function(data, callback) {
	this.client.write(data, function(err) {
		if(err) console.warn(err);
	});
}

Client.prototype.connectHandler = function(d) {
	console.log("Incoming shemale");
	//Tell the client that we're open
	this.respond("READY");
}

Client.prototype.data = function(data) {
	var command = data.split(/\s+/g)
	this.respond(command[0]);
}

module.exports = exports = SmtpServer;

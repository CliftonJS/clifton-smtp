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
	this.clients = [];
	this.server = net.createServer(this.createClient.bind(this));
}

util.inherits(SmtpServer, EventEmitter);

//Create a new instance of a client
SmtpServer.prototype.createClient = function(c) {
	this.clients.push(new Client(this, c));
}

SmtpServer.prototype.removeClient = function(c) {
	var index = this.clients.indexOf(c);
	if(index > -1) this.clients.splice(index, 1);
	console.log("client removed" + this.clients)
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
	this.mail = {
		sender: null

	}
	this.hasSaidHelo = false;
	//TODO: Move responses to a separate module	
	this.responses = {
		READY : "220 Why hello :}\n",
		HELO : "250 127.0.0.1\n",
		NOOP: "204 Alright mate?\n",
		QUIT: "221 Closing our connection :(\n",
		MAIL: ""	
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
	this.client.on("end", this._closeConnection.bind(this))
}

Client.prototype._closeConnection = function() {
	this.client.end();
	this.parent.removeClient(this);	
}

/* Decides what to respond to the client */
Client.prototype.respond = function(command) {
	var code = command[0];
	var response = this.responses[code];
	if(response == undefined) { 
		this.write("500 Malformed command ;{\n");
		return false;
	} else {
		this.write(this.responses[code]);
		this.act(command);
		
	} 
};

/* Acts on data sent through a command: if it detects the start of the email it'll begin the emaily bit otherwise it'll just store stuff where needed like: HELO frontend.oliver.com */
Client.prototype.act = function(command) {
	switch(command[0]) {
		case "QUIT":
			this._closeConnection();
			break;
		case "HELO":
			this._handleHELO(command);		
			break;
		case "MAIL":
			this._handleIncoming(command);
		case "RCPT":
			this._handleIncoming(command);
		default:
			break;
	}	
}

Client.prototype._handleIncoming = function(command) {
	if(!this.hasSaidHelo) {
		this.write("503 HELO/EHLO first pl0x\n");
		return false;
	}
	if(command[0] == "MAIL") {
		this.mail.sender = null
		//TODO: handle this better, what if it's not a valid sender address :o;
		if(command[1].toLowerCase() == "from:") {
			this.mail.sender = command[2];
			if(command[2]) {
				this.write("250 " + this.mail.sender + "... Sender is Legit 420\n");
			} else {
				this.write("Please include the sender shit\n");
			}

		} else {
			this.write("Non legit sender\n");
		}
	} else if(command[0] == "RCPT") {
		this.mail.recipient = null
		//TODO: handle this better, what if it's not a valid sender address :o;
		if(command[1].toLowerCase() == "to:") {
			this.mail.recipient = command[2];
			if(command[2]) {
				this.write("250 " + this.mail.recipient + "... Recipient is Legit 420\n");
			} else {
				this.write("Please include the recipient shit\n");
			}

		} else {
			this.write("Non legit recipient\n");
		}
		


	}
}

Client.prototype._handleHELO = function(command) {
	if(command[1]) {
		console.log("HELO with the url: " + command[1]);
		this.incomingUrl = command[1];
	} else {
		console.log("HELO url not provided, best guess: " + this.client.remoteAddress);
		this.incomingUrl = this.client.remoteAddress;
	}
	this.hasSaidHelo = true;
}

/* Writes out to the client */
Client.prototype.write = function(data) {
	this.client.write(data, function(err) {
		if(err) console.warn(err);
	});
}

/* Handles the connection event */
Client.prototype.connectHandler = function(d) {
	console.log("Incoming shemale");
	//Tell the client that we're open
	this.respond(["READY"]);
}

/* Handles incoming data */
Client.prototype.data = function(data) {
	var command = data.split(/\s+/g);
	this.respond(command);
}

module.exports = exports = SmtpServer;

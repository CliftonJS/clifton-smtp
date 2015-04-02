//TEMPORARY
var smtp = require('./lib/clifton-smtp');
var server = smtp.createServer({});
server.listen(25, {}, function(err) { 	});
server.on("mail-received", function(d) {
	console.log("mail received event fired!");
	console.log(d);
});

var http = require('http'),
	express = require('express');

var app = express();

app.get('/generate', function(req, res){
	//Generate the mobile screenshot here by calling image magick

	res.send('generated'); //Test response for now
});

var server = app.listen(3000, function(){
	console.log("Listening on port %d", server.address().port);
});
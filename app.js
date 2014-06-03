var http = require('http'),
	express = require('express'),
	gm = require('gm');

var app = express();

app.get('/generate/:device/:orientation', function(req, res){

	var devices = {"android-v": {width: 0, height: 0, image: ""},
		"android-h": { width: 0, height: 0, image: ""},
		"iphone-v": { width: 0, height: 0, image: ""},
		"iphone-h": { width: 0, height: 0, image: ""}};

	var deviceName = req.params.device;
	var orientation = req.params.orientation;

	var deviceKey = deviceName + "-" + orientation;

	var targetDevice = devices[deviceKey];
	if (typeof(targetDevice) == "undefined"){
		throw "Device " + deviceKey + " not recognized";
	}

	var filename = req.query.file;

	console.log("Generating %s for %s", filename, deviceKey);

	//var filename = eq.params.filename;

	res.send('generated'); //Test response for now
});

var server = app.listen(3000, function(){
	console.log("Listening on port %d", server.address().port);
});
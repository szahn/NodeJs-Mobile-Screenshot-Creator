var http = require('http'),
	express = require('express'),
	fs = require('fs'),
	gm = require('gm');

var app = express();

var randomFilename = function(prefix, extension) {

	var randInt = function(min, max) {
	    return Math.floor(min + (Math.random() * (max-min)));
	};

    len = 32;
 
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var ret = "";
    while(ret.length < len) {
        ret += chars[randInt(0, chars.length)];
    }

    return prefix + ret + '.' + extension;
};

function getDevices(){
	var devices = {"android-l": {image: "android-landscape.png"},
			"android-p": { image: "android-portrait.png"},
			"iphone-p": { image: ""},
			"iphone-l": { image: ""},
			"windows-p": { image: ""},
			"windows-l": { image: ""},
			"tablet-p": { image: ""},
			"tablet-l": { image: ""}};
	return devices;
}

function getDevice(deviceName, orientation){
	var deviceKey = deviceName + "-" + orientation;
	var targetDevice = getDevices()[deviceKey];
	if (typeof(targetDevice) == "undefined"){
		throw "Device " + deviceKey + " not recognized";
	}

	return targetDevice;	
}

app.get('/generate/:device/:orientation', function(req, res){

	function generateScreenshot(deviceName, orientation, filename){

		var targetDevice = getDevice(deviceName, orientation);

		//Get the width and height of the screenshot
		gm(filename).size(function(err, size){
			if (err){
				throw err;
			}

			var newWidth = size.width * 1.14;

			//Scale the transparent mobile frame to the width and height of the screenshot and save to a temp file
			generatePlaceholder(filename, targetDevice.image, newWidth);

		});
	}

	function generatePlaceholder(filename, deviceImage, newWidth){
		var placeHolderFilename = "temp/" + randomFilename('temp', 'png');
		gm("media/" + deviceImage).resize(newWidth, null).write(placeHolderFilename, function(err){
			if (err){
				throw err;
			}

			composeImages(filename, placeHolderFilename);
		});
	}

	function composeImages(filename, placeHolderFilename){
		//compose the frame over the screenshot, scaling/shifting the screenshot in the right place so that it appears in the center of the mobile frame 
		//Save the composed image and delete any temp files
		var outFilename = "temp/" + randomFilename('out', 'png');
		gm().subCommand("composite")
			.in("-geometry", "+24+64")
			.in("-compose", "Over", filename, placeHolderFilename)
			.write(outFilename, function(err){
				if (err){
					throw err;
				}

				fs.readFile(outFilename, displayImage);
		});
	}

	function displayImage(err, img){
		if (err){
			throw err;
		}

		res.writeHead(200, {
			'Content-Type': 'image/png',
			'Cache-Control': "max-age=" + 43800*60 + ", must-revalidate"
		});
		res.end(img, 'binary');
	}

	generateScreenshot(req.params.device, req.params.orientation, req.query.file);

});

var server = app.listen(3000, function(){
	console.log("Listening on port %d", server.address().port);
});
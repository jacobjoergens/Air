//child_process 
var exec = require('child_process').exec;
//fs declarations 
var fs = require('fs');
//AWS declarations 
var AWS = require('aws-sdk');
var s3obj = new AWS.S3({params: {Bucket: 'aircam', Key: 'R1C1'}});
AWS.config.loadFromPath('/home/pi/farmone/cred.json');
//Airtable declarations 
var Airtable = require('airtable');
var base = new Airtable({ apiKey: 'keyGPayTb3EekxVN4' }).base('appPrl8Alpm8uOCtL');
//Date declaration 
var d = new Date();
d=Date.now();
//
var zlib = require('zlib');

//(function takePicture(){
	var cmd = exec("fswebcam tmpimage.jpg", 
		function(err) {
    		if (err) { 
    			console.log('Error taking picture'); 
    		} else {
    			console.log('Successfully took picture');
    			var body = fs.createReadStream('/home/pi/farmone/tmpimage.jpg').pipe(zlib.createGzip());
				s3obj.upload({Key: 'R1C1', Body: body}).
 				on('httpUploadProgress', function(evt) { console.log(evt); }).
  				send(function(err, data) { console.log(err, data)});
			} 
		}
	);
//});
setTimeout(arguments.callee, 1000);





//var data = {Key: "R1C1/", Body: ''};

// //(function uploadToS3(){
// 	s3obj.putObject(data, function(err, data){
//   		if (err) { 
//   			console.log('Error uploading data: ', data); 
//     	} else {
//       		console.log('Successfully uploaded the image!');
//       		var cmd = exec("rm tmpimage.jpg", 
// 				function(err, data) {
//     				if (err) { 
//     					console.log('Error deleting' + data + 'from pi'); 
//     				} else {
//     					console.log('Successfully deleted' + data + 'from pi');
// 			} 
// 				}
// 			);
//     	}
// 	});
// //});

//(function ServeAirtable(){
	base('Table 1').create({
  		"Date": d,
  		"Pictures": [{"url": "http://aircam.s3.amazonaws.com/R1C1/"+d}]
  	}, 
  	function(err, record) {
    	if (err) { console.log(err); return; }
    		console.log(record);
	});
	setTimeout(arguments.callee, 30000);
//});


var Server = require('./server.js');
var PushInterface = require('./pushInterface.js');
var DaoMongo = require('./daoMongo.js');

var request = require('request');
var pushEndPoint = 'http://127.0.0.1:8888/'

var s = new Server(
	new DaoMongo('lpf-prod'), 
	new PushInterface(request, pushEndPoint), 
	20, 
	'/usr/local/legerUploads/'
);

s.listen(9999);

console.log('server ready on port 9999 ...');
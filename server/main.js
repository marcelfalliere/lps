var Server = require('./server.js');
var PushInterface = require('./pushInterface.js');
var mockDao = require('./tests/mockDao.js');

var request = require('request');
var pushEndPoint = 'http://127.0.0.1:8888/'

var s = new Server(mockDao, new PushInterface(request, pushEndPoint), 10, '/usr/local/legerUploads/');
s.listen(9999);

console.log('server ready on port 9999 ...');
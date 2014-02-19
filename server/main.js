var Server = require('./server.js');
var mockDao = require('./tests/mockDao.js');

var s = new Server(mockDao, 10);
s.listen(9999);

console.log('server ready on port 9999');
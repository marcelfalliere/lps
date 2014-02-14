var Server 	= require('./server.js'),
	mockDao = require('./tests/mockDao.js')

var server = new Server(mockDao, 10);
server.listen(9999);

console.log('Server ready on port 9999');
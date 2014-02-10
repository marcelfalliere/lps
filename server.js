var _ = require('underscore');

function Server(dao) {
  var http = require('http'), 
  		express = require('express');

  this._app = express();
  this._dao = dao;
  this._server = http.createServer(this._app);
}

Server.prototype.listen = function(port) {
	this._server.listen(port);

	this._app.get('/threads', _.bind(function(req,res){
		this._dao.threads(function(threads){
			res.send(threads);
		})
	},this));
}

Server.prototype.close = function(callback) {
	this._server.close(callback);
}

Server.prototype.get = function(path, callback) {
	this._app.get(path, callback);
}

module.exports = Server;


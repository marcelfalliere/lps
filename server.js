var _ = require('underscore');
var qs = require('querystring');

function Server(dao, limit) {
  var http = require('http'), 
  	  express = require('express');

  this._app = express();
  this._dao = dao;
  this._server = http.createServer(this._app);
  
  this._dao.setLimit(limit);
}

Server.prototype.listen = function(port) {
	this._server.listen(port);

	// HTTP GET /threads 
	this._app.get('/threads', _.bind(function(req,res){
		this._dao.threads(function(threads){
			res.send(threads);
		})
	},this));

	// HTTP GET /threads/<thread_id>
	this._app.get('/threads/:id', _.bind(function(req,res){
		this._dao.thread(req.params.id, function(thread){
			if (thread.length != 1) 
				res.status(404).send('Not found');
			else
				res.send(thread[0]);
		});
	},this));

	// HTTP GET /threads/<thread_id>/post_comment
	// with data : text(required)
	this._app.post('/threads/:id/post_comment', _.bind(function(req,res){
		var body = '';
		req.on('data',function(data){
			body+=data;
		});
		req.on('end',_.bind(function(){

			var body_parsed = qs.parse(body);
			var text = body_parsed.text;
			
			this._dao.post_comment(req.params.id, text, function(thread){
				if (thread.length != 1) 
					res.status(404).send('Not found');
				else
					res.send(thread[0]);
			})
		},this));
	},this));

	// HTTP POST /post_thread
	// with data : title(required)
	this._app.post('/post_thread', _.bind(function(req,res){
		var body = '';
		req.on('data',function(data){
			body+=data;
		});
		req.on('end',_.bind(function(){

			var body_parsed = qs.parse(body);
			var title = body_parsed.title;
			
			this._dao.post_thread(title, function(thread){
				res.send(thread);
			})
		},this));
	},this));
}

Server.prototype.close = function(callback) {
	this._server.close(callback);
}

module.exports = Server;


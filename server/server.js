var _ = require('underscore');
var qs = require('querystring');
var multiparty = require("multiparty");
var util = require('util');
var fs = require('fs');
var gm = require('gm').subClass({ imageMagick: true });


function Server(dao, pushInterface, limit, savePath) {
  var http = require('http');
  this.express = require('express');

  this._app = this.express();
  this._dao = dao;
  this._pushInterface = pushInterface;
  this._server = http.createServer(this._app);
  
  this._dao.setLimit(limit);

  this._savePath = savePath;
}

Server.prototype.listen = function(port) {
	this._server.listen(port);

	// CORS ! for dev only
	this._app.use(function(req, res, next) {
	    res.header('Access-Control-Allow-Origin', '*');
	    res.header('Access-Control-Allow-Methods', 'GET,POST');
	    res.header('Access-Control-Allow-Headers', 'Content-Type');

	    next();
	});

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

	// HTTP POST /threads/<thread_id>/post_comment
	// with data : text(required)
	this._app.post('/threads/:id/post_comment', _.bind(function(req,res){
		var body = '';
		req.on('data',function(data){
			body+=data;
		});
		req.on('end',_.bind(function(){

			try {
				var body_parsed = JSON.parse(body);
			} catch(exc) {
				var body_parsed = qs.parse(body);
			}
			var text = body_parsed.text;
			var color = body_parsed.color;
			
			this._dao.post_comment(req.params.id, text, color, _.bind(function(thread){
				
				
				if (thread.length != 1) 
					res.status(404).send('Not found');
				else {
					this._pushInterface.push('newcomments'+thread[0].thread_id, "Un anonyme vient de contribuer à une \"discussion\" sur laquelle vous avez participé !", thread[0].thread_id);
					res.send(thread[0]);
				}
			},this))
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

			try {
				var body_parsed = JSON.parse(body);
			} catch(exc) {
				var body_parsed = qs.parse(body);
			}
			var title = body_parsed.title;
			var color = body_parsed.color;
			var policeName = body_parsed.policeName;
			var policeSize = body_parsed.policeSize;
			var imageUrl = body_parsed.imageUrl;
			
			this._dao.post_thread(title, color, policeName, policeSize, imageUrl, _.bind(function(thread){
				console.log(thread);
				this._pushInterface.push('newfalope', 'Un nouveau contenu vient d\'être posté...', thread.id+'');
				res.send(thread);
			},this));
		},this));
	},this));

	// HTTP POST /save_image
	// the body is the image I guess
	this._app.post('/save_image', _.bind(function(req,res){
		var form = new multiparty.Form();

	    form.parse(req, _.bind(function(err, fields, files) {
	    	var imageName = ((Math.random()*Math.random()+'').replace('.',''))+'.png';
	    	var imageSavePath = this._savePath+imageName;
	    	fs.createReadStream(files.image[0].path).pipe(fs.createWriteStream(imageSavePath));
			
	      	var o = {imageUrl:imageName};	
	      	res.send(o);
	    },this));

	},this));

	// HTTP GET /xxxx.png
	this._app.get('/:image.png', _.bind(function(req,res){
		var stat = fs.statSync(this._savePath+req.params.image+'.png');
		res.writeHead(200, {
		  'Content-Type' : 'image/png',
		  'Content-Length': stat.size
		});
		fs.createReadStream(this._savePath+req.params.image+'.png').pipe(res);
	},this));


	// HTTP GET /xxxx.png/thumb
	this._app.get('/:image.png/thumb', _.bind(function(req,res){
		var imageOriginalPath = this._savePath+req.params.image+'.png';
		var imageThumbPath = this._savePath+req.params.image+'_thumb.png';
		fs.exists(imageThumbPath, function(exists){
			if(!exists) {
				// create and then return the think
				gm(imageOriginalPath)
				.thumb(50,50, imageThumbPath, 30, function(err){
					if (!err) {
						var stat = fs.statSync(imageThumbPath);
						res.writeHead(200, {
						  'Content-Type' : 'image/png',
						  'Content-Length': stat.size
						});
						fs.createReadStream(imageThumbPath).pipe(res);
					} else {
						console.log('error'+err);
					}
				});
			} else {
				// return the thing
				var stat = fs.statSync(imageThumbPath);
				res.writeHead(200, {
				  'Content-Type' : 'image/png',
				  'Content-Length': stat.size
				});
				fs.createReadStream(imageThumbPath).pipe(res);
			}
		});
	},this));

}

Server.prototype.close = function(callback) {
	this._server.close(callback);
}

module.exports = Server;





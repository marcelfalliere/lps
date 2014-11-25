var _ = require('underscore');
var qs = require('querystring');
var multiparty = require("multiparty");
var util = require('util');
var fs = require('fs');
var gm = require('gm').subClass({ imageMagick: true });;
var path = require('path');

var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "la.petite.falope@gmail.com",
        pass: "lapetitesalopeellemangedeschattestoutlesjoursetmemelematin"
    }
});

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
		var duid = req.headers['x-duid'];

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
			
			this._dao.post_thread(title, color, policeName, policeSize, imageUrl, duid, _.bind(function(thread){
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
		  'Content-Length': stat.size,
		  'Cache-Control': 'public, max-age=3600'
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
						  'Content-Length': stat.size,
						  'Cache-Control': 'public, max-age=3600'
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
				  'Content-Length': stat.size,
				  'Cache-Control': 'public, max-age=3600'
				});
				fs.createReadStream(imageThumbPath).pipe(res);
			}
		});
	},this));

	// HTTP POST /threads/<thread_id>/report
	this._app.post('/threads/:id/report', _.bind(function(req,res){
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
			var thread_id = body_parsed.thread_id;
			var text = body_parsed.text;
			
			this._dao.report_thread(thread_id, text, _.bind(function(err){
				if (err!=null)
					res.json(500, {error:"internal server error"});

				var mailOptions = {
				    from: "La petite falope <la.petite.falope@gmail.com>",
				    to: "frederic.falliere@gmail.com",
				    subject: "Report la petite falope "+thread_id,
				    text: "Une falope d'id "+thread_id+" vient d'être reportée",
				    html: "Une falope d'id <b>"+thread_id+"</b> vient d'être reportée"
				}
				smtpTransport.sendMail(mailOptions, function(error, response){
				    if(error)
				        console.log("send mail error"+ error);
				    else
				        console.log("Message sent: " + response.message);
				});

				res.json({ok:new Date().getTime()});
			},this))
		},this));

	},this));

	// HTTP GET /banned 
	this._app.get('/banned', _.bind(function(req,res){
		var duid = req.headers['x-duid'];
		this._dao.is_banned(duid, function(banned){
			res.send({banned:banned});
		})
	},this));


	// ---------------------
	// ADMIN ZONE

	// page html
	this._app.get('/modozone', function(res, res){
		fs.readFile(path.resolve(__dirname, 'modozone.html'), function (err, html) {
			if (err)
				res.send(500, 'I\'m an error bitch');
			else {
				res.writeHeader(200, {"Content-Type": "text/html"});  
		        res.write(html);  
		        res.end();  
				
			}
		});
	});

	// push to all
	this._app.post('/modozone/push', _.bind(function(req, res){
		var body = '';
		req.on('data',function(data){
			body+=data;
		});
		req.on('end',_.bind(function(){
			var passcode = req.headers['x-passcode'];
			if (passcode!=='fifoupresident') {
				res.send(403);
			} else {
				try {
					var body_parsed = JSON.parse(body);
				} catch(exc) {
					var body_parsed = qs.parse(body);
				}
				var msg = body_parsed.content;

				console.log("MSG:", msg);
				this._pushInterface.push('newfalope', msg, undefined, function(){
					res.send()
				});
			}
			
		},this));

	},this));

	// HTTP POST /threads/<thread_id>/delete
	// suppression d'un thread
	this._app.post('/threads/:id/delete', _.bind(function(req,res){
		var passcode = req.headers['x-passcode'];
		if (passcode!=='fifoupresident') {
			res.send(404);
		} else {
			var thread_id = req.params.id;
			this._dao.delete_thread(thread_id, _.bind(function(results){
				if (results==true) 
					res.json(200, {deleted:true});
				else
					res.send(500);
			},this))
		}	

	},this));

	// HTTP POST /threads/<thread_id>/ban
	// ban de l'utilisateur créateur du thread
	this._app.post('/threads/:id/banuser', _.bind(function(req,res){
		var passcode = req.headers['x-passcode'];
		if (passcode!=='fifoupresident') {
			res.send(404);
		} else {
			var thread_id = req.params.id;
			this._dao.ban_user(thread_id, _.bind(function(results){
				if (results==true) 
					res.json(200, {deleted:true});
				else
					res.send(500);
			},this))
		}	
	},this));

}

Server.prototype.close = function(callback) {
	this._server.close(callback);
}

module.exports = Server;





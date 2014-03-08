var _ = require('underscore');
var EasyMongo = require('easymongo');

function DaoMongo(dbname){
	this._dbname=dbname;
	var options = {
	    dbname: this._dbname
	};
	this._mongo = new EasyMongo(options);
}

DaoMongo.prototype.setLimit = function(limit) {
	this._limit=limit;
}

DaoMongo.prototype.threads = function(callback) {
	var _threads = this._mongo.collection('threads');
	_threads.find({}, {sort:{last_comment:-1}}, _.bind(function(err, threads){
		this._transformMongoId(threads);
		if(err==null)
			callback(threads);
	},this));
}

DaoMongo.prototype.thread = function(id, callback){
	var _threads = this._mongo.collection('threads');
	_threads.findById(id, _.bind(function(err, thread){
		this._transformMongoId(thread);
		if (err==null) {
			var _comments = this._mongo.collection('comments');
			var threadId = thread.id+'';
			_comments.find({thread_id:threadId}, _.bind(function(err, comments){
				this._transformMongoId(comments);
				thread.comments=comments;
				callback([thread]);
			},this));

		}
	},this));
}

DaoMongo.prototype.post_thread = function(title, color, policeName, policeSize, imageUrl, callback) {
	var _threads = this._mongo.collection('threads');
	
	// TODO : implement size limit

	var new_thread = {
		comments:[],
		title:title,
		color:color,
		policeName:policeName,
		policeSize:policeSize,
		imageUrl:imageUrl,
		last_comment:new Date().getTime()
	}

	_threads.save(new_thread, _.bind(function(err, thread){
		this._transformMongoId(thread);
		if (err==null) 
			callback(thread); 
	},this));
}

DaoMongo.prototype.post_comment = function(id, text, color, callback) {
	var _comments = this._mongo.collection('comments');

	var new_comment = {
		thread_id:id,
		text:text,
		color:color
	}

	// TODO : update thread last_comment

	_comments.save(new_comment, _.bind(function(err, comment) {
		this._transformMongoId(comment);
		if (err==null) {
			callback([comment])
			
			var _threads = this._mongo.collection('threads');
			_threads.findById(id, _.bind(function(err, thread){
				
				if (err==null) {

					thread.last_comment = new Date().getTime();
					_threads.save(thread, function(err, res){
						// 
					});
				}
			},this));

			
		}
	},this))

}

DaoMongo.prototype._transformMongoId = function(obj) {
	if (_.isArray(obj)) {
		_.each(obj, function(o){
			if (o._id) {
				o.id = o._id;
				delete o._id;
			}
		});
	} else if (_.isObject(obj)) {
		if (obj._id) {
			obj.id = obj._id;
			delete obj._id;
		}
	}
		
}


module.exports = DaoMongo;



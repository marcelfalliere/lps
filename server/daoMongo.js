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
		else
			callback(err);
	},this));
}

DaoMongo.prototype.thread = function(id, callback){
	var _threads = this._mongo.collection('threads');
	_threads.findById(id, _.bind(function(err, thread){
		this._transformMongoId(thread);
		if (err==null && thread!=false) {
			var _comments = this._mongo.collection('comments');
			var threadId = thread.id+'';
			_comments.find({thread_id:threadId}, _.bind(function(err, comments){
				this._transformMongoId(comments);
				thread.comments=comments;
				callback([thread]);
			},this));
		} else {
			callback([]);
		}
	},this));
}

DaoMongo.prototype.post_thread = function(title, color, policeName, policeSize, imageUrl, duid, callback) {
	var _threads = this._mongo.collection('threads');

	var insert_new_threads = _.bind(function(){
		var new_thread = {
			comments:[],
			title:title,
			color:color,
			policeName:policeName,
			policeSize:policeSize,
			imageUrl:imageUrl,
			duid:duid,
			last_comment:new Date().getTime(),
			comments_count:0
		}

		console.log("New thread created ", new_thread)

		_threads.save(new_thread, _.bind(function(err, thread){
			this._transformMongoId(thread);
			if (err==null) 
				callback(thread); 
		},this));
	}, this);
	
	// limit
	_threads.count({}, _.bind(function(err, count_threads){
		if (count_threads >= this._limit) {
			_threads.find({}, {sort:{last_comment:1}}, _.bind(function(err, threads){
				if (err==null) {
					_threads.remove({_id:threads[0]._id}, insert_new_threads)
				} else {
					insert_new_threads();
				}
			}));
		} else {
			insert_new_threads();
		}

	},this));

}

DaoMongo.prototype.post_comment = function(id, text, color, pseudonym, callback) {
	var _comments = this._mongo.collection('comments');

	var new_comment = {
		thread_id:id,
		text:text,
		color:color,
		pseudonym:pseudonym || 'Anonyme'
	}

	console.log('new comment', new_comment);

	_comments.save(new_comment, _.bind(function(err, comment) {
		this._transformMongoId(comment);
		if (err==null) {
			
			var _threads = this._mongo.collection('threads');
			_threads.findById(id, _.bind(function(err, thread){
				
				if (err==null) {

					thread.last_comment = new Date().getTime();
					thread.comments_count = thread.comments_count + 1;
					_threads.save(thread, function(err, res){
						callback([comment]);
					});
				}
			},this));

			
		}
	},this))

}

DaoMongo.prototype.report_thread = function(thread_id, text, callback) {
	var _reports = this._mongo.collection('reports');

	var new_report = {
		thread_id:thread_id,
		text:text
	}

	_reports.save(new_report, _.bind(function(err) {
		callback(err);
	},this));
}

DaoMongo.prototype.delete_thread = function(thread_id, callback) {
	var _threads = this._mongo.collection('threads');

	_threads.remove({_id:thread_id}, function(error, results){
		callback(results);
	});
}

DaoMongo.prototype.ban_user = function(thread_id, callback) {
	var _threads = this._mongo.collection('threads');

	_threads.findById(thread_id, _.bind(function(error, result){
		if (error!=null) {
			callback(false)
		} else {
			var _bans = this._mongo.collection('bans');
			_bans.save({duid:result.duid, creation_date:new Date().getTime()}, function(error, results){
				callback(error==null);
			});
		}

	},this));
}

DaoMongo.prototype.is_banned = function(duid, callback) {
	var _bans = this._mongo.collection('bans');
	_bans.find({duid:duid}, {limit:1}, _.bind(function(error, results){
		callback(results.length != 0)
	},this));
}

DaoMongo.prototype._transformMongoId = function(obj) {
	if (_.isArray(obj)) {
		_.each(obj, function(o){
			if (o._id) {
				o.id = o._id;
				delete o._id;
			}
			if (o.duid)
				delete o.duid;
		});
	} else if (_.isObject(obj)) {
		if (obj._id) {
			obj.id = obj._id;
			delete obj._id;
		}
		if (obj.duid)
			delete obj.duid;
	}
		
}


module.exports = DaoMongo;



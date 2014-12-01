
db.threads.find({}).forEach(function(thread){

	var count = db.comments.find({thread_id:thread._id.str}).count();

	thread.comments_count = count;
	db.threads.save(thread);
})


db.comments.update({}, {$set:{pseudonym:'Anonyme'}}, {multi:true})
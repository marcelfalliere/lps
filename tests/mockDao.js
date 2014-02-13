/*

drop-in replacement for the Server class dao parameter

*/

var _ = require('underscore');

var initial_threads = [
		{
			id:'1',
			title:'first',
			count_comments:0,
			last_comment:10
		},
		{
			id:'2',
			title:'second',
			count_comments:0,
			last_comment:9
		},
		{
			id:'3',
			title:'third',
			count_comments:0,
			last_comment:8
		},
		{
			id:'4',
			title:'fourth',
			count_comments:0,
			last_comment:7
		},
		{
			id:'5',
			title:'fifth',
			count_comments:0,
			last_comment:6
		},
		{
			id:'6',
			title:'sixth',
			count_comments:0,
			last_comment:5
		},
		{
			id:'7',
			title:'seventh',
			count_comments:0,
			last_comment:4
		},
		{
			id:'8',
			title:'eighth',
			count_comments:0,
			last_comment:3
		},
		{
			id:'9',
			title:'nineth',
			count_comments:0,
			last_comment:2
		},
		{
			id:'10',
			title:'tenth',
			count_comments:0,
			last_comment:1
		}
];

var initial_comments = [];

module.exports = {
	setLimit:function(limit){
		console.log(limit)
		this._limit=limit;
	},
	threads:function(callback){
		var sorted_threads = _.sortBy(initial_threads, function(t){ return -t.last_comment });
		callback(sorted_threads);
	},
	thread:function(id, callback){
		var founds = [];
		for (var i = 0 ; i < initial_threads.length ; i++) {
			if (id==initial_threads[i].id)
				founds.push(initial_threads[i]);
		}

		var commentsFound = [];
		for (var i = 0 ; i < initial_comments.length ; i++) {
			if (id==initial_comments[i].thread_id) 
				commentsFound.push(initial_comments[i])
		}

		if (founds.length == 1)
			founds[0].comments = commentsFound;

		callback(founds);
	},
	post_comment:function(id, text, callback){
		initial_comments.push({
			thread_id:id,
			text:text
		});

		this.thread(id, function(thread){
			if (thread.length==1){
				thread[0].last_comment = new Date().getTime();
			}
			callback(thread);
		});
	},
	post_thread:function(title, callback) {
		if (initial_threads.length == this._limit) {
			var oldest_thread = _.max(initial_threads, function(t){ return -t.last_comment; })
			initial_threads = _.reject(initial_threads, function(t){ return t.id==oldest_thread.id });
		}

		var new_thread = {
			id:this.next_thread_id(),
			comments:[],
			title:title,
			last_comment:new Date().getTime()
		}

		initial_threads.push(new_thread);

		callback(new_thread);
	},
	next_thread_id:function(){
		if (this.thread_id_count===undefined) {
			this.thread_id_count=100;
		}
		this.thread_id_count++;
		return this.thread_id_count+'';
	}
}
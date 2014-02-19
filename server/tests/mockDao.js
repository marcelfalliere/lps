/*

drop-in replacement for the Server class dao parameter

*/

var _ = require('underscore');

var initial_threads = [
		{
			id:'1',
			title:'first',
			count_comments:0,
			last_comment:10,
			color:'rgb(255,0,140) '
		},
		{
			id:'2',
			title:'second',
			count_comments:0,
			last_comment:9,
			color:'rgb(110,0,255) '
		},
		{
			id:'3',
			title:'third',
			count_comments:0,
			last_comment:8,
			color:'rgb(0,140,255) '
		},
		{
			id:'4',
			title:'fourth',
			count_comments:0,
			last_comment:7,
			color:'rgb(0,255,140) '
		},
		{
			id:'5',
			title:'fifth',
			count_comments:0,
			last_comment:6,
			color:'rgb(0,255,110) '
		},
		{
			id:'6',
			title:'sixth',
			count_comments:0,
			last_comment:5,
			color:'rgb(255,0,140) '
		},
		{
			id:'7',
			title:'seventh',
			count_comments:0,
			last_comment:4,
			color:'rgb(255,255,50) '
		},
		{
			id:'8',
			title:'eighth',
			count_comments:0,
			last_comment:3,
			color:'rgb(255,110,0) '
		},
		{
			id:'9',
			title:'nineth',
			count_comments:0,
			last_comment:2,
			color:'rgb(0,255,140) '
		},
		{
			id:'10',
			title:'tenth',
			count_comments:0,
			last_comment:1,
			color:'rgb(255,0,140) '
		}
];

var initial_comments = [
	{
		thread_id:'5',
		text:'hey fifth'
	},
	{
		thread_id:'5',
		text:'goog luck dude'
	}
];

module.exports = {
	setLimit:function(limit){
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
	post_thread:function(title, color, callback) {
		if (initial_threads.length == this._limit) {
			var oldest_thread = _.max(initial_threads, function(t){ return -t.last_comment; })
			initial_threads = _.reject(initial_threads, function(t){ return t.id==oldest_thread.id });
		}

		var new_thread = {
			id:this.next_thread_id(),
			comments:[],
			title:title,
			color:color,
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
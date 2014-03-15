"use strict";

var CommentModel = Backbone.Model.extend({
	initialize:function(){
		this.on('sync', _.bind(this.subscribeToNewCommentsPush,this));
	},
	url:function(){
		return conf.server.base_url+'threads/'+this.get('thread_id')+'/post_comment';
	},
	subscribeToNewCommentsPush:function(){
		var thread = new ThreadModel({id:this.get('thread_id')});
		thread.subscribeToNewCommentsPush();
	}
});
"use strict";

var CommentsCollection = Backbone.Collection.extend({
	model:CommentModel,
	url:function(){
		return conf.server.base_url+'threads/'+this.thread_id;
	},
	parse:function(dataFromServerAsJson) {
		return dataFromServerAsJson.comments;
	}
});
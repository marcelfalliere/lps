"use strict";

var CommentsCollection = Backbone.Collection.extend({
	model:CommentModel,
	url:function(){
		return conf.server.base_url+'threads/'+this.thread_id;
	},
	parse:function(dataFromServerAsJson) {
		return dataFromServerAsJson.comments;
	},
	isLoading:function(){
		if (this.length == 1) {
			if (this.at(0).get('loading'))
				return true;
		}
		return false;
	}
});
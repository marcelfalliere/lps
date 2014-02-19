"use strict";

var CommentModel = Backbone.Model.extend({
	url:function(){
		return conf.server.base_url+'threads/'+this.get('thread_id')+'/post_comment';
	}
});
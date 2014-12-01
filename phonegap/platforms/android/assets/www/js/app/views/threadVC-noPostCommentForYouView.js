"use strict";

var NoPostCommentForYouView = Backbone.Marionette.ItemView.extend({
	template:'#tpl-no-post-comment-for-you',
	className:'noPostCommentForYou',
	events:{
		'tap':'toPseudonym'
	},
	toPseudonym:function(){
		app.router.navigate('pseudonym', {trigger:true});
	}
})
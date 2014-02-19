"use strict";

var MainRouter = Backbone.Router.extend({
	routes:{
		'':'home',
		'thread/:thread_id':'thread',
		'post_thread':'postThread'
	},
	home:function(){
		app.header.setTitle('léger')
			.hideButton('back')
			.showButton('postThread')
			.hideButton('publier');

		app.content.slideInFromRight(new HomeVC({
			collection:app.threads
		}));
	},
	thread:function(thread_id) {
		app.header.setTitle(app.threads.get(thread_id).get('title'))
			.showButton('back')
			.hideButton('postThread')
			.hideButton('publier');

		app.content.slideIn(new ThreadVCLayout(
			// will handle itself
		));
	},
	postThread:function() {
		app.header.setTitle('')
			.showButton('back')
			.hideButton('postThread')
			.showButton('publier');

		app.content.slideIn(new PostThreadVC({
			model:new ThreadModel()
		}));
	}
});


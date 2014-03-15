"use strict";

var MainRouter = Backbone.Router.extend({
	routes:{
		'':'home',
		'thread/:thread_id':'thread',
		'post_thread':'postThread'
	},
	home:function(){
		app.header.setMainTitle()
			.hideButton('back')
			.showButton('postThread')
			.hideButton('publier')
			.hideButton('close')
			.setTransparent(false);

		app.content.slideInFromRight(new HomeVC({
			collection:app.threads
		}));

		if (analytics!==undefined) analytics.trackView('Home');
	},
	thread:function(thread_id) {
		app.header.setMainTitle()
			.showButton('back')
			.hideButton('postThread')
			.hideButton('publier')
			.hideButton('close')
			.setTransparent(false);

		app.content.slideIn(new ThreadVCLayout(
			// will handle itself
		));

		if (analytics!==undefined) analytics.trackView('Thread-'+thread_id);
	},
	postThread:function() {
		app.header.setTitle('')
			.hideButton('back')
			.hideButton('postThread')
			.showButton('publier')
			.showButton('close')
			.setTransparent(true)
			.buttons.publier.removeClass('loading');

		app.content.slideIn(new PostThreadVC({
			model:new ThreadModel()
		}));

		if (analytics!==undefined) analytics.trackView('PostThread');
	}
});


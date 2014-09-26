"use strict";

var MainRouter = Backbone.Router.extend({
	initialize:function(){
		this.customHistory = [];
		this.on('route', _.bind(function(r){
			this.customHistory.push(r);
		},this))
	},
	routes:{
		'':'home',
		'thread/:thread_id':'thread',
		'post_thread':'postThread',
		'banned':'banned',
		'eula':'eula'
	},
	home:function(){
		app.header.setMainTitle()
			.hideButton('back')
			.showButton('postThread')
			.hideButton('publier')
			.hideButton('report')
			.hideButton('close')
			.setTransparent(false);

		var lastRoute = this.customHistory[this.customHistory.length-1];
		if (lastRoute == 'eula') {
			app.content.slideInFromBottom(new HomeVC({
				collection:app.threads
			}));
		} else {
			app.content.slideInFromRight(new HomeVC({
				collection:app.threads
			}));
		}


		if (window.analytics!==undefined) window.analytics.trackView('Home');
	},
	thread:function(thread_id) {
		app.header.setMainTitle()
			.showButton('back')
			.hideButton('postThread')
			.hideButton('publier')
			.showButton('report')
			.hideButton('close')
			.setTransparent(false);

		app.content.slideIn(new ThreadVCLayout(
			// will handle itself
		));

		if (window.analytics!==undefined) window.analytics.trackView('Thread-'+thread_id);
	},
	postThread:function() {
		app.header.setTitle('')
			.hideButton('back')
			.hideButton('postThread')
			.showButton('publier')
			.hideButton('report')
			.showButton('close')
			.setTransparent(true)
			.buttons.publier.removeClass('loading');

		app.content.slideIn(new PostThreadVC({
			model:new ThreadModel()
		}));

		if (window.analytics!==undefined) window.analytics.trackView('PostThread');
	},
	banned:function(){
		app.header.setMainTitle()
			.hideButton('back')
			.hideButton('postThread')
			.hideButton('publier')
			.hideButton('report')
			.hideButton('close')
			.setTransparent(false)
			.buttons.publier.removeClass('loading');

		app.content.slideIn(new BannedVC());

		if (window.analytics!==undefined) window.analytics.trackView('Banned');
	},
	eula:function(){
		app.header.setMainTitle()
			.goUp()
			.buttons.publier.removeClass('loading');

		app.content.slideIn(new EulaVC());

		if (window.analytics!==undefined) window.analytics.trackView('Eula');
	}
});


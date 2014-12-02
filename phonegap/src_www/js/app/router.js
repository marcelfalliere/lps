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
		'eula':'eula',
		'pseudonym':'pseudonym'
	},
	home:function(){
		app.header.setMainTitle()
			.hideButton('back')
			.showButton('postThread')
			.hideButton('publier')
			.hideButton('report')
			.hideButton('close')
			.showButton('pseudonym')
			.setTransparent(false);

		var lastRoute = this.customHistory[this.customHistory.length-1];

		var homeVC = new HomeVC({ collection:app.threads });

		if (lastRoute == 'eula') {
			app.content.slideInFromBottom(homeVC);
		} else if (lastRoute == 'thread') {
			app.content.zoomOut(homeVC);
		} else if (lastRoute == 'pseudonym'){
			app.content.slideInToBottom(homeVC);
		} else {
			app.content.slideInFromRight(homeVC);
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
			.hideButton('pseudonym')
			.setTransparent(false);

		app.content.zoomIn(new ThreadVCLayout(
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
			.hideButton('pseudonym')
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
			.hideButton('pseudonym')
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
	},
	pseudonym:function(thread_id) {
		app.header.setTitle('')
			.hideButton('back')
			.hideButton('postThread')
			.hideButton('publier')
			.hideButton('report')
			.showButton('close')
			.hideButton('pseudonym')
			.setTransparent(true);

		app.content.slideInFromBottom(new PseudonymVC(
		));

		if (window.analytics!==undefined) window.analytics.trackView('Pseudonym');
	},
});


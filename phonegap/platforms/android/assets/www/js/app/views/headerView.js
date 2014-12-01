"use strict";

var HeaderView = Backbone.Marionette.ItemView.extend({
	el:'#header',
	events:{
		'tap .button.back': 'onBackTapped',
		'tap .button.close': 'onBackTapped',
		'tap .button.post-thread': 'onPostThreadTapped',
		'tap .button.publier':'onPublierTapped',
		'tap .button.report':'onReportTapped',
		'tap .button.pseudonym':'onPseudonymTapped',

		'newcolor':'updateButtonColor',
		'newimage':'updateImageBackground',
		'newmodel':'updateImageBackground',
		'newpolice':'updateFont',
		'saving':'lock'
	},
	onBackTapped:function(){
		var lastRoute = app.router.customHistory[app.router.customHistory.length-2];
		if (lastRoute == 'thread')
			window.history.back();
		else
			app.router.navigate('', {trigger:true});
	},
	onPostThreadTapped:function(){
		app.router.navigate('post_thread', {trigger:true});
	},
	onPublierTapped:function(){
		app.content.currentView.$el.trigger('publiertapped')
	},
	onReportTapped:function(){
		app.content.currentView.$el.trigger('raporttapped');
	},
	onPseudonymTapped:function(){
		app.router.navigate('pseudonym', {trigger:true});
	},

	updateButtonColor:function(e, color){
		this.$el.find('.publier').css('background-color', color)
	},
	updateImageBackground:function(e, imagePath){
		if (imagePath!==undefined)
			this.$el.find('.publier').css('background-image', 'url("'+imagePath+'")');
		else
			this.$el.find('.publier').css('background-image', 'none');
	},
	updateFont:function(e, font){
		this.$el.find('.publier').css({
			'font-family': font.font,
			'font-size': (parseInt(font.size,10)*0.7)+'px'
		});
	},
	lock:function(){
		this.$el.find('.publier').addClass('loading');
	}
});
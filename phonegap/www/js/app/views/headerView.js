"use strict";

var HeaderView = Backbone.Marionette.ItemView.extend({
	el:'#header',
	events:{
		'tap .button.back': 'onBackTapped',
		'tap .button.post-thread': 'onPostThreadTapped',
		'tap .button.publier':'onPublierTapped',
		'newcolor':'updateButtonColor'
	},
	initialize:function(){
		this.$backButton = this.$el.find('.back.button');
	},
	onBackTapped:function(){
		app.router.navigate('', {trigger:true});
	},
	onPostThreadTapped:function(){
		app.router.navigate('post_thread', {trigger:true});
	},
	onPublierTapped:function(){
		app.content.currentView.$el.trigger('publiertapped')
	},
	updateButtonColor:function(e, color){
		this.$el.find('.publier').css('background-color', color)
	}
});
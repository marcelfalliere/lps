"use strict";

var HeaderRegion = Backbone.Marionette.Region.extend({
	el:'#header',
	initialize:function(){
		this.headerView = new HeaderView();
	},

	setTransparent:function(shouldIt){
		this.$el.removeClass('gone-up');
		if (shouldIt==true) {
			this.$el.addClass('transparent');
		} else {
			this.$el.removeClass('transparent');
		}
		return this;
	},

	goUp:function(){
		this.$el.addClass('gone-up');
		return this;
	},

	setTitle:function(title){
		this.ensureEl();
		this.$title
			.html(title)
			.removeClass('main-title');
		return this;
	},

	setMainTitle:function(title){
		this.setTitle('la petite s.');
		this.$title.addClass('main-title');
		return this;
	},

	hideButton:function(buttonId){
		this.ensureEl();
		var button = this.buttons[buttonId];
		if (button) {
			if (button.hasClass('shown')) {
				button
					.off('webkitAnimationEnd')
					.removeClass('shown')
					.addClass('hidebuttonanim')
					.on('webkitAnimationEnd', _.bind(function(){
							this.off('webkitAnimationEnd')
								.addClass('hidden')
								.removeClass('hidebuttonanim showbuttonanim');
						}, button));

			} else {
				button.addClass('hidden');
			}
		}
		return this;
	},

	showButton:function(buttonId, possibleRoute) {
		this.ensureEl();
		var button = this.buttons[buttonId];
		if (button) {
			button
				.off('webkitAnimationEnd')
				.removeClass('hidden')
				.addClass('showbuttonanim')
				.on('webkitAnimationEnd', _.bind(function(){
						this.off('webkitAnimationEnd')
							.addClass('shown')
							.removeClass('showbuttonanim hidebuttonanim');
					}, button));
			if (possibleRoute) {
				button.attr('data-route', possibleRoute)
			}
		}
		return this;
	},

	ensureEl:function(){
		this.buttons = {
			back: this.$el.find('.button.back'),
			postThread: this.$el.find('.button.post-thread'),
			publier: this.$el.find('.button.publier'),
			close: this.$el.find('.button.close'),
			report: this.$el.find('.button.report'),
			pseudonym: this.$el.find('.button.pseudonym')
		};
		this.$title = this.$el.find('h1');
	}
});
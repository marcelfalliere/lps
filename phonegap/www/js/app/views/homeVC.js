"use strict";

var HomeItemView = Backbone.Marionette.ItemView.extend({
	template:'#tpl-home-item',
	tagName:'li',
	events:{
		'tap':'onTap'
	},
	onTap:function(){
		app.thread = this.model;

		app.homeViewScrollTop = $(window).scrollTop();

		$(window).scrollTop(0);
		$('.page.home-vc').css('top','-'+(app.homeViewScrollTop-$('#header').innerHeight())+'px')

		app.router.navigate('thread/'+this.model.get('id'), {trigger:true});
	},
	onRender:function(){
		this.$el.css('background-color', this.model.get('color'));
		this.$el.height($(window).width()+'px');
	}
});

var HomeVC = HammerScrollableView.extend({
	template:'#tpl-home',
	className:'page home-vc',
	itemViewContainer:'ol',
	itemView:HomeItemView,
	events:_.extend({}, HammerScrollableView.prototype.events, {})
});

function isIOS7(){
	return navigator.userAgent.match(/(iPad|iPhone|iPod touch);.*CPU.*OS 7_\d/i)
}
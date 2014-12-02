"use strict";

var PseudonymVC = Backbone.Marionette.ItemView.extend({
	template:function(){
		return _.template($(didSetPseudonym() ? '#tpl-pseudonym-vc' : '#tpl-set-pseudonym-vc').html())	
	},
	className:'page pseudonym-vc',
	events:{
		'tap .confirm':"setUserPseudonym",
		'tap input':'onFocusInput'
	},
	setUserPseudonym:function(){
		var pseudonym = this.$el.find('input').val();
		rememberPseudonym(pseudonym);
		this.render();

		if (window.analytics!==undefined) window.analytics.trackView('PseudonymHasBeenSet');

		setTimeout(function(){
			app.header.headerView.onBackTapped()
		},500)
	},
	onRender:function(){
		//var commentColor = 'rgb(255, 255, 122)';
		var commentColor = getCommentColor();
		if (!tinycolor(commentColor).isDark()){
			this.$el.addClass('light');
		}
		this.$el.css('background-color', commentColor)
	},
	onFocusInput:function(ev) {
		ev.gesture.preventDefault();
		this.$el.find('input').focus();
	}
});
"use strict";

var EulaVC = Backbone.Marionette.ItemView.extend({
	template:'#tpl-eula-vc',
	className:'page no-header eula-vc',
	events:{
		'tap .eula .button:not(.disabled)':'acceptEula'
	},
	acceptEula:function(){
		if (analytics!==undefined) analytics.trackView('EulaAccepted');
		hasAcceptedEula();
		location.hash='';
	},
	onRender:function(){

		setTimeout(_.bind(function(){
			
			this.$el.addClass('ready');

			setTimeout(_.bind(function(){
				this.$el.find('button').removeClass('disabled');
				this.$el.find('#banderolle').addClass('animate');
			}, this), 1000);

		}, this), 700);

		
	}
});

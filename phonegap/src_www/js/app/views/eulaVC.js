"use strict";

var EulaVC = Backbone.Marionette.ItemView.extend({
	template:'#tpl-eula-vc',
	className:'page no-header eula-vc',
	events:{
		'tap .eula .button:not(.disabled)':'acceptEula'
	},
	acceptEula:function(){
		// android <4.4 hack
		if (window.device 
			&& device.platform 
			&& device.version 
			&& device.platform=='Android' 
			&& parseFloat(device.version) < 4.4) {
			
			$('#header').attr('style', '')
		}

		if (window.analytics!==undefined) window.analytics.trackView('EulaAccepted');
		hasAcceptedEula();
		location.hash='';

			
	},
	onRender:function(){


		setTimeout(_.bind(function(){

			// android <4.4 hack
			if (window.device 
				&& device.platform 
				&& device.version 
				&& device.platform=='Android' 
				&& parseFloat(device.version) < 4.4) {
				$('#header').attr('style', 'display:none;')
			}
			
			this.$el.addClass('ready');

			setTimeout(_.bind(function(){
				this.$el.find('button').removeClass('disabled');
				this.$el.find('#banderolle').addClass('animate');
			}, this), 1000);

		}, this), 700);

		
	}
});

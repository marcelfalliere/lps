"use strict";

var ThreadModel = Backbone.Model.extend({
	url:conf.server.base_url+'post_thread',
	initialize:function(){
		this.on('sync', _.bind(this.subscribeToNewCommentsPush, this));
	},
	subscribeToNewCommentsPush:function(){
		// TODO : 2 channel : 1 pour le créateur et 1 pour les participants
		cordova.exec(function(){
			console.log('success subscribeToNewCommentsPush');
		}, function(){
			console.warn('error subscribeToNewCommentsPush');
		}, 'PushNotification', 'subscribe', ['newcomments'+this.id]);	
	
	},
	report:function(text){
		var report = new ReportModel({
			thread_id:this.get('id'),
			text:text
		});
		report.save();
		app.threads.report(this.get('id'));
	}
});
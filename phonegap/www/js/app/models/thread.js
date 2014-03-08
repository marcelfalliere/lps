"use strict";

var ThreadModel = Backbone.Model.extend({
	url:conf.server.base_url+'post_thread',
	initialize:function(){
		this.on('change:imageUrl', _.bind(this.cacheSavedImageForLater, this));
		this.on('sync', _.bind(this.subscribeToNewCommentsPush, this));
	},
	cacheSavedImageForLater:function(){
		if (!_.isEmpty(this.get('imageUrl'))) {
			var sha1 = SHA1(this.get('imageUrl'));
			convertImgToBase64(this.get('imagePath'), function(base64){
				console.log('saved to local storage ma foi');
				localStorage.setItem(sha1, base64);
			});
		}
	},
	subscribeToNewCommentsPush:function(){
		cordova.exec(function(){
			console.log('success subscribeToNewCommentsPush');
		}, function(){
			console.warn('error subscribeToNewCommentsPush');
		}, 'PushNotification', 'subscribe', ['newcomments_'+this.id]);	
	
	}
});
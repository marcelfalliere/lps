"use strict";

var ThreadModel = Backbone.Model.extend({
	url:conf.server.base_url+'post_thread',
	initialize:function(){
		this.on('change:imageUrl', _.bind(this.cacheSavedImageForLater, this));
	},
	cacheSavedImageForLater:function(){
		var sha1 = SHA1(this.get('imageUrl'));
		convertImgToBase64(this.get('imagePath'), function(base64){
			console.log('saved to local storage ma foi');
			localStorage.setItem(sha1, base64);
		});
	}
});
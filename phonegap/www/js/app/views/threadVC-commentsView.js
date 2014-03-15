"use strict";

var CommentItemView = Backbone.Marionette.ItemView.extend({
	template:'#tpl-thread-comment-item-view',
	tagName:'li'
});


var ThreadCommentsView = Backbone.Marionette.CollectionView.extend({
	template:'#tpl-thread-comments-view',
	itemViewContainer:'ol',
	tagName:'ol',
	itemView:CommentItemView,
	initialize:function(){
		this.collection.on('sync', _.bind(this.render, this));
		this.collection.on('error', _.bind(this.renderError, this));
	},
	renderError:function(){
		navigator.notification.alert(
			    "Cette falope n'existe plus, et tant mieux !",  
			    function(){},         
			    '~ ~ ~',            
			    'C\'est la vie'                  
			);
		
	}
});

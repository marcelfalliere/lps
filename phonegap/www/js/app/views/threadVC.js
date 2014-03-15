"use strict";

var ThreadVCLayout = Backbone.Marionette.Layout.extend({
	template:'#tpl-thread-layout',
	className:'page thread-vc',
	regions:{
		title:'#thread-title',
		comments:'#thread-comments',
		postComment:'#post-comment'
	},
	onRender:function(){
		
		this.iScrollInstance = new IScroll(this.$el.find('.scroll-wrap')[0], {
		    fadeScrollbars:true,
		    disableMouse: true,
    		disablePointer: true,
    		shrinkScrollbars:'scale',
    		scrollbars:'custom'
		});

		var comments = new CommentsCollection();
		comments.on('all', _.bind(function(){
			this.iScrollInstance.refresh();
		},this));

		this.title.show(new ItemReadOnlyView({
			model:app.thread
		}));
		
		this.comments.show(new ThreadCommentsView({
			thread_id:app.thread.get('id'),
			collection:comments
		}));

		this.postComment.show(new PostCommentView({
			model:new CommentModel({
				thread_id:app.thread.get('id')
			}),
			comments:comments
		}));

		comments.thread_id = app.thread.get('id');
		comments.fetch();
		
	}
});

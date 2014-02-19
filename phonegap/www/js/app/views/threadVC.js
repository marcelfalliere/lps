"use strict";

var ThreadTitleView = Backbone.Marionette.ItemView.extend({
	template:'#tpl-thread-title-view'
})

var CommentItemView = Backbone.Marionette.ItemView.extend({
	template:'#tpl-thread-comment-item-view',
	tagName:'li'
});

var ThreadCommentsView = Backbone.Marionette.CollectionView.extend({
	template:'#tpl-thread-comments-view',
	itemViewContainer:'ol',
	itemView:CommentItemView,
	initialize:function(){
		this.fetchComments();
	},
	fetchComments:function(){
		this.collection.thread_id = this.options.thread_id;
		this.collection.on('all', _.bind(this.render, this));
		this.collection.fetch();
	}
});

var PostCommentView = Backbone.Marionette.ItemView.extend({
	template:'#tpl-post-comment-view',
	events:{
		'keyup input':'onKeyupSaveUserInput',
		'tap .post':'onTapToPost'
	},
	onKeyupSaveUserInput:function(){
		this.model.set('text', this.$el.find('input').val());
	},
	onTapToPost:function(){
		this.postModelToServer();
		this.updateLocalCommentsCollection();
		this.cleanAndPrepareNewModel();
	},
	postModelToServer:function(){
		this.model.on('sync',_.bind(this.updateLocalThreadsList,this));
		this.model.save();
	},
	updateLocalCommentsCollection:function(){
		this.options.comments.add(this.model);
	},
	cleanAndPrepareNewModel:function(){
		this.$el.find('input').val('');
		this.model = new CommentModel({
			thread_id:this.model.get('thread_id')
		})
	},
	updateLocalThreadsList:function(){
		app.threads.get(this.model.get('thread_id')).set('last_comment', new Date().getTime());
		app.threads.sort();
	}
});

var ThreadVCLayout = Backbone.Marionette.Layout.extend({
	template:'#tpl-thread-layout',
	className:'page thread-vc',
	regions:{
		title:'#thread-title',
		comments:'#thread-comments',
		postComment:'#post-comment'
	},
	onRender:function(){
		var comments = new CommentsCollection();

		this.title.show(new ThreadTitleView({
			model:app.thread
		}));
		
		this.title.$el
			.css('background-color', app.thread.get('color'))
			.height($(window).width()+'px');

		this.comments.show(new ThreadCommentsView({
			thread_id:app.thread.get('id'),
			collection:comments
		}));

		this.postComment.show(new PostCommentView({
			model:new CommentModel({
				thread_id:app.thread.get('id')
			}),
			comments:comments
		}))
	}
});
"use strict";

var PostCommentView = Backbone.Marionette.ItemView.extend({
	template:'#tpl-post-comment-view',
	className:'post-comment-wrap',
	events:{
		'keyup input':'onKeyupSaveUserInput',
		'tap .post':'onTapToPost',
		'tap input':'onFocusInput',
	},
	initialize:function(){
		this.options.comments.on('error', _.bind(function(){
			this.$el.remove();
		},this));
	},
	onKeyupSaveUserInput:function(){
		this.model.set('text', this.$el.find('input').val());
	},
	onTapToPost:function(){
		if (window.analytics) window.analytics.trackEvent('Thread', 'onTapToPost', 'Tap sur le bouton répondre');

		this.postModelToServer();
		this.updateLocalCommentsCollection();
		this.cleanAndPrepareNewModel();
	},
	onFocusInput:function(ev){
		if (window.analytics) window.analytics.trackEvent('Thread', 'onFocusInput', 'Focus sur le champ de réponse');
		ev.gesture.preventDefault();
		this.$el.find('input').focus();
		this.$el.find('input')[0].select();
	},
	postModelToServer:function(){

		var color = getCommentColor();

		this.model.set('color', color);
		this.model.set('pseudonym', getPseudonym());
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

"use strict";

var PushView = Backbone.Marionette.ItemView.extend({
	template:'#tpl-push',
	events:{
		'tap':'onTap'
	},
	onRender:function(){
		this.ttl = setTimeout(_.bind(function(){
			app.push.close();
		},this), 6000);
	},
	onTap:function(){
		clearTimeout(this.ttl);


		// présent en local ?
		var thread = app.threads.get(this.model.get('thread_id'));
		// pas présent : ben on fetch
		if (thread == undefined) {
			this.$el.text('chargement...')
			app.threads.fetch({
				success:_.bind(function(){
					app.thread = app.threads.get(this.model.get('thread_id'));;
					app.router.navigate('thread/'+this.model.get('thread_id'), {trigger:true});
					app.push.close();	
				},this)
			});
			return;
		} else {
			app.thread = thread;
			app.router.navigate('thread/'+this.model.get('thread_id'), {trigger:true});
			app.push.close();	
		}
	}
});
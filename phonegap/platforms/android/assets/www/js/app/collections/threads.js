"use strict";

var ThreadsCollection = Backbone.Collection.extend({
	model:ThreadModel,
	url:conf.server.base_url+'threads',
	initialize:function(){
		var saved = localStorage.getItem('threads_saved');
		if (saved!=null) {
			var parsed = JSON.parse(saved);
			if (this.length==0)
				this.add(parsed);
		}
		this.on('all', _.bind(this.saveThreads, this));
	},
	saveThreads:function(){
		localStorage.setItem('threads_saved', JSON.stringify(this.toJSON()));
	},
	comparator:function(a, b) {
	  if (a.get('last_comment') > b.get('last_comment')) return -1;
	  if (b.get('last_comment') > a.get('last_comment')) return 1; 
	  return 0; 
	}
});
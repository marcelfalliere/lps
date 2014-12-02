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
		// on retire ceux qui sont reported localement
		var reported = localStorage.getItem('reported');
		if (reported!=null) {
			var reports = JSON.parse(reported);
			for (var i = reports.length - 1; i >= 0; i--) {
				this.remove(reports[i]);
			}
		}

		localStorage.setItem('threads_saved', JSON.stringify(this.toJSON()));
	},
	comparator:function(a, b) {
	  if (a.get('last_comment') > b.get('last_comment')) return -1;
	  if (b.get('last_comment') > a.get('last_comment')) return 1; 
	  return 0; 
	},
	report:function(thread_id) {
		if (thread_id) {
			var reported = localStorage.getItem('reported');
			var	report = [];

			if (reported!=null) 
				report = JSON.parse(reported);
			report.push(thread_id);
			localStorage.setItem('reported', JSON.stringify(report));
			
			this.remove(thread_id);
		}
	}
});
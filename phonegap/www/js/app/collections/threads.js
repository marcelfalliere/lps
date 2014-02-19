"use strict";

var ThreadsCollection = Backbone.Collection.extend({
	model:ThreadModel,
	url:conf.server.base_url+'threads',
	comparator:function(a, b) {
	  if (a.get('last_comment') > b.get('last_comment')) return -1;
	  if (b.get('last_comment') > a.get('last_comment')) return 1; 
	  return 0; 
	}
});
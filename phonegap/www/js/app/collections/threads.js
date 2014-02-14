"use strict";

var ThreadsCollection = Backbone.Collection.extend({
	model:ThreadModel,
	url:'http://localhost:9999/threads'
});
"use strict";

var MainRouter = Backbone.Router.extend({
	routes:{
		'':'index'
	},
	index:function(){
		app.header.setTitle('f');

		app.content.slideInFromRight(new HomeVC());
	}
});


"use strict";

function main(){
	window.app = new Backbone.Marionette.Application();
	initializeApp();
	app.start();
}

function initializeApp(){
	initializeBackbone();
	initializeHammer();

	initializePlatformsSquirk();

	initializeRegions();
	initializeCollections();
	initializeRouterAfterEverythingElse();
}

function initializeHammer(){
	$("#viewport").hammer();
}

function initializeBackbone(){
	Backbone.emulateHTTP = true;
}

function initializePlatformsSquirk(){
	$(document).on('deviceready', function(){
		if (parseFloat(device.version)>=7) {
			$('html').attr('data-ios7',true);
		}
	});
}

function initializeRegions(){
	app.addRegions({
		header:HeaderRegion,
		content:ContentRegion
	});
}


function initializeCollections() {
	app.addInitializer(function(){
		this.threads = new ThreadsCollection();
		this.threads.fetch();
	});
}


function initializeRouterAfterEverythingElse() {
	app.on("initialize:after", function(options){
	  location.hash='';
	  this.router = new MainRouter();
	  Backbone.history.start({pushState: false});
	});
}

document.querySelector("body").onload = main;
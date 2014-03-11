"use strict";

function main(){
	window.app = new Backbone.Marionette.Application();
	initializeApp();
	app.start();
}

function initializeApp(){
	initializeXhr();
	initializeBackbone();
	initializeHammer();
	initializeCacheDatabase();
	initializeGoogleAnalytics();

	initializePlatformsSquirk();

	initializeRegions();
	initializeCollections();
	initializeRouterAfterEverythingElse();
}

function initializeXhr(){
	$.ajaxSetup({ cache: false });
}

function initializeHammer(){
	$("#viewport").hammer();
}

function initializeBackbone(){
	Backbone.emulateHTTP = true;
}

function initializeCacheDatabase(){
	app.db = openDatabase('mydb', '1.0', 'my first database', 5 * 1024 * 1024);
	app.db.transaction(function (tx) {
	  tx.executeSql('CREATE TABLE IF NOT EXISTS images (sha1 unique, base64)');
	});
}

function initializePlatformsSquirk(){
	$(document).on('deviceready', function(){
		if (parseFloat(device.version)>=7) {
			$('html').attr('data-ios7',true);
		}
	});
}

function initializeGoogleAnalytics(){
	$(document).on('deviceready', function(){
		analytics.startTrackerWithId('UA-48753141-1')
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
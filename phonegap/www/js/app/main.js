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
	initializeGoogleAnalytics();

	initializePlatformsSquirk();

	initializeRegions();
	initializeCollections();
	initializeRouterAfterEverythingElse();
	initializeScrollBackToTopHelper();

	initializeInAppPush();

	checkIfUserIsBanned();
}

function initializeXhr(){
	$.ajaxSetup(
		{ 
			cache: false,
			beforeSend:function(xhr){
				xhr.setRequestHeader('X-DUID', device.uuid);
			}
		}
	);
}

function initializeHammer(){
	$("#viewport").hammer();
}

function initializeBackbone(){
	Backbone.emulateHTTP = true;
}

function initializePlatformsSquirk(){
	if (isIOS7()) {
		$('html').attr('data-ios7',true);
	}
}

function initializeGoogleAnalytics(){
	$(document).on('deviceready', function(){
		console.log('device ready');
		analytics.startTrackerWithId('UA-48753141-1');
	});
}

function initializeInAppPush() {
	app.on('push', function(data){
		var thread_id = data.thread_id;
		var title = data.title;
		app.push.show(
			new PushView({model:
				new Backbone.Model({
					thread_id:thread_id,
					title:title
				})
			})
		)
	});
}

function initializeRegions(){
	app.addRegions({
		header:HeaderRegion,
		content:ContentRegion,
		push:PushRegion
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
		if (hasNotSeenEula()){
			location.hash = 'eula';
		}

		this.router = new MainRouter();
	 	Backbone.history.start({pushState: false});
	});
}

function checkIfUserIsBanned() {
	var potentialInformation = localStorage.getItem('banned');
	if (potentialInformation == 'true') {
		whenIsBanned();
	} else {
		$.ajax({
			url:conf.server.base_url+'banned',
			success:function(data){
				if (data.banned === true) {
					localStorage.setItem('banned', 'true');
					whenIsBanned();
				}
			}
		})
	}
}

function whenIsBanned() {
	location.hash = 'banned';
}

function hasNotSeenEula(){
	var potentialInformation = localStorage.getItem('hasSeenEula');
	return potentialInformation !== 'true'
}

function hasAcceptedEula(){
	localStorage.setItem('hasSeenEula', 'true')
}

function initializeScrollBackToTopHelper(){
	$('#scroll-back-to-top-helper').on('click', function(){
		$('#content .page').trigger('scrollBackToTop')
	})
	
	
}

document.querySelector("body").onload = main;

/* this js file utils function */

function isIOS7(){
	return navigator.userAgent.match(/(iPad|iPhone|iPod touch);.*CPU.*OS 7_\d/i)!=null || navigator.userAgent.match(/(iPad|iPhone|iPod touch);.*CPU.*OS 8_\d/i)!=null
}

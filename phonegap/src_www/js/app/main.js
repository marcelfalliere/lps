"use strict";

function main(){
	window.app = new Backbone.Marionette.Application();
	initializeApp();
	app.start();
}

function initializeApp(){
	initializeXhr();
	initializeBackbone();
	initializeHammerForMarionette();
	initializePlatformsSquirk();
	initializeGoogleAnalytics();

	initializeRegions();
	initializeCollections();
	initializeRouterAfterEverythingElse();
	initializeScrollBackToTopHelper();

	initializeInAppPush();
	initializeSocketIo();

	initializePhonegapEvents();

	checkIfUserIsBanned();
}

function initializeXhr(){
	$.ajaxSetup(
		{ 
			cache: false,
			beforeSend:function(xhr){
				if (window.device)
					xhr.setRequestHeader('X-DUID', device.uuid);
			}
		}
	);
}

function initializeSocketIo() {
	app.socket = io(conf.server.base_url);
	app.socket.on('threads', function(threads){
		console.log('threads !');

		if (app.threads) {

			if(!_.isEqual(
				_.map(threads, function(t){ return t.id }), 
				_.map(app.threads.toJSON().splice(0,20), function(t){ return t.id }))
			    ||
			    !_.isEqual(
				_.map(threads, function(t){ return t.last_comment }), 
				_.map(app.threads.toJSON().splice(0,20), function(t){ return t.last_comment }))
			){

				// new ones !
				threads.forEach(function(thread){
					if (!app.threads.get(thread.id)) {
						console.log('adding thread ', thread);
						thread.brand_new = true;
						thread.last_comment = new Date().getTime();
						app.threads.add(thread);
					}
				});

				// delete them
				app.threads.forEach(function(thread){
					var possibleMatch = _.filter(threads, function(t){ return t.id == thread.id });
					if (possibleMatch.length == 0) {
						thread.set('delete_me', true);
						thread.collection.trigger('change:delete_me:socketio');
						console.log('deleting', thread.toJSON());
					}
				});

				// refresh order with last comment ?
				var changed = false;
				app.threads.forEach(function(thread){
					var possibleMatch = _.filter(threads, function(t){ return t.id == thread.id });
					if (possibleMatch.length == 1 
						&& possibleMatch[0].last_comment != thread.get('last_comment')) {
						changed = true;

						console.log('hey');

						thread.set({
							'last_comment': possibleMatch[0].last_comment,
							'new_comments' : true
						});

						thread.collection.trigger('change:new_comments:socketio');

					}
				});
				if (changed == true) {
					app.threads.sort();
				}

			}
		}
	});
}

function initializePhonegapEvents() {
	document.addEventListener("resume", function(){
		// fetch new threads
		if (app.threads) {
			app.threads.fetch();
		}

		// register back to websocket ?
		if (app.socket.disconnected || !app.socket.connected) {
			initializeSocketIo();
		}
	}, false);
}

function initializeHammerForMarionette(){
	$("#viewport").hammer({prevent_default:true});
}

function initializeBackbone(){
	Backbone.emulateHTTP = true;
}

function initializePlatformsSquirk(){
	if (!isIOS7()) {
		$('html').removeAttr('data-ios7');
	}
	if (navigator && navigator.splashscreen)
		navigator.splashscreen.hide();
}

function initializeGoogleAnalytics(){
	$(document).on('deviceready', function(){
		navigator.splashscreen.hide();
		window.analytics.startTrackerWithId('UA-48753141-1');

		if (navigator.platform == 'Android') {
			
		}
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
	app.addInitializer(function(options){
		
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

function didSetPseudonym(){
	var potentialInformation = getPseudonym();
	return potentialInformation != null;
}

function rememberPseudonym(pseudonym){
	localStorage.setItem('pseudonym', pseudonym)
}

function getPseudonym(){
	return localStorage.getItem('pseudonym');
}

function getCommentColor(){
	var randomColor = stringToColor("Anonyme");
	if (window.device && window.device.uuid) 
		randomColor = stringToColor(device.uuid);
	return randomColor;
}

function stringToColor(str) {
    for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
    for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));
    return colour;
}

document.querySelector("body").onload = main;

/* this js file utils function */

function isIOS7(){
	return navigator.userAgent.match(/(iPad|iPhone|iPod touch);.*CPU.*OS 7_\d/i)!=null || navigator.userAgent.match(/(iPad|iPhone|iPod touch);.*CPU.*OS 8_\d/i)!=null
}

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('lps', [
  'ionic',
  'ngAnimate',
  'ImgCache',
  'tagged.directives.autogrow',
  'lps.controllers', 
  'lps.constants', 
  'lps.services', 
  'lps.directives'])

.run(function(){
  Parse.initialize("qsAuzRuN7pDDmp55z1r7e15dkTKxswdBqhNHOIsy", "QLxF7lyeCQGdMkNA13rWfPU5s68BacrDpyc9e87q");
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Splashscreen
    if (navigator && navigator.splashscreen) {
      navigator.splashscreen.hide();
    }
    // Keyboard
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    // Status bar
    if(window.StatusBar) {
      StatusBar.hide();
    }
  });
})

.run(function($ionicPlatform, ImgCache) {
    $ionicPlatform.ready(function() {
      ImgCache.$init();
    });
})

.config(function(ImgCacheProvider) {
    ImgCacheProvider.setOption('debug', true);
    ImgCacheProvider.setOption('usePersistentCache', true);
    ImgCacheProvider.manualInit = true;
})

.constant('$ionicLoadingConfig', {
  template: '<lps-loader></lps-loader>'
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('home', {
    url: '/home',
    templateUrl : 'templates/home.html',
    controller: 'HomeCtrl'
  })
  .state('compose', {
    url: '/compose',
    templateUrl : 'templates/compose.html',
    controller: 'ComposeCtrl'
  })
  .state('see', {
    url: '/see/{thread_id}',
    templateUrl : 'templates/see.html',
    controller: 'SeeCtrl'
  })
  location.hash='#home';
})
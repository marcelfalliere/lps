
angular.module('lps.controllers')

.controller('HomeCtrl', function($scope, $rootScope, $state, ThreadsService, $ionicScrollDelegate, $ionicLoading, $ionicGesture, $timeout, MathUtils){

	$scope.threads = [];
	
	var init = function(){
		$ionicLoading.show();
		ThreadsService.all().then(function(threads){
			$scope.threads = threads;
			$ionicLoading.hide();
		}, function(){
			$ionicLoading.hide();
		})
	}	
	init();

	$rootScope.$on('see', function(event, thread){

		ThreadsService.incrementThreadSeenCount(thread.id);

		thread.loadingAnswers = true;
		ThreadsService.answers(thread.id).then(function(answers){
			thread.answers = answers;
			thread.loadingAnswers = false;

			$timeout(function(){
				$rootScope.$broadcast('refresh-impetus');
			});
		}, function(){
			// ?
		})
	});

	$scope.doAnswer = function(thread) {
		thread.seeMode = 'form';
	}

	$scope.doPostAnswer = function(thread){
		thread.postingAnswer = true;
		ThreadsService.publishAnswerToThread(thread.id, thread.newAnswer).then(function(answer){
			thread.newAnswer = '';
			thread.postingAnswer = false;
			thread.answers.push(answer);
			delete thread.seeMode;

			$timeout(function(){
				$rootScope.$broadcast('refresh-impetus');
			});
		})
		
	}



})


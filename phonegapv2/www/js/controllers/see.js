
angular.module('lps.controllers')

.controller('SeeCtrl', function($scope, $stateParams, $state, ThreadsService){

	$scope.thread = {};
	$scope.answers = [];
	$scope.answerData = {
		text:''
	}
	$scope.sending = false;

	var init = function(){
		ThreadsService.thread($stateParams.thread_id).then(function(thread){
			$scope.thread = thread
		}, function(){
			// TODO ?
		});
		ThreadsService.answers($stateParams.thread_id).then(function(answers){
			$scope.answers = answers;
		}, function(){
			// TODO ?
		})
	}
	init();

	$scope.back = function(){
		$state.go('home');
	}

	$scope.doSendAnswer = function(){
		$scope.sending = true;
		ThreadsService.publishAnswerToThread($stateParams.thread_id, $scope.answerData).then(function(){

		}, function(){
			// TODO ?
		})
	}

});

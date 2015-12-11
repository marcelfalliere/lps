
angular.module('lps.controllers')

.controller('HomeCtrl', function($scope, ThreadsService, $ionicLoading){

	$scope.threads = [];
	
	$ionicLoading.show();

	ThreadsService.all().then(function(threads){
		$scope.threads = threads;
		$ionicLoading.hide();
	}, function(){
		$ionicLoading.hide();
	})

})


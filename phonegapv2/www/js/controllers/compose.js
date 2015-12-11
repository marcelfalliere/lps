
angular.module('lps.controllers')

.controller('ComposeCtrl', function($scope, $state, ThreadsService, $timeout){

	$scope.quit = function(){
		$state.go('home');
	}

	$scope.send = function(){
		$scope.publishing=true;
		ThreadsService.publishThread($scope.threadData).then(function(){
			$scope.publishing=false;
			$state.go('home');		
		}, function(error){
			$scope.publishing=false;
			alert('Oupsss... impossible de publier pour le moment. Désolé gros. ('+error+')')
		})
	}

	var init = function(){
		$scope.uploading = false;
		$scope.publishing = false;
		$scope.percentage;
		$scope.progressWidth=0;
		$scope.progressClass='';
		$scope.threadData = {
			id:undefined,
			image:undefined,
			seen:0
		}
	}

	var imageHasBeenTaken = function(image) {
		$scope.uploading = true;
		$scope.progressWidth=100;
		$scope.progressClass='';

		$scope.threadData.image = image;
		ThreadsService.prepareNewThreadWithImage($scope.threadData.image).then(function(id){
			$scope.threadData.id = id;
			$scope.uploading = false;
		}, function(err){
			$scope.uploading = false;
			console.error('ko', err)
		}, function(percentage){
			$scope.progressWidth = (100 - percentage*100);
			if (percentage==1) {
				$scope.progressWidth = 100;
				$scope.progressClass = 'working';
			}
		})
	}

	var showCamera = function(){
		if (window.SquareCamera) {
			SquareCamera.show(function(imagePath){
				$scope.$apply(function(){
					imageHasBeenTaken(imagePath);
				});
			}, function(error){
				alert('Oupsss... ('+error+')')
			});
		} else {
			//alert('Oh copain, la caméra, ben elle marche pas chez toi.');
			imageHasBeenTaken('img/CDVSquareCameraDefaultPicture.png');
		}
	}

	init();
	$scope.$on('$ionicView.enter', function(e) {
		showCamera();
	});

})


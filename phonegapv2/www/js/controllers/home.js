
angular.module('lps.controllers')

.controller('HomeCtrl', function($scope, $state, ThreadsService, $ionicLoading, $ionicGesture){

	$scope.threads = [];
	$scope.viewIndex = 0;
	
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

	$scope.see = function(thread){
		$state.go('see', {thread_id:thread.id});
	}

	// below -> viewer
	$scope.isUsingLpsViewer = false;

	$scope.shouldLoadThreadItem = function(threadIndex) {
		return threadIndex == $scope.viewIndex 
		|| threadIndex-1 == $scope.viewIndex
		|| threadIndex+1 == $scope.viewIndex;
	}

	$scope.isCurrent = function(threadIndex) { return threadIndex == $scope.viewIndex; }
	$scope.isNext = function(threadIndex) { return threadIndex-1 == $scope.viewIndex; }

	$scope.onDrag = function(thread, $event) {
		
		$scope.isUsingLpsViewer=true;
		thread.lpsviewer_gesture = {
			center : {
				pageX: $event.gesture.center.pageX,
				pageY: $event.gesture.center.pageY
			},
			eventType:$event.gesture.eventType,
			pointerType:$event.gesture.pointerType,
			angle:$event.gesture.angle
		};
		console.log($event.gesture.angle);
		//console.debug('onDrag', $scope.threads.indexOf(thread), $event)
	}
	$scope.onTouch = function(thread, $event) {
		console.log('onTouch', $scope.threads.indexOf(thread))
	}
	$scope.onRelease = function(thread, $event) {
		
		$scope.isUsingLpsViewer=false;
		thread.lpsviewer_gesture = {
			center : {
				pageX: $event.gesture.center.pageX,
				pageY: $event.gesture.center.pageY
			},
			eventType:$event.gesture.eventType,
			pointerType:$event.gesture.pointerType
		};

		console.log('onRelease', $scope.threads.indexOf(thread))
	}

	$scope.getItemStyle = function(thread) {
		if ($scope.threads.indexOf(thread) == $scope.viewIndex) {
			return getItemStyleForCurrentItem(thread)
		} else if ($scope.threads.indexOf(thread)-1 == $scope.viewIndex) {
			return getItemStyleForNextItem($scope.threads[$scope.viewIndex])
		}
	}
	
	// private

	var getItemStyleForCurrentItem = function(thread) {
		var trX = '';
		if (thread.lpsviewer_gesture && thread.lpsviewer_gesture.center.pageX) {
			var trX = window.innerWidth - thread.lpsviewer_gesture.center.pageX;
			if(thread.lpsviewer_gesture.eventType=='end' && thread.lpsviewer_gesture.pointerType=='touch'){
				var trX = '0';
			}

			var rotate = Math.abs(trX)/4;

			return {
				viewport: 'transform: translateX(-'+trX+'px) rotateZ('+rotate+'deg) ;',
				content: 'transform: rotateZ(-'+rotate+'deg) translateX('+trX+'px);'
			}
		}
		return trX;
	}

	var getItemStyleForNextItem = function(thread) {
		var opacity = 'inherit';
		var transform = 'none';

		if (thread.lpsviewer_gesture) {
			var scale = '1';
			var trX = '0'

			var b = 0;
			var a = 1/window.innerWidth;
			var x = window.innerWidth - thread.lpsviewer_gesture.center.pageX;
			opacity = a*x+b; // oh yeah;$

			// var b2 = 0.5;
			// var a2 = 0.5/window.innerWidth;
			// var x2 = window.innerWidth - thread.lpsviewer_gesture.center.pageX;
			// scale = a2*x2+b2; // oh yeah*2;

			// var b3 = -200;
			// var a3 = 200/window.innerWidth;
			// var x3 = window.innerWidth - thread.lpsviewer_gesture.center.pageX;
			// trX = a3*x3+b3; // oh yeah*3;

			// transform = 'translateX('+trX+'px) scale('+ scale +')'
		}
		return {
			viewport: 'opacity:'+opacity+';transform:'+transform+';',
			content: ''
		}
	}

	


})


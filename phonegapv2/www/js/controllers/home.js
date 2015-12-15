
angular.module('lps.controllers')

.controller('HomeCtrl', function($scope, $state, ThreadsService, $ionicLoading, $ionicGesture, $timeout, MathUtils){

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

	$scope.see = function(thread){
		$state.go('see', {thread_id:thread.id});
	}

	// below -> viewer
	$scope.viewIndex = 0;
	$scope.usingViewer = false;
	$scope.viewerDisabled = false;

	$scope.doNext = function(){
		if ($scope.viewIndex < $scope.threads.length && !$scope.usingViewer && !$scope.viewerDisabled) {
			$scope.usingViewer = false;
			$scope.viewerDisabled = true;
			$timeout(function(){
				$scope.viewIndex = $scope.viewIndex+1;
				$scope.viewerDisabled = false;
			}, 400);
		}
	}

	$scope.shouldLoadThreadItem = function(threadIndex) {
		return threadIndex == $scope.viewIndex 
		|| threadIndex-1 == $scope.viewIndex
		|| threadIndex+1 == $scope.viewIndex;
	}

	$scope.isCurrent = function(threadIndex) { return threadIndex == $scope.viewIndex; }
	$scope.isNext = function(threadIndex) { return threadIndex-1 == $scope.viewIndex; }

	$scope.onDrag = function(thread, $event) {
		$scope.usingViewer = true;
		thread.lpsviewer_gesture = transformEventObject($event);
	}
	$scope.onRelease = function(thread, $event) {
		$scope.usingViewer = false;
		thread.lpsviewer_gesture = transformEventObject($event);
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
		var style="opacity:1;"
		if (thread.lpsviewer_gesture && thread.lpsviewer_gesture.eventType=='move') {
			
			var trX = thread.lpsviewer_gesture.deltaX;
			var trY = thread.lpsviewer_gesture.deltaY;

			//var rotate = Math.abs(trX*trY)*Math.abs(thread.lpsviewer_gesture.center.pageX*thread.lpsviewer_gesture.center.pageY)/2000000;
			var ROTATE_THRESOLD = 2*window.innerWidth/3;
			var rotate = MathUtils.yEqualAXPlusB(ROTATE_THRESOLD, 0, 0, 20, thread.lpsviewer_gesture.center.pageX);
			if (thread.lpsviewer_gesture.center.pageX > ROTATE_THRESOLD) {
				rotate = 0;
			}

			style = 'transform: translateX('+thread.lpsviewer_gesture.deltaX+'px) translateY('+thread.lpsviewer_gesture.deltaY+'px) rotateZ('+rotate+'deg) ;';
		} else if (thread.lpsviewer_gesture && thread.lpsviewer_gesture.eventType=='end') {
			style = 'transition:all .4s;transform: translateX(-100%);';
			$scope.doNext();			
		}
		return style;
	}

	var getItemStyleForNextItem = function(thread) {
		var style = "";

		if (thread.lpsviewer_gesture && thread.lpsviewer_gesture.eventType=='move') {
			var scale = '1';

			var b = 0;
			var a = 1/window.innerWidth;
			var x = window.innerWidth - thread.lpsviewer_gesture.center.pageX;
			var opacity = a*x+b; // oh yeah;$

			// var b2 = 0.5;
			// var a2 = 0.5/window.innerWidth;
			// var x2 = window.innerWidth - thread.lpsviewer_gesture.center.pageX;
			// scale = a2*x2+b2; // oh yeah*2;

			// var b3 = -200;
			// var a3 = 200/window.innerWidth;
			// var x3 = window.innerWidth - thread.lpsviewer_gesture.center.pageX;
			// trX = a3*x3+b3; // oh yeah*3;

			style = 'opacity:'+opacity+'';

		} else if (thread.lpsviewer_gesture && thread.lpsviewer_gesture.eventType=='end') {
			style = 'transition:all .4s; opacity:1;'
		}
		
		return style;
	}

	var transformEventObject = function($event){
		return {
			center : {
				pageX: $event.gesture.center.pageX,
				pageY: $event.gesture.center.pageY
			},
			deltaX: $event.gesture.deltaX,
			deltaY: $event.gesture.deltaY,
			eventType:$event.gesture.eventType,
			angle:$event.gesture.angle,
			velocityX:$event.gesture.velocityX
		}
	}



})


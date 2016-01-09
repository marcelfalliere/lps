
angular.module('lps.controllers')

.controller('HomeCtrl', function($scope, $state, ThreadsService, $ionicScrollDelegate, $ionicLoading, $ionicGesture, $timeout, MathUtils){

	$scope.threads = [];
	
	var init = function(){
		$ionicLoading.show();
		ThreadsService.all().then(function(threads){
			$scope.threads = threads;
			displayThread(threads[0])
			$ionicLoading.hide();
		}, function(){
			$ionicLoading.hide();
		})
	}	
	init();

	$scope.see = function(thread){
		$state.go('see', {thread_id:thread.id});
	}

	$scope.doDisplayAnswerForm = function(thread) {
		thread.answerMode = true;
		$ionicScrollDelegate.resize();
	}
	$scope.quitAnswerMode = function(thread) {
		thread.answerMode = false;	
		$ionicScrollDelegate.resize();
	}

	// below -> viewer

	$scope.viewIndex = 0;
	$scope.viewerDisabled = false;
	$scope.usingViewer = false;
	$scope.scrollEnabled = false;
	$scope.nav = {
		isGoingLeft:false,
		isGoingRight:false
	}
	$scope.canScroll = true;
	var DISABLED_TIME = 200;
	var timeoutDetailsDisplay;

	$scope.$watch('viewIndex', function(newVal, oldVal){
		if (newVal != oldVal && newVal && newVal > 0 && newVal < $scope.threads.length && !$scope.threads[newVal].answers_loaded) {
			var thread = $scope.threads[newVal];
			ThreadsService.answers(thread.id).then(function(ret){
				thread.answers_loaded=true;
				thread.answers = ret;

			});
		}
	})


	var doNext = function(){
		$scope.viewerDisabled = true;
		$scope.doingNext = true;
		$timeout(function(){
			$scope.threads.forEach(function(t){ t.style=''; })
			$scope.doingNext = false;
			$scope.viewIndex = $scope.viewIndex + 1;	
			$scope.viewerDisabled = false;
		}, DISABLED_TIME);
	}
	var doPrev = function(){
		$scope.viewerDisabled = true;
		$scope.doingPrev = true;
		$timeout(function(){
			$scope.threads.forEach(function(t){ t.style=''; })
			$scope.doingPrev = false;
			$scope.viewIndex = $scope.viewIndex - 1;	
			$scope.viewerDisabled = false;
		}, DISABLED_TIME);
	}

	$scope.shouldLoadThreadItem = function(threadIndex) {
		return  $scope.viewIndex-4 < threadIndex && $scope.viewIndex+4 > threadIndex
	}
	$scope.isRealFar = function(threadIndex) {
		return  $scope.viewIndex-3 == threadIndex || $scope.viewIndex+3 == threadIndex
	}

	$scope.onDrag = function(thread, $event) {
		$scope.usingViewer = true;
		$scope.canScroll = false;

		$timeout.cancel(timeoutDetailsDisplay);
		thread.shouldDisplayDetails = false;
		$scope.nav.isGoingLeft = false;
		$scope.nav.isGoingRight = false;

		var style = 'transform: translateX('+$event.gesture.deltaX+'px) translateY('+$event.gesture.deltaY+'px)';
		var screenRatio = $event.gesture.center.pageX / window.innerWidth;
		if (screenRatio < 1/3 && $scope.viewIndex < $scope.threads.length - 1) {
			$scope.nav.isGoingLeft = true;
			style += ' scale('+(MathUtils.yEqualAXPlusB(0, 0.2, 1/3, 1, screenRatio))+');';
		} else if (screenRatio > 2/3 && $scope.viewIndex > 0) {
			$scope.nav.isGoingRight = true;
			style += 'scale('+(MathUtils.yEqualAXPlusB(2/3, 1, 1, 0.2, screenRatio))+');';
		}

		thread.style=style;
	}
	$scope.onRelease = function(thread, $event) {
		$scope.usingViewer = false;
		$scope.nav.isGoingLeft = false;
		$scope.nav.isGoingRight = false;
		$scope.canScroll = true;

		var screenRatio = $event.gesture.center.pageX / window.innerWidth;
		if (screenRatio < 1/3 && $scope.viewIndex < $scope.threads.length - 1) {
			thread.style = DEF_TIME+DEF_PREV;
			doNext();
		} else if (screenRatio > 2/3 && $scope.viewIndex > 0) {
			thread.style = DEF_TIME+DEF_NEXT;
			doPrev();
		} else {
			thread.style=DEF_TIME+DEF_CURR;
			console.log('display thread on release');
			displayThread(thread);
		}
	}

	$scope.onScroll = function(){
		if (!$scope.canScroll) {
			$ionicScrollDelegate.scrollTo(0,0, false);	
		} else if ($scope.nav.isGoingLeft || $scope.nav.isGoingRight) {
			if (Math.abs($ionicScrollDelegate.getScrollPosition().top) >= 0 + 1.5674){
				$ionicScrollDelegate.scrollTo(0,0, true);	
			} else {
				$ionicScrollDelegate.scrollTo(0,0, false);	
			}
		}
		console.log($ionicScrollDelegate);
	}

	var displayThread = function(thread){
		$timeout.cancel(timeoutDetailsDisplay);
		timeoutDetailsDisplay = $timeout(function(){
			thread.shouldDisplayDetails = true;
		}, 700)
	}

	var DEF_TIME = "transition: all .4s;"
	var DEF_TIME_SLOW = "transition: all .3s ease-in-out;"
	var DEF_CURR = "transform: translateX(0) translateY(0) scale(1)";
	var DEF_NEXT = "transform: translateX(40%) translateY(60%) scale(0.2);";
	var DEF_NEXT_POSWANTED = "transform: translateX(40%) translateY(65%) scale(0.2);";
	var DEF_PREV = "transform: translateX(-40%) translateY(60%) scale(0.2);";
	var DEF_PREV_POSWANTED = "transform: translateX(-40%) translateY(65%) scale(0.2);";
	var DEF_FUTU = "transform: translateX(45%) translateY(75%) scale(0.1);";
  var DEF_PAST = "transform: translateX(-45%) translateY(75%) scale(0.1);";

	$scope.getItemStyle = function(thread) {
		var indexInArray = $scope.threads.indexOf(thread);

		if ($scope.viewIndex+1 == indexInArray) { // le suivant

			// va devenir le suivant dans le futur
			if ($scope.doingPrev) return DEF_TIME+DEF_FUTU;

			// va devenir le current
			if ($scope.doingNext) { 
				console.log('display thread getItemStyle 1', thread.seen);
				displayThread(thread);
				return DEF_TIME+DEF_CURR;
			}

			// l'user veut aller dans ce sens
			if ($scope.nav.isGoingRight) return DEF_TIME_SLOW+DEF_NEXT_POSWANTED;

			return DEF_NEXT;

		} else if ($scope.viewIndex-1 == indexInArray) { // le précédent

			// va devenir le précédent dans le passé
			if ($scope.doingNext) return DEF_TIME+DEF_PAST;

			// va devenir le current
			if ($scope.doingPrev) {
				console.log('display thread getItemStyle 2');
				displayThread(thread);
				return DEF_TIME+DEF_CURR;
			}

			// l'user veut aller dans ce sens
			if ($scope.nav.isGoingLeft) return DEF_TIME_SLOW+DEF_PREV_POSWANTED;

			return DEF_PREV;

		} else if (indexInArray < $scope.viewIndex-1) { // tout les plus précédents
			
			// va devenir le précédent strict
			if ($scope.doingPrev && indexInArray == $scope.viewIndex-2) return DEF_TIME+DEF_PREV;
			
			return DEF_PAST;

		} else if (indexInArray > $scope.viewIndex+1) { // tout les plus suivants

			// va devenir le suivant strict
			if ($scope.doingNext && indexInArray == $scope.viewIndex+2) return DEF_TIME+DEF_NEXT;
			
			return DEF_FUTU;
		}
	}
	
	// private

	var getItemStyleForCurrentItem = function(thread) {
		
	}

	var getItemStyleForNextItem = function(thread) {
		var style = "transform: translateX(40%) translateY(60%) scale(0.2) rotateZ(10deg);";

		if (thread.lpsviewer_gesture && thread.lpsviewer_gesture.eventType=='move') {
			var scale = '1';

			

			// var b2 = 0.5;
			// var a2 = 0.5/window.innerWidth;
			// var x2 = window.innerWidth - thread.lpsviewer_gesture.center.pageX;
			// scale = a2*x2+b2; // oh yeah*2;

			// var b3 = -200;
			// var a3 = 200/window.innerWidth;
			// var x3 = window.innerWidth - thread.lpsviewer_gesture.center.pageX;
			// trX = a3*x3+b3; // oh yeah*3;

		} else if (thread.lpsviewer_gesture && thread.lpsviewer_gesture.eventType=='end') {
			style = 'transition:all .4s; transform:none;'
		}
		if (thread.seen == 20) console.log(style);
		return style;
	}

	var getItemStyleForPreviousItem = function(thread) {
		var DEFAULT_PREVIOUS_ITEM = "transform: translateY(60%) scale(0.2) rotateZ(-10deg);";
		var style = DEFAULT_PREVIOUS_ITEM;

		if (thread.lpsviewer_gesture && thread.lpsviewer_gesture.eventType=='move') {
			
		} else if (thread.lpsviewer_gesture && thread.lpsviewer_gesture.eventType=='end') {
			style = 'transition:all .4s;'+DEFAULT_PREVIOUS_ITEM;
		}
		if (thread.seen == 20) console.log(style);
		
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


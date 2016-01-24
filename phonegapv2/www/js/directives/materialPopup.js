
angular.module('lps.directives')

.directive('materialPopup', function($rootScope, $ionicGesture, $timeout) {
  return {
    restrict: 'A',
    scope:{
    	'entity':'=entity'
    },
    link : function($scope, $element, $attr) {

    	var isOpened = false;
    	var WINDOW_W = window.innerWidth;
    	var WINDOW_H = window.innerHeight;
    	var CARD_PADDING = WINDOW_W*0.05;
    	var impetusInstance;
    	var lastTranslateY;
      var lastTransitionend;
      var initialTop;
      var initialHeight;

      $ionicGesture.on('tap', function(){
      	if (!isOpened) {
	      	$element.removeClass('materialed-removing').addClass('materialed-popup');
	      	isOpened=true;
	      	$rootScope.$broadcast('going-to-thread'); 
      	}
      },$element);

      // idée pour plus tard : changer l'origin du thread pour que la rotation soit plus mieux
      // $ionicGesture.on('drag', function(event){
      // 	if (isOpened && lastTranslateY) {
      // 		console.log('origin-x')
      // 		console.log('pageY', event.gesture.center.pageY, 'initialTop', initialTop, 'lastTranslateY', lastTranslateY);
      // 	}
      // }, $element);

      $element.on('transitionend', function(){
      	if (isOpened && impetusInstance==null) {
	      	if (lastTransitionend){
	      		$timeout.cancel(lastTransitionend);
	      	}
	      	lastTransitionend = $timeout(function(){

	      		if ($scope.entity) {
	      			$rootScope.$broadcast('see', $scope.entity)
	      		}
	      		
	      		$element.addClass('material-popup-opened');
		    		impetusInstance = null;
		    		initialTop = $element[0].getBoundingClientRect().top;
		    		initialHeight = $element[0].offsetHeight;
		    		
		    		impetusInstance = new Impetus({
					    source: $element[0],
					    boundX:[-2,2],
					    boundY:[WINDOW_H - ( initialTop + initialHeight + WINDOW_W), WINDOW_W],
					    update: function(x, y) {
					    	lastTranslateY = y;
					    	if (isOpened) {
					    		$element.attr('style', 'transform:translate3d('+ (CARD_PADDING) +'px, '+y+'px, 0) rotate3d(0,0,1,'+( ((x>0) ? Math.min(x,10): Math.max(x,-10))/10 )+'deg);')
					    	} else {
					    		$element.attr('style', '');
					    	}
					    }
		      	});
	      	},100)
      		
      	}
      });

      // $ionicGesture.on('drag', function(event){
      // 	if (isOpened){
      // 		$element.css('transform', 'translateX(5vw) translateY('+event.gesture.deltaY+'px)')
      // 	}
      // },$element);
      
			$rootScope.$on('tap-backdrop', function(){
				if (isOpened) {
					impetusInstance=null;
					isOpened=false;
					$element.attr('style','');
					$element.addClass('materialed-removing').removeClass('materialed-popup').removeClass('material-popup-opened');
				}
			});

			$rootScope.$on('going-to-thread', function(){
				$element.removeClass('materialed-removing');
				// maybe clean and ensure all is ok ?
			})

			$rootScope.$on('refresh-impetus', function(){
				if (isOpened){
					var currentHeight = $element[0].offsetHeight;
					if (currentHeight != initialHeight) {
						impetusInstance.updateBoundY([WINDOW_H - ( initialTop + currentHeight + WINDOW_W), WINDOW_W])	
					}
					console.log('received a refresh event ... initialHeight', initialHeight, ' ans current height :',  $element[0].offsetHeight)
				}
			})

    }
  }
})

.directive('materialPopupBackdrop', function($ionicGesture, $rootScope){
	return {
		restrict:'E',
		link:function($scope, $element){
			
			$rootScope.$on('going-to-thread', function(){
				$element.addClass('shown')
			})

			$ionicGesture.on('tap', function(){
      	$rootScope.$broadcast('tap-backdrop'); 
      	$element.removeClass('shown');
      },$element)

		}
	}
})
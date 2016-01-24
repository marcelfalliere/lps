
angular.module('lps.directives')

.directive('magicthumb', function($ionicGesture, $rootScope) {
  return {
    restrict: 'A',
    link : function($scope, $element) {
			// console.log('link magicthumb with $element->', $element);
			// $ionicGesture.on('drag', function(event){
			// 	//console.log('link magicthumb drag with event-> ', event);
			// 	console.log(event.gesture.deltaX)
			// 	$rootScope.$broadcast('moveBy', {
			// 		css:'transform:translateX(-10px) rotateY(25deg) rotateX(25deg) translateY(-10px);'
			// 	});


   //  	}, $element)
      

    }
  }
})

.directive('magicthumbImpact', function($rootScope){
	return {
		restrict:'A',
		link : function($scope, $element){
			// $rootScope.$on('moveBy', function(event, eventData){
			// 	//console.log('eventData.css', eventData.css);
			// 	$element.attr('style', eventData.css);
			// })
		}
	}
})
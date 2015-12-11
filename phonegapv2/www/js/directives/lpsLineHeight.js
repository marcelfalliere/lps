
angular.module('lps.directives')

.directive('lpsLineHeight', function(){
	return {
		restrict:'A',
		link:function(scope, element) {
			element[0].style.lineHeight = element[0].clientHeight+'px';

		}
	}
})


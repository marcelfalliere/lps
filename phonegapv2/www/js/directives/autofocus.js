
angular.module('lps.directives')

.directive('autofocus', function($timeout) {
  return {
    restrict: 'A',
    link : function($scope, $element) {

      $(element).focus();
      
    }
  }
});

angular.module('lps.services')

.service('MathUtils', function(){

	this.yEqualAXPlusB = function(x1,y1,x2,y2, x){
		var a = (y1-y2)/(x1-x2);
		var b = y1 - a * x1;
		return a*x+b;
	}

})


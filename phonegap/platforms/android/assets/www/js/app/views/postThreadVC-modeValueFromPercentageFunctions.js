"use strict";



// helper methods : gives from a percentage the appropriate onDragUpOrDownUpdateColor
function getColorFromPercentage(percentage) {
	var from255To0=function(percentage){
		var modulo = percentage % (100/6);
		var a = -2.55;
		var b = 255;
		var x = modulo * 6;
		return parseInt(a*x+b,10);
	};
	var fromZeroTo255=function(percentage){
		var modulo = percentage % (100/6);
		var a = 2.55;
		var b = 0;
		var x = modulo * 6;
		return parseInt(a*x+b,10);
	};
	var aSixth = 100/6;
	var model = [
		{ from:0, 		to:aSixth, 		r:255, 			g:0, 			b:fromZeroTo255 },
		{ from:aSixth, 	to:2*aSixth, 	r:from255To0, 	g:0, 			b:255 			},
		{ from:2*aSixth,to:3*aSixth, 	r:0, 			g:fromZeroTo255,b:255 			},
		{ from:3*aSixth,to:4*aSixth, 	r:0, 			g:255,			b:from255To0	},
		{ from:4*aSixth,to:5*aSixth, 	r:fromZeroTo255,g:255,			b:0				},
		{ from:5*aSixth,to:100,			r:255,			g:from255To0,	b:0				}
	];

	var step = _.reject(model, function(m){ return !(percentage >= m.from && percentage <= m.to) })[0];

	var color = {
		r: (typeof(step.r)=='function')?step.r(percentage):step.r,
		g: (typeof(step.g)=='function')?step.g(percentage):step.g,
		b: (typeof(step.b)=='function')?step.b(percentage):step.b
	}

	return 'rgb('+color.r+','+color.g+','+color.b+')'
}

function getPoliceFromPercentage(percentage) {
	var aSeventh = 100/7;
	var model = [
		{ from:0,			to:aSeventh,		name:'dragon',			size:'12px'},
		{ from:aSeventh,	to:2*aSeventh,		name:'wolf',			size:'40px'},
		{ from:2*aSeventh,	to:3*aSeventh,		name:'homizio',			size:'20px'},
		{ from:3*aSeventh,	to:4*aSeventh,		name:'typewriterforme',	size:'20px'},
		{ from:4*aSeventh,	to:5*aSeventh,		name:'bombard',			size:'20px'},
		{ from:5*aSeventh,	to:6*aSeventh,		name:'edmunds',			size:'20px'},
		{ from:6*aSeventh,	to:100,				name:'dienasty',		size:'20px'}
	];
	
	var font = _.reject(model, function(m){ return !(percentage >= m.from && percentage <= m.to) })[0];

	console.log('font for percentage : ', font.name, percentage);

	return {
		font:font.name,
		size:font.size
	}
}




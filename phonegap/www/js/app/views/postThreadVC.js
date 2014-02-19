"use strict";

var PostThreadVC = Backbone.Marionette.ItemView.extend({
	template:'#tpl-post-thread-vc',
	className:'page post-thread-vc',
	events:{
		'pagebeforeshow':'onPageBeforeShow',
		'pageshow':'onPageShowFocusInput',
		'keyup input':'onKeyupSaveUserInputAndUpdateTitle',
		'tap input':'onFocusInput',

		'dragdown #input-wrap':'onDragUpOrDownUpdateColor',
		'dragup #input-wrap':'onDragUpOrDownUpdateColor',

		'publiertapped':'onTapToPost'
	},
	onPageShowFocusInput:function(){
		this.$el.find('input').val(getRandomPlaceholder());
		this.onKeyupSaveUserInputAndUpdateTitle();
		setTimeout(_.bind(function(){ // timeout or fouc, you choose
			this.$el.find('input').focus();
			this.$el.find('input')[0].select();
			this.$el.find('input')[0].setSelectionRange(0, 9999);
		},this),200)
	},
	onFocusInput:function(ev){
		ev.gesture.preventDefault();
		this.$el.find('input').focus();
	},
	onPageBeforeShow:function(){
		this.$iw = this.$el.find('#input-wrap');
		this.$iw.height($(window).width()+'px');
		this.saveAndRenderColorToModel(Math.random()*100);
	},
	onKeyupSaveUserInputAndUpdateTitle:function(){
		var title = this.$el.find('input').val();
		this.model.set('title', title);
		$('#header h1').text(title)
	},
	onTapToPost:function(){
		this.postModelToServer();
		this.displayLoad();
	},
	postModelToServer:function(){
		this.model.on('sync', _.bind(this.updateLocalThreadsCollectionAndLeaveScreen,this));
		this.model.save();
	},
	displayLoad:function(){
		this.$el.addClass('loading');
	},
	updateLocalThreadsCollectionAndLeaveScreen:function(model){
		app.threads.add(model);

		app.router.navigate('', {trigger:'true'});
	},

	onDragUpOrDownUpdateColor:function(e){
		var yInPixels = e.gesture.center.pageY - this.$iw.offset().top;
		var percentage = yInPixels*100/$(window).width();
		this.saveAndRenderColorToModel(percentage)
	},

	saveAndRenderColorToModel:function(percentage) {
		var colorFromPercentage = getColorFromPercentage(percentage);
		this.$iw.css('background-color', colorFromPercentage);
		this.model.set('color', colorFromPercentage);
		app.header.headerView.$el.trigger('newcolor', colorFromPercentage);
	}
});


// helper methods : gives from a percentage the appropriate onDragUpOrDownUpdateColor
function getColorFromPercentage(percentage) {
	var from255To0=function(){
		return 110;
	};
	var fromZeroTo255=function(){
		return 140;
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
		r: (typeof(step.r)=='function')?step.r():step.r,
		g: (typeof(step.g)=='function')?step.g():step.g,
		b: (typeof(step.b)=='function')?step.b():step.b
	}

	return 'rgb('+color.r+','+color.g+','+color.b+')'
}

// helper : get random placeholder

function getRandomPlaceholder(){
	return 'éh toi, tabernac !';
}
















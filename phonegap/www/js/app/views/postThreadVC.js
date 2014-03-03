"use strict";

var PostThreadVC = Backbone.Marionette.ItemView.extend({
	initialize:function(){
		_.extend(this, PostThreadVC_Upload);
		this.model.set('mode', 'bgcolor');
		this.model.on('change:imagePath', _.bind(this.newImagePath, this));
		this.model.on('change:mode', _.bind(this.renderCurrentModeInUI, this));
	},
	template:'#tpl-post-thread-vc',
	className:'page post-thread-vc',
	events:{
		'pagebeforeshow':'onPageBeforeShow',
		'pageshow':'onPageShow',

		'keyup [contentEditable]':'onKeyupSaveUserInputAndUpdateTitle',
		'tap #input-wrap':'onFocusInput',

		'dragdown #input-wrap':'onDragUpOrDownUpdateCurrentModelValues',
		'dragup #input-wrap':'onDragUpOrDownUpdateCurrentModelValues',

		'publiertapped':'onTapToPost',

		'tap #controls .picture':'startCapture',
		'tap #controls .bgcolor':'bgcolor',
		'tap #controls .police':'police'
	},
	onPageBeforeShow:function(){
		this.$iw = this.$el.find('#input-wrap');
		this.$input = this.$iw.find('[contentEditable]');
		this.$controls = this.$el.find('#controls');
		this.$controlHint = this.$el.find('#control-hint');

		var size = $(window).width()+'px';
		this.$iw.css({
			"height":size,
  			"line-height":size
		});
		
		
		this.saveAndRenderColorToModel(Math.random()*100);
		this.saveAndRenderPoliceToModel(Math.random()*100);

		app.header.headerView.$el.trigger('newmodel');

	},
	onPageShow:function(){
		this.model.set('mode', 'bgcolor');
		this.$controlHint.addClass('ready');
		this.renderCurrentModeInUI();

		this.$input.text(getRandomPlaceholder());
		this.onKeyupSaveUserInputAndUpdateTitle();
		
	},
	focus:function(){
		this.$input.focus();

		var doc = document;
		var element = this.$input[0];
		if (doc.body.createTextRange) {
		   var range = document.body.createTextRange();
		   range.moveToElementText(element);
		   range.select();
		} else if (window.getSelection) {
		   var selection = window.getSelection();        
		   var range = document.createRange();
		   range.selectNodeContents(element);
		   selection.removeAllRanges();
		   selection.addRange(range);
		}
	},	
	onFocusInput:function(ev){
		ev.gesture.preventDefault();
		this.focus();
	},
	onKeyupSaveUserInputAndUpdateTitle:function(){
		this.model.set('title', this.$input.html());
	},
	onTapToPost:function(){
		if (this.model.get('isUploading')==true) {
			navigator.notification.alert(
			    "La photo est en train d'être envoyée ... Patience!",  
			    function(){},         
			    '',            
			    'Ok'                  
			);
		} else if (this.model.get('isSaving')!=true) {
			this.postModelToServer();
		}
	},
	postModelToServer:function(){
		app.header.headerView.$el.trigger('saving');
		this.model.set('isSaving',true);
		this.model.on('sync', _.bind(this.updateLocalThreadsCollectionAndLeaveScreen,this));
		this.model.save();
	},
	updateLocalThreadsCollectionAndLeaveScreen:function(model){
		app.threads.add(model);

		this.model.set('isSaving',false);
		app.router.navigate('', {trigger:'true'});
	},

	startCapture:function(){
		this.model.set('mode', 'picture');

		cordova.exec(
			_.bind(function(imagePath){
				this.model.set('imagePath', imagePath);
				this.uploadImage(imagePath);

			},this), 
			_.bind(function(error){
				alert(error);
			},this), 
			"CanvasCamera", "showCaptureView", [""]
		);
	},

	onDragUpOrDownUpdateCurrentModelValues:function(e){
		var yInPixels = e.gesture.center.pageY - this.$iw.offset().top;
		var percentage = yInPixels*100/$(window).width();

		if (this.model.get('mode')==='bgcolor')
			this.saveAndRenderColorToModel(percentage)
		
		if (this.model.get('mode')==='police')
			this.saveAndRenderPoliceToModel(percentage);
	},

	saveAndRenderColorToModel:function(percentage) {
		var colorFromPercentage = getColorFromPercentage(percentage);
		this.$iw.css('background-color', colorFromPercentage);
		this.model.set('color', colorFromPercentage);
		app.header.headerView.$el.trigger('newcolor', colorFromPercentage);
	},
	saveAndRenderPoliceToModel:function(percentage){
		var policeFromPercentage = getPoliceFromPercentage(percentage);
		this.model.set('policeName', policeFromPercentage.font);
		this.model.set('policeSize', policeFromPercentage.size);
		app.header.headerView.$el.trigger('newpolice', policeFromPercentage);
		
		this.$input.css('font-family', policeFromPercentage.font);
		this.$input.css('font-size', policeFromPercentage.size);
	},

	bgcolor:function(){
		if(this.model.get('imagePath')!==undefined) {
			navigator.notification.confirm(
			    "Utiliser une couleur de fond à la place de la photo ?",  
			    _.bind(function(buttonIndex){
			    	if (buttonIndex==1) {
			    		this.abortFileTransfer();
			    		this.model.set('mode', 'bgcolor');
			    		this.model.set('imagePath', '');
			    	}
			    },this),         
			    '',            
			    ['Oui', 'Non']);   
		} else {
			this.model.set('mode', 'bgcolor');
		}
	},
	police:function(){
		this.model.set('mode', 'police');
	},
	newImagePath:function(){
		this.$iw.css('background-image', 'url("'+this.model.get('imagePath')+'")');
		app.header.headerView.$el.trigger('newimage', this.model.get('imagePath'));
	},
	renderCurrentModeInUI:function(){
		var mode = this.model.get('mode');
		var $control = this.$controls.find('.'+mode);
		var offsetX = $control.position().left + $control.innerWidth()/2
		this.$controlHint.css('-webkit-transform', 'translateX('+offsetX+'px)');
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

function getPoliceFromPercentage(percentage) {
	if (0 <= percentage && percentage < 33) {
		return {
			font:'dragon',
			size:'12px'
		};
	} else if (33 <= percentage && percentage < 66) {
		return { 
			font:'wolf',
			size:'40px'
		};
	} else {
		return {
			font:'homizio',
			size:'20px'
		};
	}
}

// helper : get random placeholder

var randomPlaceholders = [
	'éh toi tabernac',
	'test1',
	'test2',
	'test3',
	'test4',
	'test5',
	'test6',
	'test7',
	'test8',
];

function getRandomPlaceholder(){
	var lastRandomPlaceholder = localStorage.getItem('lastRandomPlaceholder')
	if (lastRandomPlaceholder==null || lastRandomPlaceholder==undefined) {
		lastRandomPlaceholder=0;
	} else {
		lastRandomPlaceholder=parseInt(lastRandomPlaceholder,10);
	}

	var placeholder = '';
	if (lastRandomPlaceholder+1 < randomPlaceholders.length) {
		placeholder = randomPlaceholders[lastRandomPlaceholder+1];
		localStorage.setItem('lastRandomPlaceholder', lastRandomPlaceholder+1);
	} else {
		placeholder = randomPlaceholders[0];
		localStorage.setItem('lastRandomPlaceholder', 0);
	}

	return placeholder;
}
















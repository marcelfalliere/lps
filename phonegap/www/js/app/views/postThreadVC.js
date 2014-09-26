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

		this.onKeyupSaveUserInputAndUpdateTitle();
		
		this.startCapture();
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
			    "La photo est en train d'être envoyée ... Patience! (dernier pourcentage connu : "+this.percent+"%)",  
			    function(){},         
			    '~ ~ ~',            
			    'Ben j\'attends'                  
			);
		} else if (this.model.get('isSaving')!=true) {
			this.postModelToServer();
		}
	},
	postModelToServer:function(){
		window.analytics.trackEvent('PostThread', 'postModelToServer', this.model.get('title'));

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
		window.analytics.trackEvent('PostThread', 'startCapture', 'Prise de photo');

		this.model.set('mode', 'picture');

		cordova.exec(
			_.bind(function(imagePath){
				this.model.set('imagePath', imagePath);
				this.uploadImage(imagePath);
				setTimeout(_.bind(function(){ this.focus(); }, this), 200);
			},this), 
			_.bind(function(error){
				if (error == 0) {
					// nothing ?
				} else {
					alert(error);
				}
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
		window.analytics.trackEvent('PostThread', 'bgcolor', 'Couleur de fond');
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
			    'Confirmez-vous ?',            
			    ['Oui', 'Non']);   
		} else {
			this.model.set('mode', 'bgcolor');
		}
	},
	police:function(){
		window.analytics.trackEvent('PostThread', 'police', 'Police de caractère');
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


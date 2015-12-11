"use strict";

var HomeItemView = ItemReadOnlyView.extend({
	template:'#tpl-home-item',
	tagName:'li',
	className:function(){
		var className = 'home-item';
		if(this.model.get('delete_me') == true)
			className += ' delete_me';
		if(this.model.get('brand_new') == true)
			className += ' brand_new';
		if(this.model.get('new_comments') == true)
			className += ' new_comments';
		return className;
	},
	home:true,

	events:{
		'tap':'onTap',
	},

	templateHelpers: function(){
		return {
		    indexInCollection:(_.bind(function(){
		    	return "#"+ (this.model.collection.indexOf(this.model)+1);
		    },this)())
		}
	},
	onRender:function(){
		ItemReadOnlyView.prototype.onRender.apply(this, arguments);

		if (!_.isEmpty(this.model.get('color'))){
			var darkenedColor = tinycolor(this.model.get('color')).darken(10);
			this.$el.find('.blur-bg').css('background-color', darkenedColor);
		}
		
		this.loadImage();

		// delete this $el
		if (this.$el.hasClass('delete_me'))
			this.$el.on('webkitAnimationEnd', _.bind(function(){
				this.model.collection.remove(this.model);
				this.destroy();
				this.$el.removeClass('delete_me');
			},this));

		// focus user interes on this $el
		if (this.$el.hasClass('brand_new'))
			this.$el.on('webkitAnimationEnd', _.bind(function(){
				this.model.set('brand_new', false);
				this.$el.removeClass('brand_new');
			},this));


		// focus user interes on this $el
		if (this.$el.hasClass('new_comments'))
			this.$el.on('webkitAnimationEnd', _.bind(function(){
				this.model.set('new_comments', false);
				this.$el.removeClass('new_comments');
			},this));

	},

	toDetails:function(ev){
		app.thread = this.model;
		app.router.navigate('thread/'+this.model.get('id'), {trigger:true});
	},

	loadImage:function(){

		if (!_.isEmpty(this.model.get('imageUrl'))){
			this.$el.find('.blur-bg').css('background-image', 'url("'+this.model.get('imageUrl')+'")')
			this.$el.find('.blur-bg').css('background-color', 'transparent');
		}

		ItemReadOnlyView.prototype.loadImage.apply(this, arguments);
	},

	onTap:function(ev){
		if (this.options.parentView.shouldNavigateToDetails(this.model)) {
			this.toDetails(ev);
		} else {
			this.options.parentView.zoomingOnModel(this.model);
		}

	},

	deleteInUi:function(){
		if (this.model.get('delete_me')==true) {
			this.$el.addClass('delete_me');
			this.$el.on('webkitAnimationEnd', _.bind(function(){
				this.model.collection.remove(this.model);
				this.destroy();
				this.$el.removeClass('delete_me');
			},this));
		}
	},

	highlighNewCommentInUi:function(){
		if (this.model.get('new_comments')==true) {
			this.$el.addClass('new_comments');
			this.$el.on('webkitAnimationEnd', _.bind(function(){
				this.model.set('new_comments', false);
				this.$el.removeClass('new_comments');
			},this));
		}
	}
});



var HomeVC = Backbone.Marionette.CompositeView.extend({
	template:'#tpl-home',
	className:'page home-vc',
	childViewContainer:'ol',
	childView:HomeItemView,
	events:{
		'swipeleft'	: 'swipeLeft',
		'swiperight': 'swipeRight',
		'swipeup'	: 'swipeUp',
		'swipedown'	: 'swipeDown'
	},
	initialize:function(){
		this.collection.on('change:delete_me:socketio', _.bind(function(){
			this.collection.where({delete_me:true}).forEach(_.bind(function(threadModel){
				var view = this.children.findByModel(threadModel)
				if (view) view.deleteInUi();
			},this));

		},this));

		this.collection.on('change:new_comments:socketio', _.bind(function(){
			this.collection.where({new_comments:true}).forEach(_.bind(function(threadModel){
				var view = this.children.findByModel(threadModel)
				if (view) view.highlighNewCommentInUi();
			},this));

		},this));
	},
	childViewOptions: function(){
		return {
			parentView:this
		}
	},
	zoomed:false,
	deZoom:function(){
		this.$el.find('ol')
			.removeAttr('style')
			.removeClass('zoomed');

		this.zoomed = false;
	},
	shouldNavigateToDetails:function(model){
		return this.zoomed && this.zoomedModel.id == model.id
	},
	zoomingOnModel:function(model){
		
		var coords = this._getCoordsForModel(model);
		
		var translateX = '-' + (coords.col * 25) + '%';
		var translateY = '-' + (coords.line * $(window).width()) + 'px';

		this.$el.find('ol')
			.css('-webkit-transform-origin', ($(window).width()/2)+'px '+($(window).height())+'px')
			.css('-webkit-transform', 'scale(0.8) translateX('+translateX+') translateY('+translateY+')')
			.addClass('zoomed')
			//.find('li.active').removeClass('active');


		//this.children.findByModel(model).$el.addClass('active');

		this.zoomed = true;
		this.zoomedModel = model;
	},

	swipeLeft:function(ev){
		if (this.zoomedModel) {
			var coords = this._getCoordsForModel(this.zoomedModel);

			if (coords.col == 3) {
				this.deZoom();
			} else {
				this.zoomingOnModel(this.zoomedModel.collection.at(this.zoomedModel.collection.indexOf(this.zoomedModel) + 1))
			}
			ev.gesture.preventDefault();
		}
	},
	swipeRight:function(ev){
		if (this.zoomedModel) {
			var coords = this._getCoordsForModel(this.zoomedModel);

			if (coords.col == 0) {
				this.deZoom();
			} else {
				this.zoomingOnModel(this.zoomedModel.collection.at(this.zoomedModel.collection.indexOf(this.zoomedModel) - 1))
			}
			ev.gesture.preventDefault();
		}
	},
	swipeUp:function(ev){
		if (this.zoomedModel) {
			var coords = this._getCoordsForModel(this.zoomedModel);

			if (coords.line == 4) {
				this.deZoom();
			} else {
				this.zoomingOnModel(this.zoomedModel.collection.at(this.zoomedModel.collection.indexOf(this.zoomedModel) + 4))
			}
			ev.gesture.preventDefault();
		}
	},

	swipeDown:function(ev){
		if (this.zoomedModel) {
			var coords = this._getCoordsForModel(this.zoomedModel);

			if (coords.line == 0) {
				this.deZoom();
			} else {
				this.zoomingOnModel(this.zoomedModel.collection.at(this.zoomedModel.collection.indexOf(this.zoomedModel) - 4))
			}
			ev.gesture.preventDefault();
		}
	},


	_getCoordsForModel:function(model){
		var index = model.collection.indexOf(model);

		return {
			line : Math.floor(index / 4),
			col  : index % 4
		}
	}


});

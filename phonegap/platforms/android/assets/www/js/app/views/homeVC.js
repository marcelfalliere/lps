"use strict";

var HomeItemView = ItemReadOnlyView.extend({
	template:'#tpl-home-item',
	tagName:'li',
	events:{
		'tap':'onTap',
		'becomesVisible':'loadImage'
	},
	templateHelpers: function(){
		return {
		    home:true,
		    indexInCollection:(_.bind(function(){
		    	return "#"+ (this.model.collection.indexOf(this.model)+1);
		    },this)())
		}
	},
	onRender:function(){
		this.imageLoaded = false;

		ItemReadOnlyView.prototype.onRender.apply(this, arguments);

		if (!_.isEmpty(this.model.get('color'))){
			var darkenedColor = tinycolor(this.model.get('color')).darken(10);
			this.$el.find('.blur-bg').css('background-color', darkenedColor);
		}
		
	},

	onTap:function(ev){
		ev.gesture.preventDefault();
		app.thread = this.model;

		app.homeViewScrollTop = $(window).scrollTop();

		$(window).scrollTop(0);
		$('.page.home-vc').css('top','-'+(app.homeViewScrollTop-$('#header').innerHeight())+'px')

		app.router.navigate('thread/'+this.model.get('id'), {trigger:true});
	},

	loadImage:function(){
		if (this.imageLoaded)
			return;

		this.imageLoaded=true;

		if (!_.isEmpty(this.model.get('imageUrl'))){
			this.$el.find('.blur-bg')
				.css('background-image', 'url("'+this.model.get('imageUrl')+'")')
				this.$el.find('.blur-bg').css('background-color', 'transparent');
		}

		ItemReadOnlyView.prototype.loadImage.apply(this, arguments);
	}
});

var HomeVC = Backbone.Marionette.CompositeView.extend({
	template:'#tpl-home',
	className:'page home-vc',
	itemViewContainer:'ol',
	itemView:HomeItemView,
	events:{
		'scrollBackToTop':'scrollBackToTop',
		'touchend .scroll-inner':'touchEnd'
	},
	scrollBackToTop:function() {
		this.iScrollInstance.scrollTo(0,0, 0);
		this.onScroll();
	},
	onRender:function(){

		this.iScrollInstance = new IScroll(this.$el.find('.scroll-wrap')[0], {
		    fadeScrollbars:true,
		    probeType: 3,
		    disableMouse: true,
    		disablePointer: true,
    		shrinkScrollbars:'scale',
    		scrollbars: 'custom'
		});
		
		this.$p2r = this.$el.find('.pull-to-refresh');
		this.breakpoint = 80;
		this.isFetching = false;
		this.windowW = $(window).width();
		this.currentPage = 0;

		this.iScrollInstance.on('scroll', _.bind(this.onScroll,this));

		var refreshIScrollFunction = _.bind(function(){
			this.iScrollInstance.refresh();
		},this);

		this.collection
			.on('add', refreshIScrollFunction)
			.on('remove', refreshIScrollFunction);

		setTimeout(refreshIScrollFunction, 10);

		if (window.app.homeViewlastCloseIScrollY)
			this.iScrollInstance.scrollTo(0, window.app.homeViewlastCloseIScrollY);

		this.onScroll();
	},

	appendHtml: function(collectionView, itemView, index){ // see https://github.com/marionettejs/backbone.marionette/wiki/Adding-support-for-sorted-collections
		var childrenContainer = collectionView.itemViewContainer ? collectionView.$(collectionView.itemViewContainer) : collectionView.$el;
		var children = childrenContainer.children();
		
		if (children.size() <= index) {
			childrenContainer.append(itemView.el);
		} else {
			children.eq(index).before(itemView.el);
		}

	},

	refreshFunction:function(){
		setTimeout(_.bind(function(){
			this.collection.fetch({
	            success:_.bind(function(){
	                this.$p2r.text("c'est fait");
	                this.isFetching=false;
	            },this),
	            error:_.bind(function(){
	                this.$p2r.text('une erreur est survenue :(')
	                this.isFetching=false;
	            },this)
	        ,remove: true});
			
		},this),100);
	},

	onClose:function(){
		window.app.homeViewlastCloseIScrollY = this.iScrollInstance.y;
	},

	onScroll:function(){
		if (this.iScrollInstance.y > 0) {
			if (this.isFetching==true)
				this.$p2r.text('en cours...')
			else if (this.iScrollInstance.y < this.breakpoint)
				this.$p2r.text(dots(parseInt(this.iScrollInstance.y/2,10)));
			else if (this.iScrollInstance.y >= this.breakpoint)
				this.$p2r.text('lâcher pour rafraîchir')
		}

		var currentPage = Math.floor(Math.abs(this.iScrollInstance.y) / this.windowW);

		$(this.$el.find('.scroll-inner ol li')[currentPage]).trigger('becomesVisible');
		$(this.$el.find('.scroll-inner ol li')[currentPage+1]).trigger('becomesVisible');
		$(this.$el.find('.scroll-inner ol li')[currentPage+2]).trigger('becomesVisible');

	},

	onTouchend:function(){
		if (this.isFetching==false && this.iScrollInstance.y >= this.breakpoint) {
			this.isFetching=true;
			this.$p2r.text('en cours...')
			this.refreshFunction();
		}
	}

});

function dots(howmany) {
    return Array(howmany).join().split(',').map(function(e, i) { return '.'; }).join(' ');
}


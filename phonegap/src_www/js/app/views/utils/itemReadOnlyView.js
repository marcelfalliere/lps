"use strict";

var ItemReadOnlyView = Backbone.Marionette.ItemView.extend({
	template:'#tpl-home-item',
	templateHelpers:function(){
		return {
			title:(_.bind(function(){
				if (this.model)
					return this.model.get('title');
				return "";
			},this))(),
			indexInCollection:(_.bind(function(){
		    	return "#"+ (this.model.collection.indexOf(this.model)+1);
		    },this)())
		}
	},
	onRender:function(){
		
		var size = $(window).width()+'px';

		this.$el.css({
			"height":size,
			"width":size,
  			"line-height":size
		});

		if (this.model) {
			if (!_.isEmpty(this.model.get('color'))){
				this.$el.css('background-color', this.model.get('color'));
			}

			if (!_.isEmpty(this.model.get('imageUrl'))){
				this.$el.css('background-image', 'none');
				this.$el.css('background-color', 'transparent');

				var imageThumbUrl = this.model.get('imageUrl')+'/thumb';
				this.$el.find('.normal-image').css('background-image', 'url("'+imageThumbUrl+'")')
			}

			if (!_.isEmpty(this.model.get('policeName'))){
				this.$el.css({
					'font-family': this.model.get('policeName'),
					'font-size': this.model.get('policeSize')
				});
			}

			if (location.hash != '')
				this.loadImage();
			
		}
	},

	loadImage:function(){
		if (!_.isEmpty(this.model.get('imageUrl'))){

			var imageUrl = this.model.get('imageUrl');
			
			this.$el.find('.normal-image').css('background-image', 'url("'+imageUrl+'")')
			
		}
	}
	
});
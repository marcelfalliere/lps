"use strict";

var ContentRegion = Backbone.Marionette.Region.extend({
	el:'#content',
	zoomIn:function(view){
		this.transition(view, 'show zoomin', 'hide zoomin');
	},
	zoomOut:function(view){
		this.transition(view, 'show zoomout', 'hide zoomout');
	},
	slideIn:function(view) {
		this.transition(view, 'slide in', 'slide out easy');
	},
	slideInFromRight:function(view) {
		this.transition(view, 'slide in left', 'slide out easy right');
	},

	slideInFromBottom:function(view) {
		this.transition(view, 'slide in bottom', 'slide up easy');
	},
	transition:function(view, animIn, animOut) {
		this.ensureEl();

		var isReplacingAView = this.currentView!=undefined;

		if (isReplacingAView) {

			this.currentView.$el
				.addClass(animOut)
				.trigger('pagebeforehide')
				.on('webkitAnimationEnd', _.bind(function(){
					this.$el.off('webkitAnimationEnd');
					this.close();
					this.remove();
				}, this.currentView));

			view.render();

			view.$el
				.addClass(animIn)
				.trigger('pagebeforeshow')
				.one('webkitAnimationEnd', _.bind(function(){
					this.off('webkitAnimationEnd')
						.removeClass(animIn)
						.trigger('pageshow')
				}, view.$el));

			this.$el.append(view.el);
			
			this.currentView = view;

		} else {
			this.show(view);
			view.$el.trigger('pagebeforeshow').trigger('pageshow');
		}
	}
});
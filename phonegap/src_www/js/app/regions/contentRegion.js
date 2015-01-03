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
		this.transition(view, 'slide in bottom', 'hide zoomout');
	},

	slideInToBottom:function(view) {
		this.transition(view, 'show zoomin', 'slide up easy');
	},
	transition:function(view, animIn, animOut) {

		var isReplacingAView = this.currentView!=undefined;

		if (isReplacingAView) {

			this.currentView.$el
				.addClass(animOut)
				.trigger('pagebeforehide')
				.on('webkitAnimationEnd', _.bind(function(){
					this.$el.off('webkitAnimationEnd');
					this.destroy();
				}, this.currentView));

			view.render();

			view.$el
				.addClass(animIn)
				.trigger('pagebeforeshow')
				.one('webkitAnimationEnd', _.bind(function(){
					this.currentView = this.toBeCurrentView;
					this.currentView.$el
						.off('webkitAnimationEnd')
						.removeClass(animIn)
						.trigger('pageshow')
				}, this));

			this.$el.append(view.el);
			
			this.toBeCurrentView = view;

		} else {
			this.show(view);
			view.$el.trigger('pagebeforeshow').trigger('pageshow');
		}
	}
});
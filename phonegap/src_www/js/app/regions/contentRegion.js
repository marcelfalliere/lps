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

			this.previousView = this.currentView;
			this.currentView = view;

			this.previousView.$el
				.addClass(animOut)
				.trigger('pagebeforehide')
				.on('webkitAnimationEnd', _.bind(function(){

					this.$el
						.off('webkitAnimationEnd')
						.remove();

				}, this.previousView));

			this.currentView.render();

			this.currentView.$el
				.addClass(animIn)
				.trigger('pagebeforeshow')
				.one('webkitAnimationEnd', _.bind(function(){

					this.$el
						.off('webkitAnimationEnd')
						.removeClass(animIn)
						.trigger('pageshow')

				}, this.currentView));

			this.$el.append(this.currentView.el);

		} else {
			this.show(view);
			view.$el.trigger('pagebeforeshow').trigger('pageshow');
		}
	}
});
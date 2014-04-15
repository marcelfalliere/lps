"use strict";

var EulaVC = Backbone.Marionette.ItemView.extend({
	template:'#tpl-eula-vc',
	className:'page no-header eula-vc',
	events:{
		'dragright':'drag',
		'dragleft':'drag',
		'swipeleft':'swipeleft',
		'swiperight':'swiperight',
		'release':'release',
		'tap .eula .button:not(.disabled)':'acceptEula'
	},
	acceptEula:function(){
		hasAcceptedEula();
		location.hash='';
	},
	onRender:function(){
		var $paneContainer = this.$el.find('.pane-container');
		var $panes = this.$el.find('.pane');
		var windowW = $(window).width();
		$paneContainer.css({
			width: windowW*$panes.length +'px'
		});
		$panes.css({
			width: windowW +'px'
		});

		this.pane_count = $panes.length;
		this.pane_width = windowW;
		this.current_pane = 0;
		this.container = $paneContainer;
	},
	drag:function(ev) {

	    var pane_offset = -(100/this.pane_count)*this.current_pane;
	    var drag_offset = ((100/this.pane_width)*ev.gesture.deltaX) / this.pane_count;

	    if((this.current_pane == 0 && ev.gesture.direction == "right") ||
	        (this.current_pane == this.pane_count-1 && ev.gesture.direction == "left")) {
	        drag_offset *= .4;
	    }

	    this._setContainerOffset(drag_offset + pane_offset);
	},
	release:function(ev) {
        if(Math.abs(ev.gesture.deltaX) > this.pane_width/2) {
            if(ev.gesture.direction == 'right') {
                this._prev();
            } else {
                this._next();
            }
        }
        else {
            this._showPane(this.current_pane, true);
        }
	},
	swipeleft:function(ev) {
        this._next();
        ev.gesture.stopDetect();		
	},
    swiperight:function(ev) {
		this._prev();
		ev.gesture.stopDetect();
	},

	_next:function(){
		this._showPane(this.current_pane+1, true);
	},
	_prev:function(){
		this._showPane(this.current_pane-1, true);
	},
	_setContainerOffset:function(percent, animate) {
        this.container.removeClass("animate");

        if(animate) {
            this.container.addClass("animate");
        }

        this.container.css("transform", "translate3d("+ percent +"%,0,0) scale3d(1,1,1)");
        
    },
    _showPane:function(index, animate) {
        // between the bounds
        index = Math.max(0, Math.min(index, this.pane_count-1));
        this.current_pane = index;

        var offset = -((100/this.pane_count)*this.current_pane);
        this._setContainerOffset(offset, animate);

        // check specific pane action
        var $currentPane = $(this.container.children('.pane')[this.current_pane]);
        if ($currentPane.hasClass('eula')) {
        	$currentPane.find('.button').removeClass('disabled');
        } else {
        	this.container.children('.pane.eula').find('.button').addClass('disabled');
        }
    }
});

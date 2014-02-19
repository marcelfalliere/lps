
var HammerScrollableView = Backbone.Marionette.CompositeView.extend({
	breakpoint:80,
	initialize:function(){
		this.headerHeight = $('#header').innerHeight();
	},
	events:{
		'dragdown ol':'dragdown',
		'dragup ol':'dragup',
		'release ol':'release',
		'touch ol':'touch' 
	},
	touch:function(ev){
		this.hide();
	},
	dragup:function(ev){
		// no requestAnimationFrame instance is running, start one
        if(!this._anim) {
            this.updateHeight();
        }

        // stop browser scrolling
        ev.gesture.preventDefault();

        // update slidedown height
        // it will be updated when requestAnimationFrame is called
        this._slidedown_height = ev.gesture.deltaY * 0.4;
	},
	dragdown:function(ev){
		this._dragged_down = true;

        // if we are not at the top move down
        var scrollY = window.scrollY;
        if(scrollY > 5) {
            return;
        } else if(scrollY !== 0) {
            window.scrollTo(0,0);
        }

        // no requestAnimationFrame instance is running, start one
        if(!this._anim) {
            this.updateHeight();
        }

        // stop browser scrolling
        ev.gesture.preventDefault();

        // update slidedown height
        // it will be updated when requestAnimationFrame is called
        this._slidedown_height = ev.gesture.deltaY * 0.4;
        
	},
	release:function(ev){
		if(!this._dragged_down) {
		    return;
		}

		// cancel animation
		cancelAnimationFrame(this._anim);

		// over the breakpoint, trigger the callback
		if(ev.gesture.deltaY >= this.breakpoint) {
		    this.$el.find('ol')[0].className='pullrefresh-loading';

		    this.setHeight(60);
		    this.trigger('load-request');
		}
		// just hide it
		else {
			this.$el.find('ol')[0].className='pullrefresh-slideup';

		    this.hide();
		}
	},
	updateHeight:function() {
        var self = this;

        this.setHeight(this._slidedown_height);

        if(this._slidedown_height >= this.breakpoint){
            this.$el.addClass('breakpoint');
        } else {
            this.$el.removeClass('breakpoint');
        }

        this._anim = requestAnimationFrame(function() {
            self.updateHeight();
        });
    },
    setHeight:function(height) {
        this.$el.find('ol').css('-webkit-transform', 'translate3d(0,'+height+'px,0) scale3d(1,1,1)');
    },
    hide:function(){
    	this.setHeight(0);
    	cancelAnimationFrame(this._anim);
    	this._anim=null;
    	this._dragged_down=false;
    	var self = this;
    	setTimeout(function(){ self.$el.find('ol')[0].className=''; }, 320);
    }
});

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
                window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                    timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
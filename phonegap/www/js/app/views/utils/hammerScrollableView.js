
var HammerScrollableView = {
	breakpoint:80,
	initialize:function(){
		this.headerHeight = $('#header').innerHeight();
        this._slide_height=0;
        this._saved_height=0;
        this.isScrolling=false;
        $('#scroll-back-to-top-helper').on('tap', _.bind(this.onTapScrollBackToTopHelper, this));
	},
    events:{
        'dragstart .scroll-wrap':'dragstart',
		'touch .scroll-wrap':'dragstart',
        'dragdown .scroll-wrap':'dragdown',
        'dragup .scroll-wrap':'dragup',
        'release .scroll-wrap':'release',
        'pagebeforeshow':'pagebeforeshow',
        'pagebeforehide':'pagebeforehide'
	},
    onRender:function(){
        this.$p2r = this.$el.find('.pull-to-refresh');
    },
    pagebeforeshow:function(){

        // restore du height si présent
        if (this.saveScrollHeight==true && app.scrollableViewHeightSave) {
            var potentialHeight = app.scrollableViewHeightSave[this.$el.attr('class').split(' ')[1]];
            if (potentialHeight) {
                this.setHeight(potentialHeight);
                app.scrollableViewHeightSave[this.$el.attr('class').split(' ')[1]] = 0;
                this._saved_height = potentialHeight;
            }
        }
    },
    pagebeforehide:function(){
        // arret du helper scroll back to top
        $('#scroll-back-to-top-helper').off('tap');

        // sauvegarde dans le global namespace de la hauteur
        if (this.saveScrollHeight==true && app.scrollableViewHeightSave===undefined) {
            app.scrollableViewHeightSave = {};
        }
        app.scrollableViewHeightSave[this.$el.attr('class').split(' ')[1]] = this._saved_height;
    },
    onTapScrollBackToTopHelper:function(){
        this.scrollToWithAnim(0, 'back-to-top', 300);
    },
    dragstart:function(ev){
        // nettoyage si en train de scroller
        if (this.isScrolling==true) {
            clearTimeout(this.scrollingTimeout);
            var currentTop = $('.scroll-wrap').position().top;
            this.$el.find('.scroll-wrap')[0].className='scroll-wrap'; 
            this.setHeight(currentTop);
            this._saved_height=currentTop;
            this.isScrolling=false;
        }
    },
	dragup:function(ev){

        // stop browser scrolling
        ev.gesture.preventDefault();

        // update slidedown height
        // it will be updated when requestAnimationFrame is called
        this._slide_height = this._saved_height  + ev.gesture.deltaY * 0.9;
		
        // no requestAnimationFrame instance is running, start one
        if(!this._anim) {
            this.updateHeight();
        }
	},
	dragdown:function(ev){
        // stop browser scrolling
        ev.gesture.preventDefault();

        // update slidedown height
        // it will be updated when requestAnimationFrame is called
        this._slide_height = this._saved_height + ev.gesture.deltaY * 0.9;

        // no requestAnimationFrame instance is running, start one
        if(!this._anim) {
            this.updateHeight();
        }
	},
	release:function(ev){

        if (ev.gesture.velocityY!=0) {
            var bottomFrontier = -1*(this.$el.find('.scroll-wrap').height() - $(window).height() + $('#viewport > #header').innerHeight());
            
            if (this.$el.find('.scroll-wrap').height() < $(window).height() - $('#viewport > #header').innerHeight()) 
                bottomFrontier=0;
            
            if (this._slide_height > 0 && this._slide_height < this.breakpoint) { // top frontier sans breakpoint
                this.scrollToWithAnim(0, 'back-to-top', 300);
            } else if (this._slide_height > 0 && this._slide_height >= this.breakpoint) { // top frontier + bp
                if (this.isFetching!=true) {

                    if (this.refreshFunction) {
                        this.isFetching=true;
                        this.scrollToWithAnim(this.breakpoint, 'back-to-top', 300);
                        this.updatePullToRefreshText();
                        
                        this.refreshFunction();
                    } else {
                        this.scrollToWithAnim(0, 'back-to-top', 300);
                    }
                } else {
                    this.scrollToWithAnim(this.breakpoint, 'back-to-top', 300);
                }
            } else if(this._slide_height < bottomFrontier) { // bottom frontier
                this.scrollToWithAnim(bottomFrontier, 'back-to-top', 300);
            } else { // inside the scroll
                var hypotheticalVelocityDestination = ((ev.gesture.direction=='down')?-1:1)*ev.gesture.velocityY*this._slide_height + this._slide_height;
                var velocityDestination = (bottomFrontier>hypotheticalVelocityDestination)?bottomFrontier:((hypotheticalVelocityDestination>0)?0:hypotheticalVelocityDestination);
        		this.scrollToWithAnim(velocityDestination, 'velocity-scroll', 1000);
            }
        }
        
		// cancel animation
		cancelAnimationFrame(this._anim);
        this._anim=undefined;
		
	},
    updatePullToRefreshText:function(){
        if (this.isFetching==true) {
            this.$p2r.text('en cours ...')
        } else if (this._slide_height >= 0 && this._slide_height < this.breakpoint  && this.isFetching != true) { // entre 0 et breakpoint
            this.$p2r.text(dots(parseInt(this._slide_height/2,10)));
        } else if (this._slide_height >= this.breakpoint && this.isFetching != true) {
            this.$p2r.text('lâcher pour rafraîchir')
        }
    },
	updateHeight:function() {
        var self = this;

        this.updatePullToRefreshText();

        this.setHeight(this._slide_height);

        if(this._slide_height >= this.breakpoint){
            this.$el.addClass('breakpoint');
        } else {
            this.$el.removeClass('breakpoint');
        }

        this._anim = requestAnimationFrame(function() {
            self.updateHeight();
        });
    },
    setHeight:function(height) {
        this.$el.find('.scroll-wrap').css('-webkit-transform', 'translate3d(0,'+height+'px,0) scale3d(1,1,1)');
        if (height < -this.$el.find('.scroll-wrap').height()/2) {
            $('body').addClass('bg-reverse');
        } else {
            $('body').removeClass('bg-reverse');
        }   
    },
    scrollToWithAnim:function(h, animClass, wait){
        this.$el.find('.scroll-wrap')[0].className=animClass+' scroll-wrap';
        this.setHeight(h);
        this._saved_height=h;
        this.isScrolling=true;
        var self = this;
        this.scrollingTimeout=setTimeout(function(){ 
            self.$el.find('.scroll-wrap')[0].className='scroll-wrap'; 
            self.isScrolling=false;
        }, wait);
    }
};

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

function dots(howmany) {
    return Array(howmany).join().split(',').map(function(e, i) { return '.'; }).join(' ');
}

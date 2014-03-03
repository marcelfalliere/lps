"use strict";

var HomeItemView = Backbone.Marionette.ItemView.extend({
	template:'#tpl-home-item',
	tagName:'li',
	events:{
		'tap':'onTap'
	},
	onTap:function(ev){
		ev.gesture.preventDefault();
		app.thread = this.model;

		app.homeViewScrollTop = $(window).scrollTop();

		$(window).scrollTop(0);
		$('.page.home-vc').css('top','-'+(app.homeViewScrollTop-$('#header').innerHeight())+'px')

		app.router.navigate('thread/'+this.model.get('id'), {trigger:true});
	},

	onRender:function(){
		
		var size = $(window).width()+'px';

		this.$el.css({
			"height":size,
  			"line-height":size
		});

		if (!_.isEmpty(this.model.get('color'))){
			this.$el.css('background-color', this.model.get('color'));
		}

		if (!_.isEmpty(this.model.get('policeName'))){
			this.$el.css({
				'font-family': this.model.get('policeName'),
				'font-size': this.model.get('policeSize')
			});
		}

		if (!_.isEmpty(this.model.get('imageUrl'))){

			// de base, chargement de l'image thumb
			this.$el.css('background-image', 'url("'+this.model.get('imageUrl')+'/thumb'+'")')
			
			var imageUrl = this.model.get('imageUrl');
			var imageThumbUrl = this.model.get('imageUrl')+'/thumb';
			var sha1 = SHA1(imageUrl);
			
			// si sha1 présent dans localstorage
			app.db.transaction(_.bind(function (tx) {
				tx.executeSql('SELECT * FROM images WHERE sha1=?', [sha1], _.bind(function (tx, results) {
				  
				  if(results.rows.length==0) {

				  	convertImgToBase64(imageUrl, _.bind(function(base64){
						this.$el.css('background-image', 'url("'+base64+'")');
				  		
						app.db.transaction(function(tx){
				  			tx.executeSql('INSERT INTO images (sha1, base64) VALUES (?, ?)', [sha1, base64])
						});

					},this));

				  } else {

				  	this.$el.css('background-image', 'url("'+results.rows.item(0).base64+'")');

				  }
				},this));
			},this));
			
		}
	}

});

var HomeVC = HammerScrollableView.extend({
	template:'#tpl-home',
	className:'page home-vc',
	itemViewContainer:'ol',
	itemView:HomeItemView,
	events:_.extend({}, HammerScrollableView.prototype.events, {}),
	appendHtml: function(collectionView, itemView, index){ // see https://github.com/marionettejs/backbone.marionette/wiki/Adding-support-for-sorted-collections
		var childrenContainer = collectionView.itemViewContainer ? collectionView.$(collectionView.itemViewContainer) : collectionView.$el;
		var children = childrenContainer.children();
		
		if (children.size() <= index) {
			childrenContainer.append(itemView.el);
		} else {

			children.eq(index).before(itemView.el);
		}
	}
});

function isIOS7(){
	return navigator.userAgent.match(/(iPad|iPhone|iPod touch);.*CPU.*OS 7_\d/i)
}

function SHA1(s){function U(a,b,c){while(0<c--)a.push(b)}function L(a,b){return(a<<b)|(a>>>(32-b))}function P(a,b,c){return a^b^c}function A(a,b){var c=(b&0xFFFF)+(a&0xFFFF),d=(b>>>16)+(a>>>16)+(c>>>16);return((d&0xFFFF)<<16)|(c&0xFFFF)}var B="0123456789abcdef";return(function(a){var c=[],d=a.length*4,e;for(var i=0;i<d;i++){e=a[i>>2]>>((3-(i%4))*8);c.push(B.charAt((e>>4)&0xF)+B.charAt(e&0xF))}return c.join('')}((function(a,b){var c,d,e,f,g,h=a.length,v=0x67452301,w=0xefcdab89,x=0x98badcfe,y=0x10325476,z=0xc3d2e1f0,M=[];U(M,0x5a827999,20);U(M,0x6ed9eba1,20);U(M,0x8f1bbcdc,20);U(M,0xca62c1d6,20);a[b>>5]|=0x80<<(24-(b%32));a[(((b+65)>>9)<<4)+15]=b;for(var i=0;i<h;i+=16){c=v;d=w;e=x;f=y;g=z;for(var j=0,O=[];j<80;j++){O[j]=j<16?a[j+i]:L(O[j-3]^O[j-8]^O[j-14]^O[j-16],1);var k=(function(a,b,c,d,e){var f=(e&0xFFFF)+(a&0xFFFF)+(b&0xFFFF)+(c&0xFFFF)+(d&0xFFFF),g=(e>>>16)+(a>>>16)+(b>>>16)+(c>>>16)+(d>>>16)+(f>>>16);return((g&0xFFFF)<<16)|(f&0xFFFF)})(j<20?(function(t,a,b){return(t&a)^(~t&b)}(d,e,f)):j<40?P(d,e,f):j<60?(function(t,a,b){return(t&a)^(t&b)^(a&b)}(d,e,f)):P(d,e,f),g,M[j],O[j],L(c,5));g=f;f=e;e=L(d,30);d=c;c=k}v=A(v,c);w=A(w,d);x=A(x,e);y=A(y,f);z=A(z,g)}return[v,w,x,y,z]}((function(t){var a=[],b=255,c=t.length*8;for(var i=0;i<c;i+=8){a[i>>5]|=(t.charCodeAt(i/8)&b)<<(24-(i%32))}return a}(s)).slice(),s.length*8))))}
	
function convertImgToBase64(url, callback, outputFormat){
    var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img,0,0);
        var dataURL = canvas.toDataURL(outputFormat || 'image/png');
        callback.call(this, dataURL);
        // Clean up
        canvas = null; 
    };
    img.src = url;
}


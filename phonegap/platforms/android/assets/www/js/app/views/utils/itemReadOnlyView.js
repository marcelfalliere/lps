"use strict";

var ItemReadOnlyView = Backbone.Marionette.ItemView.extend({
	template:'#tpl-home-item',
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

			// De base, couleur de fond transparente
			this.$el.css('background-color', 'transparent');

			// de base, chargement de l'image thumb
			var imageUrl = this.model.get('imageUrl');
			var imageThumbUrl = this.model.get('imageUrl')+'/thumb';

			// si l'image est présente dans le div #cache-images, alors mettre directement la normale
			if ($('#cache-images').find('img[src="'+imageUrl+'"]').length > 0) {
				console.log('reusing '+this.model.get('title'));

				this.$el.find('.normal-image').css('background-image', 'url("'+imageUrl+'")')
			} else {
				// sinon, charger et cacher
				console.log('caching '+this.model.get('title'));

				var cacheImages = document.getElementById('cache-images');
				var thumbImage = new Image();
				thumbImage.onload = _.bind(function() {
					this.$el.css('background-image', 'url("'+thumbImage.src+'")')
					
					var normalImage = new Image();
					normalImage.onload = _.bind(function() {
						this.$el.find('.normal-image').css('background-image', 'url("'+normalImage.src+'")')
					},this)
					normalImage.src = imageUrl;
					cacheImages.appendChild(normalImage);	
				},this)
				thumbImage.src = imageThumbUrl;
				cacheImages.appendChild(thumbImage);
			}


/*
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
			},this));*/
			
		}
	}
});
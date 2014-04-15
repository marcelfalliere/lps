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
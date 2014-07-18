"use strict";

var ReportModel = Backbone.Model.extend({
	url:function(){
		return conf.server.base_url+'threads/'+this.get('id')+'/report'
	},
	initialize:function(){
		this.on('sync', _.bind(this.onSynced, this));
		this.on('error', _.bind(this.onError, this));
	},
	onSynced:function() {
		navigator.notification.alert('Votre report est bien pris en compte et va être traité dans les 24h. En attendant, l\'image ne sera plus affichée sur votre téléphone.');
		app.threads.report(this.get('id'));
	},
	onError:function() {
		navigator.notification.alert('La requête de report n\'a pas abouti ! Vous devriez réessayer une fois que vous retrouvez du réseau.', function(){}, '!! une erreur est survenue :( !!');
	}
});
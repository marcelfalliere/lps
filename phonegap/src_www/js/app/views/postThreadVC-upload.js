"use strict";

var PostThreadVC_Upload = {
	uploadImage:function(imagePath){
		this.model.set('isUploading', true);
        var options = new FileUploadOptions();
        debugger;
        options.fileKey="image";
        options.fileName=imagePath.substr(imagePath.lastIndexOf('/')+1);
        options.mimeType="image/png";

        this.ft = new FileTransfer();

        try {

        	this.onProgress({
        		loaded:0,
        		total:1
        	});
            this.ft.onprogress = _.bind(this.onProgress, this);
            
            this.ft.upload(
                imagePath,
                encodeURI(conf.server.base_url+'save_image'),
                _.bind(this.onSuccess,this),
                _.bind(this.onFail,this),
                options
            );

        } catch(e) {
            this.onFail(e);
        }
	},
	onProgress:function(progressEvent){
		var $uploadOverlay = this.$el.find('#input-wrap .upload-overlay');
		if ($uploadOverlay.length==0) {
			$uploadOverlay = $('<div class="upload-overlay"></div>').appendTo('#input-wrap');
		}

		var percent = 100 - ((progressEvent.loaded / progressEvent.total) * 100);
		this.percent = percent;
		$uploadOverlay.css('width', percent+'%');
	},
	onSuccess:function(rawResponse){
		this.$el.find('#input-wrap .upload-overlay').remove();
		this.model.set('isUploading', false);
		try {
			if (rawResponse.responseCode==200) {
				var body = JSON.parse(rawResponse.response);
				this.model.set('imageUrl', conf.server.base_url+body.imageUrl)
			} else {
				this.onFail('Response is '+rawResponse.responseCode)
			}

		} catch (err) {
			this.onFail('JSON exception :('+ err);
		}
	},
	onFail:function(error){
		console.log("error",error);
	},
	isUploading:function(){
		return this.model.get('isUploading')==true;
	},
	abortFileTransfer:function(){
		this.$el.find('.upload-overlay').remove();
		this.ft.abort();
	}
};
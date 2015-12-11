
angular.module('lps.services')

.service('ThreadsService', function($http, $q, $timeout, ImgCache){

	var Thread = Parse.Object.extend("thread");
	var Answer = Parse.Object.extend("answer");
	var currentThread;
	var threads = [];

	this.all = function(){
		var deferred = $q.defer();

		query = new Parse.Query(Thread);
		query.descending('updatedAt');
		query.equalTo('published', true);
		query.find({
			success:function(results){
				for (var i = 0; i < results.length; i++) {
					var image = results[i].get('image');
		      var object = {
		      	image: image?image.url():undefined,
		      	seen: results[i].get('seen')
		      };
		      threads.push(object);
		    }
				deferred.resolve(threads);
			},
			error:function(error){
				console.error("ThreadsService#all ParseError: " + error.code + " \n Message: " + error.message+" \n");
				deferred.reject();
			}
		});

		return deferred.promise;
	}

	this.prepareNewThreadWithImage = function(image) {
		var deferred = $q.defer();

		convertFileToBase64viaFileReader(image) // 'file://'+
		.then(uploadToParse, deferred.reject)
		.then(createNewThreadWithImage, deferred.reject ,deferred.notify)
		.then(deferred.resolve, deferred.reject)
		// $timeout(function(){ deferred.notify(.2); },250)
		// $timeout(function(){ deferred.notify(.4); },500)
		// $timeout(function(){ deferred.notify(.6); },750)
		// $timeout(function(){ deferred.notify(.8); },1000)
		// $timeout(function(){ deferred.notify(1); },1500)
		// $timeout(function(){
		// 	deferred.resolve('h');
		// },4800)

		return deferred.promise;
	}

	this.publishThread = function(threadData) {
		ImgCache.cacheFile(currentThread.get('image')._url);

		var deferred = $q.defer();
		currentThread.set('published',true);
		currentThread.set('seen',1);
		currentThread.save().then(function(){
			var object = {
      	image: currentThread.get('image')._url,
      	seen: 0
      };
      threads.unshift(object);

			deferred.resolve();
		}, deferred.reject);
		return deferred.promise;
	}


	// private functions

	var convertFileToBase64viaFileReader = function(url, callback){
		var deferred = $q.defer();

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
      var reader  = new FileReader();
      reader.onloadend = function () {
          deferred.resolve(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.send();

    return deferred.promise;
	}

	var uploadToParse = function(base64Image){
		var deferred = $q.defer();

		Parse._getInstallationId().then(function(installationId) { 

			var oReq = new XMLHttpRequest();
			oReq.responseType='json'
			
			oReq.upload.addEventListener("progress", function(oEvent){
				if (oEvent.lengthComputable) {
			    var percentComplete = oEvent.loaded / oEvent.total;
			    deferred.notify(percentComplete);
			  } else {
			  	deferred.notify(0);
			    console.error('Impossible de calculer la progression puisque la taille totale est inconnue');
			  }
			}, false);

			oReq.addEventListener("load", function(){
				deferred.resolve(oReq.response);
			}, false);

			oReq.open('POST', 'https://api.parse.com/1/files/image.png', true);
			oReq.setRequestHeader("Content-Type", 'text/play');
      oReq.send(JSON.stringify({
					_ApplicationId: Parse.applicationId,
					_ClientVersion: "js1.6.7",
					_ContentType: "image/png",
					_InstallationId: installationId,
					_JavaScriptKey: Parse.javaScriptKey,
					base64: base64Image.substring(base64Image.indexOf('base64,')+'base64,'.length)
				}));
		})

		

		// var file = new Parse.File('image.png', {base64 : base64Image });
		// file.save().then(function(){
		// 	console.log('done updload ; make a new thread maybe ?')
		// 	deferred.resolve(file);
		// },function(){
		// 	console.log('fail upload')
		// },function(update){
		// 	console.log('got notification upload ? ',update)
		// });

		return deferred.promise;
	}

	var createNewThreadWithImage = function(parseImage) {
		var deferred = $q.defer();

		var hackedParseFile = new Parse.File();
		hackedParseFile._name = parseImage.name;
		hackedParseFile._url = parseImage.url;

		currentThread = new Thread();
		currentThread.set('image', hackedParseFile);
		currentThread.set('published', false);
		currentThread.save().then(function(response){
			deferred.resolve(response.id)
		}, function(err){
			deferred.reject('err', err)
		});

		return deferred.promise;	
	}

})


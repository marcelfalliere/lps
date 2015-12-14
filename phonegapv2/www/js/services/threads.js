
angular.module('lps.services')

.service('ThreadsService', function($http, $q, $timeout, ImgCache){

	var Thread = Parse.Object.extend("thread");
	var Answer = Parse.Object.extend("answer");
	var currentThread;
	var threads = [];
	var cpt = 20;
	while (cpt > 0) {
		threads.push({
			image:'img/CDVSquareCameraDefaultPicture.png',
			seen:cpt
		});
		cpt--;
	}

	this.all = function(){
		var deferred = $q.defer();

		if (threads.length!=0){
			deferred.resolve(threads);
		} else {
			query = new Parse.Query(Thread);
			query.descending('updatedAt');
			query.equalTo('published', true);
			query.find({
				success:function(results){
					for (var i = 0; i < results.length; i++) {
			      threads.push(transformParseThreadToFlatObject(results[i]));
			    }
					deferred.resolve(threads);
				},
				error:function(error){
					console.error("ThreadsService#all ParseError: " + error.code + " \n Message: " + error.message+" \n");
					deferred.reject();
				}
			});
		}

		return deferred.promise;
	}

	this.thread = function(thread_id) {
		var deferred = $q.defer();

		incrementThreadSeenCount(thread_id);

		var thread = _.find(threads, {id:thread_id});
		if (thread){
			deferred.resolve(thread);
		} else {
			query = new Parse.Query(Thread);
			query.get(thread_id, {
				success:function(object){
					deferred.resolve(transformParseThreadToFlatObject(object));
				},
				error:function(error){
					console.error("ThreadsService#all ParseError: " + error.code + " \n Message: " + error.message+" \n");
					deferred.reject();
				}
			});
		}

		return deferred.promise;
	}

	this.answers = function(thread_id){
		var deferred = $q.defer();

		query = new Parse.Query(Answer);
		var thread = new Thread();
		thread.id = thread_id;
		query.equalTo('thread', thread)
		query.find({
			success:function(results){
				var answers = [];
				for (var i = 0; i < results.length; i++) {
		      answers.push(transformParseAnswerToFlatObject(results[i]));
		    }
				deferred.resolve(answers);
			},
			error:function(error){
				console.error("ThreadsService#answers {thread_id="+thread_id+"} ParseError: " + error.code + " \n Message: " + error.message+" \n");
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
		currentThread.set('seen',0);
		currentThread.save().then(function(){
      // ajout au tableau des threads locaux
      threads.unshift(transformParseThreadToFlatObject(currentThread));
			deferred.resolve();
		}, deferred.reject);
		return deferred.promise;
	}

	this.publishAnswerToThread = function(thread_id, answerData){
		var deferred = $q.defer();
		var answer = new Answer();
		answer.set('text', answerData.text);
		var thread = new Thread();
		thread.id = thread_id;
		answer.set('thread', thread);
		answer.save({
			success:function(answer){
				debugger;
				deferred.resolve();
			},
			error:deferred.reject
		});
		return deferred.promise;
	}

	// ----------------------------------------
	// Private functions


	var incrementThreadSeenCount = function(thread_id){
		var thread = new Thread();
		thread.id = thread_id;
		thread.increment('seen');
		thread.save({
			success:function(t){
				var thread = _.find(threads, {id:thread_id});
				if (thread){
					thread.seen = t.get('seen');
				}
			}
		});
	}

	var transformParseAnswerToFlatObject = function(parseAnswer) {
		var object = {
			id:parseAnswer.id,
			text:parseAnswer.get('text')
		};
		return object;
	}

	var transformParseThreadToFlatObject = function(parseThread) {
		var image = parseThread.get('image');
    var object = {
    	image: image?image.url():undefined,
    	seen: parseThread.get('seen'),
    	id: parseThread.id
    };
    return object;
	}

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


var _ = require('underscore');

function PushInterface(request, endPoint){
	this._request=request;
	this._endPoint=endPoint;
}

PushInterface.prototype.push = function(event, msg, thread_id, callback) {
	var form = {  msg: msg };

	if (thread_id != undefined) {
		form['data.thread_id'] = thread_id;
	}	

	this._request.post({
		uri:this._endPoint+'event/'+event,
		json:true,
		form: form
	}, _.bind(function(){
		if (callback) callback();
		// what do ?
	},this));
}



module.exports = PushInterface;
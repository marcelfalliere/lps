var _ = require('underscore');

function PushInterface(request, endPoint){
	this._request=request;
	this._endPoint=endPoint;
}

PushInterface.prototype.push = function(event, msg) {
	this._request.post({
		uri:this._endPoint+'event/'+event,
		json:true,
		form: { msg: msg }
	}, _.bind(function(){
		// what do ?
	},this));
}

module.exports = PushInterface;
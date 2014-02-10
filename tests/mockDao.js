/*

drop-in replacement for the Server class dao parameter

*/

module.exports = {
	threads:function(callback){
		callback(new Array(10))
	}
}
var request = require('request'),
	credentials = require('./credentials.js'); 

module.exports = function (api, wkspce, date) {
	request('https://'+ api +':@app.asana.com/api/1.0/tasks?workspace='+ wkspce + '&assignee=me&completed_since='+ date +'&opt_fields=due_on,name,tags'), function(err, response, data) {
		if (err) return (err);
		var dataObj = JSON.parse(data);
		return dataObj.data; 

	}
}
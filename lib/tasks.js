var request = require('request');

module.exports = function (api, wkspce, date, tagName) {
	var tcTasks = [];
	request('https://'+ api +':@app.asana.com/api/1.0/tasks?workspace='+ wkspce + '&assignee=me&completed_since='+ date +'&opt_fields=due_on,name,tags'), function(err, response, data) {
		if (err) return (err);
		var dataObj = JSON.parse(data);
		for (var i = 0; i < dataObj.data.length; i++) {
		 	if (dataObj.data[i].tags === tagName) {
		 		tcTasks.push(dataObj.data[i]);
		 	}
		 }; 
		 return tcTasks;
	}
}
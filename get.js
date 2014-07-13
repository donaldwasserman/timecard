var request = require('request'),
	moment = require('moment'),
	_ = require('underscore'),
	creds = require('./lib/credentials.js');

var testTags = function(list, tag) {
	tagTruth = [];
	for (var i = 0; i < list.length; i++) {
		if (list[i].id == tag) {
			tagTruth.push(list[i].id.toString())
		} 
	}
	return _.contains(tagTruth, tag);
}

var projectNames = function(api, wkspce) {
	request('https://'+api+'')
}

getCompletedTasks = function (api, wkspce, lookback, tagID) {
	var now = moment();
	var computedDate = now.subtract('months', lookback).format('YYYY-MM-DDTHH:MM:SSZZ');

	request('https://'+api+':@app.asana.com/api/1.0/tasks?workspace='+wkspce+'&completed_since='+computedDate+'&assignee=me&opt_fields=due_on,name,projects,tags,completed_at', function(err, response, data){

		if (err) console.error(err);
		var clean = data.replace("'s" || "'S", "s");
		var dataObj = JSON.parse(clean);
		var list = _.filter(dataObj.data, function (el) {
			return el.completed_at !== null && testTags(el.tags, tagID);
		})
		var tasklist = _.each(list, function(i) {
			i.time = (i.name.indexOf('##') > 0) ? i.name.substring(i.name.indexOf('##') + 2) : 'no time';
			i.grantID = (i.projects.length === 1) ? i.projects[0].id : 'you messed up' 
			i.displayname = i.name.slice(0, i.name.indexOf('##'));
		});
		console.log(tasklist);
		return tasklist;
	})
}
getCompletedTasks(creds.api, creds.mhc, 1, creds.tc);


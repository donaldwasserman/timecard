var request = require('request'),
	moment = require('moment'),
	_ = require('underscore'),
	nodemailer = require('nodemailer'),
	csv = require('to-csv'),
	fs = require('fs');
	creds = require('./config.js');

var testTags = function(list, tag) {
	tagTruth = [];
	for (var i = 0; i < list.length; i++) {
		if (list[i].id == tag) {
			tagTruth.push(list[i].id.toString())
		} 
	}
	return _.contains(tagTruth, tag);
}

var getCompletedTasks = function (api, wkspce, lookback, tagID) {

	var now = moment();
	var computedDate = now.subtract('months', lookback).format('YYYY-MM-DDTHH:MM:SSZZ');

	request('https://'+api+':@app.asana.com/api/1.0/tasks?workspace='+wkspce+'&completed_since='+computedDate+'&assignee=me&opt_fields=due_on,name,projects,tags,completed_at', function(err, response, data){

		if (err) console.error(err);
		var dataObj = JSON.parse(data);
		var list = _.filter(dataObj.data, function (el) {
			return el.completed_at !== null && testTags(el.tags, tagID);
		})

		request('https://'+api+':@app.asana.com/api/1.0/workspaces/'+wkspce+'/projects', function(err, res, mdata) {
			
			var moreData = JSON.parse(mdata);
			var projectList = moreData.data; 

			var tasklist = _.each(list, function(i) {
				
				i.time = (i.name.indexOf('##') > 0) ? i.name.substring(i.name.indexOf('##') + 2) : 'no time';
				
				i.projectID = (i.projects.length === 1) ? i.projects[0].id : 'invalid projects' 
				
				i.displayname = i.name.slice(0, i.name.indexOf('##'));
				
				i.date = moment(i.completed_at).format("MM/DD/YYYY");
				
				i.projectName = _.values(_.pick(_.findWhere(projectList, {id: i.projectID}), 'name'))[0];
			});

			var filtered = _.map(tasklist, function(t) {
				return _.pick(t, 'displayname', 'date', 'time', 'projectName');
			});
			
			fs.writeFile('output/'+moment(now).format('MMM-YYYY')+'-timecard.csv', csv(filtered), function (err) {
				console.log('Your timecard for '+moment(now).format('MMMM')+' is done! Check your "OUTPUT" folder, and grab a beer.');
			}) 

		});

	});
	
}

getCompletedTasks(creds.api, creds.workspace, creds.lookback, creds.tag);


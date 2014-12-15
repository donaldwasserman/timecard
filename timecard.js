var request = require('request'),
	moment = require('moment'),
	_ = require('underscore'),
	csv = require('to-csv'),
	fs = require('fs'),
	creds = require('./config.js');

var testTags = function(list, tag) {
	tagTruth = [];
	for (var i = 0; i < list.length; i++) {
		if (list[i].id == tag || tag === 0) {
			tagTruth.push(list[i].id.toString())
		} 
	}
	return _.contains(tagTruth, tag);
}

var getCompletedTasks = function (api, wkspce, tagID, fromDate, toDate) {
	
	//make sure wkspace and id are strings
	if (typeof wkspce !== 'number') {
		throw "ERROR: Need numbers for workspace!"
	}
	
	var fd = moment(fromDate).format('YYYY-MM-DDTHH:MM:SSZZ'); 
	var td; 
	var now = moment();

	//console.log('Calling up Asana...');
	request('https://'+api+':@app.asana.com/api/1.0/tasks?workspace='+wkspce+'&completed_since='+fd+'&assignee=me&opt_fields=due_on,name,projects,tags,completed_at', function(err, response, data){
		console.log(data);
		if (!err) {

			try {
				var dataObj = JSON.parse(data);
				//console.log(dataObj);
				//clean up to match dates and tags
				var list = _.filter(dataObj.data, function (el) {
					return el.completed_at !== null && testTags(el.tags, tagID);
				});
				
				if (typeof toDate !== 'undefined') {
					list = _.filter(list, function (l) {
						return	moment(l.completed_at).isBefore(toDate, 'day');
					});
				}

				if (list < 1) {
					console.log("dude, you really only did less than 1 thing?");
				
				} else {

				request('https://'+api+':@app.asana.com/api/1.0/workspaces/'+wkspce+'/projects', function(err, res, mdata) {
					
					var moreData = JSON.parse(mdata);
					var projectList = moreData.data; 

					var tasklist = _.each(list, function(i) {
					//map tasks to object => csv

						i.time = (i.name.indexOf('##') > 0) ? i.name.substring(i.name.indexOf('##') + 2) : 'no time';
						
						i.projectID = (i.projects.length === 1) ? i.projects[0].id : 'invalid projects' 
						
						i.displayname = i.name.slice(0, i.name.indexOf('##'));
						
						i.date = moment(i.completed_at).format("MM/DD/YYYY");
						
						i.projectName = _.values(_.pick(_.findWhere(projectList, {id: i.projectID}), 'name'))[0];
					});
					
					//console.log('...just organized all your tasks...');
					
					var filtered = _.map(tasklist, function(t) {
						return _.pick(t, 'displayname', 'date', 'time', 'projectName');
					});
					
					fs.writeFile('output/'+moment(now).format('MMM-YYYY')+'-timecard.csv', csv(filtered), function (err) {
						console.log('Your timecard for '+moment(now).format('MMMM')+' is done! Check your "OUTPUT" folder, and grab a beer.');
					}) 

				});
			 }
			} catch(e) {
				console.log(data)
			}
			

		} else {

			console.log('Your error: '+ err + '. Looks like you got what you paid for...try again');
		}
		
	});
	
}

getCompletedTasks(creds.api, creds.workspace, creds.tag, creds.fromDate, creds.toDate);


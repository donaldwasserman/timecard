var http = require('http'),
	express = require('express'),
	tasks = require('./lib/tasks.js'),
	moment = require('moment'),
	fs = require('filesystem'),
	request = require('request'),
	nodemailer = require("nodemailer"),
	credenitals = require('./lib/credenitals.js'),
	_ = require('underscore');

function findTag (element) {
	var regex = /(##)\d/;
	if (element.tags === credentials.tc) {
		//match regex
	}
}

function getData () {
		request('https://'+ credentials.api +':@app.asana.com/api/1.0/tasks?workspace='+ credentials.mhc +'&assignee=me&completed_since=now&opt_fields=due_on,name,projects,tags', function(err, response, data){
		var dataObj = JSON.parse(data);
}
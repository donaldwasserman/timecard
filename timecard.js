var http = require('http'),
	express = require('express'),
	tasks = require('./lib/tasks.js'),
	moment = require('moment'),
	_ = require('underscore');

var app = express();

var credentials = require('./lib/credentials');

app.set('port', process.env.PORT || 3000); 
app.listen(app.get('port'), function(){
	console.log('Express started on http://localhost:' + app.get('port') +'; Press Ctrl+C to terminate');
});
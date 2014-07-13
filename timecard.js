var http = require('http'),
	express = require('express'),
	tasks = require('./lib/tasks.js'),
	moment = require('moment'),
	credentials = require('./lib/credentials.js')
	_ = require('underscore');


var app = express();
var handlebars = require('express3-handlebars').create({extname: '.hbs', defaultLayout: 'main'});
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

app.set('port', process.env.PORT || 3000);

app.get('/', function  (req, res) {
	res.render('home');
});

app.get('/get-card', function (req, res){
	res.render('getTasks', {
		timecard: tasks.getTasks(credentials.api, credentials.mhc, 1, credentials.tc)
	});
});

app.listen(app.get('port'), function (){
	console.log("express started on localhost://"+ app.get('port')+ " !");
});
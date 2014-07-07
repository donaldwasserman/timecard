var http = require('http'),
	express = require('express'),
	tasks = require('./lib/tasks.js'),
	moment = require('moment'),
	credentials = require('./lib/credentials.js')
	_ = require('underscore');


var app = express();
var handlebars = require('express3-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(function  (req, res) {
	res.type('text/plain');
	res.status(404);
	res.send('Welcome to donad\'s timecard ');
});

app.listen(app.get('port'), function (){
	console.log("express started on localhost://"+ app.get('port')+ " !");
});
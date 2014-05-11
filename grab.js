var express = require('express'),
	app = express(),
	http = require('http'),
	server = http.createServer(app)
	path = require('path'),
	request = require('request')
	cumtdkey = require('./key.json');

app.configure(function (){
	app.set('views', 'views/');
	app.set('view engine', 'jade');
	app.use(express.static(path.resolve('./public')));
});

var key = cumtdkey['key'];

app.get('/', function (req, res){
	request('http://developer.cumtd.com/api/v2.2/json/GetStopTimesByStop?key='+ key + '&stop_id=ISR', function (error, response, body) {
			var ret = [];
			var j = JSON.parse(body);
			var times = j['stop_times'];
			for( var i = 0; i<times.length && i <= 4; i+=2){
				ret.push(times[i].departure_time);
			}
			res.render('index', {ret:ret});
		});	
});


server.listen(3000);	

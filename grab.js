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
			var north = [];
			var south = [];
			var j = JSON.parse(body);
			var times = j['stop_times'];
			for( var i = 0; i<times.length; i+=2){
				if(north.length <= 4 && times[i].stop_id == "ISR:2")
					north.push(times[i].departure_time);
				else if(south.length <= 4 && times[i].stop_id == "ISR:1")
					south.push(times[i].departure_time);
				else continue;
			}
			res.render('index', {north:north, south:south});
		});	
});


server.listen(3000);	

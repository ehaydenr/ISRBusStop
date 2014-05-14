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
			var date = new Date();
			var current_hour = date.getHours();
			var current_minute = date.getMinutes();
			var north = [];
			var south = [];
			var j = JSON.parse(body);
			var times = j['stop_times'];
			for( var i = 0; i<times.length; i++){
				if(times[i].trip.block_id.indexOf('M') == -1) continue;
				var hour = parseInt(times[i].departure_time.substring(0,2));
				var minute = parseInt(times[i].departure_time.substring(3,5));
				if(hour < current_hour) 
					continue;
				if(hour == current_hour && minute < current_minute)
					continue;
				var hourmod = hour%12;
				if(hourmod == 0) hourmod = 12;
				if(minute < 10) minute = "0" + minute;
				var t = hourmod + ":" + minute;
				if(north.length <= 4 && times[i].stop_id == "ISR:2")
					north.push(t);
				else if(south.length <= 4 && times[i].stop_id == "ISR:1")
					south.push(t);
				else continue;
			}
			res.render('index', {north:north, south:south});
		});	
});


server.listen(3000);	


var express     = require ('express'),
    http        = require ('http'), 
    app         = express (),
    querystring = require ('querystring'),
    route       = require ('./route');

var client = require ('share').client;

app.listen (3000);
console.log ("listening to 3000");

app.get ('/hello', route.startService);

//curl GET "localhost:3000/hello?port=8002&host=localhost&projectid=sample_project&file=energy.tex"

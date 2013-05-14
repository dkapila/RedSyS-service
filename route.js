/* Route */

var client      = require ('share').client,
    http        = require ('http'),
    querystring = require ('querystring'),
    api         = require ('./api');


exports.startService = function (req, res) {
	if (req.query['permissions'] === 'accept') {
		console.log ("service starting");
		var host       = req.query['host'];
		var port       = req.query['port'];
		var project_id = req.query['projectid'];
		var filename   = req.query['file'];

		getConnection(host, port, project_id, filename, function (err, connection) {
			connect (host, port, project_id, filename, connection);
		});
	}
	else {
		res.send ("This service requires rights to modify this present file");
	}
}


function connect (host, port, project_id, filename, connection) {
	var data = querystring.stringify({
	      client: connection.id,
	      project_id: project_id
	    });

	var options = {
	  hostname: host,
	  port: port,
	  path: '/setproject',
	  method: 'POST',
	   headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
  	  }
	};
	makeRequest (options, data, filename, connection);	
}

function getConnection(host, port, project_id, filename, callback) {
	var retry, retryFunc;
	var link = 'http://' + host + ":" + port + "/channel";
	var connection = new client.Connection(link);
	retry = 5;
	retryFunc = function() {
	if (retry === 0) {
	  return callback("Connection to server failed");
	}
	if (!connection.connected) {
	  return callback(null, connection);
	}
	retry--;
	return setTimeout(retryFunc, 200);
	};
	return setTimeout(retryFunc, 200);
};


function makeRequest (options, data, filename, connection) {
	//makig POST REQUEST
	var req = http.request(options, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
	    chunk = JSON.parse(chunk);
	    if (chunk.status === "ok") {
	    	openConnection (connection, filename);
	    }
	  });
	});
	req.on('error', function(e) {
	});
	console.log (data);
	req.write(data);
	req.end();	
}

function openConnection (connection, filename) {
	// Open the 'hello' document, which should have type 'text': 
	connection.open(filename, 'etherpad', function(error, doc) {
		if (error) {
			console.log ("error display " + error);
		}
		api.onInit (doc);
		doc.on ('change', function (op) {
			api.onDocChange (doc);
		});
	});
}
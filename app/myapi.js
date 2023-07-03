/**
 * myapi.js
 * 
 * @version 1.1 - April 2015
 *
 * 
 * DESCRIPTION:
 * an application to demonstrate running a node 
 * API Appserver on a Raspberry Pi to access GPIO I/O
 * Uses the Express and wiringPi node packages. 
 * 
 * 
 * @throws none
 * @see nodejs.org
 * @see express.org
 * 
 * @author Ceeb
 * (C) 2015 PINK PELICAN NZ LTD
 */

var http      = require('http');
var express   = require('express');
var bodyParser = require("body-parser");
var gpio      = require('pi-gpio');

var app       = express();
app.use(bodyParser.urlencoded({ extended:false}));
app.use(bodyParser.json());

// input port objects for our example
var inputs = [    { pin: '37', gpio: '26', value: null },
                  { pin: '38', gpio: '20', value: null }
                ];

// -----------------------------------------------------------------------
// open GPIO ports
var i;
for (i in inputs) {
  console.log('opening GPIO port ' + inputs[i].gpio + ' on pin ' + inputs[i].pin + ' as input');
  gpio.open(inputs[i].pin, "input", function (err) {
    if (err) {
      throw err;
    }
  }); // gpio.open
} // if

// ------------------------------------------------------------------------
// read and store the GPIO inputs twice a second
setInterval( function () {
  gpio.read(inputs[0].pin, function (err, value) {
    if (err) {
      throw err;
    }
    console.log('read pin ' + inputs[0].pin + ' value = ' + value);
    // update the inputs object
    inputs[0].value = value.toString(); // store value as a string
  });

  gpio.read(inputs[1].pin, function (err, value) {
    if (err) {
      throw err;
    }
    console.log('read pin ' + inputs[1].pin + ' value = ' + value);
    inputs[1].value = value.toString();
  });
}, 500); // setInterval

// ------------------------------------------------------------------------
// configure Express to serve index.html and any other static pages stored 
// in the home directory
app.use(express.static(__dirname));

// Express route for incoming requests for a single input
app.get('/inputs/:id', function (req, res) {
  var i;

  console.log('received API request for port number ' + req.params.id);
  
  for (i in inputs){
    if ((req.params.id === inputs[i].gpio)) {
      // send to client an inputs object as a JSON string
      res.send(inputs[i]);
      return;
    }
  } // for

  console.log('invalid input port');
  res.status(403).send('dont recognise that input port number ' + req.params.id);
}); // apt.get()


// Express route for incoming requests for a single input
//app.post('/inputs/:id',function (req) {
app.post('/params',function (req) {
	
	var button=req.body.button;
	var ports=req.body.ports;
  
  console.log('received API post-request for port number ' + ports);
  
    if ((ports === inputs[1].gpio)) {
			
		gpio.setDirection(inputs[1].pin, "output", function(err){
			if (err) throw err;
			console.log("pin direction is now set to OUTPUT");
		});
		
		console.log('setting pin value to ' + button); 		
		
		if ((button =="1")){	
			gpio.write(inputs[1].pin,true, function(err){			
		    	if (err) throw err;
					console.log("OUTPUT written");
				});		
		}
		
		else if ((button == "0")){	
			gpio.write(inputs[1].pin,false, function(err){			
		    	if (err) throw err;
					console.log("OUTPUT written");
				});		
		} 
						
      	return;
    }

  console.log('invalid input port');
  res.status(403).send('dont recognise that input port number ' + req.params.id);
}); // apt.post()

// Express route for incoming requests for a list of all inputs
app.get('/inputs', function (req, res) {
  // send array of inputs objects as a JSON string
  console.log('all inputs');
  res.status(200).send(inputs);
}); // apt.get()

// Express route for any other unrecognised incoming requests
app.get('*', function (req, res) {
  res.status(404).send('Unrecognised API call');
});

// Express route to handle errors
app.use(function (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send('Oops, Something went wrong!');
  } else {
    next(err);
  }
}); // apt.use()

process.on('SIGINT', function() {
  var i;

  console.log("\nGracefully shutting down from SIGINT (Ctrl+C)");

  console.log("closing GPIO...");
  for (i in inputs) {
    gpio.close(inputs[i].pin);
  }
  process.exit();
});

// ------------------------------------------------------------------------
// Start Express App Server
//
app.listen(3000);
console.log('App Server is listening on port 3000');


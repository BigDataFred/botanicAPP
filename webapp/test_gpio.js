var gpio = require("pi-gpio");

//We’re going to blink the LED, so lets define some variables

var intervalId;
 var durationId;
 var gpioPin = 16;    // header pin 16 = GPIO port 23

//Open a pin in output mode

// open pin 16 for output
//
gpio.open(gpioPin, "output", function(err) {
var on = 1;
console.log('GPIO pin '+gpioPin+' is open. toggling LED every 100 mS for 10s');

//Blink the LED attached to this pin on and off every 100mS

intervalId = setInterval( function(){
  gpio.write(gpioPin, on, function() { // toggle pin between high (1) and low (0)
    on = (on + 1) % 2;
    });
  }, 100);
});

//Let the blinking run for 10 seconds, then close port and exit

durationId= setTimeout( function(){
  clearInterval(intervalId);
  clearTimeout(durationId);
  console.log('10 seconds blinking completed');
  gpio.write(gpioPin, 0, function() { // turn off pin 16
    gpio.close(gpioPin); // then Close pin 16
    process.exit(0); // and terminate the program
  });
}, 10000); // duration in mS
function mygpio(button) {
	
	var ports = 20;  // the GPIO ports we will read
	
	url = document.URL + 'params';
	//alert(document.URL + 'params');
		
	if (button=="1"){
		alert("do you wish to turn the pump ON?");
		  $.post(url, {ports:ports, button: button}, function () {
		  });
	  }
	else if (button=="0"){
		
		alert("do you wish to turn the pump OFF?");	
		  $.post(url, {ports:ports, button: button}, function () {
		  });
	  
	}	
};

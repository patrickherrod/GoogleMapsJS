		/*
		 *  This code is property of DePauw University. Any unauthorized use of code is prohibited.
		 *
		 *  Written By: Patrick Herrod - 10.25.2012
		 *  Modified: 2.5.2013
		 *
		 *  This project is a mileage calculator meant to provide a faster and easier method for faculty
		 *  to report and file travels.  The project will be used for DePauw's Carbon Footprint
		 *  initiative, in an effort to better track emissions.  This file is part of an online module
		 *  and is not a stand-alone project.
		 */


        var autocompleteArr = new Array();  //Array to hold the google autocomplete objects
        var fields = 0;                     //Counter for destination input boxes
        var totalDistance = 0;				//Place holder for calculated distance
        var lastDistance = 0;				//Distance previously calculated
        var inputArr = new Array();         //Array to hold 
        var lastPlaceArr = new Array();

        function initialize() {

            /* Add listener to transportation mode radio buttons */

            for (var x = 0; x < 2; x++) {
                addInput();
                /*
                var request = {
                    name = inputArr[fields-1];
                }
                google.maps.event.trigger(autocompleteArr[fields-1], 'place_changed');
                */
            }

			//radio button for the user to select the mode of transportation
            var radios4 = document.getElementsByName('modeOfTrans');
            for (var i = 0, max4 = radios4.length; i < max4; i++) {
                radios4[i].onclick = function () {
					//case where the user selects "Plane" travel option
                    if (document.getElementById('air').checked) {
                        document.getElementById('trainWarning').style.display = "none";		//remove train warining message
						//reset placeholder values
                        document.getElementById('MILEAGE').value = 0;
                        totalDistance = 0;
                        lastDistance = 0;
                        var x;
                        for (x = 0; x < 10; x++) {		//reset all values in the form
                            var holder;
                            holder = document.getElementById('field' + x);
                            holder.value = "";
                            if (x > 1) {
                                holder.style.display = "none";
                            }
                        }
                        fields = 2;															//reset # of input fields to be displayed
                        document.getElementById('airCalcTable').style.display = "block";	//display air mileage calculator links
                    }
					//case where the user selects "Road" travel option
                    else if (document.getElementById('ground').checked) {
                        document.getElementById('trainWarning').style.display = "none";		//remover train warning message
						//reset values
                        document.getElementById('MILEAGE').value = 0;
                        totalDistance = 0;
                        lastDistance = 0;
                        var x;
                        for (x = 0; x < 10; x++) {		//reset form values
                            var holder;
                            holder = document.getElementById('field' + x);
                            holder.value = "";
                            if (x > 1) {
                                holder.style.display = "none";
                            }
                        }
                        fields = 2;											//reset # of input fields to be displayed
                    }
					//case where the user selects "Train" travel option
                    else if (document.getElementById('train').checked) {
                        document.getElementById('airCalcTable').style.display = "none";		//remove air calculation table and links
                        document.getElementById('MILEAGE').value = 0;			//reset calculator value
                        totalDistance = 0;
                        lastDistance = 0;
                        var x;
                        for (x = 0; x < 10; x++) {		//reset form fields
                            var holder;
                            holder = document.getElementById('field' + x);
                            holder.value = "";
                            if (x > 1) {
                                holder.style.display = "none";
                            }
                        }
                        fields = 2;						//reset number of input fields to be displayed
                        document.getElementById('trainWarning').style.display = "block";	//dislpay train warning message
                    }
                    else {
                        alert("Please select method of transportation.");
                    }
                }
            }
			
			//radio family for user to designate "one-way" or "round-trip" 
            var radios3 = document.getElementsByName('roundtrip');
            for (var i = 0, max3 = radios3.length; i < max3; i++) {
                radios3[i].onclick = function () {
                    totalDistance = 0;		//reset distances
                    lastDistance = 0;
                    var x;
          
					//Go back and recalculate the distances for already entered destinations
                    for (x = 1; x <= fields - 1; x++) {
                        if (autocompleteArr[x].getPlace() != undefined){
                            calcDistance(autocompleteArr[x - 1].getPlace().formatted_address, autocompleteArr[x].getPlace().formatted_address);
                        }
                    }
					
					//if the user select "round-trip"
                    if (document.getElementById('RETURNED').checked) {
                        var q;
                        var lastFlag = 0;
 
						//
                        for (q = fields - 1; q >= 0; q--) {
                            if (autocompleteArr[q].getPlace() != undefined && lastFlag === 0) {
                                calcDistance(autocompleteArr[fields - 1].getPlace().formatted_address, autocompleteArr[0].getPlace().formatted_address);
                                lastFlag++;
                            }
                        }
                        lastFlag = 0;
                    }
                }
            }
			//Initialization of google maps input box Autocomplete
            var service = new google.maps.places.AutocompleteService();
            service.getPlacePredictions({ input: inputArr[0].value }, callBack);
        }

		/*
		 *	Autocomplete service callback function that performs a check on
		 *	whether google maps found the inputted destination and whether
		 *	an OK status is received.
		 *  predictions - the list of destination predictions returned by google maps
		 *	status - the status of a completed search
		 */
        function callBack(predictions, status) {
            var results = document.getElementById('results');	//Display html element to contain google api results
			
            if (status != google.maps.places.PlacesServiceStatus.OK) {
                alert(status);
                return;
            }
        };
        //google.maps.event.trigger(autocompleteArr[0], 'place_changed');

		/*
		 *	Function that enables one more input field for an extra destination that the
		 *	user wants to specify.
		 */
        function addInput() {
            if (fields < 10) {		//If we haven't reached our limit
                if (fields > 1) {	//If we have already initialized the first two location input fields
					if (inputArr[fields - 1].value.length < 4 || !(autocompleteArr[fields - 1].getPlace())) {	//if the last input box has a value less then 4 or the autocomplete object assigned to that field does not  have a valid destination
                        alert("Please input a valid destination in each box before adding another destination box.");
                        return;
                    }
                }
                inputArr[fields] = document.getElementById('field' + fields);  //assign new html input element to array of input objects
                autocompleteArr[fields] = new google.maps.places.Autocomplete(inputArr[fields]);  //create a new autocomplete for this input field and put autocomplete in an array 
                if (fields >= 0) {
                    addListener();	//add listener to input field
                }

                document.getElementById('field' + fields).style.display = "block";	//display the new html input box
                fields++;		//increment input field counter
            } else {		//we have reached our destination limit
                document.getElementById('limitMessage').style.display = "block";	//display warning message
                document.form.add.disabled = true;		//disable "Add Destination" button
            }
        }

        /*
		 *	This function creates a google maps listener after an autocomplete object has been assigned to an input box.
		 *	The function contains conditional statements that describe the ongoing behavior of each listener and autocomplete.
		 */
        function addListener() {
            google.maps.event.addListener(autocompleteArr[fields], 'place_changed', function () {
                lastDistance = 0;
                if (autocompleteArr[0].getPlace() != undefined) {	//If the user enter a valid starting position
                    if (lastPlaceArr[fields - 1] != autocompleteArr[fields - 1].getPlace().formatted_address) {	 //If user changed the last destination but it was not registered with the autocomplete object
                        totalDistance = 0;		//reset all distances
                        lastDistance = 0;
                        var x;

                        for (x = 1; x <= fields - 1; x++) {  //Recalculate distance for all valid destinations
                            if (autocompleteArr[x].getPlace() != undefined) {	//if autocomplete contains a valid destintion
                                calcDistance(autocompleteArr[x - 1].getPlace().formatted_address, autocompleteArr[x].getPlace().formatted_address);	//calculate distance between current and previous destinations
                            }
                        }
						
                    } else if (inputArr[fields - 1].value.length === 0) {	//If user erases or leaves last destination input blank
                        totalDistance = 0;

                        for (x = 1; x <= fields - 1; x++) {	//Recalculate distance for all valid destinations
                            if (autocompleteArr[x].getPlace() != undefined) {
                                calcDistance(autocompleteArr[x - 1].getPlace().formatted_address, autocompleteArr[x].getPlace().formatted_address);
                            }
                        }
						
                    } else {	//calculate the distance of the last two destinations
                        calcDistance(autocompleteArr[fields - 2].getPlace().formatted_address, autocompleteArr[fields - 1].getPlace().formatted_address);
                    }
					
                    if (document.getElementById('RETURNED').checked) {		//If the user selected "Round Trip"
                        var q;
                        var lastFlag = 0;

                        for (q = fields - 1; q >= 0; q--) {		//Calculate the distance between the last destination and the first (we assume the user's last destination was the starting point)
                            if (autocompleteArr[q].getPlace() != undefined && lastFlag === 0) {
                                calcDistance(autocompleteArr[fields - 1].getPlace().formatted_address, autocompleteArr[0].getPlace().formatted_address);
                                lastFlag++;
                            }
                        }
                        lastFlag = 0;
                    }
                } else {	//The user did not enter a valid starting destination
                    alert("Don't forget to input a starting point!");	//display warning
                    google.maps.event.addListener(autocompleteArr[0], 'place_changed', function () {	//reattach a listener to the first input field to ensure a recalculation
                        calcDistance(autocompleteArr[(0)].getPlace().formatted_address, autocompleteArr[1].getPlace().formatted_address); //recalculate first segment of travel
                        if (document.getElementById('RETURNED').checked) {	//If round trip calculate distance between last and first destination
                            var q;
                            var lastFlag = 0;

                            for (q = fields - 1; q >= 0; q--) {
                                if (autocompleteArr[q].getPlace() != undefined && lastFlag === 0) {
                                    calcDistance(autocompleteArr[fields - 1].getPlace().formatted_address, autocompleteArr[0].getPlace().formatted_address);
                                    lastFlag++;
                                }
                            }
                            lastFlag = 0;
                        }
                    });
                }
            });
        }

		/*
		 *	Function that does the distance between to locations
		 *	origin - starting point for distance calculation
		 *	destination - finishing location for distance calculation
		 */
        function calcDistance(origin, destination) {
            var service = new google.maps.DistanceMatrixService();
            this.origin = origin;
            this.destination = destination;
            var unit_system = google.maps.UnitSystem.METRIC;
            var highways = false;
            var tolls = false;

            service.getDistanceMatrix(	//google query function with specified parameters
                {
                    origins: [origin],
                    destinations: [destination],
                    travelMode: google.maps.TravelMode.DRIVING,
                    unitSystem: unit_system,
                    avoidHighways: highways,
                    avoidTolls: tolls
                }, callback2);
        }

		/*
		 *	Callback function for DistanceMatrixService
		 *	response - Distance Service return value
		 *	status - status of the response
		 */
        function callback2(response, status) {
            if (status != google.maps.DistanceMatrixStatus.OK) {
                alert('Error was: ' + status);
            } else {
                if (document.getElementById('air').checked || document.getElementById('train').checked) { return; }		//don't display mileage for anything but road travel
                var result = response.rows[0].elements;
                lastDistance = convertDistance(result[0].distance.value);	//convert distance from meters to miles
                totalDistance = totalDistance + lastDistance;		//add the recently calculated distance to the total distance of travel
                
                document.getElementById('MILEAGE').value = totalDistance + " mi";	//display the new total distance

            }

			/*
			 *	Convert a distance from metric(meters) to imperial(miles)
			 *	dist - distance in meters to convert
			 */
            function convertDistance(dist) {
                var dist = dist / 1000;
                dist = dist * 0.621371192;
                dist = Math.round(dist);
                return dist;
            }
        }


        google.maps.event.addDomListener(window, 'load', initialize);

    
'use strict';

app.controller("LandingPageCtrl", function($location, $rootScope, $scope, PoopService){

	const initialLoad = () => {
		PoopService.getCurrentLatLong().then((results) => {
			let currentPos = results;
	  		// $scope.latlong = {'latitude': currentPos.coords.latitude, 'longitude': currentPos.coords.longitude};
	  		getZip(currentPos);
		}).catch((err) => {
			console.log("error in initialLoad - getCurrentLocation", err);
		});
	};

	initialLoad();

	const getZip = (position) => {
		PoopService.searchByLatLong(position).then((results) => {
			let zip = results.data.results[0].address_components[7].short_name;
			runSearch(zip);
		}).catch((err) => {
			console.log("error in getZip", err);
		});
	};

	const runSearch = (zipSearch) => {
		PoopService.searchByZip(zipSearch).then((results) => {
	    	$scope.formatedAddress = results.data.results[0].formatted_address;
	    	let address = parseAddress($scope.formatedAddress);
	    	getReps(address.city, address.state, address.zip);
	  	}).catch((err) => {
	    	console.log("error in runSearch", err);
	  	});
	};

	const parseAddress = (cityStateZip) => {
		let city  = cityStateZip.split(',')[0];
	  	let state = cityStateZip.split(',')[1].split(" ")[1];
	  	let zip   = cityStateZip.split(',')[1].split(" ")[2];
	  	return {"city": city, "state": state, "zip": zip};
	};

	const getReps = (city, state, zip) => {
	    PoopService.searchCivicReps(city, state, zip).then((results) => {
	    	$scope.divisions = results.data.divisions;
	        $scope.offices = results.data.offices;
	        $scope.officials = results.data.officials;
	        massageData();
	    }).catch((err) => {
	        console.log("error in searchCivicReps", err);
	    });
	};

	const massageData = () => {

		let positionTitleArray = [];
		$scope.offices.forEach(function(office) {
			let numOfOfficePositions = office.officialIndices.length;
			if(numOfOfficePositions === 1) {
				positionTitleArray.push(office.name); 
			}
			else if(numOfOfficePositions > 1) {
				let i = numOfOfficePositions;
				while(i) {
					positionTitleArray.push(office.name);
					i--;
				}
			}
		});

		for(let i = 0; i < $scope.officials.length; i++) {
			$scope.officials[i].officeTitle = positionTitleArray[i];

			if(!$scope.officials[i].photoUrl) {
				$scope.officials[i].photoUrl = "./images/unknown.png";
			}
		}


	};
	









});
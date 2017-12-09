'use strict';

app.controller("LandingPageCtrl", function($location, $rootScope, $scope, AuthService, PoopService){

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
			results.data.results[0].address_components.pop();
			let zip = results.data.results[0].address_components.pop();
			runSearch(zip.short_name);
		}).catch((err) => {
			console.log("error in getZip", err);
		});
	};

	const runSearch = (zipSearch) => {
		console.log("in runSearch", zipSearch);
		PoopService.searchByZip(zipSearch).then((results) => {
	    	$scope.formatedAddress = results.data.results[0].formatted_address;
	    	let address = parseAddress($scope.formatedAddress);    
	    	getReps(address.city, address.state, address.zip);
	  	}).catch((err) => {
	    	console.log("error in runSearch", err);
	  	});
	};

	const parseAddress = (cityStateZip) => {
	 	cityStateZip = cityStateZip.split(',');
	 	cityStateZip.pop();
	 	let stateZip = cityStateZip.pop();
	 	stateZip = stateZip.split(" ");
	 	let zip   = stateZip.pop();
	  	let state = stateZip.pop();
	  	let city  = cityStateZip.pop();
	  	// console.log("city, state, zip", city, state, zip);
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

		// let divisionArray = [];
		// Object.keys($scope.divisions).forEach(key => {
		//     let div = $scope.divisions[key];
		// 	if(div.officeIndices) {
		// 	    let numOfDivs = div.officeIndices.length;
		// 		if(numOfDivs === 1) {
		// 			divisionArray.push(div.name); 
		// 		}
		// 		else if(numOfDivs > 1) {
		// 			let i = numOfDivs;
		// 			while(i) {
		// 				divisionArray.push(div.name);
		// 				i--;
		// 			}
		// 		}
		// 	}
		// });

		let positionTitleArray = []; console.log($scope.offices.length); console.log($scope.officials.length);
		$scope.offices.forEach(function(office) {
			let numOfOfficePositions = office.officialIndices.length; 
			if(numOfOfficePositions === 1) {
				positionTitleArray.push(office.name); 
			}
			else if(numOfOfficePositions > 1) {
				let j = numOfOfficePositions;
				while(j) {
					positionTitleArray.push(office.name);
					j--;
					console.log("positionTitle:", office.name);
				}
			}
		});

		for(let i = 0; i < $scope.officials.length; i++) {
			$scope.officials[i].officeTitle = positionTitleArray[i];
			// $scope.officials[i].officeDiv = divisionArray[i];

			if(!$scope.officials[i].photoUrl) {
				$scope.officials[i].photoUrl = "./images/unknown.png";
			}
		}


	};
	
	$scope.saveFavorite = (official) => {
	    official.favorite = !official.favorite;
	    official.rating = 0;
	    official.uid = AuthService.getCurrentUid();
		PoopService.saveOfficial(official).then((results) => {
			console.log("saveFavorite", results.data.name);
		}).catch((err) => {
			console.log("error in saveFavorite", err);
		});
	};

	$scope.removeFavorite = (official) => {
	    official.favorite = !official.favorite;
	    PoopService.removeOfficial(official).then((results) => {
		}).catch((err) => {
			console.log("error in removeFavorite", err);
		});
};


});
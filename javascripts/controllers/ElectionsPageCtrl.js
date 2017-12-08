'use strict';

app.controller("ElectionsPageCtrl", function($location, $rootScope, $scope, PoopService){

	$scope.reset = function() {
		$scope.electionSearch = null;
	    $scope.electionForm.$setPristine();
	    $scope.electionForm.$setUntouched();
 	};

 	$scope.states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

 	// PoopService.searchCivicElections().then((results) => {
  //       $scope.blahZip = results.data;
  //     }).catch((err) => {
  //       console.log("error in searchCivicElections", err);
  //     });
	const getReps = (city, state, zip) => {
	    PoopService.searchCivicReps(city, state, zip).then((results) => {
	        $scope.blahReps = results.data;
	    }).catch((err) => {
	        console.log("error in searchCivicReps", err);
	    });
	};

	 
	const parseAddress = (cityStateZip) => {
		let city  = cityStateZip.split(',')[0];
	  	let state = cityStateZip.split(',')[1].split(" ")[1];
	  	let zip   = cityStateZip.split(',')[1].split(" ")[2];
	  	return {"city": city, "state": state, "zip": zip};
	};


	$scope.runSearch = (zipSearch) => {
		PoopService.searchByZip(zipSearch).then((results) => {
	    	let Zip = results.data;
	    	$scope.blahZip = Zip.results;
	    	console.log("in zipSearch: ",Zip.results[0].address_components);
	    	$scope.location = Zip.results[0].formatted_address;
	    	let address = parseAddress($scope.location);
	    	getReps(address.city, address.state, address.zip);
	  	}).catch((err) => {
	    	console.log("error in runSearch", err);
	  	});
	};
 	 

});
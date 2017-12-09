"use strict";

app.service("PoopService", function($http, $q, FIREBASE_CONFIG, CIVIC_CONFIG, PROPUBLICA_CONFIG, GOOGLEMAPS_CONFIG) {

	const searchPropublica = (query) => {
		return $http.get(`https://api.propublica.org/congress/v1/?api_key=${PROPUBLICA_CONFIG}`);
	};

	const searchCivicReps = (city, state, zipCode) => { 
		return $http.get(`https://www.googleapis.com/civicinfo/v2/representatives?key=${CIVIC_CONFIG}&address=${city}%20${state}%20${zipCode}`);
	};

	const searchCivicElections = () => { 
		return $http.get(`https://www.googleapis.com/civicinfo/v2/elections?key=${CIVIC_CONFIG}`);
	};

	const searchByZip = (searchZip) => { // returns city, state, & zip code
		return $http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${searchZip}&key=${GOOGLEMAPS_CONFIG}`);
	};

	const searchByLatLong = (position) => { // retuns data on locality, address, & political area 
		return $http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${GOOGLEMAPS_CONFIG}`);
	};

	const getCurrentLatLong = () => { // returns latitude & longitude
		let currentPos;
    	return $q((resolve, reject) => {
			let geoSuccess = function(position) {
				currentPos = position;
        		resolve(position);
			};
			navigator.geolocation.getCurrentPosition(geoSuccess);
		});
	};

	const saveOfficial = (newOfficial) => {
		if(newOfficial.$$hashKey) {
			delete newOfficial.$$hashKey;
		}
		console.log("in PoopService.saveOfficial: ", newOfficial);
		return $http.post(`${FIREBASE_CONFIG.databaseURL}/myOfficials.json`, JSON.stringify(newOfficial));
		// let key = `${FIREBASE_CONFIG.databaseURL}`.child("posts").push().getKey();
		// console.log('key', key);
		// $http.post(`${FIREBASE_CONFIG.databaseURL}/myOfficials.json`, JSON.stringify(newOfficial));

	};

	const removeOfficial = (oldOfficial) => { // firebase returns null when delete is successfull
		// console.log("in deleteContact, contactId", contactId);
		// return $http.delete(`${FIREBASE_CONFIG.databaseURL}/contacts/${contactId}.json`);
	};




// var req = {
//  method: 'POST',
//  url: 'http://example.com',
//  headers: {
//    'X-API-Key': `${PROPUBLICA_CONFIG}`
//  },
//  data: { test: 'test' }
// }

// $http(req).then(function(){...}, function(){...});





	return { searchPropublica, searchCivicReps, searchCivicElections, searchByZip, searchByLatLong, getCurrentLatLong, saveOfficial, removeOfficial };
});


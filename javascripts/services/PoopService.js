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
		return $http.post(`${FIREBASE_CONFIG.databaseURL}/myOfficials.json`, JSON.stringify(newOfficial));
	};

	const removeOfficial = (officialId) => {
		return $http.delete(`${FIREBASE_CONFIG.databaseURL}/myOfficials/${officialId}.json`);
	};

	const getOfficials = (userUid) => {
	    let officials = [];
	    return $q((resolve, reject) => {
	    	$http.get(`${FIREBASE_CONFIG.databaseURL}/myOfficials.json?orderBy="uid"&equalTo="${userUid}"`).then((results) => {
	            let myOfficials = results.data;
	            Object.keys(myOfficials).forEach((key) => {
	                myOfficials[key].id = key; 
	                officials.push(myOfficials[key]);
	            });
	            resolve(officials);
	    	}).catch((err) => {
	    		reject(err);
	    	});
	    });
	};

	const updateRating = (existingOfficial) => {
		let officialId = existingOfficial.id;
		delete existingOfficial.id;
		delete existingOfficial.$$hashKey;
		return $http.put(`${FIREBASE_CONFIG.databaseURL}/myOfficials/${officialId}.json`, JSON.stringify(existingOfficial));
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





	return { searchPropublica, searchCivicReps, searchCivicElections, searchByZip, searchByLatLong, getCurrentLatLong, saveOfficial, removeOfficial, getOfficials, updateRating };
});


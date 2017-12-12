'use strict';

app.controller("FavoritesPageCtrl", function($location, $rootScope, $scope, AuthService, PoopService){

	const getMyOfficials = () => {
		PoopService.getOfficials(AuthService.getCurrentUid()).then((results) => {
			$scope.officials = results;
		}).catch((err) => {
			console.log("error in getMyOfficials", err);
		});
	};

	getMyOfficials();

	$scope.removeMyFavorite = (official) => {
		PoopService.removeOfficial(official.id).then((results) => {
			getMyOfficials();
		}).catch((err) => {
			console.log("error in removeMyFavorite", err);
		});

	};

	$scope.changeRating = (official) => {
 		PoopService.updateRating(official).then(() => {
 			getMyOfficials();
		}).catch((err) => {
			console.log("error in updateContact", err);
		});
 	};

	$scope.thisBtn = function($event) {
		($event.currentTarget).className += " button-selected";
		$scope.thatBtn = true;
	};

	$scope.changeRating = function(official, num) {
		official.rating = num;
		PoopService.updateRating(official).then(() => {
 			getMyOfficials();
		}).catch((err) => {
			console.log("error in updateContact", err);
		});
	};

});
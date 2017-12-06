'use strict';

app.controller("ElectionsPageCtrl", function($location, $rootScope, $scope, PoopService){

	$scope.reset = function() {
		$scope.electionSearch = null;
	    $scope.electionForm.$setPristine();
	    $scope.electionForm.$setUntouched();
 	};








});
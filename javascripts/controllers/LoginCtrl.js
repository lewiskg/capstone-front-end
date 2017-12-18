'use strict';

app.controller("LoginCtrl", function($location, $rootScope, $scope, AuthService){
	$scope.authenticate = () => {
		AuthService.authenticateGoogle().then((result) => {
			$rootScope.navbar = true;

			$scope.$apply(() => {
				$location.path("/poop/landing");

			});
		}).catch((err) => {
			console.log("error", err);

		});
	};
});
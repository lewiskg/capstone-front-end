'use strict';

app.controller("LoginCtrl", function($location, $rootScope, $scope, AuthService){
	$scope.authenticate = () => {
		AuthService.authenticateGoogle().then((result) => {
			// $rootScope.uid = result.user.uid;
			$rootScope.navbar = true;

			$scope.$apply(() => {
				// $location.url("/poop/landing");
				$location.path("/poop/landing");

			});
		}).catch((err) => {
			console.log("error", err);

		});
	};
});
"use strict";

let isAuth = (AuthService) => new Promise ((resolve, reject) => {
	if(AuthService.isAuthenticated()){
		resolve();  // sends true back
	} else {
		reject();  // sends false back
	}
});

app.run(function($location, $rootScope, FIREBASE_CONFIG, AuthService){
	firebase.initializeApp(FIREBASE_CONFIG);


	//watch method that fires on change of a route.  3 inputs. 
  	//event is a change event
  	//currRoute is information about your current route
  	//prevRoute is information about the route you came from
  	$rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute) { // every time route changes this fires
    	// checks to see if there is a cookie with a uid for this app in localstorage
    	var logged = AuthService.isAuthenticated();
    	var appTo;

    	// to keep error from being thrown on page refresh
    	if (currRoute.originalPath) {
      		// check if the user is going to the login page = currRoute.originalPath
      		// if user is on login page then appTo is true
      		// if it finds something other than /login it return a -1 and -1!==-1 so resolves to false
      		// currRoute.originalPath ='/search' -1 != -1 appTo= false 
      		// currRoute.originalPath ='/search' 0 != -1 appTo= true
      		appTo = currRoute.originalPath.indexOf('/login') !== -1;
      	}  
    	//if not on /login page AND not logged in redirect to /login
		if (!appTo && !logged) {
		     //if not on /auth page AND not logged in redirect to /auth     
		       event.preventDefault();
		       $rootScope.navbar = false;
		       $location.path('/login');
		    } else if (appTo && !logged){
		       //if on /login page AND not logged in, no redirect only authentiate in navbar
		       $rootScope.navbar = false;
		    } else if (appTo && logged){
		       //if on /login page AND logged in, redirect to search page
		       $rootScope.navbar = true;
		       $location.path('/poop/landing');
		    } else if (!appTo && logged){
		       //if not on /login page AND logged in see other navbar
		       $rootScope.navbar = true;
		    }
  	});
});

app.config(function($routeProvider){
	$routeProvider
		.when("/login", {
			templateUrl: 'partials/login.html',  
			controller: 'LoginCtrl' 
		})
		.when("/poop/landing", {
			templateUrl: 'partials/landingPage.html',  
			controller: 'LandingPageCtrl',
			resolve:  {isAuth} // part of ngRouter
		})
		.when("/poop/favorites", {
			templateUrl: 'partials/favorites.html',  
			controller: 'FavoritesPageCtrl',
			resolve:  {isAuth} // part of ngRouter
		})
	    .when("/poop/votingHistory", {
	      	templateUrl: 'partials/votingHistory.html',
	      	controller: 'VotingHistoryPageCtrl',
	      	resolve: {isAuth}
	    })
		.otherwise("/login"); 

});
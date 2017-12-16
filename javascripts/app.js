"use strict";

/* globals app: true */

const app = angular.module("PoopApp", ["ngAnimate", "ngRoute", "ngSanitize",  'ui.bootstrap']);

app.directive('focus',
	function($timeout) {
	 return {
	 scope : {
	   trigger : '@focus'
	 },
	 link : function(scope, element) {
	  scope.$watch('trigger', function(value) {
	    if (value === "true") {
	      $timeout(function() {
	       element[0].focus();
	      });
	   }
	 });
	 }
	};
}); 
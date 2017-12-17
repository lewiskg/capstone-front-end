'use strict';

app.controller("VotingHistoryPageCtrl", function($location, $rootScope, $scope, $window, AuthService, PoopService){

	const getRepsForState = (state) => {
		$scope.data = {};
		$scope.memberArray = [];

		PoopService.getMemberOfCongressProPublicaId('senate', state).then((results) => {
			$scope.data.senate = results.data.results;
			putIdOnMember($scope.data.senate);
		}).catch((err) => {
			console.log("error in doThis", err);
		});

		PoopService.getMemberOfCongressProPublicaId('house', state).then((results) => {
			$scope.data.house = results.data.results;
			putIdOnMember($scope.data.house);
		}).catch((err) => {
			console.log("error in doThis", err);
		});

	};

	$scope.doThat = (state) => {
		$scope.stateSelectedFlag = true;
		$scope.voteDataFlag = false;
		getRepsForState(state);
		$scope.sTate = state;
	};
	
	const putIdOnMember = (ids) => {
		ids.forEach((member) => {
			let tempObj = {};
			tempObj.id = member.id;
			tempObj.lastName = member.last_name;
			$scope.memberArray.push(tempObj);
		});
	};

	$scope.getVotingHistory = (member) => { console.log("in getVotingHistory", member.name, member.id);
		$scope.voteDataFlag = true;
		$scope.congressRep = member.name;
		PoopService.getMemberOfCongressVotingHistory(member.id).then((results) => {
			 let temp = results.data;
			 if(!temp.results[0].votes) {
			 	$scope.voteArray = "No recorded votes for this member in the ProPublica Database.";
			 } else {
			 	$scope.voteArray = temp.results[0].votes;
			 }
		}).catch((err) => {
			console.log("error in getVotingHistory", err);
		});
	};

	$scope.billDetails = (billUri, index) => { console.log("in billDetails,", index, billUri);
		PoopService.getBillDetails(billUri).then((results) => {
			let additionalBillDetails = results.data;
			$scope.bills = [];
			$scope.repVotes = [];
			
			additionalBillDetails = additionalBillDetails.results.votes;
			$scope.bills[index] = additionalBillDetails;
			$scope.repsPositions = additionalBillDetails.vote.positions;

			additionalBillDetails.vote.total.name = "total";
			additionalBillDetails.vote.independent.name = "independent";
			additionalBillDetails.vote.democratic.name = "democrat";
			additionalBillDetails.vote.republican.name = "republican";

			$scope.repVotes.push(additionalBillDetails.vote.total);
			$scope.repVotes.push(additionalBillDetails.vote.independent);
			$scope.repVotes.push(additionalBillDetails.vote.democratic);
			$scope.repVotes.push(additionalBillDetails.vote.republican);

		}).catch((err) => {
			console.log("error in getVotingHistory", err);
		});
	};


// Accordian ui-bootstrap angular variables
	$scope.moreDetails = 0;

	$scope.oneAtATime = true;

  	$scope.status = {
	    isCustomHeaderOpen: false,
	    isFirstOpen: true,
	    isFirstDisabled: false
	};

 	$scope.states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

		$scope.stateSelectedFlag = false;
		$scope.voteDataFlag = false;


});


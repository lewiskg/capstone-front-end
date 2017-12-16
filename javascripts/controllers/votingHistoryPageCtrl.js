'use strict';

app.controller("VotingHistoryPageCtrl", function($location, $rootScope, $scope, $window, AuthService, PoopService){

	const doThis = (chamber, state) => {

		PoopService.getMemberOfCongressProPublicaId(chamber, state).then((results) => {
			$scope.data = results.data.results;
			putIdOnMember($scope.data);
		}).catch((err) => {
			console.log("error in doThis", err);
		});
	};

	doThis('senate', 'TN');

	const putIdOnMember = (ids) => {
		$scope.memberArray = [];
		ids.forEach((member) => {
			let tempObj = {};
			tempObj.id = member.id;
			tempObj.lastName = member.last_name;
			$scope.memberArray.push(tempObj);
		});
		getVotingHistory($scope.memberArray[0].id);

	};

	const getVotingHistory = (memberId) => {
		PoopService.getMemberOfCongressVotingHistory(memberId).then((results) => {
			 let temp = results.data;
			 $scope.voteArray = temp.results[0].votes;
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

});

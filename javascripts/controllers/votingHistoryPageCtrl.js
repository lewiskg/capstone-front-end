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
			console.log($scope.memberArray);
		});
		getVotingHistory($scope.memberArray[0].id);

	};

	const getVotingHistory = (memberId) => {
		PoopService.getMemberOfCongressVotingHistory(memberId).then((results) => {
			 let temp = results.data;
			 $scope.voteArray = temp.results[0].votes;
			console.log($scope.voteArray);
		}).catch((err) => {
			console.log("error in getVotingHistory", err);
		});
	};

	$scope.bills = [];
	$scope.moreDetails = 0;

	$scope.billDetails = (billUri, index) => { console.log("in billDetails,", index, billUri);
		PoopService.getBillDetails(billUri).then((results) => {
			 $scope.bills[index] = results.data;
			 // $scope.tempBill = results.data;
			 // $scope.voteArray = temp.results[0].votes;
			// console.log($scope.tempBill);
		}).catch((err) => {
			console.log("error in getVotingHistory", err);
		});
	};


// Accordian ui-bootstrap angular stuff

  $scope.oneAtATime = true;

  $scope.groups = [
    {
      title: 'Dynamic Group Header - 1',
      content: 'Dynamic Group Body - 1'
    },
    {
      title: 'Dynamic Group Header - 2',
      content: 'Dynamic Group Body - 2'
    }
  ];

  $scope.status = {
    isCustomHeaderOpen: false,
    isFirstOpen: true,
    isFirstDisabled: false
  };

$scope.selected = {value: 0};



});


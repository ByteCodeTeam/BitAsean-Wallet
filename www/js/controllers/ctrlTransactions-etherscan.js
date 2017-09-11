angular.module('leth.controllers')
  .controller('TransactionsEtherscanCtrl', function ($scope, $stateParams, $ionicPopup, $ionicListDelegate, Transactions) {
     
	window.open('https://etherscan.io/address-tokenpage?a='+$scope.qrcodeString,'_blank'); 

  })
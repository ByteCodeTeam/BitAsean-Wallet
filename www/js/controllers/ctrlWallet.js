angular.module('leth.controllers')
  .controller('WalletCtrl', function ($scope, $rootScope, $stateParams, $ionicLoading, $ionicModal, $state, 
                                      $ionicPopup, $cordovaBarcodeScanner, $ionicActionSheet, 
                                      $timeout, ENSService, AppService, Transactions,ExchangeService, Chat,$ionicPlatform,$cordovaSplashscreen) {
 
	
    var TrueException = {};
    var FalseException = {};
	var activeCoins;
	
    $scope.minGasPrice = 1;
	$scope.maxGasPrice = 60;
	$scope.stepGasPrice = 1;
	
	$scope.minGasLimit = 55000;
	$scope.maxGasLimit = 200000;
	$scope.stepGasLimit = 1000;

	$scope.gasPrice = 21;   
	$scope.gasLimit = 55000;     
	
	$scope.account = AppService.account();

	$scope.addBitAseanToken = function(){ 
		  
		var length = 0;
		if($scope.listCoins != undefined){
			length = $scope.listCoins.length+1;
		} 
		
		var customToken = {
		  "Name" : 'BitAsean',
		  "GUID" : "C" + length,
		  "Network" : 'Mainet', 
		  "Company" : 'BitAsean',
		  "Logo" : 'img/logo.png',
		  "Symbol" : 'BAS',
		  "Decimals" : 8,
		  "Abstract" : 'BitAsean',
		  "Address" : '0x2A05d22DB079BC40C2f77a1d1fF703a56E631cc1',
		  "ABI" : [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"mintedAmount","type":"uint256"}],"name":"mintToken","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"frozenAccount","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"freeze","type":"bool"}],"name":"freezeAccount","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"decimalUnits","type":"uint8"},{"name":"tokenSymbol","type":"string"}],"payable":false,"type":"constructor"},{"payable":false,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"target","type":"address"},{"indexed":false,"name":"frozen","type":"bool"}],"name":"FrozenFunds","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}],
		  "Send" : "transfer",
		  "Events" : [{"Transfer":"address indexed from, address indexed to, uint256 value"}],
		  "Units":[{"multiplier": "1", "unitName": "BAS"}],
		  "Custom" : true,
		  "Installed" : true
		}
		if($scope.listCoins == undefined){
			$scope.listCoins = [];
		}
		$scope.listCoins.push(customToken);
		localStorage.Coins = JSON.stringify($scope.listCoins); 

    }
 
    if(localStorage.Coins === undefined ||localStorage.Coins === null ){
		$scope.addBitAseanToken();
	}
	if( $scope.listCoins == undefined ){
		$scope.listCoins = JSON.parse(localStorage.Coins);
	} 

	if(activeCoins === undefined || activeCoins === null){
		activeCoins = $scope.listCoins;
	} 
 
    var setCoin = function(index){
      if(index==0){
        $scope.idCoin = 0;
        $scope.logoCoin = "img/ethereum-icon.png";
        $scope.descCoin = "Ethereum";
        if($scope.nameNetwork=="Main-ETC"){
          $scope.symbolCoin = "ΞC";
          $scope.xCoin = "XETC";                  
        }else{
          $scope.symbolCoin = "Ξ";
          $scope.xCoin = "XETH";                  
        }
        $scope.decimals = "9";
        $scope.listUnit = [
    			{multiplier: "1.0e18", unitName: "Ether"},
    			{multiplier: "1.0e9", unitName: "Gwei"}
				//,{multiplier: "1.0e12",unitName: "szabo"}
    		];
        $scope.unit = $scope.listUnit[0].multiplier;
        $scope.balance = AppService.balance($scope.unit);
        //if($scope.addrTo!=undefined)
        //  $scope.balAddrTo = parseFloat(web3.eth.getBalance($scope.addrTo))/$scope.unit;
        $scope.symbolFee = $scope.symbolCoin;   
	  }else { 
    	  
		if(activeCoins[index-1].Symbol === 'BAS'){
			$scope.logoCoin = 'img/logo.png'; 
		}else{
			$scope.logoCoin = activeCoins[index-1].Logo;
		} 
		$scope.idCoin = index; 
        $scope.descCoin = activeCoins[index-1].Abstract;
        $scope.symbolCoin = activeCoins[index-1].Symbol;
        $scope.decimals = activeCoins[index-1].Decimals;
        $scope.xCoin = activeCoins[index-1].Exchange;          
        $scope.methodSend = activeCoins[index-1].Send;
        $scope.contractCoin = web3.eth.contract(activeCoins[index-1].ABI).at(activeCoins[index-1].Address);
    	$scope.listUnit = activeCoins[index-1].Units;
        $scope.unit = $scope.listUnit[0].multiplier;
        $scope.balance = AppService.balanceOf($scope.contractCoin,$scope.unit + 'e+' + $scope.decimals);
        //if($scope.addrTo!=undefined)
        //  $scope.balAddrTo = AppService.balanceOfUser($scope.contractCoin,$scope.unit + 'e+' + $scope.decimals,$scope.addrTo);

      }
      
      //updateExchange();
    } 

	//set BAS for default
	if($scope.idCoin === undefined || $scope.idCoin === null){
		setCoin(1); 
	} 
	
	
	$scope.refreshBalance = function(){ 
	
		if($scope.idCoin == 0 || $scope.idCoin === undefined)  //buggy from wallet refresh  
			$scope.balance = AppService.balance($scope.unit);
		else
			$scope.balance = AppService.balanceOf($scope.contractCoin,$scope.unit + 'e+' + $scope.decimals); 
		
		$scope.$broadcast('scroll.refreshComplete');
		
	}
	  
    var updateExchange = function(){
      if($scope.xCoin){
        ExchangeService.getTicker($scope.xCoin, JSON.parse(localStorage.BaseCurrency).value).then(function(value){
          $scope.balanceExc = JSON.parse(localStorage.BaseCurrency).symbol + " " + parseFloat((value * $scope.balance).toFixed(2)) ;
        });
      }else{
        $scope.balanceExc = JSON.parse(localStorage.BaseCurrency).symbol + " " + parseFloat((0).toFixed(2)) ;
      }
    };

    $scope.$on('$ionicView.enter', function() {
	 
	  
    })

  
    $scope.fromAddressBook = false;

	$scope.scanPay = function () {
		
		$ionicPlatform.ready(function () {
		  if($rootScope.deviceready){
			  $cordovaBarcodeScanner
			  .scan()
			  .then(function (barcodeData) {
				if(barcodeData.text!= ""){ 
					
					var addresses = barcodeData.text.split('#');
					var coins = barcodeData.text.split('@').length>1 ? $barcodeData.text.split('@')[1] : "";
					var addr = addresses[0];
					var idkey = addresses.length > 1 ? addresses[1].split('@')[0] : "";
					//$scope.payTo = {};  
					$scope.payTo.addrTo = addr; 
					//$scope.addrTo = addr;
					$scope.addrKey = idkey;
					$scope.amountTo = parseFloat(coins);
		  
				}
			  }, function (error) {
				// An error occurred
				console.log('Error!' + error);
			  });
		  }
		});        
	};
	
    if($stateParams.addr){
      //xxxx#yyy@123
      var addresses = $stateParams.addr.split('#');
      var coins = $stateParams.addr.split('@').length>1 ? $stateParams.addr.split('@')[1] : "";
      var addr = addresses[0];
      var idkey = addresses.length > 1 ? addresses[1].split('@')[0] : "";
	  $scope.payTo = {};
      $scope.payTo.addrTo = addr;
      $scope.addrKey = idkey;
      $scope.amountTo = parseFloat(coins);
      $scope.fromAddressBook = true;
	  
      /*if($scope.idCoin==0 || $scope.idCoin==undefined)
        $scope.balAddrTo = parseFloat(web3.eth.getBalance($scope.addrTo))/$scope.unit;
      else
        $scope.balAddrTo = AppService.balanceOfUser($scope.contractCoin,$scope.unit,$scope.addrTo);*/
	
    }else { 
      $scope.fromAddressBook = false;
    }

    $scope.scrollRefresh = function(){
      refresh();
    }

    $scope.sendCoins = function (addr, amount, unit, idCoin) {
      if(addr.split('.')[1]==ENSService.suffix){
        addr = ENSService.getAddress(addr);
      } 

      var value = parseFloat(amount) * unit;
      if( $scope.idCoin!=0){
        //AppService.transferCoin($scope.contractCoin, $scope.methodSend, $scope.account, addr, value).then( 
		AppService.transferCoinGasPrice($scope.contractCoin, $scope.methodSend, $scope.account, addr, value,$scope.gasPrice,$scope.gasLimit).then(
          function (result) {
			$ionicLoading.hide();
            if (result[0] != undefined) {
              var errorPopup = $ionicPopup.alert({
                title: 'Error',
                template: result[0]
              });
              errorPopup.then(function (res) {
                
                console.log(res);
              });
            } else {
              var successPopup = $ionicPopup.alert({
                title: 'Transaction sent',
                template: result[1]
              });
              successPopup.then(function (res) { 
                //$state.go('tab.transall');
              });
              //save transaction
              var newT = {from: $scope.account, to: addr, id: result[1], value: value, unit: unit, symbol: $scope.symbolCoin, time: new Date().getTime()};
              $scope.transactions = Transactions.add(newT);
              Chat.sendTransactionNote(newT);              
              refresh();
            }
          },
          function (err) {
            var alertPopup = $ionicPopup.alert({
              title: 'Error',
              template: err

            });
            alertPopup.then(function (res) {
              $ionicLoading.hide();
              console.log(err);
            });
        });

      }
      else{
        AppService.transferEth($scope.account, addr, value, $scope.fee).then(
          function (result) {
            //$ionicLoading.show({template: 'Sending...'});
			$ionicLoading.show({
			  duration: 3000,
			  noBackdrop: true,
			  template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner>'
			});
	
            if (result[0] != undefined) {
              var errorPopup = $ionicPopup.alert({
                title: 'Error',
                template: result[0]
              });
              errorPopup.then(function (res) {
                $ionicLoading.hide();
                console.log(res);
              });
            } else {
              var successPopup = $ionicPopup.alert({
                title: 'Transaction sent',
                template: result[1]
              });
              successPopup.then(function (res) {
                $ionicLoading.hide();
                
                $state.go('tab.transall');
              });
              //save transaction
              var newT = {from: $scope.account, to: addr, id: result[1], value: value, unit: unit, symbol: $scope.symbolCoin, time: new Date().getTime()};
              $scope.transactions = Transactions.add(newT);
              Chat.sendTransactionNote(newT);              
              refresh();
            }
          },
          function (err) {
            var alertPopup = $ionicPopup.alert({
              title: 'Error',
              template: err

            });
            alertPopup.then(function (res) {
              $ionicLoading.hide();
              console.log(err);
            });
        });
      }
    };

    $scope.setFee = function(){ 
      var unit = 1.0e9; 
      $scope.fee = ($scope.gasPrice*$scope.gasLimit)/unit;
    }
	
	$scope.setFee();
	
	$scope.setGasPrice = function(val){
      $scope.gasPrice = val;  
	  $scope.setFee();
    }
	
	$scope.setGasLimit = function(val){
      $scope.gasLimit = val;  
	  $scope.setFee();
    }
	 

    $scope.unitChanged = function(u){
      var unt = $scope.listUnit.filter(function (val) {
        if(val.multiplier === u)
          return val;
      });
      $scope.balance = AppService.balance(unt[0].multiplier);
      $scope.symbolCoin = unt[0].unitName;
      $scope.unit = unt[0].multiplier; 
   
    }

    $scope.confirmSend = function (addr, amount,unit) {
	  ENSService.init('Mainet');
      var addrEns="";
      if(addr.split('.')[1]==ENSService.suffix){
        addrEns = ENSService.getAddress(addr);
      }
      var receiver = addr + " " + addrEns;
      var total = parseFloat(amount);
      var unit = $scope.unit;  
      /*if($scope.idCoin==0){
        var valueFee = parseFloat($scope.fee / unit);
        total = parseFloat(amount + valueFee) ;
      }*/

      var confirmPopup = $ionicPopup.confirm({
        title: 'Confirm payment',
        template: 'Send ' + total + " " + document.querySelector('#valuta option:checked').text + " to " + receiver + " ?"
      });
      confirmPopup.then(function (res) {
        if (res) {
          $scope.sendCoins(addr, amount,unit);
        } else {
          $ionicLoading.hide();
          //console.log('send coins aborted');
        }
      });
    };
    
    $scope.checkAddress = function (address) {
      try {
        angular.forEach(this.friends, function(value, key) {
          if(value.addr != address){
            throw TrueException;
          }else {
            throw FalseException;
          }
        })
      }catch (e){
        if(e === TrueException){
          $scope.toAdd = true;
        }else if(e===FalseException) {
          $scope.toAdd = false;
        }
      }
    }

    $scope.clearAddrTo = function(){
      $scope.fromAddressBook = false;
    }

    $scope.chooseCoin = function(){  
	
      var buttonsGroup = [{text: '<span style="text-align:left"><img width="30px" heigth="30px" src="img/ethereum-icon.png" style="vertical-align: middle !important;"/> Ethereum [ETH]</span>'}];

	  for (var i = 0; i < activeCoins.length; i++) {
		var coinLogo;  
		if(activeCoins[i].Symbol === 'BAS'){
			coinLogo = 'img/logo.png'; 
		}else{
			coinLogo = activeCoins[i].Logo;
		}
		
        var text = {text: '<img width="30px" heigth="30px" src="' + coinLogo + '" style="vertical-align: middle !important;"/> ' + activeCoins[i].Name + ' [' + activeCoins[i].Symbol + ']'};
        buttonsGroup.push(text);
      }

      var hideSheet = $ionicActionSheet.show({
        buttons: buttonsGroup,
        destructiveText: (ionic.Platform.isAndroid()?'<i class="icon ion-android-exit assertive"></i> ':'')+'Cancel',
        titleText: 'Choose coins to pay with',
        destructiveButtonClicked:  function() {
          hideSheet();
        },
        buttonClicked: function(index) { 
          setCoin(index);
          hideSheet();
          $timeout(function() {
           hideSheet();
          }, 20000);
        }
      })
    };

    $scope.listTransaction = function(){
		
		if($scope.idCoin != 0){
			var ref = cordova.InAppBrowser.open('https://etherscan.io/address-tokenpage?a='+$scope.account, '_blank');
		}else{
			var ref = cordova.InAppBrowser.open('https://etherscan.io/address/'+$scope.account, '_blank'); 
		} 
			
		/*ref.addEventListener('loadstop', function() {  
			ref.insertCSS({
            "code": ".table-responsive { height: 100%;}"   
			}); 
		}) */ 
		   
    }
	
	$rootScope.hideTabs = ''; //patch
	if($scope.idCoin==0 || $scope.idCoin==undefined)    
		$scope.balance = AppService.balance($scope.unit);
	else
		$scope.balance = AppService.balanceOf($scope.contractCoin,$scope.unit + 'e+' + $scope.decimals);
 
   

  })
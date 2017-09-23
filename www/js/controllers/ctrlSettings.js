angular.module('leth.controllers')
.controller('SettingsCtrl', function ($scope, $interval, $ionicModal, $ionicLoading, $ionicPopup, $timeout,$cordovaEmailComposer, $ionicActionSheet, $cordovaFile, $http, 
                                      Geolocation, AppService, ExchangeService, Chat, PasswordPopup, $cordovaClipboard) {    
  $scope.editableHost = false;
  $scope.addrHost = localStorage.NodeHost;
  $scope.hostsList= JSON.parse(localStorage.HostsList);
	$scope.indexHost = $scope.hostsList.indexOf($scope.addrHost);
  $scope.pin = { checked: (localStorage.PinOn=="true") };
  $scope.touch = { checked: (localStorage.TouchOn=="true") };
  $scope.geo = { checked: (localStorage.GeoOn=="true") };
  $scope.backmode = { checked: (localStorage.BackMode=="true") };
  $scope.vibration = { checked: (localStorage.Vibration=="true") };
  $scope.nfc = { checked: (localStorage.NfcOn=="true") };
  $scope.baseCurrency = JSON.parse(localStorage.BaseCurrency);

  $scope.setIndexHost = function(index){    
    localStorage.NodeHost = $scope.hostsList[index];
    AppService.setWeb3Provider(global_keystore);
    $scope.addrHost = localStorage.NodeHost;
  }

  $scope.plusIndexHost = function(){    
    $scope.setIndexHost( $scope.hostsList.indexOf($scope.addrHost) + 1);    
  }

  $scope.minIndexHost = function(){    
    $scope.setIndexHost( $scope.hostsList.indexOf($scope.addrHost) - 1);        
  }

  var seedModal;
  var createSeedModal = function () {
    $ionicModal.fromTemplateUrl('templates/seed.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      seedModal = modal;
      seedModal.show();
    });
  };

  $scope.closeSeedModal = function () {
    seedModal.hide();
  };

  var setPin = function(value){
    localStorage.PinOn = value? "true":"false";
    $scope.pin = { checked: value};
  };

  var setTouchID = function(value){
    localStorage.TouchOn = value? "true":"false";
    $scope.touch = { checked: value};
  };

  var setNFC = function(value){
    localStorage.NfcOn = value? "true":"false";
    $scope.nfc = { checked: value};
  };

  var setGeo = function(value){
    localStorage.GeoOn = value? "true":"false";
    $scope.geo = { checked: value};
    if(value){   
      document.addEventListener("deviceready", function () {
        Geolocation
          .getCurrentPosition()
            .then(function (position) {
              console.log(position);
              $scope.lat  = position.coords.latitude;
              $scope.long = position.coords.longitude;
            }, function (err) {
                // error
            });

          $timeout(function() {
            $scope.watchLocation();
          }, 10000);
        });
      }
    else if($scope.geoWatch!=undefined){
      $scope.geoWatch.clearWatch();        
    }
  };

  var setVibration = function(value){
    localStorage.Vibration = value? "true":"false";
    $scope.vibration = { checked: value};
  };

  $scope.$watch('vibration.checked',function(value) {
    setVibration(value);
  });

  var setBackMode = function(value){
    localStorage.BackMode = value? "true":"false";
    $scope.backmode = { checked: value};
  };

  $scope.$watch('backmode.checked',function(value) {
    setBackMode(value);
  });

  $scope.$watch('geo.checked',function(value) {
    setGeo(value);
  });

	$scope.$watch('pin.checked',function(value) {
		setPin(value);
	});

  $scope.$watch('nfc.checked',function(value) {
    setNFC(value);
  });

  $scope.$watch('touch.checked',function(value) {
    setTouchID(value);
    if(value)
      setPin(value);
  });

  $scope.isIOS = function(){
    return ionic.Platform.isIOS();
  };

  $scope.enableEditHost = function(value){
    $scope.editableHost = value;
  };

  $scope.showEditHost = function(){
    return $scope.editableHost;
  };

  $scope.setCurrency = function(currency){
    localStorage.BaseCurrency =  currency; 
    $scope.baseCurrency = localStorage.BaseCurrency;
  };

  $scope.editHost = function (addr) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Set Provider Host',
      template: 'Are you sure you want to modify the provider host? '
    });
    confirmPopup.then(function (res) {
      if (res) {
        localStorage.NodeHost = addr;
        AppService.setWeb3Provider(global_keystore);
        $scope.addrHost = localStorage.NodeHost;
  		  if(!$scope.hostsList.includes(addr)) {
  			  $scope.hostsList.push(addr);
  			  localStorage.HostsList=JSON.stringify($scope.hostsList);
  		  }
        $scope.editableHost = false;  
        setChatFilter();    
        refresh();
        console.log('provider host update to: ' + addr);
      } else {
        console.log('provider host not modified');
      }
    });
  };

  $scope.deleteHost = function (addr) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Delete Provider Host',
      template: 'Are you sure you want to delete the provider host? '
    });
    confirmPopup.then(function (res) {
      if (res) 
      {
  		  if($scope.hostsList.includes(addr) && $scope.hostsList.length>1 ) {
          var iHost = $scope.hostsList.indexOf(addr);
  			  $scope.hostsList.splice(iHost,1);
  			  localStorage.HostsList=JSON.stringify($scope.hostsList);
  			  localStorage.NodeHost=$scope.hostsList[iHost];
  			  AppService.setWeb3Provider(global_keystore);
          $scope.addrHost = localStorage.NodeHost;            
          $scope.editableHost = false;          
  			  refresh();
  				console.log('provider <' + addr + '> deleted');
  		  }
  		  else if ($scope.hostsList.length==1){
  			  var confirmPopup = $ionicPopup.alert({
  				title: 'Operation Denied',
  				template: 'It\'s not possible to remove your unique provider. '
    			});
          console.log('unique provider host could not be deleted');
  		  }
      } else {
        console.log('provider host not deleted');
      }
    });
  };

  var confirmImport = function (val) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Restore a backuped wallet',
      template: 'Are you sure you want to restore a wallet from backup and overwrite the current? '
    });
    confirmPopup.then(function (res) {
      if (res) {
        switch(val){
          case 0:
              //console.log('importing wallet from seed');
              createSeedModal();
              break;
          case 1:
              //console.log('importing wallet from Storage');
              importStorageWallet();
              break;
        }

        console.log('importing wallet from backup');
        refresh();
      } else {
        console.log('do not import wallet');
      }
    });
  };

  $scope.chooseImportWallet = function () {
	  var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'From Seed' }
        /*{ text: 'From Storage'}*/
      ],
      destructiveText: (ionic.Platform.isAndroid()?'<i class="icon ion-android-exit assertive"></i> ':'')+'Cancel',
      titleText: 'Choose a wallet to import from?',
      destructiveButtonClicked:  function() {
        hideSheet();
      },
      buttonClicked: function(index) {
        confirmImport(index);
        hideSheet();
       $timeout(function() {
         hideSheet();
        }, 20000);
      }
    })
  };

  $scope.importSeedWallet = function (form) {
    seedModal.remove();
    //console.log(form);
    $scope.createWallet(form.seed,form.password,form.code);

    var alertPopup = $ionicPopup.alert({
       title: 'Restore Wallet',
       template: 'Wallet restored successfully!'
     });

    alertPopup.then(function(res) {
      //console.log('wallet restored from seed');
      refresh();
    });
  };

  var importStorageWallet = function(){
    //show all value fileList[]
    var keystoreFilename = "leth_keystore.json";
    document.addEventListener("deviceready", function () {
      $cordovaFile.readAsText(cordova.file.dataDirectory, keystoreFilename)
        .then(function (success) {
          // success
          console.log('read successfully');
          var ls = JSON.parse(success);
          global_keystore = new lightwallet.keystore.deserialize(ls.data);
          global_keystore.passwordProvider = customPasswordProvider;

          AppService.setWeb3Provider(global_keystore);
          localStorage.AppKeys = JSON.stringify({data: global_keystore.serialize()});

          refresh();
 
          var alertPopup = $ionicPopup.alert({
            title: 'Restore Wallet',
            template: 'Wallet restored successfully!'
          });

          alertPopup.then(function(res) {
            console.log('wallet restored');
          });
        }, function (error) {
          // error
          console.log(error);
      });
    }, false);
  };

  var backupWalletToStorage = function(){
    //TODO: backup of localstorage.Enckeys
    var keystoreFilename = "leth_keystore.json";
    document.addEventListener("deviceready", function () {
      $cordovaFile.writeFile(cordova.file.dataDirectory,
             keystoreFilename,
             localStorage.AppKeys,
             true)
          .then(function (success) {
            var alertPopup = $ionicPopup.alert({
               title: 'Backup Wallet',
               template: 'Wallet backuped successfully!'
             });

            alertPopup.then(function(res) {
              console.log('wallet backuped');
            });
          }, function () {
          // not available
        });
    }, false);     
  };

  var backupSeed = function(){
    PasswordPopup.open("Enter your wallet <b>Password<b/> </br>[not PIN]", "unlock account to proceed").then(
      function (password) {
		if(password == undefined){
		  return;
		}
        global_keystore.keyFromPassword(password, function (err, pwDerivedKey) {
			
			if(pwDerivedKey != undefined){
				var seed = global_keystore.getSeed(pwDerivedKey);
				
				var confirmPopup = $ionicPopup.confirm({
					title: 'Backup securely your seed',
					template: seed,
					buttons: [{
						text: '<i style="color: white;" class="button button-icon icon ion-ios-email-outline"></i>',
						type: 'button-negative',
						onTap: function (e) {
							confirmPopup.close(); 
							$scope.shareSeedByEmail(seed);  
						}
					}, {
						text: '<i style="color: white;" class="button button-icon icon ion-ios-copy-outline"></i>',
						type: 'button-negative',
						onTap: function (e) {
							confirmPopup.close(); 
							$scope.copySeed(seed);
						}
					} , {
						text: 'Close',
						type: 'button-negative',
						onTap: function (e) {
							confirmPopup.close(); 
						}
					} 
					]
				});
	
				/*var alertPopup = $ionicPopup.alert({
					title: 'Backup securely your seed',
					template: seed
				}); 

				alertPopup.then(function(res) {    
					console.log('seed backuped');
				});*/
			}else{
				var alertPopup = $ionicPopup.alert({
					title: 'An error occurred during backup',
					template: 'Please check your password again'
				});
				
			} 
			$ionicLoading.hide();
			
		});
      },
      function (err) {
        $ionicLoading.hide();
      })      
  }

  var backupPrivateKey = function(){
    PasswordPopup.open("Enter your wallet <b>Password<b/> </br>[not PIN]", "unlock account to proceed").then(
      function (password) {
		  
		if(password == undefined){
		  return;
		}
		
        global_keystore.keyFromPassword(password, function (err, pwDerivedKey) { 
			
			if(pwDerivedKey != undefined){
				
				var pvtKey = global_keystore.exportPrivateKey(AppService.account(), pwDerivedKey)
				var confirmPopup = $ionicPopup.confirm({
					title: 'Backup securely your private key',
					template: pvtKey,
					buttons: [{
						text: '<i style="color: white;" class="button button-icon icon ion-ios-email-outline"></i>',
						type: 'button-negative',
						onTap: function (e) {
							confirmPopup.close(); 
							$scope.sharePKeyByEmail(pvtKey);  
						}
					}, {
						text: '<i style="color: white;" class="button button-icon icon ion-ios-copy-outline"></i>',
						type: 'button-negative',
						onTap: function (e) {
							confirmPopup.close(); 
							$scope.copyPrivatekey(pvtKey);
						}
					} , {
						text: 'Close',
						type: 'button-negative',
						onTap: function (e) {
							confirmPopup.close(); 
						}
					} 
					]
				});
				
				
			 
			}else{
				var alertPopup = $ionicPopup.alert({
					title: 'An error occurred during backup',
					template: 'Please check your password again'
				});
				
			} 
			$ionicLoading.hide(); 
         
        });
      },
      function (err) {
        $ionicLoading.hide();
      })      
  }


  $scope.backupWallet = function () {
	  var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'Backup Seed' },
        /*{ text: 'Backup Keys' },*/
        { text: 'Backup Private Key' }
        /*{ text: 'Backup on Storage'}*/
      ],
      destructiveText: (ionic.Platform.isAndroid()?'<i class="icon ion-android-exit assertive"></i> ':'')+'Cancel',
      titleText: 'How do you want to backup your wallet?',
      destructiveButtonClicked:  function() {
        hideSheet();
      },
      buttonClicked: function(index) {
        switch(index){
          case 0:
              backupSeed();
              hideSheet();
              break;
          case 1:
              backupPrivateKey();
              hideSheet();
              break;
          /*case 2:
              walletViaEmail();
              hideSheet();
              break;
          case 3:
              backupWalletToStorage();
              hideSheet();
              break;*/
			  }
		$timeout(function() {
		 hideSheet();
        }, 20000);
      }
    })
  };

  var walletViaEmail = function(){
    //backup keys wallet via email 
    PasswordPopup.open("Enter your wallet password [not PIN]", "unlock account to proceed").then(
      function (password) {

        document.addEventListener("deviceready", function () {
          var keystoreFilename = AppService.account() + "_lethKeystore.json";
          var directorySave=cordova.file.dataDirectory;
          var directoryAttach=cordova.file.dataDirectory.replace('file://','');
          
          if(ionic.Platform.isAndroid()) {
            directorySave = cordova.file.externalDataDirectory;
            directoryAttach = cordova.file.externalDataDirectory;
          }
          $cordovaFile.writeFile(directorySave,
                                 keystoreFilename,
                                 JSON.stringify(global_keystore.serialize()),
                                 true)
            .then(function (success) {
              $cordovaEmailComposer.isAvailable().then(function() {
                var emailOpts = {
                  to: [''],
                  attachments: ['' + directoryAttach + keystoreFilename],
                  subject: 'Backup LETH Wallet',
                  body: 'A LETH backup wallet is attached.<br>powerd by Ethereum from <b>BitAsean</b>',
                  isHtml: true
                };

                $cordovaEmailComposer.open(emailOpts).then(null, function () {
                  // user cancelled email
                });

                return;
              }, function (error) {
                return;
              });
            }, function () {
              // not available
            });
        }, false);     
    },
      function (err) {

    })  
  };
  
  
  $scope.shareSeedByEmail = function(seed){
      
      document.addEventListener("deviceready", function () {
        $cordovaEmailComposer.isAvailable().then(function() {
         
          var emailOpts = {
            to: [''],  
            subject: 'My Backup Seed',
            body: 'ETH wallet seed: <b>'+seed+'</b>',
            isHtml: true
          };

          $cordovaEmailComposer.open(emailOpts).then(null, function () {
            console.log('email view dismissed');
          });

          return;
        }, function (error) {
          console.log("cordovaEmailComposer not available");
          return;
        });
      }, false);         
    }

    $scope.copySeed = function(seed){
      document.addEventListener("deviceready", function () {  
        $cordovaClipboard
        .copy(seed)
        .then(function () {
          // success
          //alert('Address in clipboard');
          var alertPopup = $ionicPopup.alert({
             title: 'Copy Seed',
             template: 'Seed is in clipboard!'
           });

           alertPopup.then(function(res) {
             console.log('Seed copied in clipboard');
           });
        }, function () {
          // error
          console.log('Copy error');
        });
      }, false);         
    }
	
	
	$scope.sharePKeyByEmail = function(privatekey){
      
      document.addEventListener("deviceready", function () {
        $cordovaEmailComposer.isAvailable().then(function() {
         
          var emailOpts = {
            to: [''],  
            subject: 'My private key',
            body: 'ETH wallet private key: <b>'+privatekey+'</b>',
            isHtml: true
          };

          $cordovaEmailComposer.open(emailOpts).then(null, function () {
            console.log('email view dismissed');
          });

          return;
        }, function (error) {
          console.log("cordovaEmailComposer not available");
          return;
        });
      }, false);         
    }

    $scope.copyPrivatekey= function(privatekey){
      document.addEventListener("deviceready", function () {  
        $cordovaClipboard
        .copy(privatekey)
        .then(function () {
          // success
          //alert('Address in clipboard');
          var alertPopup = $ionicPopup.alert({
             title: 'Copy private key',
             template: 'Private key is in clipboard!'
           });

           alertPopup.then(function(res) {
             console.log('Private key copied in clipboard');
           });
        }, function () {
          // error
          console.log('Copy error');
        });
      }, false);         
    }
	
	
})

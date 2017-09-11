web3 = new Web3();
hdPath = "m/44'/60'/0";
hdPath2 = "m/44'/60'/0'/0";
StorePath = 'https://www.inzhoop.com/dappleths'; 

var app = angular.module('leth', ['ionic', 'nfcFilters', 'ngTagsInput', 'angularLoad','ionic.contrib.ui.cards', 'ngSanitize', 'ionic.service.core', 'ngCordova', 'ja.qr', 'leth.controllers', 'leth.services','ionic-lock-screen'])
  .constant('$ionicLoadingConfig', {
    template: 'Loading...'
  })
  .constant('StoreEndpoint', {
    //url: 'DappLETHs'
    url: StorePath
  })
  .run(function ($ionicPlatform, $rootScope, $ionicLoading, $ionicScrollDelegate,
                $lockScreen,$state,$window, $location) {
    $ionicPlatform.ready(function () {
      //Start Settings
      if (typeof localStorage.NfcOn == 'undefined') {localStorage.NfcOn="false";}
      if (typeof localStorage.Vibration == 'undefined') {localStorage.Vibration="false";}
      if (typeof localStorage.BackMode == 'undefined') {localStorage.BackMode="false";}
      if (typeof localStorage.PinOn == 'undefined') {localStorage.PinOn="false";}
      if (typeof localStorage.TouchOn == 'undefined') {localStorage.TouchOn="false";}
      if (typeof localStorage.GeoOn == 'undefined') {localStorage.GeoOn="false";}
      if (typeof localStorage.Friends == 'undefined') {localStorage.Friends = '[]';}
      if (typeof localStorage.LastMsg == 'undefined') {localStorage.LastMsg= JSON.stringify({time:0, hash:"0x"});}
      if (typeof localStorage.Transactions == 'undefined') {localStorage.Transactions = '[]';}
      if (typeof localStorage.Coins == 'undefined') {localStorage.Coins = '[]';}
      if (typeof localStorage.NodeHost == 'undefined') {
        localStorage.NodeHost = "http://wallet.inzhoop.com:8545";
      }
      if (typeof localStorage.HostsList == 'undefined') {
        localStorage.HostsList=JSON.stringify(["https://api.myetherapi.com/eth","https://mainnet.infura.io/mew","http://wallet.inzhoop.com:8545"]);
      }
      if (typeof localStorage.BaseCurrency == 'undefined') {localStorage.BaseCurrency = JSON.stringify({ name: 'EUR', symbol:'€', value: 'ZEUR'});}      
	    if(localStorage.PinOn=="true"){
    		$lockScreen.show({
    			code: JSON.parse(localStorage.AppCode).code,
          touchId: JSON.parse(localStorage.TouchOn),
    			ACDelbuttons: true,
    			onCorrect: function () {},
    			onWrong: function (attemptNumber) {},
  		  });
		  }
      if (typeof localStorage.AppKeys == 'undefined') {
          //console.log("wallet not found");
          $rootScope.hasLogged = false;
          localStorage.HasLogged = $rootScope.hasLogged;          
          $location.path('/tab/login');
        }
        else {
          //console.log("login successfully");
          $rootScope.hasLogged = true; 
          localStorage.HasLogged = $rootScope.hasLogged;
		  $state.go('tab.wallet');
          //$location.path('/tab/wallet/');
      } 

      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.disableScroll(true);   
        //window.addEventListener('native.keyboardshow', keyboardShowHandler);     
      }
      if (window.StatusBar) {
        StatusBar.styleLightContent();
        //StatusBar.styleBlackOpaque()
        //StatusBar.styleBlackTranslucent();
      }
      
      $rootScope.$on('loading:show', function () {
        $ionicLoading.show({
         template: 'Loading...'
        })
      })
      $rootScope.$on('loading:hide', function () {
        $ionicLoading.hide()
      })

      $window.addEventListener('LaunchUrl', function(event) {
        // gets page name from url
        var page =/.*:[/]{2}([^?]*)[?]?(.*)/.exec(event.detail.url)[1];
        // redirects to page specified in url
        if(event.detail.url.split(':')[0] == "ethereum")
          $state.go('tab.wallet', {addr: page});
      }); 

      document.addEventListener("deviceready", function () {  
          $rootScope.deviceready = true;  
      }, false);     

    });
  })
  .config(function ($ionicConfigProvider, $stateProvider, $urlRouterProvider) {
    // $ionicConfigProvider.views.maxCache(10);
    $ionicConfigProvider.views.transition('platform');
    // $ionicConfigProvider.views.forwardCache(false);
    $ionicConfigProvider.backButton.icon('ion-ios-arrow-back');
    $ionicConfigProvider.backButton.text('');                  // default is 'Back'
    $ionicConfigProvider.backButton.previousTitleText(false);  // hides the 'Back' text
    // $ionicConfigProvider.templates.maxPrefetch(20);


    $stateProvider
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: 'AppCtrl'  
      })
      .state('tab.login', {
        url: '/login',
        views: {
          'login': {
            templateUrl: 'templates/login.html'          
          }
        }
      }) 
      .state('tab.wallet', {
        url: '/wallet/:addr',
        views: {
          'wallet': {
            templateUrl: 'templates/wallet.html',
            controller: 'WalletCtrl'
          }
        }
      })
      .state('tab.settings', {
        url: '/settings',
        views: {
          'settings': {
            templateUrl: 'templates/settings.html',
            controller: 'SettingsCtrl'
          }
        }
      })
      .state('tab.transactions', {
        url: '/transactions/:addr',
        views: {
          'friends': {
            templateUrl: 'templates/transactions.html',
            controller: 'TransactionCtrl'
          }
        }
      })
	  .state('tab.transactions-etherscan', {
        url: '/transactions-etherscan/:addr',
        views: {
          'wallet': {
            templateUrl: 'templates/transactions-etherscan.html',
            controller: 'TransactionsEtherscanCtrl'
          }
        }
      })
      .state('tab.transall', {
        url: '/transactions/:addr',
        views: {
          'wallet': {
            templateUrl: 'templates/transactions.html',
            controller: 'TransactionCtrl'
          }
        }
      })      
       
      .state('tab.dappleth-run', {
        cache: false,
        url: '/dappleth-run/:Id',
        views: {
          'dappleths': {
            templateUrl: 'templates/dappleth-run.html',
            controller: "DapplethRunCtrl"
          }
        }
      })     
      .state('tab.address', {
        url: '/address',
        views: {
          'address': {
            templateUrl: 'templates/address.html',
            controller: 'AddressCtrl'
          }
        }
      })
      .state('tab.friends', {
        url: '/friends',
        views: {
          'friends': {
            templateUrl: 'templates/friends.html',
            controller: 'FriendsCtrl'
          }
        }
      })
      .state('tab.chats', {
        url: '/chats',
        views: {
          'chats': {
            templateUrl: 'templates/chats.html',
            controller: 'ChatsCtrl'
          }
        }
      })
	  .state('tab.map', {
        url: '/map',
        views: {
          'map': {
            templateUrl: 'templates/map.html',
            controller: 'MapCtrl'
          }
        }
      })
      .state('tab.friend', {
        url: '/friends/:Friend',
        views: {
          'friends': {
            templateUrl: 'templates/friend-detail.html',
            controller: 'FriendCtrl'
          }
        }
      })
      ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab');
  })
  .config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
	})
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push(function ($rootScope) {
      return {
        request: function (config) {
          $rootScope.$broadcast('loading:show')
          return config
        },
        response: function (response) {
          $rootScope.$broadcast('loading:hide')
          return response
        }
      }
    })

     $httpProvider.defaults.useXDomain = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })
  .config(function( $controllerProvider, $provide, $compileProvider ) {
    // Since the "shorthand" methods for component 
    // definitions are no longer valid, we can just 
    // override them to use the providers for post-
    // bootstrap loading.
    //console.log( "Config method executed." );

    // Let's keep the older references.
    app._controller = app.controller;
    // Provider-based controller.
    app.controller = function( name, constructor ) {
      $controllerProvider.register( name, constructor );
      return( this );
    };
  })
  .directive('hideTabs', function($rootScope) {
    return {
      restrict: 'A',
      link: function($scope, $el) {
        $rootScope.hideTabs = 'tabs-item-hide';
        $scope.$on('$destroy', function() {
            $rootScope.hideTabs = '';
        });
        $scope.$on('$ionicView.beforeLeave', function() {
            $rootScope.hideTabs = '';
        });
        $scope.$on('$ionicView.beforeEnter', function() {
            $rootScope.hideTabs = 'tabs-item-hide';
        });
      }
    };
  })
  .filter('inCategory', function($filter){
    return function(list, arrayFilter, element){
        if(arrayFilter){
            return $filter("filter")(list, function(listItem){
                return arrayFilter.indexOf(listItem[element]) != -1;
            });
        }
    };
  })
  .filter('strLimit', ['$filter', function($filter) {
   return function(input, beginlimit, endlimit) {
      if (! input) return;
      if (input.length <= beginlimit + endlimit) {
          return input;
      }

      return $filter('limitTo')(input, beginlimit) + '...' + $filter('limitTo')(input, -endlimit) ;
   };
  }])
  ;

  function handleOpenURL(url) {
    setTimeout(function() {
      var event = new CustomEvent('LaunchUrl', {detail: {'url': url}});
      window.dispatchEvent(event);
    }, 0);
  }

  
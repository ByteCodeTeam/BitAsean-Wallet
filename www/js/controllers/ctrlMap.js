angular.module('leth.controllers')  
  .controller('MapCtrl', function ($scope, $ionicListDelegate, $ionicModal, $ionicActionSheet, $ionicScrollDelegate, $cordovaImagePicker, $cordovaCamera, $timeout, 
                                      Friends, Chat, AppService, Geolocation,StoresService,$ionicLoading,$http,$timeout) { 
 
	var map;
	$scope.showLoading();
	document.addEventListener("deviceready", function() {
	  var div = document.getElementById("map_canvas");

	  var options = {
			'camera': {
				'target': {
					  "lat": 13.746840,
					  "lng": 100.535197
					},
				'zoom': 2
			}
	};

	  // Initialize the map view
	  map = plugin.google.maps.Map.getMap(div,options); 

	  // Wait until the map is ready status.
	  map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);
	   
	}, false);

	function onMapReady() { 
		map.setMyLocationEnabled(true); 
		getStoresData(); 
		$timeout(function() {
           $ionicLoading.hide();
        }, 1000);
		
	}

	function addMarker() {

		map.addMarkerCluster({ 
			boundsDraw: false,
			markers: $scope.storesData,
			icons: [
			  {min: 2, max: 100, url: "././img/blue.png", anchor: {x: 16, y: 16},label: {color:"#ffffff"}},
			  {min: 100, max: 1000, url: "././img/yellow.png", anchor: {x: 16, y: 16},label: {color:"#ffffff"}},
			  {min: 1000, max: 2000, url: "././img/purple.png", anchor: {x: 24, y: 24},label: {color:"#ffffff"}},
			  {min: 2000, url: "././img/red.png",anchor: {x: 32,y: 32},label: {color:"#ffffff"}}
			]
			
		  }, function (markerCluster) {
 
				var htmlInfoWnd = new plugin.google.maps.HtmlInfoWindow();
				markerCluster.on(plugin.google.maps.event.MARKER_CLICK, function (position, marker) {
					var html = [
					"<div style='width:250px;min-height:130px;'>",  
					"<div style='vertical-align: middle; text-align: center;'><img style='max-width:80px;max-height:80px;width: auto;height: auto; '; src='"+marker.get("logo")+"'></div>",
					"<strong>" + (marker.get("title") || marker.get("name")) + "</strong>"
					];
					if (marker.get("address")) {
						html.push("<div style='font-size:0.8em;'>" + marker.get("address") + "</div>");
					}
					if (marker.get("website")) {
						html.push("<div style='font-size:0.8em;'>" + marker.get("website") + "</div>");
					}
					html.push("</div>");
					htmlInfoWnd.setContent(html.join(""));
					htmlInfoWnd.open(marker);
				});

		  });
	}
		 
	function getStoresData() {  
		$http.get('http://128.199.118.37/stores.php')
		.success(function(data, status, headers,config){ 
			$scope.storesData = data;  
			if($scope.storesData != undefined && $scope.storesData.length > 0){
				addMarker();
			}
			
		})
		.error(function(data, status, headers,config){
			console.log('data error');
		}); 
		  
	}
	
 })
angular.module('leth.controllers')  
  .controller('MapCtrl', function ($scope, $ionicListDelegate, $ionicModal, $ionicActionSheet, $ionicScrollDelegate, $cordovaImagePicker, $cordovaCamera, $timeout, 
                                      Friends, Chat, AppService, Geolocation) { 
 
	var map;
	document.addEventListener("deviceready", function() {
	  var div = document.getElementById("map_canvas");

	  var options = {
			'camera': {
				'target': dummyData()[0].position,
				'zoom': 12
			}
		};

	  // Initialize the map view
	  map = plugin.google.maps.Map.getMap(div,options); 

	  // Wait until the map is ready status.
	  map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);
	   
	}, false);

	function onMapReady() {
		
		map.setMyLocationEnabled(true);
		addMarker();
	   
	}

	function addMarker() {

		map.addMarkerCluster({ 
			boundsDraw: false,
			markers: dummyData(),
			icons: [
			  {min: 2, max: 100, url: "././img/blue.png", anchor: {x: 16, y: 16}},
			  {min: 100, max: 1000, url: "././img/yellow.png", anchor: {x: 16, y: 16}},
			  {min: 1000, max: 2000, url: "././img/purple.png", anchor: {x: 24, y: 24}},
			  {min: 2000, url: "././img/red.png",anchor: {x: 32,y: 32}}
			]
			
		  }, function (markerCluster) {
 
				var htmlInfoWnd = new plugin.google.maps.HtmlInfoWindow();
				markerCluster.on(plugin.google.maps.event.MARKER_CLICK, function (position, marker) {
					var html = [
					"<div style='width:250px;min-height:100px'>",
					"<img src='img/starbucks_logo.gif' align='right'>",
					"<strong>" + (marker.get("title") || marker.get("name")) + "</strong>"
					];
					if (marker.get("address")) {
						html.push("<div style='font-size:0.8em;'>" + marker.get("address") + "</div>");
					}
					if (marker.get("phone")) {
						html.push("<a href='tel:" + marker.get("phone") + "' style='font-size:0.8em;color:blue;'>Tel: " + marker.get("phone") + "</div>");
					}
					html.push("</div>");
					htmlInfoWnd.setContent(html.join(""));
					htmlInfoWnd.open(marker);
				});

		  });
	}
		 
	function dummyData() {
		return  [
				  {
					"position": {
					  "lat": 21.382314,
					  "lng": -157.933097
					},
					"name": "Starbucks - HI - Aiea  03641",
					"address": "Aiea Shopping Center_99-115 Aiea Heights Drive #125_Aiea, Hawaii 96701",
					"phone": "808-484-1488",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 21.3871,
					  "lng": -157.9482
					},
					"name": "Starbucks - HI - Aiea  03642",
					"address": "Pearlridge Center_98-125 Kaonohi Street_Aiea, Hawaii 96701",
					"phone": "808-484-9548",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 21.363402,
					  "lng": -157.928275
					},
					"name": "Starbucks - HI - Aiea  03643",
					"address": "Stadium Marketplace_4561 Salt Lake Boulevard_Aiea, Hawaii 96818",
					"phone": "808-488-9313",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 21.3884,
					  "lng": -157.9431
					},
					"name": "Starbucks - HI - Aiea  03644",
					"address": "Pearlridge Mall_98-1005 Moanalua Road_Aiea, Hawaii 96701",
					"phone": "808-484-9355",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 21.6507,
					  "lng": -158.0652
					},
					"name": "Starbucks - HI - Haleiwa  03645",
					"address": "Pupukea_59-720 Kamehameha Highway_Haleiwa, Hawaii 96712",
					"phone": "808-638-0341",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 19.699335,
					  "lng": -155.06566
					},
					"name": "Starbucks - HI - Hilo  03646",
					"address": "Border Waiakea Center_315-325 Makaala Street_Hilo, Hawaii 96720",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 19.698399,
					  "lng": -155.064864
					},
					"name": "Starbucks - HI - Hilo  03647",
					"address": "Prince Kuhio Plaza_111 East Puainako Street_Hilo, Hawaii 96720",
					"phone": "808-959-2492",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 19.722763,
					  "lng": -155.085598
					},
					"name": "Starbucks - HI - Hilo [D]  03648",
					"address": "Hilo_438 Kilauea Ave_Hilo, Hawaii 96720",
					"phone": "808-933-3094",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 21.338183,
					  "lng": -157.917579
					},
					"name": "Starbucks - HI - Honolulu  03649",
					"address": "Airport Trade Center_550 Paiea Street_Honolulu, Hawaii 96819",
					"phone": "808-833-3519",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 21.3074,
					  "lng": -157.865199
					},
					"name": "Starbucks - HI - Honolulu  03650",
					"address": "Aloha Tower_1 Aloha Tower Drive_Honolulu, Hawaii 96813",
					"phone": "808-522-1901",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 21.30846253,
					  "lng": -157.8614898
					},
					"name": "Starbucks - HI - Honolulu  03651",
					"address": "Bishop_1000 Bishop Street #104_Honolulu, Hawaii 96813",
					"phone": "808-599-4833",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 21.311363,
					  "lng": -157.863751
					},
					"name": "Starbucks - HI - Honolulu  03652",
					"address": "Central Pacific Bank_220 South King Street_Honolulu, Hawaii 96813",
					"phone": "808-538-7600",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 21.28507546,
					  "lng": -157.838214
					},
					"name": "Starbucks - HI - Honolulu  03653",
					"address": "Discovery Bay_1778 Ala Moana Boulevard_Honolulu, Hawaii 96815",
					"phone": "808-946-8563",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 21.342733,
					  "lng": -158.027408
					},
					"name": "Starbucks - HI - Honolulu  03654",
					"address": "Ewa Beach_91-1401 Fort Weaver Road_Honolulu, Hawaii 96706",
					"phone": "808-685-4594",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 21.28005068,
					  "lng": -157.8285093
					},
					"name": "Starbucks - HI - Honolulu  03655",
					"address": "Duty Free Shopper_330 Royal Hawaiian Avenue_Honolulu, Hawaii 96815",
					"phone": "808-926-4863",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 21.3115,
					  "lng": -157.8649
					},
					"name": "Starbucks - HI - Honolulu  03656",
					"address": "Financial Plaza_130 Merchant Street #111_Honolulu, Hawaii 96813",
					"phone": "808-585-8658",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 21.282048,
					  "lng": -157.713041
					},
					"name": "Starbucks - HI - Honolulu  03657",
					"address": "Hawaii Kai Town Center_6700 Kalanianaole Highway_Honolulu, Hawaii 96825",
					"phone": "808-396-3013",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 21.291345,
					  "lng": -157.848791
					},
					"name": "Starbucks - HI - Honolulu  03658",
					"address": "Hokua_1288 Ala Moana Blvd_Honolulu, Hawaii 96814",
					"phone": "808-591-2891",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 21.335164,
					  "lng": -157.868742
					},
					"name": "Starbucks - HI - Honolulu  03659",
					"address": "Kamehameha Shopping Center_1620 North School Street_Honolulu, Hawaii 96817",
					"phone": "808-832-1430",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 21.27852422,
					  "lng": -157.7875773
					},
					"name": "Starbucks - HI - Honolulu  03660",
					"address": "Kahala Mall_4211 Waialae Avenue_Honolulu, Hawaii 96816",
					"phone": "808-737-0283",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 21.294372,
					  "lng": -157.841963
					},
					"name": "Starbucks - HI - Honolulu  03661",
					"address": "Keeaumoku_678 Keeamoku Street #106_Honolulu, Hawaii 96814",
					"phone": "808-946-7513",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 21.2819,
					  "lng": -157.8163
					},
					"name": "Starbucks - HI - Honolulu  03662",
					"address": "Kapahulu Avenue_625 Kapahulu Avenue_Honolulu, Hawaii 96815",
					"phone": "808-734-4116",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 21.27608195,
					  "lng": -157.7049835
					},
					"name": "Starbucks - HI - Honolulu  03663",
					"address": "Koko Marina_7192 Kalanianaole Highway_Honolulu, Hawaii 96825",
					"phone": "808-394-5577",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 21.3129,
					  "lng": -157.8129
					},
					"name": "Starbucks - HI - Honolulu  03664",
					"address": "Manoa Valley_2902 East Manoa Road_Honolulu, Hawaii 96822",
					"phone": "808-988-9295",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 21.293082,
					  "lng": -157.847092
					},
					"name": "Starbucks - HI - Honolulu  03665",
					"address": "Macys Ala Moana_1450 Ala Moan Boulevard_Honolulu, Hawaii 96814",
					"phone": "808-943-2437",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 21.341957,
					  "lng": -157.929089
					},
					"name": "Starbucks - HI - Honolulu  03666",
					"address": "Moanalua Shopping Center_930 Valkenburgh Street_Honolulu, Hawaii 96818",
					"phone": "808-422-2804",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 21.279503,
					  "lng": -157.833101
					},
					"name": "Starbucks - HI - Honolulu  03667",
					"address": "Outrigger Reef_2169 Kalia Road #102_Honolulu, Hawaii 96815",
					"phone": "808-922-8694",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 21.282251,
					  "lng": -157.828172
					},
					"name": "Starbucks - HI - Honolulu  03668",
					"address": "Ohana Waikiki West_2330 Kuhio Avenue_Honolulu, Hawaii 96815",
					"phone": "808-922-9570",
					"icon": "././img/starbucks.png"
				  },
				  {
					"position": {
					  "lat": 21.323602,
					  "lng": -157.890904
					},
					"name": "Starbucks - HI - Honolulu  03669",
					"address": "Sand Island_120 Sand Island Access Road #4_Honolulu, Hawaii 96819",
					"phone": "808-832-9915",
					"icon": "././img/starbucks.png"
				  }
				];
	}
 })
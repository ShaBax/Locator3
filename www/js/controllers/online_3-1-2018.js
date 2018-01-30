'use strict';

  app.controller('OnlineCtrl',  function($scope,$rootScope,$http,Online,NgMap,$interval,$filter,$window,$timeout) {
  $scope.base = base;
  $scope.basePath = basePath;
  $scope.firsttime = 0;

  $scope.allGroupsInitialized = false;
  $scope.option = 'all';
  $scope.vehiclegroups = {};
  $scope.allAvailableObjects = [];
  $scope.selectedLiveGroups = [];
  $scope.allAvailableGroups = [];
  $scope.allVehiclespositonsData = [];
  $scope.selectedVehicles = [];
  $scope.liveObjectMarkerFlag =true;  
  $scope.tripFlag = false;
  $scope.ServiceReminderFlag = false;
  $scope.hidetrackFlag = true;
  $scope.selectedPOI = {};
  $scope.selectedPOI = 'POI';
  $scope.searchByAddressFlag = false;
  $scope.searchByPOIFlag = true;
  $scope.searchByPolygonFlag = false;
  $rootScope.liveSchedulingFlag = true;
  $scope.streetViewcenter = '';
  $scope.traffic = true;
  $scope.googlemap=true;
  $scope.report=false;
  $scope.analytics=false;
  $scope.maintenance = false;
  $scope.deleteButton = false;
  $scope.deleteScheduleButton = false;
  $scope.auth_token = $scope.get_auth_token();
  $scope.imagePath = imagePath;
  $scope.maintenanceImagePath = maintenanceImagePath;
  $scope.service_edit = '';
  $scope.schedule_edit = '';
  $scope.remainder_edit ='';
  $scope.fuel_edit = '';
  $scope.doc_edit = '';
  $scope.reminder={};
  $scope.service = {};
  $scope.schedule = {};
  $scope.service.service_total_cost = 0;
  $scope.service.service_date =  $filter('date')(new Date(), 'yyyy-MM-dd')+" "+$filter('date')(new Date(), 'hh:mm:ss');
  $scope.date = new Date();
  $scope.maintenanceFrom = $filter('date')($scope.date.setDate($scope.date.getDate() - 7), 'yyyy-MM-dd')+" "+$filter('date')(new Date(), 'hh:mm:ss');
  $scope.maintenanceTo = $filter('date')(new Date(), 'yyyy-MM-dd')+" "+$filter('date')(new Date(), 'hh:mm:ss');
  $scope.sharelocation ='';
  $scope.tokenvalidity = 15;
  var vm = this;
  var trafficLayer = new google.maps.TrafficLayer();
  var stop;
  var count = 0;
  var markers = [];

  $scope.center = [];
  $scope.latitude = 25.217100;
  $scope.longitude = 55.361364;
  $scope.center.push($scope.latitude,$scope.longitude);
  $scope.pos = '';
  $scope.type = '';
  $scope.path = {};
  $scope.radius = '';
  $scope.onlineMarkers=[];
  $scope.fuelEntry={};
  $scope.fuelEntry.fuel_date = $filter('date')(new Date(), 'yyyy-MM-dd')+" "+$filter('date')(new Date(), 'hh:mm:ss');
  $scope.remainder = {};
  $scope.reminder.remainder_due_date = $filter('date')(new Date(), 'yyyy-MM-dd')+" "+$filter('date')(new Date(), 'hh:mm:ss');
  $scope.documents={};
  $scope.track = {};
  $scope.points = [];
  $scope.polylinePoints = [];
  $scope.movingPoints = [];
  $scope.selectedVehicle = false;
  $scope.traffic = true;
  $scope.drawing = '';
  $scope.geoZoneDetails=[];
  $scope.myMarkers = [];
  $scope.Timer = null;
  $scope.save_deviceID(-1);
  $scope.reportID = '';
  $scope.selectedDevices = [];
  $scope.vehicledtls = {};
  $scope.today = new Date();
  $scope.fromDate = $filter('date')(new Date(), 'yyyy-MM-dd');
  $scope.toDate = $filter('date')($scope.today.setDate($scope.today.getDate() + 1), 'yyyy-MM-dd');
  $scope.fromTime = $filter('date')(new Date(), 'hh:mm:ss');
  $scope.toTime = $filter('date')(new Date(), 'hh:mm:ss');
  $scope.from = $scope.fromDate +" "+$scope.fromTime;
  $scope.to = $scope.toDate +" "+$scope.toTime; 
  $scope.graph = [];
  $rootScope.infoMarker ={};  
  $scope.navigationDetination="";
  $rootScope.playandpause = false;
  $rootScope.playandpauseFlag = false;
  $rootScope.showMapOfTripFlag = false;
  $scope.commonzoneLatLng =[];
  
   $( "#slider" ).slider({
    slide: function( event, ui ) {              
      vm.setTrackerPosition(ui.value);
    }
  });

  $scope.AnalyticsDuration='';
  $scope.timeInterval = 'Duration';
  $scope.notificationDetails = {};
  $scope.notificationDetails.customer_noitification_geozone_shape = 'polygon';
  $scope.selectedShape = 'Geozone';
  $scope.showaddNotfnButton = false;

  var polygonToEdit = [];
  $scope.polygonCoords = [];
  $scope.editedPolygonPoints = [];

  //Info Bubble
  $scope.infoBubble = new InfoBubble({
      maxWidth: 500
    });  
  //INfo Bubble End
  var vm=this;
  NgMap.getMap().then(function(map) {
    vm.map = map;
    trafficLayer.setMap(vm.map);
  });

  var infoWindow = new google.maps.InfoWindow;
  var contentString = '';

  $scope.selectedLiveDisplayOption = 'all';
  var zonePolygon = [];
  $scope.zoneMarker = [];
  $scope.zonePolygonCoords = [];

  $rootScope.requests = [];
 
  $rootScope.$on("showGeozoneOnMap", function(event,args){

  //alert($scope.zonePolygonCoords);
  if($scope.zonePolygonCoords!='')
  zonePolygon.setMap(null);

    if (args.geozone.gz_shape == 'polygon') {
 
      $scope.zonePolygonCoords = [];
         
      $scope.triangleCoords = args.geozone.gz_points.split("],");
      for (var i = 0; i < $scope.triangleCoords.length; i++) {
        $scope.triangleCoords[i] = $scope.triangleCoords[i].replace("[","");  
        if (i==$scope.triangleCoords.length-1) {
          $scope.triangleCoords[i] = $scope.triangleCoords[i].replace("]",""); 
        }
        $scope.triangleCoords[i] = $scope.triangleCoords[i].split(","); 
        $scope.zonePolygonCoords.push(new google.maps.LatLng($scope.triangleCoords[i][0],  $scope.triangleCoords[i][1]));
      }

      var bounds = new google.maps.LatLngBounds();

      for (var i = 0; i < $scope.zonePolygonCoords.length; i++) {
        bounds.extend($scope.zonePolygonCoords[i]);
      }
      
      vm.map.fitBounds(bounds);

      $scope.center = [bounds.getCenter().lat(),bounds.getCenter().lng()];

      zonePolygon = new google.maps.Polygon({
        paths: $scope.zonePolygonCoords,
        editable: false,
        strokeColor: '#168BD1',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#168BD1',
        fillOpacity: 0.35
      });          
         
      zonePolygon.setMap(vm.map);


//$scope.zonePolygonCoords = [];
//zonePolygon.setMap(null);
           
    }else{

      $scope.center = args.geozone.gz_points;
      $scope.zoneMarker.push($scope.center);

    }

  });

  $rootScope.$on("geoZoneDetails", function(event,args){

    if (args.geoZoneID == '') {

      infoWindow.close();

      $scope.geoZoneDetails= [];
      for (var i = 0; i < $scope.polygonCoords.length; i++) {
        polygonToEdit.setMap(null);
      }
      $scope.polygonCoords = [];

    }else{

      $scope.geoZoneID = args.geoZoneID;
      $scope.editedPolygonPoints = [];
      $scope.polygonCoords = [];

      var bounds = new google.maps.LatLngBounds();
      var polygonToShow = {};
      
      Online.getZoneDetails($scope.geoZoneID,$scope.auth_token)
      .success(function (data){

        $scope.checkd = args.checkd;
        $scope.edit = args.edit;      

        if($scope.checkd==1){

          if (args.type == 'geozone') {
         
            $scope.triangleCoords = data.geozone.gz[0].gz_points.split("],");
            for (var i = 0; i < $scope.triangleCoords.length; i++) {
              $scope.triangleCoords[i] = $scope.triangleCoords[i].replace("[","");  
              if (i==$scope.triangleCoords.length-1) {
                $scope.triangleCoords[i] = $scope.triangleCoords[i].replace("]",""); 
              }
              $scope.triangleCoords[i] = $scope.triangleCoords[i].split(","); 
              $scope.polygonCoords.push(new google.maps.LatLng($scope.triangleCoords[i][0],  $scope.triangleCoords[i][1]));
            }
            
          }else{

            $scope.geozonePointToEdit = data.geozone.gz[0].gz_points;
          }

          $scope.geoZoneDetails.push(data.geozone.gz[0]);    
                   
        }
        else{            
          for(var i = 0; i < $scope.geoZoneDetails.length; i++){
            if($scope.geoZoneDetails[i].gz_id == data.geozone.gz[0].gz_id){
              $scope.geoZoneDetails.splice(i,1);
            }
          }           
        }
       
        if($scope.edit==1 || $scope.edit==2){
          $scope.showSavepoint=true;
          $scope.showAddpoint=false;

          if (args.type == 'geozone') {
            for (var i = 0; i < $scope.polygonCoords.length; i++) {
              bounds.extend($scope.polygonCoords[i]);
            }
            vm.map.fitBounds(bounds);
            vm.map.setZoom(16);

            $scope.center = [bounds.getCenter().lat(),bounds.getCenter().lng()];

            polygonToEdit = new google.maps.Polygon({
              paths: $scope.polygonCoords,
              editable: true,
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#FF0000',
              fillOpacity: 0.35
            });          
         
            polygonToEdit.setMap(vm.map);

            google.maps.event.addListener(polygonToEdit, 'click', function(event) {
             
              contentString = data.geozone.gz[0].gz_name;
              infoWindow.setContent(contentString);
              infoWindow.setPosition(event.latLng);
              infoWindow.open(vm.map);

            });
            
            $scope.editedPolygonPoints = $scope.polygonCoords;

            $rootScope.$broadcast('editdrawedGeoZone',{editedPolygonCoords : $scope.editedPolygonPoints});  

            google.maps.event.addListener(polygonToEdit.getPath(), "insert_at", getPolygonCoords);

            google.maps.event.addListener(polygonToEdit.getPath(), "remove_at", getPolygonCoords);

            google.maps.event.addListener(polygonToEdit.getPath(), "set_at", getPolygonCoords);

            function getPolygonCoords() {
              var len = polygonToEdit.getPath().getLength();  
              $scope.editedPolygonPoints = polygonToEdit.getPath().getArray();

              $rootScope.$broadcast('editdrawedGeoZone',{editedPolygonCoords : $scope.editedPolygonPoints});           
            } 

          }else{

            $scope.center = $scope.geozonePointToEdit;
            $rootScope.$broadcast('editedGeozonePoint', { position: $scope.geozonePointToEdit });
          }

        }else{

          polygonToShow = vm.map.shapes.geozonePolygon.getPath().getArray();

          for (var i = 0; i < polygonToShow.length; i++) {
            bounds.extend(polygonToShow[i]);
          }
          vm.map.fitBounds(bounds);
          vm.map.setZoom(16);
        }
      })  

    }

  });

  $scope.editGeoPoint = function(e){
    $rootScope.$broadcast('editedGeozonePoint', { position: e.latLng });
  }

  vm.showLabel = function(e,gzName){  

    contentString = gzName;
    infoWindow.setContent(contentString);
    infoWindow.setPosition(e.latLng);
    infoWindow.open(vm.map);
  }

  vm.showZoneLabel = function(e,gz){  
    contentString = gz.gz_name;
    infoWindow.setContent(contentString);
    infoWindow.setPosition(e.latLng);
    infoWindow.open(vm.map);
  }


  $scope.pointerImage = {
    url: 'http://www.firepineapple.com/application/views/images/map_marker.gif',
    size: [45, 45],
    origin: [0,0],
    anchor: [20, 20]

  };

  var car = "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z";

  $scope.iconCar = {
    path: car,
    scale: .7,
    strokeColor: 'white',
    strokeWeight: .10,
    fillOpacity: 1,
    fillColor: '#404040',
    offset: '5%',
    // rotation: parseInt(heading[i]),
    anchor: new google.maps.Point(10, 25) // orig 10,50 back of car, 10,0 front of car, 10,25 center of car
  };

  $scope.doubleLine = {
    path: 'M 18.15,2.15v10.802c0,1.109-0.9,2-2,2h-0.08v2.219 H12.92v-2.219H9.4V8.62h1.42c0.09-1.14,1.05-2.03,2.21-2.03c0.96,0,1.771,0.6,2.08,1.45c0.37-0.36, 0.6-0.87,0.6-1.42V3.86 c0- 1.11-0.899-2-2-2H4.59c-1.1,0-2,0.89-2,2v2.76c0,1.1,0.9,2,2,2H8.9v6.332h-3.44v2.219H2.31v-2.219H2.15c-1.11,0-2-0.891-2-2V2.15 c0-1.1,0.89-2,2- 2h14C17.25,0.15,18.15,1.05,18.15,2.15 z',
    fillOpacity: 0.85,
    strokeWeight: 1,
    fillColor: "#ff0000",
    fillOpacity: .7,
    scale: .8,
    anchor: new google.maps.Point(10,10),
    rotation: 0
  };

  $scope.showPopover=false;

  $scope.popover = {
    title: 'Title',
    message: 'Message'
  };   

  $scope.refreshNGMap=function () {

      NgMap.getMap().then(function(map) {
        var currCenter = map.getCenter();
        google.maps.event.trigger(map, 'resize');
        
        map.setCenter(currCenter);
      });
  } 

  $rootScope.$on("CommonGeozones", function(event,args){

    $scope.types=args.type ;
     
     $http({
      method  : 'get',url     : baseUrl + 'getCommonLatLng/'+$scope.types ,headers: {'Xtoken': $scope.authtoken} 
    })
    .success(function (data){
  
      $scope.commonzoneLatLng=data.CommonPoints;
      var centerPoints = $scope.commonzoneLatLng[0].gz_points.split("]");
      centerPoints = centerPoints[0].replace("[","");
      centerPoints = centerPoints.split(",");     
      $scope.center = [centerPoints[0],centerPoints[1]];
    })
     
  });

  $rootScope.$on("setObjectToCenter", function(event,args){
     
    $scope.center=[args.latitude,args.longitude];

    if (args.geozoneType) {

      Online.getZoneDetails(args.geozoneId,$scope.auth_token)
      .success(function (data){

          if (args.geozoneType == 'geozone') {

            var centerPoints = data.geozone.gz[0].gz_points.split("],");
            centerPoints = centerPoints[0].replace("[","");
            centerPoints = centerPoints.split(",");      
             
            $scope.center = [centerPoints[0],centerPoints[1]];
          }else{
            $scope.center = data.geozone.gz[0].gz_points;
          }
      })
    }
        

  });

  $rootScope.$on("openPopUp", function(event,args){
   
      $scope.center=[args.latitude,args.longitude];
      
      vm.getIdlingDetails(event,args.iding);
  });

  $rootScope.$on("openGeozonePopup", function(event,args){
      $scope.center=[args.latitude,args.longitude];
      vm.getGeozoneOnMapDetails(event,args.geozone);
  });

  $rootScope.$on("showHistoryEventInfowindow", function(event,args){

    $scope.center=[args.historyEvent.event_latitude,args.historyEvent.event_longitude];

     vm.event = args.historyEvent;

      $scope.tooltipStatusIgnition=true;
      $scope.tooltipStatus=false;
       setTimeout(function () {
      $scope.$apply(function(){
          $scope.tooltipStatusIgnition= false;
      });
    }, 6000);

  });

/*  $rootScope.$on("vehicleDetails", function(event,args){
    //$scope.getGroups();
    $scope.deviceId = args.deviceId;
    $scope.selectedDevice = args.device;
    $scope.save_deviceID($scope.deviceId);
    $scope.selectedVehicle = true;
    $scope.tripFlag = true;
    $scope.infoBubble.close();
   
    Online.getVehicleDetails($scope.auth_token)
    .success(function (data){

      $scope.vehDetails = data.vehDetails.data; 
       
        if (args.selectAll == 1) {
          for (var i = 0; i < $scope.vehDetails.length; i++) {
            if ($scope.selectedDevices.indexOf($scope.vehDetails[i].obj_device_id) == -1) {
                $scope.selectedDevices.push($scope.vehDetails[i].obj_device_id); 
      
                $scope.parkingMarkers = [];
                $scope.eventMarkers = [];
                $scope.idlingMarkers = [];
                  $scope.geozoneMarkers = [];
              //  $scope.center=[$scope.vehDetails[i].track_vehicles_veh_latitude,$scope.vehDetails[i].track_vehicles_veh_longitude];
                $scope.icon = "/car.png";
                
                if($scope.vehDetails[i].track_vehicles_status=='Moving'){
                   
                  $scope.iconFolder = "green";           

                  if($scope.vehDetails[i].track_vehicles_veh_angle ==0 || $scope.vehDetails[i].track_vehicles_veh_angle == 360){
                    $scope.direction = "0";
                  }else if($scope.vehDetails[i].track_vehicles_veh_angle == 90){
                    $scope.direction = "90";
                  }else if($scope.vehDetails[i].track_vehicles_veh_angle == 180){
                    $scope.direction = "180";
                  }else if($scope.vehDetails[i].track_vehicles_veh_angle == 270){
                    $scope.direction = "270";
                  }else if($scope.vehDetails[i].track_vehicles_veh_angle > 0 && $scope.vehDetails[i].track_vehicles_veh_angle < 90){
                    $scope.direction = "45";
                  }else if($scope.vehDetails[i].track_vehicles_veh_angle > 90 && $scope.vehDetails[i].track_vehicles_veh_angle < 180){
                    $scope.direction = "135";
                  }else if($scope.vehDetails[i].track_vehicles_veh_angle >180 && $scope.vehDetails[i].track_vehicles_veh_angle < 270 ){
                    $scope.direction = "225";
                  }else{
                    $scope.direction = "315";
                  }

                  $scope.icon = "/car_"+$scope.direction+".png";

                }else if($scope.vehDetails[i].track_vehicles_status=='Idling')
                  $scope.iconFolder = "orange";
                else
                   $scope.iconFolder = "red";

                $scope.tempMarker={label:$scope.vehDetails[i].obj_name.toString().substr(0, 15), angle:$scope.vehDetails[i].track_vehicles_veh_angle, title:$scope.vehDetails[i].obj_name, icon: $scope.imagePath+'/'+$scope.iconFolder+$scope.icon,vehDetails:$scope.vehDetails[i],animation: 'Animation.DROP'}; 
                 
                $scope.onlineMarkers.push($scope.tempMarker) ; 
                  
               
            }
          }

                var lat =$scope.vehDetails[i-1].track_vehicles_veh_latitude;
                var lng = $scope.vehDetails[i-1].track_vehicles_veh_longitude;
                var loc = new google.maps.LatLng(lat, lng);
                //$scope.center=loc;
                vm.map.setZoom(8);
               // console.log(loc);
          //console.log($scope.vehDetails[0].track_vehicles_veh_latitude+":"+$scope.vehDetails[0].track_vehicles_veh_longitude);
          // $scope.center=[$scope.vehDetails[0].track_vehicles_veh_latitude,$scope.vehDetails[0].track_vehicles_veh_longitude];
        }else{  
        
          if ($scope.deviceId) {     
            if($scope.selectedDevice){
              for (var i = 0; i < $scope.vehDetails.length; i++) {

                if($scope.vehDetails[i].obj_device_id == $scope.get_deviceID() ||  $scope.vehDetails[i].obj_device_id == $scope.deviceId){
                  if ($scope.selectedDevices.indexOf($scope.vehDetails[i].obj_device_id) == -1) {
                      $scope.selectedDevices.push($scope.vehDetails[i].obj_device_id); 
           
                      $scope.parkingMarkers = [];
                      $scope.eventMarkers = [];
                      $scope.idlingMarkers = [];
                        $scope.geozoneMarkers = [];
                      $scope.center=[$scope.vehDetails[i].track_vehicles_veh_latitude,$scope.vehDetails[i].track_vehicles_veh_longitude];
                      $scope.icon = "/car.png";
                      
                      if($scope.vehDetails[i].track_vehicles_status=='Moving'){
                         
                        $scope.iconFolder = "green";           

                        if($scope.vehDetails[i].track_vehicles_veh_angle ==0 || $scope.vehDetails[i].track_vehicles_veh_angle == 360){
                          $scope.direction = "0";
                        }else if($scope.vehDetails[i].track_vehicles_veh_angle == 90){
                          $scope.direction = "90";
                        }else if($scope.vehDetails[i].track_vehicles_veh_angle == 180){
                          $scope.direction = "180";
                        }else if($scope.vehDetails[i].track_vehicles_veh_angle == 270){
                          $scope.direction = "270";
                        }else if($scope.vehDetails[i].track_vehicles_veh_angle > 0 && $scope.vehDetails[i].track_vehicles_veh_angle < 90){
                          $scope.direction = "45";
                        }else if($scope.vehDetails[i].track_vehicles_veh_angle > 90 && $scope.vehDetails[i].track_vehicles_veh_angle < 180){
                          $scope.direction = "135";
                        }else if($scope.vehDetails[i].track_vehicles_veh_angle >180 && $scope.vehDetails[i].track_vehicles_veh_angle < 270 ){
                          $scope.direction = "225";
                        }else{
                          $scope.direction = "315";
                        }

                        $scope.icon = "/car_"+$scope.direction+".png";

                      }else if($scope.vehDetails[i].track_vehicles_status=='Idling')
                        $scope.iconFolder = "orange";
                      else
                         $scope.iconFolder = "red";

                      $scope.tempMarker={label:$scope.vehDetails[i].obj_name.toString().substr(0, 15), angle:$scope.vehDetails[i].track_vehicles_veh_angle, title:$scope.vehDetails[i].obj_name, icon: $scope.imagePath+'/'+$scope.iconFolder+$scope.icon,vehDetails:$scope.vehDetails[i],animation: 'Animation.DROP'}; 
                       
                      $scope.onlineMarkers.push($scope.tempMarker) ; 
                        
                      var lat =$scope.vehDetails[i].track_vehicles_veh_latitude;
                      var lng = $scope.vehDetails[i].track_vehicles_veh_longitude;
                      var loc = new google.maps.LatLng(lat, lng);
                      $scope.center.push(loc);
                  }
                }
              }
            }else{
                for (var i = 0; i < $scope.onlineMarkers.length; i++){  
                  if($scope.onlineMarkers[i].vehDetails.obj_device_id == $scope.deviceId){
                    $scope.onlineMarkers.splice(i,1);        
                  }             
                }
                for (var j = 0; j < $scope.selectedDevices.length; j++) { 
                  if($scope.selectedDevices[j] == $scope.deviceId){          
                    $scope.selectedDevices.splice(j,1); 
                  }  
                }           
            }
          }

          if (args.selectedGroupStatus) {
            for (var i = 0; i < $scope.vehDetails.length; i++) {
              if ($scope.vehDetails[i].obj_gp_id == args.selectedGroup) {
                if ($scope.selectedDevices.indexOf($scope.vehDetails[i].obj_device_id) == -1) {
                  $scope.selectedDevices.push($scope.vehDetails[i].obj_device_id); 
       
                  $scope.parkingMarkers = [];
                  $scope.eventMarkers = [];
                  $scope.idlingMarkers = [];
                  $scope.geozoneMarkers = [];
                  $scope.center=[$scope.vehDetails[i].track_vehicles_veh_latitude,$scope.vehDetails[i].track_vehicles_veh_longitude];
                  $scope.icon = "/car.png";
                  
                  if($scope.vehDetails[i].track_vehicles_status=='Moving'){
                     
                    $scope.iconFolder = "green";           

                    if($scope.vehDetails[i].track_vehicles_veh_angle ==0 || $scope.vehDetails[i].track_vehicles_veh_angle == 360){
                      $scope.direction = "0";
                    }else if($scope.vehDetails[i].track_vehicles_veh_angle == 90){
                      $scope.direction = "90";
                    }else if($scope.vehDetails[i].track_vehicles_veh_angle == 180){
                      $scope.direction = "180";
                    }else if($scope.vehDetails[i].track_vehicles_veh_angle == 270){
                      $scope.direction = "270";
                    }else if($scope.vehDetails[i].track_vehicles_veh_angle > 0 && $scope.vehDetails[i].track_vehicles_veh_angle < 90){
                      $scope.direction = "45";
                    }else if($scope.vehDetails[i].track_vehicles_veh_angle > 90 && $scope.vehDetails[i].track_vehicles_veh_angle < 180){
                      $scope.direction = "135";
                    }else if($scope.vehDetails[i].track_vehicles_veh_angle >180 && $scope.vehDetails[i].track_vehicles_veh_angle < 270 ){
                      $scope.direction = "225";
                    }else{
                      $scope.direction = "315";
                    }

                    $scope.icon = "/car_"+$scope.direction+".png";

                  }else if($scope.vehDetails[i].track_vehicles_status=='Idling')
                    $scope.iconFolder = "orange";
                  else
                     $scope.iconFolder = "red";

                  $scope.tempMarker={label:$scope.vehDetails[i].obj_name.toString().substr(0, 15), angle:$scope.vehDetails[i].track_vehicles_veh_angle, title:$scope.vehDetails[i].obj_name, icon: $scope.imagePath+'/'+$scope.iconFolder+$scope.icon,vehDetails:$scope.vehDetails[i],animation: 'Animation.DROP'}; 
                   
                  $scope.onlineMarkers.push($scope.tempMarker) ; 
                    
                  var lat =$scope.vehDetails[i].track_vehicles_veh_latitude;
                  var lng = $scope.vehDetails[i].track_vehicles_veh_longitude;
                  var loc = new google.maps.LatLng(lat, lng);
                  $scope.center.push(loc);
                }
              }
            }
          }else{
            for (var i = 0; i < $scope.vehDetails.length; i++) {
              if ($scope.vehDetails[i].obj_gp_id == args.selectedGroup) {
                for (var j = 0; j < $scope.selectedDevices.length; j++) { 
                  if($scope.selectedDevices[j] == $scope.vehDetails[i].obj_device_id){             
                    $scope.selectedDevices.splice(j,1); 
                  }  
                }

                for (var k = 0; k < $scope.onlineMarkers.length; k++){  
                  if($scope.onlineMarkers[k].vehDetails.obj_device_id == $scope.vehDetails[i].obj_device_id){
                    $scope.onlineMarkers.splice(k,1);        
                  }             
                }
              }
            }
          }

        }
                                         
    })

  });

  $scope.updateMap = function(){

    Online.getVehicleDetails($scope.auth_token)
    .success(function (data){
      
      $scope.vehDetails = data.vehDetails.data;

      $rootScope.allno = data.vehDetails.all;
      $rootScope.online = data.vehDetails.online;
      $rootScope.idle = data.vehDetails.idle;
      $rootScope.conpblm = data.vehDetails.not; 
      $rootScope.didnotrun  = data.vehDetails.didnotrun;   

      $rootScope.groups = data.orgGroups;

      
      for (var i = 0; i < $scope.vehDetails.length; i++) {

        if ($scope.selectedDevices.indexOf($scope.vehDetails[i].obj_device_id) != -1) {

          $scope.icon = "/car.png";

            if($scope.vehDetails[i].track_vehicles_status=='Moving'){
                 
              $scope.iconFolder = "green";
            
                if($scope.vehDetails[i].track_vehicles_veh_angle ==0 || $scope.vehDetails[i].track_vehicles_veh_angle == 360){
                  $scope.direction = "0";
                }else if($scope.vehDetails[i].track_vehicles_veh_angle == 90){
                  $scope.direction = "90";
                }else if($scope.vehDetails[i].track_vehicles_veh_angle == 180){
                  $scope.direction = "180";
                }else if($scope.vehDetails[i].track_vehicles_veh_angle == 270){
                  $scope.direction = "270";
                }else if($scope.vehDetails[i].track_vehicles_veh_angle > 0 && $scope.vehDetails[i].track_vehicles_veh_angle < 90){
                  $scope.direction = "45";
                }else if($scope.vehDetails[i].track_vehicles_veh_angle > 90 && $scope.vehDetails[i].track_vehicles_veh_angle < 180){
                  $scope.direction = "135";
                }else if($scope.vehDetails[i].track_vehicles_veh_angle >180 && $scope.vehDetails[i].track_vehicles_veh_angle < 270 ){
                  $scope.direction = "225";
                }else{
                  $scope.direction = "315";
                }

              $scope.icon = "/car_"+$scope.direction+".png";

            }
            else if($scope.vehDetails[i].track_vehicles_status=='Idling')
              $scope.iconFolder = "orange";
            else
              $scope.iconFolder = "red";

            $scope.tempMarker={label:$scope.vehDetails[i].obj_name.toString().substr(0, 15), angle:$scope.vehDetails[i].track_vehicles_veh_angle, title:$scope.vehDetails[i].obj_name , icon: $scope.imagePath+'/'+$scope.iconFolder+$scope.icon,vehDetails:$scope.vehDetails[i],animation: ''}; 
        

          for (var prop in $scope.onlineMarkers) {
            if ($scope.onlineMarkers.hasOwnProperty(prop)) {        
              if($scope.vehDetails[i].obj_device_id==$scope.onlineMarkers[prop].vehDetails.obj_device_id)
                $scope.onlineMarkers.splice(prop,1);
            }
          }
        
          $scope.onlineMarkers.push($scope.tempMarker);

          $scope.refreshNGMap();
       
        }      
      };
      $('#preloader').delay(1350).fadeOut(); 
    }) 

  }


  var myInterval;
   // Active
  window.addEventListener('focus', startTimer);
   // Inactive
  window.addEventListener('blur', stopTimer);
  function timerHandler() {   
     $scope.updateMap();  
  }

  function startTimer() {
    $scope.updateMap();
    myInterval = window.setInterval(timerHandler, 25000);
   }
  function stopTimer() {
    window.clearInterval(myInterval);
   }*/
 
  $rootScope.$on('refreshDetails', function(event,args){
    $scope.selectedDevices = [];
    $scope.onlineMarkers = [];
  });

  $rootScope.$on("changeLiveOptions", function(event,args){
    
    $scope.selectedLiveDisplayOption = args.option;

  });

//TO hide the tracks and the slider plugin
  $scope.hideTrack = function(){

      $rootScope.playandpause = false;
      $scope.tripFlag = false;
      $rootScope.tripHistory = [];
      $scope.stops = [];
      $scope.currentTrack = [];
      $scope.track = [];
      $scope.parkings = [];      
      $rootScope.events = []; 
      $scope.idlings = [];
      $scope.points = [];
      $scope.polylinePoints = [];
      $scope.movingPoints = [];
      $scope.movingPoints=[];
      $scope.parkingMarkers = [];
      $scope.eventMarkers = [];
      $scope.idlingMarkers = [];

      if (zonePolygon) {
        for (var i = 0; i < $scope.zonePolygonCoords.length; i++) {
          zonePolygon.setMap(null);
        }
        $scope.zonePolygonCoords = [];
      }

      if ($scope.zoneMarker.length > 0) {

        for (var i = 0; i < $scope.zoneMarker.length; i++){  
          $scope.zoneMarker.splice(i,1);        
        }
      }

  }

  $scope.showCurrentTrack = function(deviceID,tripID){
    if($rootScope.showMapOfTripFlag==false)
      $rootScope.showLoading();

    $scope.traffic = false;
    trafficLayer.setMap(null);
    $scope.infoBubble.close();
    $rootScope.playandpause = true;
    $scope.parkingMarkers = [];
    $scope.eventMarkers = [];
    $scope.idlingMarkers = [];
    $scope.geozoneMarkers = [];
    $scope.tripHistory = [];
    $scope.stops = [];
    $scope.currentTrack = [];
    $scope.track = [];
    $rootScope.tripHistoryDetails = {};

    $scope.tripFlag=true;
   
    if (zonePolygon) {
      for (var i = 0; i < $scope.zonePolygonCoords.length; i++) {
        zonePolygon.setMap(null);
      }
      $scope.zonePolygonCoords = [];
    }

    if ($scope.zoneMarker.length > 0) {

      for (var i = 0; i < $scope.zoneMarker.length; i++){  
        $scope.zoneMarker.splice(i,1);        
      }
    }

    $scope.save_deviceID(deviceID);

    if ($scope.get_deviceID() != -1 || 1==1) {



      var request = Online.getVehDetails(deviceID,tripID,$scope.auth_token);
      $rootScope.requests.push(request);

      request.promise.then(function (data){



        $rootScope.clearRequest(request);
        $rootScope.hideLoading();
        $rootScope.tripHistory = data.tripHistory;
        $rootScope.stops = $rootScope.tripHistory.stops;
        $rootScope.idling = $rootScope.tripHistory.idling; 
        $rootScope.geoZones = $rootScope.tripHistory.geozones;
        $rootScope.salikData = $rootScope.tripHistory.salik;
        $rootScope.events = $rootScope.tripHistory.events;
        $rootScope.details = $rootScope.tripHistory.details;
       // alert($rootScope.details);
       
       $rootScope.tripHistoryDetails.fuelrates = $rootScope.tripHistory.fuelrates;
       $rootScope.tripHistoryDetails.totalStops = $rootScope.tripHistory.totalStops;
       $rootScope.tripHistoryDetails.idlingTime = $rootScope.tripHistory.idlingTime;
        
        $scope.currentTrack = data.get_current_track;
        $scope.track = $scope.currentTrack.points;
 
 

        if ($scope.center[0] != $scope.track[$scope.track.length-1].track_vehicles_veh_latitude && $scope.center[1] != $scope.track[$scope.track.length-1].track_vehicles_veh_longitude) {
          vm.map.setZoom(16);
        }
        $scope.center = [$scope.track[$scope.track.length-1].track_vehicles_veh_latitude,$scope.track[$scope.track.length-1].track_vehicles_veh_longitude];

        //vm.map.setZoom(16);
        $scope.parkings = $scope.currentTrack.parkings;        
        $scope.parkingMarkers.push($scope.parkings);
        
        $scope.events = $rootScope.tripHistory.events; 
        $scope.eventMarkers.push($scope.events);

        $scope.idlings = $rootScope.tripHistory.idling;
        $scope.idlingMarkers.push($scope.idlings);

        $scope.GeozonesOnMap =  $rootScope.tripHistory.geozones;
        $scope.geozoneMarkers.push($scope.GeozonesOnMap);
    
        $scope.points = [];
        $scope.polylinePoints = [];
        $scope.movingPoints = [];
    
          for (var i = 0; i < $scope.track.length-1; i++) {

             

            $scope.points = [];
            $scope.points.push($scope.track[i].track_vehicles_veh_latitude,$scope.track[i].track_vehicles_veh_longitude);

            $scope.movingPoints.push($scope.points); 
          };
          $(".rightSideLoader").hide();

          for (var i = 0; i < $scope.track.length; i++) {
            $scope.points = [];


             

            if ($scope.track[i].track_vehicles_veh_speed <= 60  ) {

              if(i!=0)
                $scope.points.push([$scope.track[i-1].track_vehicles_veh_latitude,$scope.track[i-1].track_vehicles_veh_longitude]);

              $scope.points.push([$scope.track[i].track_vehicles_veh_latitude,$scope.track[i].track_vehicles_veh_longitude]);

              if(i<$scope.track.length)
                $scope.points.push([$scope.track[i+1].track_vehicles_veh_latitude,$scope.track[i+1].track_vehicles_veh_longitude]);

                $scope.polylinePoints.push({point:$scope.points,color:'green',speed:$scope.track[i].track_vehicles_veh_speed,time:$scope.track[i].track_time,trackDate:$scope.track[i].track_date});
            }
            else if ($scope.track[i].track_vehicles_veh_speed <= 100 && $scope.track[i].track_vehicles_veh_speed > 60) {
              if(i!=0)
                $scope.points.push([$scope.track[i-1].track_vehicles_veh_latitude,$scope.track[i-1].track_vehicles_veh_longitude]);

              $scope.points.push([$scope.track[i].track_vehicles_veh_latitude,$scope.track[i].track_vehicles_veh_longitude]);

              if(i<$scope.track.length+1)
                $scope.points.push([$scope.track[i+1].track_vehicles_veh_latitude,$scope.track[i+1].track_vehicles_veh_longitude]);

              $scope.polylinePoints.push({point:$scope.points,color:'orange',speed:$scope.track[i].track_vehicles_veh_speed,time:$scope.track[i].track_time,trackDate:$scope.track[i].track_date});

            }else if ($scope.track[i].track_vehicles_veh_speed > 100) {

              if(i!=0)
                $scope.points.push([$scope.track[i-1].track_vehicles_veh_latitude,$scope.track[i-1].track_vehicles_veh_longitude]);

              $scope.points.push([$scope.track[i].track_vehicles_veh_latitude,$scope.track[i].track_vehicles_veh_longitude]);

              if(i<$scope.track.length+1)
                $scope.points.push([$scope.track[i+1].track_vehicles_veh_latitude,$scope.track[i+1].track_vehicles_veh_longitude]);
              
              $scope.polylinePoints.push({point:$scope.points,color:'red',speed:$scope.track[i].track_vehicles_veh_speed,time:$scope.track[i].track_time,trackDate:$scope.track[i].track_date});
            }
            else{

              $scope.polylinePoints.push({point:$scope.points,color:'yellow',speed:$scope.track[i].track_vehicles_veh_speed,time:$scope.track[i].track_time,trackDate:$scope.track[i].track_date});
            }

          } 
      })  
    } 

  }

  $rootScope.clearRequest = function(request) {
    $rootScope.requests.splice($rootScope.requests.indexOf(request), 1);
  };


  $scope.getMapOfThisRow = function(deviceId,tripId){
   

    $(".rightSideLoader").show();

    /*$rootScope.playandpauseFlag = true;
    $scope.refreshNGMap();
    NgMap.initMap('Map');

    NgMap.getMap().then(function(map) {
      var currCenter = map.getCenter();
      google.maps.event.trigger(map, 'resize');
      
      map.setCenter(currCenter);
    });

    angular.element(document.getElementById('addGroup')).scope().showCurrentTrack(deviceId,tripId);
    $rootScope.playandpause = false;
    $( "#slider" ).slider({
      slide: function( event, ui ) {              
        vm.setTrackerPosition(ui.value);
      }
    });*/
    if($(".sb-slidebar.sb-right.ng-scope").hasClass('sb-active'))
    {
      //alert("sb-active");
      //$(".sb-slidebar.sb-right.ng-scope").removeClass('sb-active');
      setTimeout(
      function() 
      {
        //do something special
        if(!$(".sb-slidebar.sb-right.ng-scope").hasClass('sb-active'))
        {
          $(".sb-slidebar.sb-right.ng-scope").addClass('sb-active');
        }
      }, 500);
    }
    $rootScope.$broadcast('showMapInSettings', { deviceId: deviceId, tripId: tripId });
  }

  $rootScope.$on("showOnlineEventInfowindow", function(event,args){

    $scope.center=[args.onlineEvent.event_latitude,args.onlineEvent.event_longitude];

     vm.event = args.onlineEvent;

      $scope.tooltipStatusIgnition=true;
      $scope.tooltipStatus=false;
       setTimeout(function () {
      $scope.$apply(function(){
          $scope.tooltipStatusIgnition= false;
      });
    }, 6000);

  });

  $rootScope.$on("trackDetails", function(event,args){

    $rootScope.playandpause = true;
    $scope.deviceId = args.deviceId;
    $scope.showCurrentTrack($scope.deviceId,args.tripId);
    $( "#slider" ).slider({
      slide: function( event, ui ) {              
        vm.setTrackerPosition(ui.value);
      }
    });
  });

  $rootScope.$on("selectedType", function(event,args){

    $scope.refreshNGMap();

    if(args.value=='Report'){
      $scope.selectedLiveDisplayOption="ditty";
      $( ".rightsideopen" ).hide();
      $scope.liveObjectMarkerFlag =false;     
      $scope.tripFlag = false;
      $rootScope.liveSchedulingFlag = false;
      $rootScope.showMapOfTripFlag = false;
      $scope.report=true;
      $scope.googlemap=false;
      $scope.analytics = false;
      $scope.maintenance = false;
      $scope.ServiceReminderFlag = false;
      $scope.showDocFlag = false;
      $scope.showFuelFlag = false;
      trafficLayer.setMap(vm.map);
      $rootScope.playandpause = false;

    }else if (args.value=='Analytics') {
      $scope.selectedLiveDisplayOption="ditty";
      $scope.liveObjectMarkerFlag =false;
      $scope.tripFlag = false;
      $scope.analytics = true;
      $scope.report=false;
      $scope.googlemap=false;
      $scope.maintenance = false;
      $scope.ServiceReminderFlag = false;
      $scope.showFuelFlag = false;
      $scope.showDocFlag = false;
      trafficLayer.setMap(vm.map);
      $( ".rightsideopen" ).hide();  
      $rootScope.playandpause = false;

    }else if (args.value=='History') {
      $scope.selectedLiveDisplayOption="ditty";
      $scope.historyVehIDs={};
      $scope.liveObjectMarkerFlag =false;  
      $scope.tripFlag = true; 
      $scope.analytics = false;
      $scope.report=false;
      $scope.googlemap=true;
      $scope.maintenance = false;
      $scope.ServiceReminderFlag = false;
      $scope.showFuelFlag = false;
      $scope.showDocFlag = false;
      trafficLayer.setMap(null);
      $scope.traffic = false;
      $( ".rightsideopen" ).hide();  

      if (zonePolygon) {
        for (var i = 0; i < $scope.zonePolygonCoords.length; i++) {
          zonePolygon.setMap(null);
        }
        $scope.zonePolygonCoords = [];
      }

      if ($scope.zoneMarker.length > 0) {

        for (var i = 0; i < $scope.zoneMarker.length; i++){  
          $scope.zoneMarker.splice(i,1);        
        }
      }

    }else if (args.value=='Maintanance'){
      $scope.selectedLiveDisplayOption="ditty";
      $scope.liveObjectMarkerFlag =false; 
      $scope.tripFlag = false; 
      $scope.analytics = false;
      $scope.report=false;
      $scope.googlemap=false;
      $scope.maintenance=true;
      $scope.ServiceReminderFlag = false;
      $scope.showDocFlag = false;
      $scope.showFuelFlag = false;
      $( ".rightsideopen" ).hide(); 
      $rootScope.playandpause = false; 

      $scope.addFuel();
      
    }else if(args.value=='Online'){
      $scope.selectedLiveDisplayOption="all";
      $scope.liveObjectMarkerFlag =true;
      $scope.tripFlag = false;
      $( ".rightsideopen" ).show(); 
      $scope.hidetrackFlag = true;
      $rootScope.liveSchedulingFlag = true;
      $rootScope.showMapOfTripFlag = false; 
      $scope.report=false;
      $scope.traffic = true;
      trafficLayer.setMap(vm.map);
      $scope.googlemap=true;
      $scope.analytics = false;
      $scope.maintenance = false;
      $scope.ServiceReminderFlag = false;
      $scope.showFuelFlag = false;
      $scope.doc = false;
      $(".onlineVehicleCheckBox ").attr("checked",true);
      $rootScope.playandpause = false;

      if (zonePolygon) {
        for (var i = 0; i < $scope.zonePolygonCoords.length; i++) {
          zonePolygon.setMap(null);
        }
        $scope.zonePolygonCoords = [];
      }

      if ($scope.zoneMarker.length > 0) {

        for (var i = 0; i < $scope.zoneMarker.length; i++){  
          $scope.zoneMarker.splice(i,1);        
        }
      }

    }else{
      $scope.selectedLiveDisplayOption="ditty";
      $( ".rightsideopen" ).hide(); 
      $scope.liveObjectMarkerFlag =false;  
      $scope.tripFlag = false;
      $scope.report=false;
      $scope.traffic = false;
      trafficLayer.setMap(null);
      $scope.googlemap=true;
      $scope.analytics = false;
      $scope.maintenance = false;
      $scope.ServiceReminderFlag = false;
      $scope.showFuelFlag = false;
      $scope.doc = false;
      $rootScope.playandpause = false;

      if (zonePolygon) {
        for (var i = 0; i < $scope.zonePolygonCoords.length; i++) {
          zonePolygon.setMap(null);
        }
        $scope.zonePolygonCoords = [];
      }

      if ($scope.zoneMarker.length > 0) {

        for (var i = 0; i < $scope.zoneMarker.length; i++){  
          $scope.zoneMarker.splice(i,1);        
        }
      }
    
    }
   // $scope.selectedDevices=[];
    $scope.infoBubble.close();
 

    setTimeout(function () {
      $scope.$apply(function(){
           $scope.refreshNGMap();
          
      });
    }, 500);

  });

  /*$rootScope.$on("onlineCreateReport", function(event,args){
 
    $scope.reportID = args.rID;
    $scope.fromDate = args.from;
    $scope.toDate = args.to;
    $scope.toPDF = args.makepdf;
    $scope.rptGzIDs=args.rptGzIDs;

    $http({
      method  : 'post',url     : baseUrl + 'ReportCreator' ,headers: {'Xtoken': $scope.authtoken},data: {vehIDs: args.vehIDs,fromDate: $scope.fromDate, toDate:$scope.toDate, reportID:$scope.reportID, toPDF: $scope.toPDF,rptGzIDs:$scope.rptGzIDs } 
    })
    .success(function (data){

        if($scope.toPDF==1){
        
          window.open(data[0].vehicles);
        }else{

          $scope.report = data;  
        }

        if( $scope.reportID==23){
          $scope.drawBarChart(); 
        }

        if( $scope.reportID==2 || $scope.reportID==5){
          $rootScope.showMapOfTripFlag = true;
          $( ".rightsideopen" ).show(); 
        }
        $rootScope.hideLoading();
    })
    .error(function (error) {

    });
  });*/

  $rootScope.$on("onlineCreateReport", function(event,args){
 
    $scope.reportID = args.rID;
    $scope.fromDate = args.from;
    $scope.toDate = args.to;
    $scope.toPDF = args.makepdf;
    $rootScope.graphLength = args.vehIDs.length;
    $scope.rptGzIDs=args.rptGzIDs;
    $scope.toSendEmail=args.toSendEmail;
    $scope.toExcel=args.toExcel;
    $scope.tripAndParkingReportDetails = [];
    $scope.tripCount = 0;
    $scope.totalOdometer = 0;
    $scope.parkingCount = 0;
    $scope.totalDuration = "00:00:00";
    $scope.singleVehReportDetails = {};
    $scope.totalVehReportDetails = [];
    $scope.deviceID = '';

    $rootScope.showLoading();

    var request = Online.createReport(args.vehIDs,$scope.fromDate,$scope.toDate,$scope.reportID,$scope.toPDF,$scope.rptGzIDs,$scope.auth_token,$scope.toSendEmail,$scope.toExcel);
    $rootScope.requests.push(request);
    request.promise.then(function (data){
      $rootScope.clearRequest(request);      

        if($scope.toPDF==1){
        
          window.open(data[0].vehicles);
        }else{
          $scope.report = data;  
        }

        if( $scope.reportID==23){
          $scope.drawBarChart(); 
        }

        if( $scope.reportID==29){
           $rootScope.graphLength = args.vehIDs.length;
          $rootScope.analogData = $scope.report;
          $scope.drawAnalogChart($rootScope.analogData,$rootScope.graphLength); 
        }

        if( $scope.reportID==2 || $scope.reportID==5){
          $rootScope.showMapOfTripFlag = true;
        }
        $rootScope.hideLoading();

        angular.forEach($scope.report, function(item) {
          if (item.vehicles) 
            $scope.tripAndParkingReportDetails.push(item);         
        });

        for (var i = 0; i < $scope.tripAndParkingReportDetails.length; i++) {

          $scope.tripCount = 0;
          $scope.totalOdometer = 0;
          $scope.parkingCount = 0;
          $scope.totalDuration = "00:00:00";
          $scope.hour = 0;
          $scope.minute = 0;
          $scope.second = 0;
          $scope.deviceID = $scope.tripAndParkingReportDetails[i].deviceid;

          for (var j = 0; j < $scope.tripAndParkingReportDetails[i].vehicles.length; j++) {

            if($scope.tripAndParkingReportDetails[i].vehicles[j].type == 'Trips' && $scope.tripAndParkingReportDetails[i].vehicles[j].tripmileage != 0){
              $scope.tripCount += 1;
              if ($scope.tripAndParkingReportDetails[i].vehicles[j].tripmileage > 0) {
                $scope.totalOdometer += parseFloat($scope.tripAndParkingReportDetails[i].vehicles[j].tripmileage);

                if($scope.tripAndParkingReportDetails[i].vehicles[j].duration){

                  $scope.splitTime1 = $scope.totalDuration.split(':');
                  $scope.splitTime2 = $scope.tripAndParkingReportDetails[i].vehicles[j].duration.split(':');

                  $scope.hour = parseInt($scope.splitTime1[0])+parseInt($scope.splitTime2[0]);
                  $scope.minute = parseInt($scope.splitTime1[1])+parseInt($scope.splitTime2[1]);
                  $scope.hour = parseInt($scope.hour + $scope.minute/60);
                  $scope.minute = parseInt($scope.minute%60);
                  $scope.second = parseInt($scope.splitTime1[2])+parseInt($scope.splitTime2[2]);
                  $scope.minute = parseInt($scope.minute + $scope.second/60);
                  $scope.second = parseInt($scope.second%60);

                  $scope.totalDuration = $scope.hour+':'+$scope.minute+':'+$scope.second;
                }
              }
            }
            if ($scope.tripAndParkingReportDetails[i].vehicles[j].type == 'Parking') {
              $scope.parkingCount += 1;
            }

            $scope.singleVehReportDetails = {deviceID:$scope.deviceID,tripCount:$scope.tripCount,totalOdometer:$scope.totalOdometer,parkingCount:$scope.parkingCount,totalDuration:$scope.totalDuration};

          }
          $scope.totalVehReportDetails.push($scope.singleVehReportDetails);
        }
              
    })
      .error(function (error) {
        $rootScope.hideLoading();
      });
  });





$scope.range = function(count){
  var ratings = []; 
  for (var i = 0; i < count; i++) { 
    ratings.push(i) 
  } 
  return ratings;
}




$scope.drawAnalogChart = function(fn,ln){

  $scope.analogchartdata = fn;
  $scope.len = ln;
  //$scope.vehicleName = {};
  if($scope.len>0)
  {

    for(var i = 0; i < $scope.len; i++){
      for (var i = 0; i < $scope.len; i++) {

    $scope.k = $scope.analogchartdata[i].vehicles;
    $scope['vehicleName' +i] = $scope.analogchartdata[i].name;
    //$scope['isbox_' + i ] = !$scope['isbox_' + i ];
    //$scope.kill = $scope.analogchartdata[i].name;
    //$scope.kk = $scope.analogchartdata[i].times;
    //$scope.kk.push($scope.analogchartdata[i].name);
    $scope.kk = [];

   // alert($scope.analogchartdata[i].times.length);
    
    for (var ul = 0; ul < $scope.analogchartdata[i].times.length; ul++) {
     $scope.kk.push("");
   }; 

  // alert($scope.kk);
/*
 $scope.kk = ["00","","","","1:00","","","","2:00","","","","3:00","","","","04:00","","","","5:00","","","","6:00","","","","7:00","","","","8:00","","","","9:00","","","","10:00","","","","11:00","","","","12:00","","","","13:00","","","","14:00","","","","15:00","","","","16:00","","","","17:00","","","","18:00","","","","19:00","","","","20:00","","","","21:00","","","","22:00","","","","23:00","","","","24:00"];
 */

    var lineChartData = {
      labels : $scope.kk,
      datasets : [
      {
        fillColor : "#F9E9E6",
        strokeColor : "rgba(49, 195, 166, 1)",
        data : $scope.k
      } 
      ]
    }

    var myLine = new Chart(document.getElementById("canvas"+i).getContext("2d")).Line(lineChartData);

                       };

                 };

             }

        }



  $scope.drawBarChart = function(){

    $scope.reportID=$scope.reportID;
    $scope.fromDate=$scope.fromDate;
    $scope.toDate=$scope.toDate;
 
    if($scope.reportID==23)

      var $k = [{"label":"Salim","value":918},{"label":"Abu editd","value":618}];
      $scope.DriverBarChart = {
          chart: {
              caption: "Most Drived Driver",
              subCaption: "Top 5 drived drivers in the mentioned date",
              numberPrefix: "",
              theme: "ocean"
          },
          data: $k
      };
  }
 
  //  to get user image in report////
  $scope.getUserOrgLogo = function(){
    $scope.basePath     = basePath;
    var user            = $rootScope.Get_User();

    $scope.userOrgLogo  =   user.organisation.logo; 
    $scope.image        =   user.photo;

/*    $scope.userOrgLogo = {};  
    $http({
      method  : 'post',
      url     : baseUrl + 'api-v1/user/getAdminOrgLogo', headers: {'Xtoken':$rootScope.get_auth_token()}
    })
    .success(function (data){   

      if(data.status!='error'){
        $scope.userOrgLogo = data.userlogo[0]; 
        $scope.image = data.thumb;
      }   
      $scope.basePath = basePath;          
    })
    .error(function (error) {
    });*/
  };

  $scope.getUserOrgLogo();

/*  $scope.getGroups = function(){
   
    $scope.authtoken = $scope.get_auth_token();
    $scope.groups = {};

    $http({
      method  : 'post',
      url     : baseUrl + 'api-v1/user/getObjGroupsForUser', headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){

      $scope.groups = data.orgGroups;
    })
    .error(function (error) {

    });
  }*/
 // $scope.getGroups();

  $scope.refresh = function(){

   // $scope.getGroups();
  }

  $scope.getDetails = function(option){
   
    $scope.AnalyticsDuration=option;
    $scope.timeInterval = option;

    if (option == 'today') {

      $scope.today = new Date();
      $scope.fromDate = $filter('date')(new Date(), 'yyyy-MM-dd');
      $scope.toDate = $filter('date')($scope.today.setDate($scope.today.getDate() + 1), 'yyyy-MM-dd');
      $scope.fromTime = $filter('date')(new Date(), 'hh:mm:ss');
      $scope.toTime = $filter('date')(new Date(), 'hh:mm:ss');
      $scope.from = $scope.fromDate +" "+$scope.fromTime;
      $scope.to = $scope.toDate +" "+$scope.toTime; 

      Online.showVehicle($scope.objID,$scope.objDeviceID,$scope.from,$scope.to,$scope.auth_token)
      .success(function (data){

        $scope.vehicledtls = data.data[0]; 
        $scope.lastupdated = data.lastupdated;
        $scope.details = data.details;
        vm.DrawDonutPie(data.details.percentageOfTimes[0],data.details.percentageOfTimes[1],data.details.percentageOfTimes[2]);
      }) 

    }else if (option == 'yesterday') {

      $scope.today = new Date();
      $scope.fromDate = $filter('date')($scope.today.setDate($scope.today.getDate() - 1), 'yyyy-MM-dd');
      $scope.toDate = $filter('date')(new Date(), 'yyyy-MM-dd');
      $scope.fromTime = $filter('date')(new Date(), 'hh:mm:ss');
      $scope.toTime = $filter('date')(new Date(), 'hh:mm:ss');
      $scope.from = $scope.fromDate +" "+$scope.fromTime;
      $scope.to = $scope.toDate +" "+$scope.toTime; 

      Online.showVehicle($scope.objID,$scope.objDeviceID,$scope.from,$scope.to,$scope.auth_token)
      .success(function (data){

        $scope.vehicledtls = data.data[0]; 
        $scope.lastupdated = data.lastupdated;
        $scope.details = data.details;
        vm.DrawDonutPie(data.details.percentageOfTimes[0],data.details.percentageOfTimes[1],data.details.percentageOfTimes[2]);
      })  

    }else{

      $scope.today = new Date();
      $scope.fromDate = $filter('date')($scope.today.setDate($scope.today.getDate() - 100), 'yyyy-MM-dd');
      $scope.toDate = $filter('date')(new Date(), 'yyyy-MM-dd');
      $scope.fromTime = $filter('date')(new Date(), 'hh:mm:ss');
      $scope.toTime = $filter('date')(new Date(), 'hh:mm:ss');
      $scope.from = $scope.fromDate +" "+$scope.fromTime;
      $scope.to = $scope.toDate +" "+$scope.toTime; 

      Online.showVehicle($scope.objID,$scope.objDeviceID,$scope.from,$scope.to,$scope.auth_token)
      .success(function (data){

        $scope.vehicledtls = data.data[0]; 
        $scope.lastupdated = data.lastupdated;
        $scope.details = data.details;
        vm.DrawDonutPie(data.details.percentageOfTimes[0],data.details.percentageOfTimes[1],data.details.percentageOfTimes[2]);
      })  

    }
  }

  vm.DrawDonutPie = function($movingTime,$parkingTime,$idlingTime){
    $scope.showGraph=false;
    if($movingTime >0 || $parkingTime>0 || $idlingTime>0){
      $scope.showGraph=true;

     
    
      $("#graph").html("");
      Morris.Donut({
        element: 'graph',
        data: [

        {value: $movingTime, label: 'Moving'},
        {value: $parkingTime, label: 'Parking'},
        {value: $idlingTime, label: 'Idling'}
        ],
        backgroundColor: '#f2f2f2',
        labelColor: '#1451a5',
        colors: [

        '#4caf50',
        '#f44336',
        'orange'
        ],
        formatter: function (x) { return x + "%"}
      });
    }
  }

  $scope.dashMapTitle = '';

  $rootScope.$on("vehicleDetailsforDashboard", function(event,args){

    $rootScope.first_device_id=args.deviceID;
    $rootScope.first_obj_id=args.objID;
    $scope.dashMapCenter=[];
    $rootScope.showLoading();
    $scope.today = new Date();
    $scope.fromDate = $filter('date')($scope.today.setDate($scope.today.getDate() - 1), 'yyyy-MM-dd');
    $scope.toDate = $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.fromTime = $filter('date')(new Date(), 'hh:mm:ss');
    $scope.toTime = $filter('date')(new Date(), 'hh:mm:ss');
    $scope.from = $scope.fromDate +" "+$scope.fromTime;
    $scope.to = $scope.toDate +" "+$scope.toTime; 
    $scope.latestRemainders = {}; 

    $scope.objID = args.objID;
    $rootScope.maintenanceObjID = $scope.objID;
    $scope.objDeviceID = args.deviceID;
    $scope.objDeviceIDMaintenance = $scope.objDeviceID;

    if ($scope.get_org_name() == -1) {
      $scope.organisationName = 'Default';
    }else{
      $scope.organisationName = $scope.get_org_name();
    }

    Online.showVehicle($scope.objID,$scope.objDeviceID,$scope.from,$scope.to,$scope.auth_token)
    .success(function (data){

      $scope.vehicledtls = data.data[0]; 
      $scope.lastupdated = data.lastupdated;
      $scope.details = data.details;
      $scope.dashMapCenter.push(data.LatLon[0].track_vehicles_veh_latitude,data.LatLon[0].track_vehicles_veh_longitude);

      var latlng = new google.maps.LatLng(data.LatLon[0].track_vehicles_veh_latitude, data.LatLon[0].track_vehicles_veh_longitude);
      var geocoder = geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            $scope.dashMapTitle = results[1].formatted_address; 
          }
        }
      });

      $scope.dashMapLabel = $scope.vehicledtls.obj_name;    
      $scope.iconFolder = "red";
      $scope.dashMapMarkerIcon = $scope.imagePath+'/dashboard.png';

      if( $scope.AnalyticsDuration=='')
        $scope.getDetails('yesterday');
      else
        $scope.getDetails($scope.AnalyticsDuration);
    })  

    $http({
      method  : 'get',
      url     : baseUrl + 'getLatestRemainders/'+$scope.objDeviceID, headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){

      $scope.latestRemainders = data;     

    })
    .error(function (error) {

    });

    $http({
      method  : 'get',
      url     : baseUrl + 'getLatestDocuments/'+$scope.objDeviceID, headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){

      $scope.latestDocuments = data;         
    })
    .error(function (error) {

    });

    $http({
      method  : 'get',
      url     : baseUrl + 'getLatestFuel/'+$scope.objDeviceID, headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){

      $scope.latestFuel = data;         
    })
    .error(function (error) {

    });

    $http({
      method  : 'get',
      url     : baseUrl + 'getLatestServices/'+$scope.objDeviceID, headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){

      $scope.latestServices = data;         
    })
    .error(function (error) {

    });

    NgMap.getMap({id: 'dashboardMap' }).then(function(map) {
        google.maps.event.trigger(map, 'resize');
    });

    $rootScope.hideLoading();

  }); 

  vm.getCurrentLocation = function(e,marker){  

   //$rootScope.pointerLocationAddress='545';

    $scope.infoBubble.close();

    //if( $scope.vehicleId != marker.vehDetails.obj_device_id){
      
      $scope.infoBubble = new InfoBubble({
          maxWidth: 330
      });  
    //}

    $scope.vehicleId = marker.vehDetails.obj_device_id;
    $scope.authtoken = $scope.get_auth_token();
   // $rootScope.pointerLocationAddress='Loading...';
    $rootScope.infoMarker = marker.vehDetails;

     
     
    //Code to find the current address for the popup - START

          var latlng = new google.maps.LatLng($rootScope.infoMarker.track_vehicles_veh_latitude,$rootScope.infoMarker.track_vehicles_veh_longitude);
          var geocoder = geocoder = new google.maps.Geocoder();

          geocoder.geocode({ 'latLng': latlng }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              if (results[1]) {

                $rootScope.pointerLocationAddress = results[1].formatted_address; 
                $(".iwAddress_"+$scope.vehicleId).html( results[1].formatted_address);
                //alert($(".iwAddress_"+$scope.vehicleId).html());
              }else{
                $rootScope.pointerLocationAddress = ''; 
              }
            }else{
              $rootScope.pointerLocationAddress = ''; 
            }
          });
      
    //Code to find the current address for the popup - END
    
    var content = '';
   
    /*if($rootScope.infoMarker.driver_image == ""){
     
      $rootScope.infoMarker.driver_image='profile.png';
    }*/

    var div = document.createElement('div');
    content = '<div class="popbox_main">'+
     '<h1 style="padding: 2px; height: 33px;">'+$rootScope.infoMarker.obj_name.toString().substr(0, 20)+'</h1>';

    if($rootScope.infoMarker.driver_image)
      content += '<a>'+'<IMG style="position: absolute; right: 9px; border: 1px solid rgb(204, 204, 204); padding: 4px; border-radius: 50%; width: 79px;" SRC="http://mylocatorplus.net/final/assets/drivers/'+$rootScope.infoMarker.driver_image+'"></a>';
    else
      content += '<a>'+'<IMG style="position: absolute; right: 9px; border: 1px solid rgb(204, 204, 204); padding: 4px; border-radius: 50%; width: 79px;" SRC="http://mylocatorplus.net/final/assets/drivers/profile.png"></a>';

    content += 
     '<table class="popup_content"><tbody>'+
     '<tr><td>Status</td><td>: '+$rootScope.infoMarker.track_vehicles_status;

    if($rootScope.infoMarker.track_vehicles_status=='Moving')
      content += ' at '+$rootScope.infoMarker.track_vehicles_veh_speed+' km/hr';
     
      content +='</td></tr><tr><td>Ignition</td>';

    if($rootScope.infoMarker.ignition_status==1)
      content +='<td  >: On</td>';
    else
      content +='<td  >: Off</td>';
 
      content +='</tr>';

    if ($rootScope.infoMarker.driver_name)
      content +='<tr><td>Driver</td><td> : '+$rootScope.infoMarker.driver_name+'</td></tr>';
    else
      content +='<tr><td>Driver</td><td> : Not assigned</td></tr>';

    if ($rootScope.infoMarker.driver_phone) 
      content +='<tr><td>Phone</td><td> : '+$rootScope.infoMarker.driver_phone+'</td></tr>';
    else
      content +='<tr><td>Phone</td><td> :   </td></tr>';

    if($rootScope.infoMarker.gz_name)
      content +='<tr><td>Geozone</td><td> : '+$rootScope.infoMarker.gz_name+'</td></tr>';
    else
      content +='<tr><td>Geozone</td><td> : Not in geozone</td></tr>';
     /*if($rootScope.infoMarker.track_vehicles_status=='Parking')
     content += '<tr><td style="width:25%;">Parking Time</td><td> : '+$rootScope.infoMarker.track_vehicles_veh_speed+'</td></tr>';*/

     content += '<tr><td style="width:21%;">Last Update</td><td> : '+$rootScope.infoMarker.track_vehicles_timestamp_from_device+'</td></tr>';

  

    if($rootScope.infoMarker.track_vehicles_temperature && $rootScope.infoMarker.track_vehicles_temperature!=0)
     content +='<tr><td style="width:21%;">Temperature</td><td> : '+$rootScope.infoMarker.track_vehicles_temperature+" Celsius"+'</td></tr>';



      content +='<tr><td colspan="2" style="font-weight:normal"><span class="iwAddress_'+$rootScope.infoMarker.obj_device_id+'">'+$rootScope.pointerLocationAddress+'</span> </td></tr>'+
     '</tbody></table><div class="first_left"><div class="input-group" style="width:162px"> ';

      if($rootScope.infoMarker.track_vehicles_status=='Moving')
        content +='<i class="fa fa-power-off ignIcon" aria-hidden="true" style=" background:#47a447 "  ></i>';
      else if($rootScope.infoMarker.track_vehicles_status=='Parking' || $rootScope.infoMarker.track_vehicles_status=='Stopped')
        content +='<i class="fa fa-power-off ignIcon" aria-hidden="true" style="  background:#d43f3a "  ></i>';
      else if($rootScope.infoMarker.track_vehicles_status=='Idling')
        content +=' <i class="fa fa-power-off ignIcon" aria-hidden="true" style="  background:Orange " ></i>';
      else if($rootScope.infoMarker.track_vehicles_status=='Out of Coverage')
        content +=' <i class="fa fa-power-off  btn-gray ignIcon" aria-hidden="true" style="  background:grey "  ></i> ';

      content +=' <input type="text" style="text-align:right;background-color:white;" value="'+$rootScope.infoMarker.mileage+'" readonly="" class="form-control iwMileage_'+$rootScope.infoMarker.obj_device_id+'"   /></div></div>'+
      ' <ul class="icon_set" ><li ><a  onclick="addNotification('+$rootScope.infoMarker.obj_device_id+')"  class="ttip" title="Notify Customer"><img src="assets/images/icon1.png" /></a></li>'+
      '<li><a class="ttip"  onclick="shareLocation('+$rootScope.infoMarker.obj_device_id+')" title="Share the Location"><img src="assets/images/icon3.png" /></a></li>'+
      '<li><a class="ttip"  onclick="enableStreetView()" title="Street View"><img src="assets/images/icon4.png" /></a></li>'+
      '<li><a onclick="showCurrentTrack('+$rootScope.infoMarker.obj_device_id+','+$rootScope.infoMarker.track_vehicles_trip_id+')"  class=" ttip showCurrentTrack"     title="Current Trip"><img src="assets/images/icon5.png" /></a></li>'+
      //'<li><a onclick="pause()" class="ttip" title="Pause"><i class="fa fa-pause" aria-hidden="true"></i></a></li></ul>'+

      '</div>';

    div.innerHTML=content;
    $scope.infoBubble.addTab('A Tab', div);

    google.maps.event.addListener(marker, 'click', function() {
       
      if (!$scope.infoBubble.isOpen()) {
       // infoBubble.open(vm.map, this);
      }
    });
     
    if (!$scope.infoBubble.isOpen()) {
      $scope.infoBubble.open(vm.map, this);
    }
 /*   $http({
      method  : 'get',
      url     : baseUrl + 'api-v1/user/GetTotalMileage/'+$scope.vehicleId, headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){  

      $(".iwMileage_"+$scope.vehicleId).val(data);  
      $(".iwAddress_"+$scope.vehicleId).html($rootScope.pointerLocationAddress);
    })
    .error(function (error) {

    });*/

  }

  vm.getParkingDetails = function(e,marker){    

    vm.parking = marker;
    vm.map.showInfoWindow('foo-pw', this); 
  }

  vm.getEventDetails = function(e,marker){ 

   $scope.center=[marker.event_latitude,marker.event_longitude];  
  
    vm.map.setZoom(14);
    vm.event = marker;

    $scope.tooltipStatusIgnition=true;
    $scope.tooltipStatus=false;
    setTimeout(function () {
      $scope.$apply(function(){
          $scope.tooltipStatusIgnition= false;
      });
    }, 6000);
  }

  vm.getIdlingDetails = function(e,marker){   

    $scope.center=[marker.track_vehicles_veh_latitude,marker.track_vehicles_veh_longitude]; 
   vm.map.setZoom(14);
    vm.idling = marker;
   // alert(vm.idling.status_status);
    $scope.tooltipStatus=true;
    $scope.tooltipStatusIgnition=false;
    setTimeout(function () {
      $scope.$apply(function(){
          $scope.tooltipStatus= false;
      });
    }, 6000);
  }

  vm.getGeozoneOnMapDetails = function(e,marker){    
   
    vm.geozoneOnMap = marker;
    vm.map.showInfoWindow('foo-geozone', this);
  }

  $scope.showStreetView=false;

  $scope.enableStreetView = function(){      
    $scope.streetViewcenter=$scope.center;
    $scope.showStreetView=true;
  }
  $scope.closeStreetView = function(){ 
    $scope.streetViewcenter='';
    $scope.showStreetView=false; 
  }

  $scope.checkTraffic = function(){
      if ($scope.traffic) {
        trafficLayer.setMap(vm.map);
      }else{
        trafficLayer.setMap(null);
      }
  }
  $scope.checkTraffic();

  $scope.tooltip = false;

  vm.getPoint = function(event, speed, time,trackDate) {
 
      $scope.tooltip = true;
      vm.marlatlong=event.latLng;
      vm.speed = speed;
      vm.time = time;
      vm.trackDate = trackDate;
      vm.marlatlong=event.latLng;
     
  }

  vm.normalImg  =function(event){
    vm.marlatlong = [];

    setTimeout(function () {
      $scope.$apply(function(){
          $scope.tooltip = false;
      });
    }, 3000);
  }

  $rootScope.trackProgress=0;
  $rootScope.positionCount=0;

  $scope.fight = function() {

        //var positionCount =0;
        vm.map.setZoom(11);
        var line = vm.map.shapes.mover;
        var totalPoints = line.getPath().length; 
        var speed= 100+totalPoints;
        var sliderValue = 0;

        if ( angular.isDefined(stop) ) return;
        stop=$interval(function() { 

          count=$rootScope.trackProgress;  

          sliderValue = count*100/totalPoints;
               
          $rootScope.trackProgress = (count + 1) % totalPoints;
        
          var icons = line.get('icons');
         
          $rootScope.positionCount++;

          icons[0].offset = ($rootScope.positionCount)*100/totalPoints + '%';

          line.set('icons', icons);

          if($rootScope.positionCount==totalPoints){
           
            $interval.cancel(stop);
            stop = undefined;
            sliderValue=0;
            $rootScope.positionCount=0;
            $rootScope.trackProgress=0;
          }
       
          $( "#slider" ).slider( "option", "value", sliderValue  );     
        }, speed);     
  };

  vm.setTrackerPosition=function(value){
      
    var line = vm.map.shapes.mover;
    $rootScope.trackProgress=value;
    $rootScope.positionCount = value;
    count=$rootScope.trackProgress; 
    var icons = line.get('icons');
    icons[0].offset = (count) + '%';
    line.set('icons', icons);
    var eol = google.maps.geometry.spherical.computeLength(line.getPath());
  }

  $scope.pause=function(){
    if (angular.isDefined(stop)) {
      $interval.cancel(stop);
      stop = undefined;
    }
  }   

//SERVICE///

  $rootScope.$on("vehicleName", function(event,args){

      $scope.objDeviceIDMaintenance = args.deviceID;
      $scope.check = args.deviceID;
      Online.getVehicleName($scope.objDeviceIDMaintenance,$scope.auth_token)
      .success(function (data){

        $scope.vehiclename = data.data.name[0];
        $scope.service = {};
        $scope.fuelEntry = {};
        $scope.service.service_odometer_value = data.data.odometer[0];
        $scope.today = new Date();
        $scope.service.service_date =  $filter('date')($scope.today.setDate($scope.today.getDate() - 0), 'yyyy-MM-dd')+" "+$filter('date')(new Date(), 'hh:mm:ss');
        $scope.fuelEntry.fuel_date =$filter('date')($scope.today.setDate($scope.today.getDate() - 0), 'yyyy-MM-dd')+" "+$filter('date')(new Date(), 'hh:mm:ss');
        $scope.vehicles = data.data.services;
        $scope.fuelData = data.data.fuel;
        $scope.fuelSum = data.data.sumFuel;
        $scope.serviceSum = data.data.sumServices;
        $scope.service_edit = '';

      })    
      
  }); 

  $scope.sumTheCost = function(){
    $scope.service.service_total_cost = Number($scope.service.service_material_cost || 0) + Number($scope.service.service_cost || 0);
  }

  $rootScope.$on("RemainderName", function(event,args){
   
    $scope.objDeviceIDMaintenance = args.deviceID;
    $scope.check = args.deviceID;
    Online.getServiceRemainder($scope.objDeviceIDMaintenance,$scope.auth_token)
    .success(function (data){

        $scope.objectname = data.data.name[0]; 
        $scope.reminder = {};
        $scope.documents = {};
        $scope.reminder.current_odometer = data.data.mileage;
        $scope.today = new Date();
        $scope.documents.document_expiry_date=$filter('date')($scope.today.setDate($scope.today.getDate() - 0), 'yyyy-MM-dd')+" "+$filter('date')(new Date(), 'hh:mm:ss');
        $scope.vehiclesdata = data.data.remainder;
        $scope.docData = data.data.documents;
        $scope.currMil = data.data.mileage;
       
 
        $scope.remainder_edit = '';
      })  
  }); 

  $scope.callRemainderAgain = function () {

    $scope.objDeviceIDMaintenance =  $scope.objDeviceIDMaintenance;
    Online.getServiceRemainder($scope.objDeviceIDMaintenance,$scope.auth_token)
    .success(function (data){
     
      $scope.objectname = data.data.name[0]; 
      $scope.reminder.current_odometer = data.data.mileage[0].mileage;
      $scope.vehiclesdata = data.data.remainder;
      $scope.docData = data.data.documents;
      $scope.remainder_edit = '';
    })  
  }

  /*var formdata = new FormData();
  $scope.getTheFile = function ($files) {
    angular.forEach($files, function (value, key) {
      formdata.append('file', value);
    });
  };*/

  var formdata;
  $scope.getTheFile = function ($files) {
    formdata = new FormData();
    angular.forEach($files, function (value, key) {
      formdata.append('file', value);
       
    });
  };

  $scope.uploadFile = function (id) {
    $scope.objID = id;
    var request = {
      method: 'POST',
      url     : baseUrl + 'uploadServiceImage/'+$scope.objID,
      data: formdata,
      headers: {
        'Content-Type': undefined,
        'Xtoken': $scope.authtoken
      }
    };
    formdata = null;
    $http(request)
    .success(function (d) {
       angular.element("input[type='file']").val(null);
      $scope.callAgain($scope.deviceid);
    })
    .error(function () {
       angular.element("input[type='file']").val(null);
    });
  }

  $scope.uploadDocumentFile = function (id) {
    $scope.docID = id;
    var request = {
      method: 'POST',
      url     : baseUrl + 'uploadDocumentImage/'+$scope.docID,
      data: formdata,
      headers: {
        'Content-Type': undefined,
        'Xtoken': $scope.authtoken
      }
    };
    
    $http(request)
    .success(function (d) {
    })
    .error(function () {
    });
  }

  /*$rootScope.$on("vehicleName", function(event,args){

    $scope.objDeviceIDMaintenance = args.deviceID;
      $scope.check = args.deviceID;
      Online.getVehicleName($scope.objDeviceIDMaintenance,$scope.auth_token)
      .success(function (data){
          
      })  
  }); */

  $scope.callAgain = function(id){

      $scope.objDeviceIDMaintenance = id;
      Online.getVehicleName($scope.objDeviceIDMaintenance,$scope.auth_token)
      .success(function (data){

        $scope.vehiclename = data.data.name[0]; 
        $scope.vehicles = data.data.services;
        $scope.fuelData = data.data.fuel;
        $scope.service_edit = '';
      })    
  }
/*
  $scope.getServiceBydate = function(){
    $scope.objDeviceIDMaintenance   =  $scope.objDeviceIDMaintenance;
    Online.getServiceBydate($scope.objDeviceIDMaintenance,$scope.from,$scope.to,$scope.auth_token)
    .success(function (data){
      $scope.vehicles = data.data.services;
      $scope.serviceSum = data.data.sumServices;
      $scope.service_edit = '';  
    })  
  }

  $scope.getRemainderBydate = function(){
    $scope.objDeviceIDMaintenance   =  $scope.objDeviceIDMaintenance;
    Online.getRemainderBydate($scope.objDeviceIDMaintenance,$scope.fromDate,$scope.toDate,$scope.auth_token)
    .success(function (data){
      $scope.vehiclesdata = data.data.remainder;
      $scope.remainder_edit = '';  
    }) 
  }

  $scope.getFuelBydate = function(){
    $scope.objDeviceIDMaintenance   =  $scope.objDeviceIDMaintenance;
    Online.getFuelBydate($scope.objDeviceIDMaintenance,$scope.from,$scope.to,$scope.auth_token)
    .success(function (data){
      $scope.fuelData = data.data.fuel;
      $scope.fuelSum = data.data.sumFuel;
      $scope.fuel_edit = '';  
    })  
  }  

  $scope.getDocumentBydate = function(){

      $scope.objDeviceIDMaintenance   =  $scope.objDeviceIDMaintenance;
      Online.getDocumentBydate($scope.objDeviceIDMaintenance,$scope.from,$scope.to,$scope.auth_token)
      .success(function (data){
        $scope.docData = data.data.documents;
        $scope.doc_edit = '';  
      })  
  }
   */
  //get data of a single service//

  $scope.getService = function(id){
   
    $scope.deleteButton = true;
    $scope.authtoken = $scope.get_auth_token();
    $scope.ID = id;
    $scope.service_edit = $scope.ID;  
    // alert($scope.service.service_date);
    $http({
      method  : 'get',
      url     : baseUrl + 'getService/'+$scope.ID, headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){

      if (data.status == 'success') {     
        $scope.service = data.data[0]; 
        $scope.service.service_total_cost = Number($scope.service.service_material_cost || 0) + Number($scope.service.service_cost || 0);
      }
    })
    .error(function (error) {
    });

  };

  $scope.AddnewService = function(){

    angular.element("input[type='file']").val(null);

    $scope.service_edit = '';
    $scope.deleteButton = false;
    $scope.deviceid = $scope.objDeviceIDMaintenance;
    $scope.service = {};
    $scope.today = new Date();
    $scope.service.service_date =  $filter('date')($scope.today.setDate($scope.today.getDate() - 0), 'yyyy-MM-dd')+" "+$filter('date')(new Date(), 'hh:mm:ss');
  }

  $scope.AddnewReminder = function(){
    $scope.remainder_edit = '';
    $scope.reminder.remainder_service_name = '';
    $scope.reminder.remainder_targetted_odometer = '';
    $scope.reminder.remainder_occurence = '';
    $scope.reminder.remainder_interval = '';
    $scope.reminder.remainder_comments = '';
    $scope.deleteButton = false;
    $scope.deviceid = $scope.objDeviceIDMaintenance;
    $scope.today = new Date();
    $scope.reminder.remainder_due_date =$filter('date')($scope.today.setDate($scope.today.getDate() - 0), 'yyyy-MM-dd')+" "+$filter('date')(new Date(), 'hh:mm:ss');
  }

  $scope.AddnewFuel = function(){
    $scope.fuel_edit = '';
    $scope.fuelEntry = {};
    $scope.deleteButton = false;
    $scope.deviceid = $scope.objDeviceIDMaintenance;
    $scope.today = new Date();
    $scope.fuelEntry.fuel_date =$filter('date')($scope.today.setDate($scope.today.getDate() - 0), 'yyyy-MM-dd')+" "+$filter('date')(new Date(), 'hh:mm:ss');
  }

  $scope.submitServiceForm = function(){

    $scope.deviceid = $scope.objDeviceIDMaintenance;
    if($scope.service_edit == ''){
      
      $scope.deleteButton = false;
      $scope.authtoken = $scope.get_auth_token();
      $scope.deviceid = $scope.objDeviceIDMaintenance;
      $scope.service.service_date =   $("#dateService").val();

      if (angular.isDefined($scope.deviceid)) {

          $http({
            method  : 'post',
            url     : baseUrl + 'addNewService/'+$scope.deviceid, headers: {'Xtoken': $scope.authtoken},data: $scope.service
          })
          .success(function (data){
            if (data.status == 'success') {
              $scope.uploadFile(data.idd);
              $scope.callAgain($scope.deviceid);  
            }
            $scope.service = {};
            $scope.successMessage = 'Service Added Succesfully.' 
          })
          .error(function (error) {
          });      
      }else{
        alert('Please select object');
      }
    }else{

          $scope.deleteButton = true;
          $scope.authtoken = $scope.get_auth_token();
          $scope.editID = $scope.service_edit;
          $scope.service.service_date =   $("#dateService").val();

            $http({
              method  : 'post',
              url     : baseUrl + 'editService/'+$scope.editID, headers: {'Xtoken': $scope.authtoken},data: $scope.service
            })
            .success(function (data){
              if (data.status == 'success') {
                $scope.uploadFile(data.idd);
                $scope.callAgain($scope.deviceid);
              }
              $scope.service = {};
              $scope.successMessage = 'Service Edited Succesfully.' 
            })
            .error(function (error) {
            });
    }
  };
   

  $scope.deleteService = function(id){
    if ($window.confirm("Are you sure you want to delete this service ?")) {
      $scope.deleteButton = true;
      $scope.authtoken = $scope.get_auth_token();
      $scope.ID = id;
      $http({
        method  : 'get',
        url     : baseUrl + 'deleteService/'+$scope.ID, headers: {'Xtoken': $scope.authtoken}
      })
      .success(function (data){
        if (data.status == 'success') { 

          $scope.callAgain($scope.deviceid);
          $scope.service = {};
          $scope.deleteButton = false;
        }
      })
      .error(function (error) {
      });
    }
  };

  //SERVICE///

  $rootScope.$on("Entry", function(event,args){

    $scope.showFuelFlag = false;  
    $scope.ServiceReminderFlag = false;
    $scope.googlemap=false;
    $scope.report=false;
    $scope.analytics=false;
    $scope.maintenance = true;
    $scope.deleteButton = false;
    $scope.showDocFlag = false;
    
    /*Online.getVehicleName($scope.objDeviceID,$scope.auth_token)
    .success(function (data){
      
    })  */
  }); 

  //REMAINDER//

    $rootScope.$on("Remainder", function(event,args){

      $scope.ServiceReminderFlag = true;
      $scope.googlemap=false;
      $scope.report=false;
      $scope.analytics=false;
      $scope.maintenance = false;
      $scope.deleteButton = false;
      $scope.showFuelFlag = false;
      $scope.showDocFlag = false;

      /*Online.getVehicleName($scope.objDeviceID,$scope.auth_token)
      .success(function (data){
      })  */
    }); 

    $scope.getSingleRemainder = function(id,devid){
      $scope.deleteButton = true;
      $scope.ID = id;
      $scope.devID = devid;
      $scope.remainder_edit = $scope.ID;  

      $http({
        method  : 'get',
        url     : baseUrl + 'getSingleRemainder/'+$scope.ID+'/'+$scope.devID, headers: {'Xtoken': $scope.authtoken}
      })
      .success(function (data){

        if (data.status == 'success') {  
          $scope.reminder = data.data[0];
          $scope.reminder.current_odometer = data.milage[0].mileage; 
        }
      })
      .error(function (error) {
      });
    };

    $scope.submitRemainderForm = function(){

      if($scope.remainder_edit == ''){
       
        $scope.deleteButton = false;
        $scope.deviceid = $scope.objDeviceIDMaintenance;
        $scope.reminder.remainder_due_date =   $("#dateRemainder").val();
        if (angular.isDefined($scope.deviceid)){
            $http({
              method  : 'post',
              url     : baseUrl + 'addNewRemainder/'+$scope.deviceid, headers: {'Xtoken': $scope.authtoken},data: $scope.reminder
            })
            .success(function (data){
              if (data.status == 'success') {
                $scope.callRemainderAgain();
                $scope.reminder = {};
                $scope.successMessage = 'Service Added Succesfully.' 
              }         
            })
            .error(function (error) {

            });
        }else{
            alert("please select object");
        }
      }else{
        $scope.deleteButton = true;
        $scope.editid = $scope.remainder_edit;
        $scope.reminder.remainder_due_date =   $("#dateRemainder").val();
         // alert($scope.service.service_date);
        $http({
          method  : 'post',
          url     : baseUrl + 'editRemainder/'+$scope.editid, headers: {'Xtoken': $scope.authtoken},data: $scope.reminder
        })
        .success(function (data){
          if (data.status == 'success') {
            $scope.callRemainderAgain();  
            $scope.reminder = {};
            $scope.successMessage = 'Service edited Succesfully.' 
          }        
        })
        .error(function (error) {

        });
      } 
    };

    $scope.deleteRemainder = function(id){
      if ($window.confirm("Are you sure you want to delete this remainder ?")) {
        $scope.deleteButton = true;
        $scope.ID = id;
        $http({
          method  : 'get',
          url     : baseUrl + 'deleteRemainder/'+$scope.ID, headers: {'Xtoken': $scope.authtoken}
        })
        .success(function (data){
          if (data.status == 'success') { 
            $scope.callRemainderAgain();
            $scope.reminder = {};
          }
        })
        .error(function (error) {
        });
      }
    };

  //REMAINDER//

  //FUEL//

  $rootScope.$on("Fuel", function(event,args){

    $scope.showFuelFlag = true;
    $scope.ServiceReminderFlag = false;
    $scope.googlemap=false;
    $scope.report=false;
    $scope.analytics=false;
    $scope.maintenance = false;
    $scope.deleteButton = false;
    $scope.showDocFlag = false;
    $scope.fuel_edit = '';

    /*Online.getVehicleName($scope.objDeviceID,$scope.auth_token)
    .success(function (data){    
    })  */
  }); 

  //get drivers for adding fuel////

  $scope.addFuel = function(){

    $http({
      method  : 'get',
      url     : baseUrl + 'getDriversUnderOrganisation/'+$scope.get_org_ID(), headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){

     $scope.drivers=data.drivers;

   })
    .error(function (error) {

    });

  };

  //get data of a single fuel//

  $scope.getSingleFuel = function(id){
   
    $scope.deleteButton = true;
    $scope.authtoken = $scope.get_auth_token();
    $scope.ID = id;
    $scope.fuel_edit = $scope.ID;  
    $http({
      method  : 'get',
      url     : baseUrl + 'getSingleFuel/'+$scope.ID, headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){

      if (data.status == 'success') {     
       $scope.fuelEntry = data.data[0]; 
       $scope.fuelEntry.fuel_driver_id = data.data[0].driver_id; 
      }
    })
    .error(function (error) {
    });
  };

  //add and edit fuel//

  $scope.submitFuelEntryForm = function(){

    if($scope.fuel_edit == ''){
      $scope.deleteButton = false;
      $scope.authtoken = $scope.get_auth_token();
      $scope.deviceid = $scope.objDeviceIDMaintenance;
      $scope.fuelEntry.fuel_date =   $("#dateFuel").val();

      if (angular.isDefined($scope.deviceid)) {
          $http({
            method  : 'post',
            url     : baseUrl + 'addNewFuel/'+$scope.deviceid, headers: {'Xtoken': $scope.authtoken},data: $scope.fuelEntry
          })
          .success(function (data){
             if (data.status == 'success') {
               $scope.callAgain($scope.deviceid);
             }
             $scope.fuelEntry='';
               
             $scope.successMessage = 'Fuel Added Succesfully.' 


          })
          .error(function (error) {

          });
      }else{
        alert("please select object");
      }
    }else{

        $scope.deleteButton = true;
        $scope.authtoken = $scope.get_auth_token();
        $scope.editFuelID = $scope.fuel_edit;
        $scope.fuelEntry.fuel_date =   $("#dateFuel").val();

         // alert($scope.service.service_date);
        $http({
          method  : 'post',
          url     : baseUrl + 'editFuel/'+$scope.editFuelID, headers: {'Xtoken': $scope.authtoken},data: $scope.fuelEntry
        })
        .success(function (data){
          if (data.status == 'success') {

            $scope.callAgain($scope.deviceid);
          }
          $scope.fuelEntry='';
           
          $scope.successMessage = 'Fuel Edited Succesfully.' 

        })
         .error(function (error) {

         });
    }
  };

  $scope.deleteFuel = function(id){
    if ($window.confirm("Are you sure you want to delete this fuel ?")) {
      $scope.deleteButton = true;
      $scope.authtoken = $scope.get_auth_token();
      $scope.DelFuelID = id;

      $http({
        method  : 'get',
        url     : baseUrl + 'deleteFuel/'+$scope.DelFuelID, headers: {'Xtoken': $scope.authtoken}
      })
      .success(function (data){
        if (data.status == 'success') { 

          $scope.callAgain($scope.deviceid);
          $scope.fuelEntry='';
        }
      })
      .error(function (error) {
      });
    }  
  };

//FUEL//


//DOC//
  $rootScope.$on("Document", function(event,args){

    $scope.showFuelFlag = false;
    $scope.ServiceReminderFlag = false;
    $scope.googlemap = false;
    $scope.report = false;
    $scope.analytics = false;
    $scope.maintenance = false;
    $scope.deleteButton = false;
    $scope.showDocFlag = true;
    $scope.doc_edit = '';
    
    /*Online.getVehicleName($scope.objDeviceID,$scope.auth_token)
    .success(function (data){
      
    })  */
  }); 

  $scope.AddnewDocument = function(){
    $scope.doc_edit = '';
    $scope.documents = {};
    $scope.deleteButton = false;
    $scope.deviceid = $scope.objDeviceIDMaintenance;
    $scope.today = new Date();
    $scope.documents.document_expiry_date =  $filter('date')($scope.today.setDate($scope.today.getDate() - 0), 'yyyy-MM-dd')+" "+$filter('date')(new Date(), 'hh:mm:ss');
    angular.element("input[type='file']").val(null);
  }

  //get data of a single Document//

  $scope.getSingleDocument = function(id){
   
    $scope.deleteButton = true;
    $scope.ID = id;
    $scope.doc_edit = $scope.ID;  
    $http({
      method  : 'get',
      url     : baseUrl + 'getSingleDocument/'+$scope.ID, headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){

      if (data.status == 'success') { 
       $scope.documents = data.data[0];        
      }
    })
    .error(function (error) {
    });
  };

  //add and edit Document//

  $scope.submitDocumentForm = function(){

    if($scope.doc_edit == ''){ 
      $scope.deviceid = $scope.objDeviceIDMaintenance;
      $scope.documents.document_expiry_date =   $("#dateDocument").val();

      if (angular.isDefined($scope.deviceid)){

        $http({
          method  : 'post',
          url     : baseUrl + 'addNewDocument/'+$scope.deviceid, headers: {'Xtoken': $scope.authtoken},data: $scope.documents
        })
        .success(function (data){
          if (data.status == 'success') {
            $scope.uploadDocumentFile(data.idd);
            $scope.callRemainderAgain();
            $scope.AddnewDocument();
          }                  
        })
        .error(function (error) {

        });
      }else{
        alert("please select object");
      }
    }else{
           
      $scope.editDocID = $scope.doc_edit;
      $scope.documents.document_expiry_date =   $("#dateDocument").val();
          
      $http({
        method  : 'post',
        url     : baseUrl + 'editDocument/'+$scope.editDocID, headers: {'Xtoken': $scope.authtoken},data: $scope.documents
      })
      .success(function (data){
        if (data.status == 'success') {
          $scope.uploadDocumentFile($scope.editDocID);
          $scope.callRemainderAgain();
          $scope.AddnewDocument();
        }        
      })
      .error(function (error) {

      });
    }
       
  };
   
  //delete a document//

  $scope.deleteDocument = function(id){
    if ($window.confirm("Are you sure you want to delete this document ?")){
      $scope.DelDocID = id;
      $http({
        method  : 'get',
        url     : baseUrl + 'deleteDocument/'+$scope.DelDocID, headers: {'Xtoken': $scope.authtoken}
      })
      .success(function (data){
        if (data.status == 'success') { 
         $scope.callRemainderAgain();
         $scope.AddnewDocument();
        }
      })
      .error(function (error) {
      });
    }   
  };


//DOC///

 
//CUSTOMER NOTIFICATION--START//////////////

  $scope.addNewNotification = function(){
    $scope.notificationDetails = {};
    $scope.successMessageNotification = false;
    $scope.errorMessageNotification = false;
    $scope.showaddNotfnButton = false;
    $scope.customerNotification('polygon',$rootScope.infoMarker.obj_device_id);
  }

  $scope.changeNotificationGeozoneOption = function(){
 
   //  $scope.deviceID=$scope.get_deviceID();

     $scope.deviceID=$rootScope.infoMarker.obj_device_id;


 
    $scope.customerNotification($scope.notificationDetails.customer_noitification_geozone_shape,$scope.deviceID);
     
  }

  $scope.customerNotification = function(geozone_shape,deviceID){
 
     
    if (geozone_shape == 'polygon') {
      $scope.selectedShape = 'Geozone';
      $scope.notificationDetails.customer_noitification_geozone_shape = 'polygon';
    }else{
      $scope.selectedShape = 'POI';
      $scope.notificationDetails.customer_noitification_geozone_shape = 'marker';
    }
      $scope.deviceID=deviceID;
      $scope.successMessageNotification = '';
      $http({
        method  : 'get',
        url     : baseUrl + 'getallGeozonesAndPoints/'+geozone_shape, headers: {'Xtoken': $scope.authtoken}
      })
      .success(function (data){

        if (data.status == 'success') { 
          $scope.zonePoints = data.geozones;     
          $scope.notificationDetails.customer_notification_geozone_id = $scope.zonePoints[0].gz_id;
           
        }
      })
      .error(function (error) {
      });

      $scope.getNotifications($scope.deviceID);
  }

  $scope.editNotification = function(notificationId){

    $scope.successMessageNotification = false;
    $scope.errorMessageNotification = false;
    $scope.showaddNotfnButton = true;

    $http({
        method  : 'get',
        url     : baseUrl + 'getSingleNotification/'+notificationId, headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){

        if (data.status == 'success') { 
          $scope.notificationDetails = data.SingleNotification[0];     
          //$scope.customerNotification($scope.notificationDetails.customer_noitification_geozone_shape,$scope.deviceID);
           
        }
    })
    .error(function (error) {
    });
  }

  $scope.saveNotification = function(){



    if ($scope.notificationDetails.customer_notification_id) {
      $http({
        method  : 'post',
        url     : baseUrl + 'editCustomerNotification/'+$scope.notificationDetails.customer_notification_id, headers: {'Xtoken': $scope.authtoken},data: $scope.notificationDetails
      })
      .success(function (data){
        if (data.status == 'success') {
          $scope.successMessageNotification = true;
          $scope.errorMessageNotification = false;
          $scope.successMessageNotification = 'Notification Edited Successfully';
          $scope.getNotifications($scope.deviceID);
        }else{
          $scope.errorMessageNotification = true;
          $scope.errorMessageNotification = 'Please enter valid email as notification emails!';       
        }
       
      })
      .error(function (error) {
         
      });
    }else{
 
 
     // $scope.deviceID=$scope.get_deviceID();
      $scope.deviceID = $rootScope.infoMarker.obj_device_id;
      
      /*$scope.notificationDetails = {
        customer_notification_vehicle_device_id: $scope.deviceID,
        customer_notification_geozone_id: $scope.geozone,
        customer_notification_emails:$scope.emails,
        customer_notification_message: $scope.message
      };*/

      $scope.notificationDetails.customer_notification_vehicle_device_id = $scope.deviceID;
     
      $http({
        method  : 'post',
        url     : baseUrl + 'AddNewNotification', headers: {'Xtoken': $scope.authtoken},data: $scope.notificationDetails
      })
      .success(function (data){
        if (data.status == 'success') {
          
          $scope.notificationDetails = {};
          $scope.successMessageNotification = true;
          $scope.errorMessageNotification = false;
          $scope.successMessageNotification = 'Notification Added Successfully';
           $scope.getNotifications($scope.deviceID);
        }else{
        $scope.errorMessageNotification = true;
        $scope.errorMessageNotification = 'Please enter valid email as notification emails!';       
        }
       
      })
      .error(function (error) {
         
      });
    }

  };
   
  $scope.getNotifications = function(id){

    $scope.deviceID=id;
    $http({
        method  : 'get',
        url     : baseUrl + 'getAllNotifications/'+$scope.deviceID, headers: {'Xtoken': $scope.authtoken}
      })
      .success(function (data){

       if (data.status == 'success') { 
        $scope.notifications = data.notifns;  
       }
     })
      .error(function (error) {
      });
   }

  $scope.deleteNotification = function(notificationId){

    if ($window.confirm("Are you sure you want to delete this notification ?")) {

      $http({
        method  : 'get',
        url     : baseUrl + 'deleteNotification/'+notificationId, headers: {'Xtoken': $scope.authtoken}
      })
      .success(function (data){
        if (data.status == 'success') { 
          $scope.successMessageNotification = 'Successfully Deleted Notification';
          $scope.getNotifications($rootScope.infoMarker.obj_device_id);
          $scope.notificationDetails = {};
        }
      })
      .error(function (error) {
      });
    }

  }


//CUSTOMER NOTIFICATION--END//////////////


/////SHARE LOCATION--START///


  $scope.saveShareLocation = function(){
 
      $scope.authtoken = $scope.get_auth_token();
      $scope.deviceID=$rootScope.infoMarker.obj_device_id;

     // alert($scope.deviceID);
    
      $scope.shareLocation = {
      share_location_emails: $scope.sharelocationemails,
      share_location_validto: $scope.tokenvalidity,
      share_location_device_id: $scope.deviceID
      };

      $http({
        method  : 'post',
        url     : baseUrl + 'AddNewShareLocation', headers: {'Xtoken': $scope.authtoken},data: $scope.shareLocation
      })
       .success(function (data){
         if (data.status == 'success') {
          
          $scope.ShareLocationID = data.NewID;
          $scope.sharelocationemails="";
          $scope.tokenvalidity="";
          $scope.getAllShareLocations($scope.deviceID);

          /*$http({
              method  : 'get',
              url     : baseUrl + 'sendShareLocationEmails/'+$scope.ShareLocationID, headers: {'Xtoken': $scope.authtoken},data: $scope.shareLocation
            })*/
          
          $scope.successMessageSharelocation = true;
          $scope.errorMessageSharelocation = false;
          $scope.successMessageSharelocation = 'Send emails ';
           
        }
        else
        {
        $scope.errorMessageSharelocation = true;
        $scope.successMessageSharelocation = false;
        $scope.errorMessageSharelocation = 'Please enter valid email as emails!';
       
        }
       
      })
       .error(function (error) {
         
       });
  };

  $scope.getAllShareLocations = function(deviceid){

    $scope.deviceID=deviceid;
   
    $http({
        method  : 'get',
        url     : baseUrl + 'getAllShareLocations/'+$scope.deviceID, headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){

       if (data.status == 'success') { 
        $scope.shareLocations = data.getAllShareLocation;  
       }
    })
    .error(function (error) {
    });
  }

 
  $scope.DeleteShareLocation = function(sharelocationid){
    
    if ($window.confirm("Are you sure you want to delete this Share Location ?")) {

      $http({
        method  : 'get',
        url     : baseUrl + 'deleteShareLocation/'+sharelocationid, headers: {'Xtoken': $scope.authtoken}
      })
      .success(function (data){
        if (data.status == 'success') { 
         
         $scope.successMessageSharelocation = false;
          $scope.errorMessageSharelocation = true;
         $scope.errorMessageSharelocation = 'Deleted Notification';

          $scope.getAllShareLocations($scope.deviceID);
        }
      })
      .error(function (error) {
      });
    }

  }

  /*$scope.shareLocation = function(){
       $scope.authtoken = $scope.get_auth_token();

        $scope.shareLocation = {
        sharelocationemails: $scope.sharelocationemails,
        tokenvalidity: $scope.tokenvalidity
        };

         $http({
          method  : 'get',
          url     : baseUrl + 'sendEmail', headers: {'Xtoken': $scope.authtoken},data: $scope.shareLocation
        })
           .success(function (data){
             if (data.status == 'success') { 
             }
           })
           .error(function (error) {
           });

  }*/

/////SHARE LOCATION -END///

 

 

    /*var input = document.getElementById('pac-input');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function () {
        setPlace();
    });

  var setPlace = function () {
        //infoWindow.close();
        var place = autocomplete.getPlace();
        $scope.SearchVehicles(place.geometry.location);
        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }
  }*/

  /*$scope.SearchVehiclesAddress = function(lat,lon){
      $scope.lat = lat;
      $scope.lon = lon;
      alert($scope.lat );
    
      $http({
        method  : 'get',
        url     : baseUrl + 'getAllVehiclesNearPOI/'+$scope.point, headers: {'Xtoken': $scope.authtoken}
      })
      .success(function (data){
        $scope.SearchResults = data;
         
      })
      .error(function (error) {
      });
  }*/

///near poi or a particular ddress//
  $scope.SearchVehicles = function(points){
   
    $scope.point = points;
    $http({
      method  : 'get',
      url     : baseUrl + 'getAllVehiclesNearPOI/'+$scope.point, headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){

      $scope.SearchResults = data;
       
    })
    .error(function (error) {
    });

  }

  $scope.selectedForSearch = function(type){
    if(type=='ADDRESS'){
      $scope.Addressmodel = '';
      $scope.SearchResults='';
      $scope.searchByAddressFlag = true;
      $scope.searchByPOIFlag = false;
      $scope.searchByPolygonFlag = false;
    }else if (type=='POLYGON'){
      $scope.Addressmodel = '';
      $scope.SearchResults='';
      $scope.searchByAddressFlag = false;
      $scope.searchByPOIFlag = false;
      $scope.searchByPolygonFlag = true;

    }else {
      $scope.SearchResults='';
      $scope.Addressmodel = '';
      $scope.searchByPOIFlag = true;
      $scope.searchByAddressFlag = false;
      $scope.searchByPolygonFlag = false;
    }
  }


  $scope.gotoFleetManager = function(selectedId,selectedType){

    $rootScope.selectedSideButton = 'Maintanance';
    $scope.liveObjectMarkerFlag = false;  
    $scope.tripFlag = false;
    $scope.analytics = false;
    $scope.report = false;
    $scope.googlemap = false;

    if (selectedType == 'service') {
      $scope.maintenance = true;
      $scope.ServiceReminderFlag = false;
      $scope.showFuelFlag = false;
      $scope.showDocFlag = false;
      $rootScope.selectedMainMaintenanceTab = 'fleetExpenditure';
      $rootScope.maintenanceTab = "serviceExpense";
      $scope.getService(selectedId);
      $scope.callAgain($scope.objDeviceIDMaintenance);
      //$scope.getServiceBydate();

    }else if (selectedType == 'fuel') {
      $scope.showFuelFlag = true;
      $scope.ServiceReminderFlag = false;
      $scope.maintenance = false;
      $scope.showDocFlag = false;
      $rootScope.selectedMainMaintenanceTab = 'fleetExpenditure';
      $rootScope.maintenanceTab = "fuelExpense";
      $scope.getSingleFuel(selectedId);
      $scope.callAgain($scope.objDeviceIDMaintenance);
      //$scope.getFuelBydate();

    }else if (selectedType == 'document') {
      $scope.showDocFlag = true;
      $scope.showFuelFlag = false;
      $scope.ServiceReminderFlag = false;
      $scope.maintenance = false;
      $rootScope.selectedMainMaintenanceTab = 'reminder';
      $rootScope.maintenanceTab = "DocumentReminder";
      $scope.getSingleDocument(selectedId);
      $scope.callRemainderAgain();
      //$scope.getDocumentBydate();

    }else{
      $scope.ServiceReminderFlag = true;
      $scope.showFuelFlag = false;
      $scope.maintenance = false;
      $scope.showDocFlag = false;
      $rootScope.selectedMainMaintenanceTab = 'reminder';
      $rootScope.maintenanceTab = "serviceRemainder";
      $scope.getSingleRemainder(selectedId);
      $scope.callRemainderAgain();
      //$scope.getRemainderBydate();
    }
    
    
    $( ".rightsideopen" ).hide();
  }

//console.log("Dijo P Jose End");
 

/*************************************************************************************/
/*  $rootScope.$on("vehiclesOnMap", function(event,args)
  {
    $scope.deviceId = args.deviceId;
    $scope.selectedDevice = args.device;
    $scope.save_deviceID($scope.deviceId);
    $scope.selectedVehicle = true;
    $scope.tripFlag = true;
    $scope.infoBubble.close();
    //$scope.allVehiclespositonsData; 
    if (args.selectAll == 1) 
    {
      for (var i = 0; i < $scope.allVehiclespositonsData.length; i++) 
      {
        if ($scope.selectedDevices.indexOf($scope.allVehiclespositonsData[i].uniqueId) == -1) 
        {
          $scope.selectedDevices.push($scope.allVehiclespositonsData[i].uniqueId); 
          $scope.parkingMarkers   = [];
          $scope.eventMarkers     = [];
          $scope.idlingMarkers    = [];
          $scope.geozoneMarkers   = [];
          $scope.icon             = "/car.png";     

          if($scope.allVehiclespositonsData[i].status=='Moving')
          {        
            $scope.iconFolder = "green";           
            if($scope.allVehiclespositonsData[i].position.course ==0 || $scope.allVehiclespositonsData[i].position.course == 360)
            {
              $scope.direction = "0";
            }else if($scope.allVehiclespositonsData[i].position.course == 90)
            {
              $scope.direction = "90";
            }
            else if($scope.allVehiclespositonsData[i].position.course == 180)
            {
                    $scope.direction = "180";
            }
            else if($scope.allVehiclespositonsData[i].position.course == 270)
            {
              $scope.direction = "270";
            }
            else if($scope.allVehiclespositonsData[i].position.course > 0 && $scope.allVehiclespositonsData[i].position.course < 90)
            {
              $scope.direction = "45";
            }
            else if($scope.allVehiclespositonsData[i].position.course > 90 && $scope.allVehiclespositonsData[i].position.course < 180)
            {
              $scope.direction = "135";
            }else if($scope.allVehiclespositonsData[i].position.course >180 && $scope.allVehiclespositonsData[i].position.course < 270 ){
              $scope.direction = "225";
            }
            else
            {
              $scope.direction = "315";
            }
            $scope.icon = "/car_"+$scope.direction+".png";

          }
          else if($scope.allVehiclespositonsData[i].status=='Idling')
          {  
            $scope.iconFolder = "orange";
          }
          else
          {  
            $scope.iconFolder = "red";
          }  
          //alert($scope.allVehiclespositonsData[i].position.course); 
          $scope.tempMarker={label:$scope.allVehiclespositonsData[i].name.substr(0, 15), angle:$scope.allVehiclespositonsData[i].position.course, title:$scope.allVehiclespositonsData[i].name, icon: $scope.imagePath+'/'+$scope.iconFolder+$scope.icon,vehDetails:$scope.allVehiclespositonsData[i],animation: 'Animation.DROP'}; 
          $scope.onlineMarkers.push($scope.tempMarker);        
        }
      }
      var lat =$scope.allVehiclespositonsData[i-1].position.latitude;
      var lng = $scope.allVehiclespositonsData[i-1].position.longitude;
      var loc = new google.maps.LatLng(lat, lng);
      //$scope.center=loc;
      vm.map.setZoom(8);
     // console.log(loc);
    }
    else
    {    
      if($scope.deviceId) 
      {     
        if($scope.selectedDevice)
        {
          for(var i = 0; i < $scope.allVehiclespositonsData.length; i++) 
          {
            if($scope.allVehiclespositonsData[i].uniqueId == $scope.get_deviceID() ||  $scope.allVehiclespositonsData[i].uniqueId == $scope.deviceId)
            {
              if($scope.selectedDevices.indexOf($scope.allVehiclespositonsData[i].uniqueId) == -1) 
              {
                $scope.selectedDevices.push($scope.allVehiclespositonsData[i].uniqueId); 
                $scope.parkingMarkers   = [];
                $scope.eventMarkers     = [];
                $scope.idlingMarkers    = [];
                $scope.geozoneMarkers   = [];
                $scope.center=[$scope.allVehiclespositonsData[i].position.latitude,$scope.allVehiclespositonsData[i].position.longitude];
                $scope.icon = "/car.png";      
                if($scope.allVehiclespositonsData[i].status=='Moving')
                {
                  $scope.iconFolder = "green";           
                  if($scope.allVehiclespositonsData[i].position.course ==0 || $scope.allVehiclespositonsData[i].position.course == 360)
                  {
                    $scope.direction = "0";
                  }
                  else if($scope.allVehiclespositonsData[i].position.course == 90)
                  {
                    $scope.direction = "90";
                  }
                  else if($scope.allVehiclespositonsData[i].position.course == 180)
                  {
                    $scope.direction = "180";
                  }
                  else if($scope.allVehiclespositonsData[i].position.course == 270)
                  {
                    $scope.direction = "270";
                  }
                  else if($scope.allVehiclespositonsData[i].position.course > 0 && $scope.allVehiclespositonsData[i].position.course < 90)
                  {
                    $scope.direction = "45";
                  }
                  else if($scope.allVehiclespositonsData[i].position.course > 90 && $scope.allVehiclespositonsData[i].position.course < 180)
                  {
                    $scope.direction = "135";
                  }
                  else if($scope.allVehiclespositonsData[i].position.course >180 && $scope.allVehiclespositonsData[i].position.course < 270 )
                  {
                    $scope.direction = "225";
                  }
                  else
                  {
                    $scope.direction = "315";
                  }
                  $scope.icon = "/car_"+$scope.direction+".png";
                }
                else if($scope.allVehiclespositonsData[i].status=='Idling')
                {  
                        $scope.iconFolder = "orange";
                }
                else
                {  
                  $scope.iconFolder = "red";
                }  
                $scope.tempMarker={label:$scope.allVehiclespositonsData[i].name.toString().substr(0, 15), angle:$scope.allVehiclespositonsData[i].position.course, title:$scope.allVehiclespositonsData[i].name, icon: $scope.imagePath+'/'+$scope.iconFolder+$scope.icon,vehDetails:$scope.allVehiclespositonsData[i],animation: 'Animation.DROP'};        
                $scope.onlineMarkers.push($scope.tempMarker);    
                var lat = $scope.allVehiclespositonsData[i].position.latitude;
                var lng = $scope.allVehiclespositonsData[i].position.longitude;
                var loc = new google.maps.LatLng(lat, lng);
                $scope.center.push(loc);
              }
            }
          }
        }
        else
        {
          for (var i = 0; i < $scope.onlineMarkers.length; i++)
          {  
            if($scope.onlineMarkers[i].allVehiclespositonsData.uniqueId == $scope.deviceId)
            {
              $scope.onlineMarkers.splice(i,1);        
            }             
          }
          for (var j = 0; j < $scope.selectedDevices.length; j++) 
          { 
            if($scope.selectedDevices[j] == $scope.deviceId){          
              $scope.selectedDevices.splice(j,1); 
            }  
          }           
        }
      }
      
      if(args.selectedGroupStatus) 
      {
        for(var i = 0; i < $scope.allVehiclespositonsData.length; i++) 
        {
          if($scope.allVehiclespositonsData[i].groupid == args.selectedGroup) 
          {
            if($scope.selectedDevices.indexOf($scope.allVehiclespositonsData[i].uniqueId) == -1) 
            {
              $scope.selectedDevices.push($scope.allVehiclespositonsData[i].uniqueId); 
              $scope.parkingMarkers     = [];
              $scope.eventMarkers       = [];
              $scope.idlingMarkers      = [];
              $scope.geozoneMarkers     = [];
              $scope.center = [$scope.allVehiclespositonsData[i].position.latitude,$scope.allVehiclespositonsData[i].position.longitude];
              $scope.icon   = "/car.png";
              if($scope.allVehiclespositonsData[i].status=='Moving')
              {
                $scope.iconFolder = "green";           
                if($scope.allVehiclespositonsData[i].position.course ==0 || $scope.allVehiclespositonsData[i].position.course == 360)
                {
                  $scope.direction = "0";
                }
                else if($scope.allVehiclespositonsData[i].position.course == 90)
                {
                  $scope.direction = "90";
                }
                else if($scope.allVehiclespositonsData[i].position.course == 180)
                {
                  $scope.direction = "180";
                }
                else if($scope.allVehiclespositonsData[i].position.course == 270)
                {
                  $scope.direction = "270";
                }
                else if($scope.allVehiclespositonsData[i].position.course > 0 && $scope.allVehiclespositonsData[i].position.course < 90)
                {
                  $scope.direction = "45";
                }
                else if($scope.allVehiclespositonsData[i].position.course > 90 && $scope.allVehiclespositonsData[i].position.course < 180)
                {
                  $scope.direction = "135";
                }
                else if($scope.allVehiclespositonsData[i].position.course >180 && $scope.allVehiclespositonsData[i].position.course < 270 )
                {
                      $scope.direction = "225";
                }
                else
                {
                      $scope.direction = "315";
                }
                $scope.icon = "/car_"+$scope.direction+".png";
              }
              else if($scope.allVehiclespositonsData[i].status=='Idling')
              {  
                $scope.iconFolder = "orange";
              }    
              else
              {  
                $scope.iconFolder = "red";
              }       
              $scope.tempMarker={label:$scope.allVehiclespositonsData[i].name.substr(0, 15), angle:$scope.allVehiclespositonsData[i].position.course, title:$scope.allVehiclespositonsData[i].name, icon: $scope.imagePath+'/'+$scope.iconFolder+$scope.icon,vehDetails:$scope.vehDetails[i],animation: 'Animation.DROP'}; 
              $scope.onlineMarkers.push($scope.tempMarker) ; 
              var lat =$scope.allVehiclespositonsData[i].position.latitude;
              var lng = $scope.allVehiclespositonsData[i].position.longitude;
              var loc = new google.maps.LatLng(lat, lng);
              $scope.center.push(loc);
            }
          }
        }
      }
      else
      {
        for (var i = 0; i < $scope.allVehiclespositonsData.length; i++) 
        {
          if($scope.allVehiclespositonsData[i].groupid == args.selectedGroup) 
          {
            for(var j = 0; j < $scope.selectedDevices.length; j++) 
            { 
              if($scope.selectedDevices[j] == $scope.allVehiclespositonsData[i].uniqueId)
              {             
                $scope.selectedDevices.splice(j,1); 
              }  
            }
            for(var k = 0; k < $scope.onlineMarkers.length; k++)
            {  
              if($scope.onlineMarkers[k].vehDetails.obj_device_id == $scope.allVehiclespositonsData[i].uniqueId)
              {
                $scope.onlineMarkers.splice(k,1);        
              }             
            }
          }
        }
      }
    }
  });*/
/*************************************************************************************/

  
/*************************************************************************************/
  $scope.update_vehicles_status = function()
  {
      Online.OnPosition().success(function(data){

        if ($scope.get_org_name() == -1) 
        {
          $scope.organisationName = 'Default';
        }
        else
        {
          $scope.organisationName = $scope.get_org_name();
        }

        if( typeof showTabLoader !== "undefined")
          showTabLoader();   
        if(data.responseCode==200)
        { 
          //console.log(data);
          $rootScope.allno      = data.positions.length;
          $rootScope.online     = 0;
          $rootScope.idle       = 0;
          $rootScope.conpblm    = 0; 
          $rootScope.didnotrun  = 0; 
          var positions         = data.positions;
          var vehicles          = $rootScope.Get_Vehicles();
          var vmoving           = [];
          var t=0;
          if(positions.length>0)
          {
            for(var i = 0; i < vehicles.length; i++) 
            {
              t=i;
              for(var j = 0; j < positions.length; j++) 
              {
                if(positions[j].deviceId==vehicles[i].id)
                {
                    vehicles[i].position        = positions[i];
                    vehicles[i].position.speed  = positions[i].speed.toFixed(2);
                    vehicles[i].lastupdated     = $filter('date')(positions[i].deviceTime, 'dd/MM/yyyy HH:mm:ss');
                    vehicles[i].groupid         = $scope.get_org_ID();
                    if(positions[i].attributes.di1==1 && positions[i].attributes.motion==true && positions[i].attributes.ignition==true)
                    {
                      $rootScope.online++;
                      vehicles[i].status="Moving";
                      if(vmoving.length<1)
                      {  
                        vmoving=vehicles[i];
                      }
                    }
                    else if(positions[i].attributes.di1==1 && positions[i].attributes.motion==false)
                    {
                      $rootScope.idle++;
                      vehicles[i].status="Idling";
                    }
                    else if(positions[i].attributes.di1==0 && positions[i].attributes.motion==false)
                    {
                      $rootScope.conpblm++;
                      $rootScope.didnotrun++;
                      vehicles[i].status="Stopped";
                    }
                }
              } 
                            /**************************************************************************/
                $scope.parkingMarkers = [];
                $scope.eventMarkers = [];
                $scope.idlingMarkers = [];
                $scope.geozoneMarkers = [];
                $scope.icon = "/car.png";
                
                if(vehicles[i].status=='Moving')
                {
                   
                  $scope.iconFolder = "green";           

                  if(vehicles[i].position.course ==0 || vehicles[i].position.course == 360)
                  {
                    $scope.direction = "0";
                  }
                  else if(vehicles[i].position.course == 90)
                  {
                    $scope.direction = "90";
                  }
                  else if(vehicles[i].position.course == 180)
                  {
                    $scope.direction = "180";
                  }
                  else if(vehicles[i].position.course == 270)
                  {
                    $scope.direction = "270";
                  }
                  else if(vehicles[i].position.course > 0 && vehicles[i].position.course < 90)
                  {
                    $scope.direction = "45";
                  }
                  else if(vehicles[i].position.course > 90 && vehicles[i].position.course < 180)
                  {
                    $scope.direction = "135";
                  }
                  else if(vehicles[i].position.course >180 && vehicles[i].position.course < 270 )
                  {
                    $scope.direction = "225";
                  }else{
                    $scope.direction = "315";
                  }

                  $scope.icon = "/car_"+$scope.direction+".png";

                }else if(vehicles[i].status=='Idling')
                  $scope.iconFolder = "orange";
                else
                   $scope.iconFolder = "red";
               if($scope.firsttime==0)
               {  
                  $scope.firsttime=1;
                  $scope.tempMarker={label:vehicles[i].name.substr(0, 15), angle:vehicles[i].position.course, title:vehicles[i].name, icon: $scope.imagePath+'/'+$scope.iconFolder+$scope.icon,vehicle:vehicles[i],animation: 'Animation.DROP',latitude:vehicles[i].position.latitude,longitude:vehicles[i].position.longitude}; 
               }
               else
               {
                  $scope.tempMarker={label:vehicles[i].name.substr(0, 15), angle:vehicles[i].position.course, title:vehicles[i].name, icon: $scope.imagePath+'/'+$scope.iconFolder+$scope.icon,vehicle:vehicles[i],animation: '',latitude:vehicles[i].position.latitude,longitude:vehicles[i].position.longitude}; 
               }  
                $scope.onlineMarkers.push($scope.tempMarker); 
              /**************************************************************************/
            }

              var lat =vehicles[t-1].latitude;
              var lng = vehicles[t-1].longitude;
              var loc = new google.maps.LatLng(lat, lng);
              //$scope.center=loc;
              //vm.map.setZoom(8);

            $rootScope.allVehiclespositonsData={group:{id:$scope.get_org_ID(), name:$scope.get_org_name(),vehicles:vehicles}};

          }
          hideTabLoader();
        }
      })
      .error(function (error) {
            hideTabLoader();
      });
  }
  $scope.update_vehicles_status();
  var myInterval;
   // Active
  window.addEventListener('focus', startTimer);
   // Inactive
  window.addEventListener('blur', stopTimer);
  function timerHandler() {   
     $scope.update_vehicles_status();  
  }

  function startTimer() {
    $scope.update_vehicles_status();
    myInterval = window.setInterval(timerHandler, 25000);
   }
  function stopTimer() {
    window.clearInterval(myInterval);
   }
/*************************************************************************************/
});
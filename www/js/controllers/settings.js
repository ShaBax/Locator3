'use strict';


app.controller('SettingsCtrl',  function($scope,$rootScope,$http,Online,NgMap,$interval,$filter,$window) {

  $scope.base = base;
  $scope.basePath = basePath;
  $scope.authtoken = $scope.get_auth_token();
  $scope.imagePath = imagePath;
  $scope.selectedPOI = {};
  $scope.selectedPOI = 'POI';
  $scope.searchByAddressFlag = false;
  $scope.searchByPOIFlag = true;
  $scope.searchByPolygonFlag = false;
  $rootScope.liveSchedulingFlag = true;
  $rootScope.showMapOfTripFlag = false;
  $scope.deleteScheduleButton = false;
  $scope.schedule_edit = '';
  $scope.schedule = {};
  $scope.date = new Date();
  $scope.sharelocation ='';
  $scope.center = [];
  $scope.latitude = 25.217100;
  $scope.longitude = 55.361364;
  $scope.center.push($scope.latitude,$scope.longitude);
  $scope.track = {};
  $scope.points = [];
  $scope.trackPoints = [];
  $scope.polylinePoints = [];
  $scope.movingPoints = [];
  $scope.zeroTrack = false;

  var vm = this;
  var trafficLayer = new google.maps.TrafficLayer();
  
  NgMap.getMap().then(function(map) {
    vm.map = map;
  });

  $scope.refreshNGMap=function () {

    NgMap.getMap().then(function(map) {
      var currCenter = map.getCenter();
                      map.setZoom(30);
      google.maps.event.trigger(map, 'resize');
      map.setCenter(currCenter);
    });
  } 

  $rootScope.$on("showMapInSettings", function(event,args){
    $scope.refreshNGMap();
    NgMap.initMap('Map');
    $scope.showCurrentTrack(args.deviceId,args.tripId); 
  
  });

  $scope.showCurrentTrack = function(deviceID,tripID){
    
    $scope.parkingMarkers = [];
    $scope.eventMarkers = [];
    $scope.idlingMarkers = [];
    $scope.tripHistory = [];
    $scope.stops = [];
    $scope.currentTrack = [];
    $scope.track = [];

    $scope.zeroTrack = false;

    if (deviceID) {

      $http({
        method  : 'get',
        url     : baseUrl + 'api-v1/user/GetCurrentTrack/'+deviceID+'/'+tripID, headers: {'Xtoken': $scope.authtoken}
      })
      .success(function (data){

        $scope.tripHistory = data.tripHistory;
        $scope.stops = $scope.tripHistory.stops;
        $scope.currentTrack = data.get_current_track;
        $scope.track = $scope.currentTrack.points;
    
        if(!$(".sb-slidebar.sb-right.ng-scope").hasClass('sb-active'))
        {
          $(".sb-slidebar.sb-right.ng-scope").addClass('sb-active');
        }

        $(".rightSideLoader").hide();

        if ($scope.track.length == 0) {
          $scope.center.push([$scope.tripHistory.details[0].trip_start_latitude,$scope.tripHistory.details[0].trip_start_longitude]);
          $scope.zeroTrack = true;
        }

        $scope.center = ([$scope.track[$scope.track.length-1].track_vehicles_veh_latitude,$scope.track[$scope.track.length-1].track_vehicles_veh_longitude]);
        vm.map.setZoom(30);

        $scope.parkings = $scope.currentTrack.parkings;        
        $scope.parkingMarkers.push($scope.parkings);
        
        $scope.events = $scope.tripHistory.events;  
        $scope.eventMarkers.push($scope.events);

        $scope.idlings = $scope.tripHistory.idling;  
        $scope.idlingMarkers.push($scope.idlings);

        $scope.points = [];
        $scope.trackPoints = [];
        $scope.polylinePoints = [];
        $scope.movingPoints = [];
        $scope.movingPoints=[];
    
          for (var i = 0; i < $scope.track.length-1; i++) {
            $scope.points = [];
            $scope.points.push($scope.track[i].track_vehicles_veh_latitude,$scope.track[i].track_vehicles_veh_longitude);
            $scope.movingPoints.push($scope.points); 
          };

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

  //SCHEDULING/--START////


  $scope.getSingleSchedule = function(id){

    $('#addScheduling').modal('show'); 
   
    $scope.deleteScheduleButton = true;
    $scope.ID = id;
    $scope.schedule_edit = $scope.ID;  
    $http({
      method  : 'get',
      url     : baseUrl + 'getSingleSchedule/'+$scope.ID, headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){
      if (data.status == 'success') { 
          
        $scope.schedule = data.schedules[0];

      }
    })
    .error(function (error) {
    });
  };

  $rootScope.$on("callGetAllSchedules", function(event,args){

    $scope.getAllSchedules();
  })

  $scope.getAllSchedules = function(){

    $http({
      method  : 'get',
      url     : baseUrl + 'getAllScheduling', headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){
      if (data.status == 'success') { 
        $scope.schedules = data.scheduling;  
      }
    })
    .error(function (error) {
    });

    $http({
      method  : 'get',
      url     : baseUrl + 'getAllPOIforSearchVehicle', headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){
      $scope.POIs = data.POI;
    })
    .error(function (error) {
    });

    $http({
      method  : 'get',
      url     : baseUrl + 'getAllPolygonsforSearchVehicle', headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){
      $scope.polygons = data.Ploygons;
    })
    .error(function (error) {
    });

    $http({
      method  : 'get',
      url     : baseUrl + 'getVehiclesForGeozone', headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){
      $scope.Vehicles = data;
    })
    .error(function (error) {
    });
  }

  $scope.addNewSchedule = function(){

    $scope.schedule = {};
    $scope.schedule_edit = '';
    $scope.deleteScheduleButton = false;  
  }

  $scope.submitSchedulingForm = function(){

    if($scope.schedule_edit == ''){
     
      $scope.deleteScheduleButton = false;
      $scope.deviceid = $scope.objDeviceID;
      
      $scope.schedule.scheduling_date =   $("#dateSchedule").val();       

      $http({
        method  : 'post',
        url     : baseUrl + 'addNewScheduling', headers: {'Xtoken': $scope.authtoken},data: $scope.schedule
      })
      .success(function (data){
        if (data.status == 'success') {
              
        }
        $('#addScheduling').modal('hide'); 
        $scope.schedule = {}; 
        $scope.successMessage = 'Schedule Added Succesfully.' ;
        $scope.getAllSchedules();
      })
      .error(function (error) {

      });          
    }else{
          $scope.deleteScheduleButton = true;
          $scope.editScheduleID = $scope.schedule_edit;
          $scope.schedule.scheduling_date =   $("#dateSchedule").val();

          $http({
            method  : 'post',
            url     : baseUrl + 'editScheduling/'+$scope.editScheduleID, headers: {'Xtoken': $scope.authtoken},data: $scope.schedule
          })
          .success(function (data){
            if (data.status == 'success') {             
            }
            $('#addScheduling').modal('hide'); 
            $scope.schedule = {};
            $scope.successMessage = 'Schedule Edited Succesfully.' ;
            $scope.getAllSchedules();
          })
          .error(function (error) {

          });
    }
  };

  $scope.deleteSchedule = function(scheduleid){

    if ($window.confirm("Are you sure you want to delete this ?")) {

      $http({
        method  : 'get',
        url     : baseUrl + 'deleteScheduling/'+scheduleid, headers: {'Xtoken': $scope.authtoken}
      })
      .success(function (data){
        if (data.status == 'success') { 
         
          $scope.schedule = {};
          $scope.errorMessageSharelocation = 'Deleted Notification';
          $scope.getAllSchedules();
           $('#addScheduling').modal('hide'); 
          
        }
      })
      .error(function (error) {
      });
    }
  }

  
  //SCHEDULING--END////


  var input = document.getElementById('pac-input');
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
  }

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

});
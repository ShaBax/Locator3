'use strict';
// Declare app level module which depends on views, and components
var app = angular.module('myApp', ['ui.router','ngTouch','ngMap','hm.readmore','passwordModule','chart.js']);

app.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
});
app.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});

app.run(function ($rootScope, $window) {

  $rootScope.online = navigator.onLine;
  
  $window.addEventListener("offline", function() {
    $rootScope.online = false;
  }, false);
  $window.addEventListener("online", function() {
    $rootScope.online = true;
  }, false);
  
  $rootScope.get_auth_token = function () {
    if(localStorage.loginToken) {
      return localStorage.loginToken;
    } else {
      return '-1';
    }
  }
  $rootScope.save_auth_token = function (token) {
    localStorage.loginToken = token;
    return localStorage.loginToken;
  }

  $rootScope.get_userID = function () {
    if(localStorage.userID) {
      return localStorage.userID;
    } else {
      return '-1';
    }
  }
  $rootScope.save_userID = function (userID) {
    localStorage.userID = userID;                      
    return localStorage.userID;
  }

  $rootScope.get_device_token = function () {
    if(localStorage.device_token_app) {
      return localStorage.device_token_app;
    } else {
      return '-1';
    }
  }
  $rootScope.set_device_token = function (token) {
    localStorage.device_token_app = token;
    return localStorage.device_token_app;
  }

  $rootScope.get_deviceID = function () {
    if(localStorage.deviceID) {
      return localStorage.deviceID;
    } else {
      return '-1';
    }
  }
  $rootScope.save_deviceID = function (deviceID) {
    localStorage.deviceID = deviceID;                      
    return localStorage.deviceID;
  }

  $rootScope.get_selectedPage = function () {
    if(localStorage.selectedPage) {
      return localStorage.selectedPage;
    } else {
      return '-1';
    }
  }
  $rootScope.save_selectedPage = function (page) {
    localStorage.selectedPage = page;                      
    return localStorage.selectedPage;
  }


  $rootScope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams){ 

    })
  $rootScope.$on('$stateChangeSuccess', 
    function(event, toState, toParams, fromState, fromParams){
      setTimeout(function(){
      }, 2000);
    })
  $rootScope.$on('loading:finisherror', function(){
  });

});

app.controller('AppMainCtrl', function ($scope, $state) {

  if($scope.get_device_token() == 'yes'){
    $state.go('dashboard');
  } else {
    $state.go('login');
  }
   
})

//login controller
app.controller('LoginCtrl', function ($scope, $state, Login, $rootScope) {

  $scope.user = {};
  $scope.authError = null;

  $rootScope.exitFromHere = true;
  
  $scope.login = function() {
    SpinnerDialog.show('Locator','Signing in.');

    Login.dologin( $scope.user.user_name, $scope.user.user_password )
    .success(function (data) {
      SpinnerDialog.hide();
      if(data.status == 'error'){
        $scope.authError = data.data;
      }else if(data.status == 'success') {           
        $scope.save_auth_token(data.token); 
        $scope.save_userID(data.user_id);                 
        $scope.set_device_token('yes');
        $state.go('dashboard');  
      }
    })
    .error(function (error) {
  SpinnerDialog.hide();
    });  
  }   
})

app.controller('DashboardCtrl', function ($scope,$stateParams,$state,Objects,$rootScope) {

  $scope.baseUrl = baseUrl;
  $scope.authtoken = $scope.get_auth_token();
  $scope.total = '';
  $scope.moving = '';
  $scope.idle = '';
  $scope.stopped = ''; 
  $rootScope.currentPage='';

  $rootScope.exitFromHere = true;

  $scope.labels = ["Idling", "Moving", "Stopped"];
  
  $scope.colors=['#ffc000', '#71cb71', '#ed0054'];

  $rootScope.selectedLiveVehicles = [];
  $rootScope.selectAllDevices = false;

  $scope.logoutBtn = function(){   
    $state.go('login');
  }

  $scope.getDashboardDetails = function(){

    //SpinnerDialog.show('Locator','Loading dashboard.');

    Objects.getDashboardDetails($scope.authtoken)
    .success(function (data) {
      $scope.total = data.vehDetails.all;
      $scope.moving = data.vehDetails.online;
      $scope.idle = data.vehDetails.idle;
      $scope.stopped = data.vehDetails.not;

      $scope.data = [$scope.idle, $scope.moving, $scope.stopped]; 

      //SpinnerDialog.hide(); 

    })
    .error(function (error) {

    });  
  }
  $scope.getDashboardDetails();

  Objects.getVehiclesList($scope.authtoken)
  .success(function (data) {
    $scope.groups = data.orgGroups;
    for (var i = 0; i < $scope.groups.length; i++) {
          for (var j = 0; j < $scope.groups[i].vehicles.ran.length; j++) {
            if ($rootScope.selectedLiveVehicles.indexOf($scope.groups[i].vehicles.ran[j].obj_device_id) == -1) {
              $rootScope.selectedLiveVehicles.push($scope.groups[i].vehicles.ran[j].obj_device_id);
            }
          }
    }
  })
  .error(function (error) {

  });  

  

  /*if($rootScope.exitFromHere==true)
    document.addEventListener("backbutton", onBackKeyDown, false);

  function onBackKeyDown() {
    if($rootScope.exitFromHere==true){
      if(confirm("Want to exit from the app?")){
        navigator.app.exitApp();
      }
      else
      {
        return false;
      }
    }
    else
    {
      history.go(-1);
       
    }
  }*/

  $scope.goToPage = function(page){
 
    $scope.save_selectedPage(page);

    if (page == 'report') {
      $state.go('report'); 
    }else{ 

      if(page=='vehicles'){
        $rootScope.currentPage="Live View";
        $state.go('vehicles'); 
      }else if(page=='tripVehicles'){
        $rootScope.currentPage="tripVehicles";  
        $state.go('tripVehicles');
      }else if(page=='summary'){
        $rootScope.currentPage="summary";
        $state.go('vehicles'); 
      }else if (page=='live') {
        $rootScope.selectAllDevices = true;
        $rootScope.currentPage="Live View";
        $state.go('live',{objDeviceId:0,tripId:0}); 
      }

    }
  }

  $scope.refresh = function(){
    $scope.getDashboardDetails();
  }
  
});

app.controller('VehiclesCtrl', function ($scope,$stateParams,$state,Objects,$filter,$rootScope,$interval) {
 
  $scope.baseUrl = baseUrl;
  $scope.authtoken = $scope.get_auth_token();
  $scope.groups = {};
  $scope.selectedPage = $scope.get_selectedPage();
  $scope.selectedTripVehIDs = [];
  $scope.report={};
  $scope.time='00:00:00';
  $scope.Timer = null;

  $rootScope.exitFromHere = false;
 
  $scope.today = new Date();
  $scope.fromDate = $filter('date')(new Date(), 'dd-MM-yyyy');
  $scope.toDate = $filter('date')($scope.today.setDate($scope.today.getDate() + 1), 'dd-MM-yyyy');
  $scope.report.from = $scope.fromDate +" "+$scope.time; 
  $scope.report.to = $scope.toDate +" "+$scope.time;

  $rootScope.selectAllDevices = false;

  $scope.getVehiclesList = function(loader){

    if(loader==1)
    SpinnerDialog.show('Locator','Loading vehicle list.');

    Objects.getVehiclesList($scope.authtoken)
    .success(function (data) {
      $scope.groups = data.orgGroups;

      if(loader==1)
      SpinnerDialog.hide(); 
    })
    .error(function (error) {

    });  
  }
  $scope.getVehiclesList(1);
  
  $scope.Timer = $interval(function(){
    $scope.getVehiclesList(0);
  }, 10000); 

  $scope.selectedVehiclesforTrips = function(vehName,deviceId,vehID){

    if(vehID == 0){
      for(var i=0;i<=$scope.selectedVehIDs.length;i++){
        if($scope.selectedTripVehIDs[i][1] == deviceId)
          $scope.selectedTripVehIDs.splice(i,1);                   
      }     
    }else {
      $scope.selectedTripVehIDs.push([vehName,deviceId,vehID]);
    }
  }

  $scope.selectVehicle = function(selectedDevice,objDeviceId){

    if (selectedDevice) {
      if ($rootScope.selectedLiveVehicles.indexOf(objDeviceId) == -1) {
        $rootScope.selectedLiveVehicles.push(objDeviceId);
      }
    }else{
      if($rootScope.selectedLiveVehicles.indexOf(objDeviceId) != -1){
        var index = $rootScope.selectedLiveVehicles.indexOf(objDeviceId);
        $rootScope.selectedLiveVehicles.splice(index,1); 
      }     
    }
  }

  $scope.goToNextPage = function(objId,objDeviceId,objName){
    
    if ($scope.selectedPage == 'vehicles') {
      $state.go('live',{objDeviceId:objDeviceId,tripId:0});
    }else if ($scope.selectedPage == 'summary') {
      $state.go('summary',{objId:objId,objDeviceId:objDeviceId});
    }else if ($scope.selectedPage == 'tripVehicles') {
      if ($scope.selectedTripVehIDs.length == 0 ) {
        alert('Please select one or more objects');
      }else if($scope.report.from=='' || $scope.report.to==''){
        alert('Please select date');
      }else{
        localStorage.setItem('selectedTripVehIDs', JSON.stringify($scope.selectedTripVehIDs));  
        localStorage.setItem('tripDetails', JSON.stringify($scope.report));  
        $state.go('trips',{objId:objId,objDeviceId:objDeviceId,objName:objName});
      }    
    }       
  }

  $scope.refresh = function(){
    $scope.getVehiclesList(1);
  }

  $scope.goToTrips = function(){
    $scope.save_selectedPage('trips');
    $state.go('tripVehicles');
  }

  $scope.setReportDate = function(selectedDate){
    if (selectedDate == 'today') {
      $scope.today = new Date();
      $scope.fromDate = $filter('date')(new Date(), 'dd-MM-yyyy');
      $scope.toDate = $filter('date')($scope.today.setDate($scope.today.getDate() + 1), 'dd-MM-yyyy');
      $scope.report.from = $scope.fromDate +" "+$scope.time; 
      $scope.report.to = $scope.toDate +" "+$scope.time;
    }else if (selectedDate == 'yesterday') {
      $scope.today = new Date();
      $scope.fromDate = $filter('date')($scope.today.setDate($scope.today.getDate() - 1), 'dd-MM-yyyy');
      $scope.toDate = $filter('date')(new Date(), 'dd-MM-yyyy');
      $scope.report.from = $scope.fromDate +" "+$scope.time;
      $scope.report.to = $scope.toDate +" "+$scope.time;
    }else{
      $scope.today = new Date();
      $scope.fromDate = $filter('date')($scope.today.setDate($scope.today.getDate() - 100), 'dd-MM-yyyy');
      $scope.toDate = $filter('date')(new Date(), 'dd-MM-yyyy');
      $scope.report.from = $scope.fromDate +" "+$scope.time;
      $scope.report.to = $scope.toDate +" "+$scope.time;
    }
  }

  $("#datetimepicker1").on("dp.change", function (e) {

    var date = new Date(e.date);
    var mnth = ("0" + (date.getMonth()+1)).slice(-2);
    var day  = ("0" + date.getDate()).slice(-2);
    var year = date.getFullYear();
    var datetext = date.toTimeString();
    datetext = datetext.split(' ')[0];

    $scope.report.from = day+'-'+mnth+'-'+year+' '+datetext;
  });

  $("#datetimepicker2").on("dp.change", function (e) {

    var date = new Date(e.date);
    var mnth = ("0" + (date.getMonth()+1)).slice(-2);
    var day  = ("0" + date.getDate()).slice(-2);
    var year = date.getFullYear();
    var datetext = date.toTimeString();
    datetext = datetext.split(' ')[0];

    $scope.report.to = day+'-'+mnth+'-'+year+' '+datetext;  
  });

  $scope.goToPage = function(page){
    
    $scope.save_selectedPage(page);

    if (page == 'report') {
      $state.go('report'); 
    }else{ 
      if(page=='vehicles'){
        $rootScope.currentPage="Live View";
        $state.go('vehicles'); 
      }else if(page=='tripVehicles'){       
        $rootScope.currentPage="tripVehicles";  
        $state.go('tripVehicles');
      }else if(page=='summary'){
        $rootScope.currentPage="summary";
        $state.go('vehicles'); 
      }else if (page=='live') {
        $rootScope.currentPage="Live View";
        $rootScope.selectAllDevices = true;
        $state.go('live',{objDeviceId:0,tripId:0}); 
      }
       
    }
  }

});

app.controller('TripsCtrl', function ($scope,$stateParams,$state,$filter,Objects,$rootScope) {

  $scope.baseUrl = baseUrl;
  $scope.authtoken = $scope.get_auth_token();  
  $scope.historyVehIDs = [];
  $scope.trips = {}; 
  $scope.today = new Date();

  $rootScope.exitFromHere = false;

  $scope.fromDate = $filter('date')($scope.today.setDate($scope.today.getDate() - 100), 'dd-MM-yyyy');
  $scope.toDate = $filter('date')(new Date(), 'dd-MM-yyyy');
  $scope.from = $scope.fromDate +" "+'00:00:00';
  $scope.to = $scope.toDate +" "+'00:00:00'; 
  $scope.historyVehIDs = JSON.parse(localStorage.getItem('selectedTripVehIDs'));
  $scope.tripDetails = JSON.parse(localStorage.getItem('tripDetails'));

  $rootScope.selectAllDevices = false;

  $scope.getTrips = function(){

    SpinnerDialog.show('Locator','Loading trips.');

    Objects.getTrips($scope.tripDetails.from,$scope.tripDetails.to,$scope.historyVehIDs,$scope.authtoken)
    .success(function (data) {
      $scope.trips = data; 

      SpinnerDialog.hide(); 
    })
    .error(function (error) {

    });
  }
  $scope.getTrips();

  $scope.showCurrentTrack = function(deviceId,tripId){
    $state.go('live',{objDeviceId:deviceId,tripId:tripId});
  }

  $scope.refresh = function(){
    $scope.getTrips();
  }

  $scope.goToTrips = function(){
    $scope.save_selectedPage('trips');
    $state.go('vehicles');
  }

  $scope.goToPage = function(page){

    $scope.save_selectedPage(page);

    if (page == 'report') {
      $state.go('report'); 
    }else{ 
      if(page=='vehicles'){
        $rootScope.currentPage="Live View";
        $state.go('vehicles'); 
      }else if(page=='tripVehicles'){        
        $rootScope.currentPage="tripVehicles";  
        $state.go('tripVehicles');
      }else if(page=='summary'){
        $rootScope.currentPage="summary";
        $state.go('vehicles'); 
      }else if (page=='live') {
        $rootScope.currentPage="Live View";
        $rootScope.selectAllDevices = true;
        $state.go('live',{objDeviceId:0,tripId:0}); 
      }
    }
  }

});

app.controller('LiveCtrl', function ($scope,$stateParams,$state,NgMap,$interval,$http,$rootScope,Objects) {

  $scope.baseUrl = baseUrl;
  $scope.imagePath = 'images/icons';
  $scope.authtoken = $scope.get_auth_token();  
  $scope.center = [];
  /*$scope.latitude = 25.217100;
  $scope.longitude = 55.361364;
  $scope.center.push($scope.latitude,$scope.longitude);*/
  $scope.pos = '';
  $scope.vehDetails = {};
  $scope.objDeviceID = $stateParams.objDeviceId;
  $scope.objTripId = '';
  $scope.tempMarker = {};
  $scope.onlineMarkers = [];
  $scope.iconFolder = '';
  $scope.direction = '';
  $scope.icon = '';
  $scope.traffic = false;

  $rootScope.exitFromHere = false;

  $scope.infoBubble = new InfoBubble({
    maxWidth: 500
  });  
  /*var trafficLayer = new google.maps.TrafficLayer();
  NgMap.getMap().then(function(map) {
    $scope.map = map;
    trafficLayer.setMap($scope.map);
  });*/

  $rootScope.infoMarker ={};
  $scope.streetViewcenter = '';
  $scope.showStreetView=false;
  $rootScope.playandpause = false;
  $scope.tripHistory = {};
  $scope.stops = {};
  $scope.currentTrack = {};
  $scope.track = {};
  $scope.parkings = {};
  $scope.events = {};
  $scope.idlings = {};
  $scope.markers = [];
  $scope.shareLocations = {};

  $scope.refresh = function(){
    $scope.infoBubble.close();
    $rootScope.playandpause = true;
    $scope.parkingMarkers = [];
    $scope.eventMarkers = [];
    $scope.idlingMarkers = [];
    $scope.points=[];
    $scope.polylinePoints=[];
    $scope.movingPoints=[];
  }

  $scope.goToPage = function(page){
 
    $scope.save_selectedPage(page);

    if (page == 'report') {
      $state.go('report'); 
    }else{ 
      if(page=='vehicles'){
        $rootScope.currentPage="Live View";
        $state.go('vehicles'); 
      }else if(page=='tripVehicles'){        
        $rootScope.currentPage="tripVehicles";  
        $state.go('tripVehicles');
      }else if(page=='summary'){
        $rootScope.currentPage="summary";
        $state.go('vehicles'); 
      }else if (page=='live') {
        $rootScope.currentPage="Live View";
        $rootScope.selectAllDevices = true;
        $state.go('live',{objDeviceId:0,tripId:0}); 
      }  
    }
  }

  $scope.getVehicleDetails = function(center){

     if(center==1)
      SpinnerDialog.show('Locator','Loading..');

    


    Objects.getVehicleDetails($scope.authtoken)
    .success(function (data){
      $scope.vehDetails = data.vehDetails.data; 
      $scope.onlineMarkers = [];

      if ($scope.objDeviceID != 0) {
       
        for (var i = 0; i < $scope.vehDetails.length; i++) {
          if ($scope.vehDetails[i].obj_device_id == $scope.objDeviceID) {

            $scope.icon = "/car.png";
            $scope.objTripId = $scope.vehDetails[i].track_vehicles_trip_id;

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

            $scope.tempMarker={label:$scope.vehDetails[i].obj_name, angle:$scope.vehDetails[i].track_vehicles_veh_angle, title:$scope.vehDetails[i].obj_name, icon: $scope.imagePath+'/'+$scope.iconFolder+$scope.icon,vehDetails:$scope.vehDetails[i],animation: ''}; 

            $scope.onlineMarkers.push($scope.tempMarker) ;  
            $scope.center=[$scope.vehDetails[i].track_vehicles_veh_latitude,$scope.vehDetails[i].track_vehicles_veh_longitude];

            if(center==1){      
              var lat =$scope.vehDetails[i].track_vehicles_veh_latitude;
              var lng = $scope.vehDetails[i].track_vehicles_veh_longitude;
              $scope.center.push(lat,lng);
            }
          }
        }  
      }else{
        for (var i = 0; i < $scope.vehDetails.length; i++) {
          if ($rootScope.selectedLiveVehicles.indexOf($scope.vehDetails[i].obj_device_id) != -1) {

              $scope.icon = "/car.png";
              //$scope.objDeviceID = $scope.vehDetails[i].obj_device_id;
              $scope.objTripId = $scope.vehDetails[i].track_vehicles_trip_id;

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

              $scope.tempMarker={label:$scope.vehDetails[i].obj_name, angle:$scope.vehDetails[i].track_vehicles_veh_angle, title:$scope.vehDetails[i].obj_name, icon: $scope.imagePath+'/'+$scope.iconFolder+$scope.icon,vehDetails:$scope.vehDetails[i],animation: ''}; 

              $scope.onlineMarkers.push($scope.tempMarker) ;  
              $scope.center=[$scope.vehDetails[i].track_vehicles_veh_latitude,$scope.vehDetails[i].track_vehicles_veh_longitude];

              if(center==1){      
                var lat =$scope.vehDetails[i].track_vehicles_veh_latitude;
                var lng = $scope.vehDetails[i].track_vehicles_veh_longitude;
                $scope.center.push(lat,lng);
              }

          }
        }   
      }

      SpinnerDialog.hide(); 

    })
  }
  $scope.getVehicleDetails(1);

  $scope.Timer = $interval(function(){
     if ($stateParams.tripId==0 && $rootScope.currentPage=='Live View'){
      $scope.getVehicleDetails(0);
    }
  }, 10000);  

  $scope.getCurrentLocation = function(e,marker){  

    $scope.infoBubble.close();

    $scope.infoBubble = new InfoBubble({
      maxWidth: 330
    });  

    $scope.vehicleId = marker.vehDetails.obj_device_id;

    $rootScope.infoMarker = marker.vehDetails;

    var latlng = new google.maps.LatLng($rootScope.infoMarker.track_vehicles_veh_latitude,$rootScope.infoMarker.track_vehicles_veh_longitude);

    var geocoder = geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]){
          $rootScope.pointerLocationAddress = results[1].formatted_address; 
        }
        else{
          $rootScope.pointerLocationAddress = ''; 
        }
      }
      else{
        $rootScope.pointerLocationAddress = ''; 
      }
    });

    var content = '';

    if($rootScope.infoMarker.driver_image == ""){
      $rootScope.infoMarker.driver_image='profile.png';
    }

    var div = document.createElement('div');
    content = '<div class="popbox_main">'+
    '<h1 style="padding: 2px; height: 33px;">'+$rootScope.infoMarker.obj_name+'</h1>';
    if($rootScope.infoMarker.driver_image)
      content += '<a>'+'<IMG style="position: absolute; right: 9px; border: 1px solid rgb(204, 204, 204); padding: 4px; border-radius: 50%; width: 79px;" SRC="http://mylocatorplus.com/final/assets/drivers/'+$rootScope.infoMarker.driver_image+'"></a>';
    else
      content += '<a>'+'<IMG style="position: absolute; right: 9px; border: 1px solid rgb(204, 204, 204); padding: 4px; border-radius: 50%; width: 79px;" SRC="images/profile.png"></a>';

    content += 
    '<table class="popup_content"><tbody>'+
    '<tr><td>Status</td><td>: '+$rootScope.infoMarker.track_vehicles_status+'</td></tr>'+

    '<tr><td>Ignition</td>';

    if($rootScope.infoMarker.ignition_status==1)
      content +='<td  >: On</td>';
    else
      content +='<td  >: Off</td>';

    content +='</tr>'+             
    '<tr><td>Driver</td><td> : '+$rootScope.infoMarker.driver_name+'</td></tr>'+
    '<tr><td>Phone</td><td> : '+$rootScope.infoMarker.driver_phone+'</td></tr>'+

    '<tr><td>Geozone</td><td> : Geozone</td></tr>'+
       //'<tr><td>POI</td><td> : None</td></tr>'+
       //'<tr><td>Coordinates</td><td> : '+$rootScope.infoMarker.track_vehicles_veh_latitude+','+$rootScope.infoMarker.track_vehicles_veh_longitude+'</td></tr>'+
       '<tr><td style="width:21%;">Last Update</td><td> : '+$rootScope.infoMarker.track_vehicles_timestamp_from_device+'</td></tr>'+
       '<tr><td colspan="2" style="font-weight:normal"><span class="iwAddress_'+$rootScope.infoMarker.obj_device_id+'">'+$rootScope.pointerLocationAddress+'</span> </td></tr>'+
       '</tbody></table><br><div class="first_left" style="width:100%"><div class="input-group" style="margin: 0px auto 8px; width: 70%;"> ';

       if($rootScope.infoMarker.track_vehicles_status=='Moving')
        content +='<i class="fa fa-power-off ignIcon" aria-hidden="true" style=" background:#47a447 "  ></i>';
      else if($rootScope.infoMarker.track_vehicles_status=='Parking' || $rootScope.infoMarker.track_vehicles_status=='Stopped')
        content +='<i class="fa fa-power-off ignIcon" aria-hidden="true" style="  background:#d43f3a "  ></i>';
      else if($rootScope.infoMarker.track_vehicles_status=='Idling')
        content +=' <i class="fa fa-power-off ignIcon" aria-hidden="true" style="  background:Orange " ></i>';
      else if($rootScope.infoMarker.track_vehicles_status=='Out of Coverage')
        content +=' <i class="fa fa-power-off  btn-gray ignIcon" aria-hidden="true" style="  background:grey "  ></i> ';

      content +=' <input type="text" style="text-align:right;background-color:white; value="0000" readonly class="form-control iwMileage_'+$rootScope.infoMarker.obj_device_id+'"   /></div></div>'+

      '</div>';

      div.innerHTML=content;
      $scope.infoBubble.addTab('A Tab', div);

      google.maps.event.addListener(marker, 'click', function() {

        if (!$scope.infoBubble.isOpen()) {
        }
      });

      if (!$scope.infoBubble.isOpen()) {
        $scope.infoBubble.open($scope.map, this);
      }

      $http({
        method  : 'get',
        url     : baseUrl + 'GetTotalMileage/'+$scope.vehicleId, headers: {'Xtoken': $scope.authtoken}
      })
      .success(function (data){  
        $(".iwMileage_"+$scope.vehicleId).val(data);            
      })
      .error(function (error) {

      });

      $http({
        method  : 'get',
        url     : baseUrl + 'GetAddress/'+$scope.vehicleId, headers: {'Xtoken': $scope.authtoken}
      })
      .success(function (data){             
        $(".iwAddress_"+$scope.vehicleId).html(data);

      })
      .error(function (error) {

      });

  }

  $scope.enableStreetView = function(){  
    $scope.streetViewcenter = $scope.center;
    $scope.showStreetView = true;
  }

  $scope.closeStreetView = function(){ 
    $scope.streetViewcenter = '';
    $scope.showStreetView = false; 
  }

  $scope.showCurrentTrack = function(deviceID,tripID){    

    if (tripID) {

      SpinnerDialog.show('Locator','Loading tracks.');

      $scope.traffic = false;
     // trafficLayer.setMap(null);
      $scope.infoBubble.close();
      $rootScope.playandpause = true;
      $scope.parkingMarkers = [];
      $scope.eventMarkers = [];
      $scope.idlingMarkers = [];
      $scope.save_deviceID(deviceID);

      if ($scope.get_deviceID()) {

        Objects.getVehDetails(deviceID,tripID,$scope.authtoken)
        .success(function (data){  

          $scope.tripHistory = data.tripHistory;
          $scope.stops = $scope.tripHistory.stops;
          $scope.currentTrack = data.get_current_track;
          $scope.track = $scope.currentTrack.points;

          $scope.center=([$scope.track[$scope.track.length-1].track_vehicles_veh_latitude,$scope.track[$scope.track.length-1].track_vehicles_veh_longitude]);         
           // $scope.map.setZoom(16);
           $scope.parkings = $scope.currentTrack.parkings;                 
           $scope.parkingMarkers.push($scope.parkings);         
           $scope.events = $scope.tripHistory.events;  
           $scope.eventMarkers.push($scope.events);
           $scope.idlings = $scope.tripHistory.idling;  
           $scope.idlingMarkers.push($scope.idlings);
           $scope.markers.push($scope.track);
           $scope.points = [];
           $scope.polylinePoints = [];
           $scope.movingPoints = [];

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

            }else if ($scope.track[i].track_vehicles_veh_speed <= 100 && $scope.track[i].track_vehicles_veh_speed > 60) {

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
            }else{

              $scope.polylinePoints.push({point:$scope.points,color:'yellow',speed:$scope.track[i].track_vehicles_veh_speed,time:$scope.track[i].track_time,trackDate:$scope.track[i].track_date});
            }           
          }

          SpinnerDialog.hide(); 
        })  
      } 
    }
  }
  $scope.showCurrentTrack($scope.objDeviceID,$stateParams.tripId);

  $scope.pointerImage = {
    url: 'http://www.firepineapple.com/application/views/images/map_marker.gif',
    size: [45, 45],
    origin: [0,0],
    anchor: [20, 20]
  };

  $scope.getPoint = function(event, speed, time,trackDate) {

    $scope.marlatlong = event.latLng;
    $scope.speed = speed;
    $scope.time = time;
    $scope.trackDate = trackDate;
    $scope.marlatlong = event.latLng;
  }

  $scope.getParkingDetails = function(e,marker){    

    $scope.parkingMarker = marker;
    $scope.map.showInfoWindow('foo-pw', this);  
  }

  $scope.getEventDetails = function(e,marker){    

    $scope.eventMarker = marker;
    $scope.map.showInfoWindow('foo-ev', this);   
  }

  $scope.getIdlingDetails = function(e,marker){    

    $scope.idlingMarker = marker;
    $scope.map.showInfoWindow('foo-idling', this);
  }

  $scope.getAllShareLocations = function(deviceid){

    Objects.getAllShareLocations(deviceid,$scope.authtoken)
    .success(function (data){
      if (data.status == 'success') { 
        $scope.shareLocations = data.getAllShareLocation;  
      }
    })
    .error(function (error) {
    });   
  }

  $scope.saveShareLocation = function(){

    if(!$scope.tokenvalidity)
      $scope.tokenvalidity=15;

     

    SpinnerDialog.show('Locator','Sharing the location.');

    $scope.shareLocation = {
      share_location_emails: 'app@mylocator.ae',
      share_location_validto: $scope.tokenvalidity,
      share_location_device_id: $scope.objDeviceID
    };

    Objects.addNewShareLocation($scope.shareLocation,$scope.authtoken)
    .success(function (data){
      
      if (data.status == 'success') {

        $scope.ShareLocationID = data.NewID;
        $scope.sharelocationemails="";
        $scope.tokenvalidity="";

        SpinnerDialog.hide(); 

        $('#shareModal').hide();


        window.plugins.socialsharing.share('My Locator Plus', null, null, 'http://mylocatorplus.com/share/#/app/online/'+$scope.ShareLocationID);

      }
    })
    .error(function (error) {

    });
  }

  $scope.goToTrips = function(){
    $scope.save_selectedPage('trips');
    $state.go('vehicles');
  }

});

app.controller('ReportCtrl', function ($scope,$stateParams,$state,$filter,Objects,$rootScope) {

  $scope.baseUrl = baseUrl;
  $scope.authtoken = $scope.get_auth_token(); 
  $scope.groups = {};
  $scope.reportNames = {};
  $scope.report = {};

  $rootScope.exitFromHere = false;

  $scope.report.reportID = 1;
  $scope.today = new Date();
  $scope.time = "00:00:00";
  $scope.today = new Date();
  $scope.fromDate = $filter('date')(new Date(), 'dd-MM-yyyy');
  $scope.toDate = $filter('date')($scope.today.setDate($scope.today.getDate() + 1), 'dd-MM-yyyy');
  $scope.report.from = $scope.fromDate +" "+$scope.time;
  $scope.report.to = $scope.toDate +" "+$scope.time;
  $scope.selectedVehIDs = [];
  $scope.reportDetails = {};

  $rootScope.selectAllDevices = false;
  
  $scope.getVehiclesList = function(){

    SpinnerDialog.show('Locator','Loading vehicle list.');

    Objects.getVehiclesList($scope.authtoken)
    .success(function (data) {
      $scope.groups = data.orgGroups;

      SpinnerDialog.hide(); 
    })
    .error(function (error) {
      SpinnerDialog.hide(); 
    });  
  }
  $scope.getVehiclesList(); 

  $scope.getReportNames = function(){

    Objects.getReportNames($scope.authtoken)
    .success(function (data) {
      $scope.reportNames = data;
    })
    .error(function (error) {

    });  
  }
  $scope.getReportNames(); 

  $scope.setReportDate = function(selectedDate){
    
    if (selectedDate == 'today') {
      $scope.today = new Date();
      $scope.fromDate = $filter('date')(new Date(), 'dd-MM-yyyy');
      $scope.toDate = $filter('date')($scope.today.setDate($scope.today.getDate() + 1), 'dd-MM-yyyy');
      $scope.report.from = $scope.fromDate +" "+$scope.time;
      $scope.report.to = $scope.toDate +" "+$scope.time;
    }else if (selectedDate == 'yesterday') {
      $scope.today = new Date();
      $scope.fromDate = $filter('date')($scope.today.setDate($scope.today.getDate() - 1), 'dd-MM-yyyy');
      $scope.toDate = $filter('date')(new Date(), 'dd-MM-yyyy');
      $scope.report.from = $scope.fromDate +" "+$scope.time;
      $scope.report.to = $scope.toDate +" "+$scope.time;
    }else{
      $scope.today = new Date();
      $scope.fromDate = $filter('date')($scope.today.setDate($scope.today.getDate() - 100), 'dd-MM-yyyy');
      $scope.toDate = $filter('date')(new Date(), 'dd-MM-yyyy');
      $scope.report.from = $scope.fromDate +" "+$scope.time;
      $scope.report.to = $scope.toDate +" "+$scope.time;
    }
  }

  $("#datetimepicker1").on("dp.change", function (e) {

    var date = new Date(e.date);
    var mnth = ("0" + (date.getMonth()+1)).slice(-2);
    var day  = ("0" + date.getDate()).slice(-2);
    var year = date.getFullYear();
    var datetext = date.toTimeString();
    datetext = datetext.split(' ')[0];

    $scope.report.from = day+'-'+mnth+'-'+year+' '+datetext;
  });

  $("#datetimepicker2").on("dp.change", function (e) {

    var date = new Date(e.date);
    var mnth = ("0" + (date.getMonth()+1)).slice(-2);
    var day  = ("0" + date.getDate()).slice(-2);
    var year = date.getFullYear();
    var datetext = date.toTimeString();
    datetext = datetext.split(' ')[0];

    $scope.report.to = day+'-'+mnth+'-'+year+' '+datetext;
  });

  $scope.selectedVehiclesforReport = function(vehName,deviceId,vehID){

    if(vehID == 0){
      for(var i=0;i<=$scope.selectedVehIDs.length;i++){
        if($scope.selectedVehIDs[i][1] == deviceId)
          $scope.selectedVehIDs.splice(i,1);                   
      }     
    }else {
      $scope.selectedVehIDs.push([vehName,deviceId,vehID]);
    }
  }

  $scope.goToReportDetails = function(){ 

    if ($scope.selectedVehIDs.length == 0) {
      alert('Please select one or more objects');
    }else{

      localStorage.setItem('selectedVehIDs', JSON.stringify($scope.selectedVehIDs));  
      localStorage.setItem('reportDetails', JSON.stringify($scope.report));  

      $state.go('report_listing');
    }
  }

  $scope.refresh = function(){
    $scope.getVehiclesList();
    $scope.getReportNames();
  }

  $scope.goToTrips = function(){
    $scope.save_selectedPage('trips');
    $state.go('vehicles');
  }

  $scope.goToPage = function(page){
 
    $scope.save_selectedPage(page);

    if (page == 'report') {
      $state.go('report'); 
    }else{ 
      if(page=='vehicles'){
        $rootScope.currentPage="Live View";
        $state.go('vehicles'); 
      }else if(page=='tripVehicles'){
        $rootScope.currentPage="tripVehicles";  
        $state.go('tripVehicles');
      }else if(page=='summary'){
        $rootScope.currentPage="summary";
        $state.go('vehicles'); 
      }else if (page=='live') {
        $rootScope.currentPage="Live View";
        $rootScope.selectAllDevices = true;
        $state.go('live',{objDeviceId:0,tripId:0}); 
      }
    }
  }

});

app.controller('ReportListingCtrl', function ($scope,$stateParams,$state,$filter,Objects,$rootScope) {

  $scope.baseUrl = baseUrl;
  $scope.authtoken = $scope.get_auth_token(); 
  $scope.selectedVehIDs = JSON.parse(localStorage.getItem('selectedVehIDs'));
  $scope.reportDetails = JSON.parse(localStorage.getItem('reportDetails'));
  $scope.reportNames = {};
  $scope.report = $scope.reportDetails;

  $rootScope.exitFromHere = false;

  $rootScope.selectAllDevices = false;

  $scope.goToPage = function(page){
 
    $scope.save_selectedPage(page);

    if (page == 'report') {
      $state.go('report'); 
    }else{ 
      if(page=='vehicles'){
        $rootScope.currentPage="Live View";
        $state.go('vehicles'); 
      }else if(page=='tripVehicles'){     
        $rootScope.currentPage="tripVehicles";  
        $state.go('tripVehicles');
      }else if(page=='summary'){
        $rootScope.currentPage="summary";
        $state.go('vehicles'); 
      }else if (page=='live') {
        $rootScope.currentPage="Live View";
        $rootScope.selectAllDevices = true;
        $state.go('live',{objDeviceId:0,tripId:0}); 
      }
    }
  }

  $scope.getReportNames = function(){

    Objects.getReportNames($scope.authtoken)
    .success(function (data) {
      $scope.reportNames = data;
    })
    .error(function (error) {

    });  
  }

  $scope.createReport = function(){

    SpinnerDialog.show('Locator','Creating Report.');
    
    $scope.report.from = $scope.reportDetails.from;
    $scope.report.to = $scope.reportDetails.to;

    Objects.createReport($scope.selectedVehIDs,$scope.report,$scope.authtoken)
    .success(function (data) {
      $scope.reportDtls = data;  

      SpinnerDialog.hide(); 
    })
    .error(function (error) {
      SpinnerDialog.hide(); 
    }); 
  }
  $scope.createReport();

  $scope.refresh = function(){
    $scope.createReport();
    $scope.getReportNames();
  }

  $scope.goToTrips = function(){
    $scope.save_selectedPage('trips');
    $state.go('vehicles');
  }

});

app.controller('SummeryCtrl', function ($scope,$stateParams,$state,$filter,Objects,$rootScope) {

  $scope.baseUrl = baseUrl;
  $scope.authtoken = $scope.get_auth_token();  
  $scope.today = new Date();
  $scope.fromDate = $filter('date')($scope.today.setDate($scope.today.getDate() - 1), 'yyyy-MM-dd');
  $scope.toDate = $filter('date')(new Date(), 'yyyy-MM-dd');
  $scope.fromTime = $filter('date')(new Date(), 'hh:mm:ss');
  $scope.toTime = $filter('date')(new Date(), 'hh:mm:ss');
  $scope.from = $scope.fromDate +" "+$scope.fromTime;
  $scope.to = $scope.toDate +" "+$scope.toTime; 
  $scope.objID = $stateParams.objId;
  $scope.objDeviceID = $stateParams.objDeviceId;
  $scope.vehicledtls = {};
  $scope.details = {};
  $rootScope.exitFromHere = false;

  $scope.labels = ["Idling", "Moving", "Stopped"]; 
  $scope.colors=[  '#FF7800', '#14D200', '#FF1414' ];

  $rootScope.selectAllDevices = false;

  $scope.showVehicleDetails = function(){

    SpinnerDialog.show('Locator','Loading vehicle details.');

    Objects.showVehicleDetails($scope.objID,$scope.objDeviceID,$scope.from,$scope.to,$scope.authtoken)
    .success(function (data){
      $scope.vehicledtls = data.data[0]; 
      $scope.details = data.details;
      $scope.total = 100;
      $scope.moving = data.details.percentageOfTimes[0];
      $scope.idle = data.details.percentageOfTimes[2];
      $scope.stopped = data.details.percentageOfTimes[1];

      $scope.chartData = [$scope.idle, $scope.moving, $scope.stopped]; 
      SpinnerDialog.hide(); 
    }) 
  } 
  $scope.showVehicleDetails();

  $scope.refresh = function(){
    $scope.showVehicleDetails();
  }

  $scope.goToTrips = function(){
    $scope.save_selectedPage('trips');
    $state.go('vehicles');
  }

  $scope.goToPage = function(page){
 
    $scope.save_selectedPage(page);

    if (page == 'report') {
      $state.go('report'); 
    }else{ 
      if(page=='vehicles'){
        $rootScope.currentPage="Live View";
        $state.go('vehicles'); 
      }else if(page=='tripVehicles'){  
        $rootScope.currentPage="tripVehicles";  
        $state.go('tripVehicles');
      }else if(page=='summary'){
        $rootScope.currentPage="summary";
        $state.go('vehicles'); 
      }else if (page=='live') {
        $rootScope.currentPage="Live View";
        $rootScope.selectAllDevices = true;
        $state.go('live',{objDeviceId:0,tripId:0}); 
      }      
    }
  }

});

app.controller('AlertCtrl', function ($scope,$stateParams,$state,$filter,Objects,$rootScope) {

  $scope.baseUrl = baseUrl;
  $scope.authtoken = $scope.get_auth_token();  
  $rootScope.exitFromHere = false;
  $rootScope.selectAllDevices = false;

  $scope.getNotifications = function(){

    SpinnerDialog.show('Locator','Loading notifications.');

    Objects.getNotifications($scope.authtoken)
    .success(function (data){
      $scope.highNotfns = data.high;
      $scope.normalNotfns = data.normal;
      $scope.alerts = data.alerts;

      SpinnerDialog.hide(); 
    })
    .error(function (error) {
      SpinnerDialog.hide(); 
    });
  }
  $scope.getNotifications();

  $scope.refresh = function(){
    $scope.getNotifications();
  }

  $scope.goToTrips = function(){
    $scope.save_selectedPage('trips');
    $state.go('vehicles');
  }

  $scope.goToPage = function(page){
 
    $scope.save_selectedPage(page);

    if (page == 'report') {
      $state.go('report'); 
    }else{ 
      if(page=='vehicles'){
        $rootScope.currentPage="Live View";
        $state.go('vehicles'); 
      }else if(page=='tripVehicles'){  
        $rootScope.currentPage="tripVehicles";  
        $state.go('tripVehicles');
      }else if(page=='summary'){
        $rootScope.currentPage="summary";
        $state.go('vehicles'); 
      }else if (page=='live') {
        $rootScope.currentPage="Live View";
        $rootScope.selectAllDevices = true;
        $state.go('live',{objDeviceId:0,tripId:0}); 
      }
    }
  }

});




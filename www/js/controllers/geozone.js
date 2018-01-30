'use strict';


app.controller('GeoZoneCtrl',  function($scope,$rootScope,$http,Online,NgMap,$interval,$window) {

  $scope.auth_token = $scope.get_auth_token();
  $scope.base = base;
  $rootScope.geoZonePath ="";
  $rootScope.geoZoneType ="";
  $scope.vehicleList = [];
  $scope.geoZoneNotification = "";
  $scope.geoZoneTiming = "";

  var drawingManager;
  var mapDraw;
  var polyOptions = {
    strokeWeight: 0,
    fillOpacity: 0.45,
    editable: true,
    draggable: true
  };

  NgMap.getMap().then(function(map) {
    mapDraw = map;
  });

  $scope.showAddButton=true;
  $scope.showSaveButton=false;
  $scope.showAddpoint=true;
  $scope.showSavepoint=false;
  $scope.geoZone = {};
  $scope.geoZone.gz_group_id = -1;
  $scope.selectedGeozoneObjects = [];

  $scope.newPolygonPoints = [];

  $scope.selectedGeozoneToEdit = '';
  var all_overlays = [];
  var all_markers = [];
  $scope.selectedType = '';

  // TO draw polygon to the map

  $scope.drawGeoZone = function(){ 

    $scope.selectedType = 'Zone';

    $scope.clearNGMap('add');

    $scope.showAddButton=false;    

    if ($scope.drawing || 1==1) {  

      drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        markerOptions: {
          draggable: true
        },
        polylineOptions: {
          editable: true
        },
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [  'polygon' ]
        },     
        polygonOptions: polyOptions,
        map:  mapDraw
      });

      google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
        all_overlays.push(event);
        //if ($window.confirm("Are you sure you want to save this polygon?")) {
          if(event.type=='polygon'){

            $scope.showSaveButton=true;

            $scope.geoZonePath = event.overlay.getPath().getArray(); //This returns an array of drawn polygon cordinates

            $rootScope.geoZonePath = $scope.geoZonePath.toString(); 
            $rootScope.geoZoneType = event.type; 
            drawingManager.setDrawingMode(null);
                    
            var newShape = event.overlay;
            newShape.type = event.type;
            newShape.setEditable(false);
          }
          drawingManager.setMap(null);
          drawingManager=null;
      });

    }else{
      drawingManager.setMap(null);
    }
  }

  //To draw point to the map.

  $scope.drawGeoPoint = function(){  

    $scope.selectedType = 'POI';

    $scope.clearNGMap('add');

    $scope.showAddpoint=false;    
        
    if ($scope.drawing || 1==1) {  

      drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.MARKER,          
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [  'marker' ]
        },
        markerOptions: {icon: $scope.base+'final/img/poiFlag.png',draggable: true},        
        map:  mapDraw
      });  

      google.maps.event.addListener(drawingManager, 'markercomplete', function(marker) {

        all_markers.push(marker);

        $scope.showSavepoint=true;
        $scope.geoZonePath = marker.getPosition();
        $rootScope.geoZonePath = $scope.geoZonePath.toString(); 
        $rootScope.geoZoneType = 'marker';  

        drawingManager.setMap(null);
        drawingManager=null;
        
      });


    }else{
       drawingManager.setMap(null);
    }

  }

  $rootScope.$on("clearGeozoneMap", function(event,args){
    drawingManager.setMap(null);
    //drawingManager=null;
    $scope.clearNGMap('add');
  });

  $rootScope.$on("editedGeozonePoint", function(event,args){
    $scope.geoZonePath = args.position;
    $rootScope.geoZonePath = $scope.geoZonePath.toString(); 
    $rootScope.geoZoneType = 'marker';  
  });

  $scope.setObjectToCenter = function(geozoneType, geozoneId){ 
    $rootScope.$broadcast('setObjectToCenter', { latitude: '', longitude: '', geozoneType:geozoneType, geozoneId:geozoneId });
  } 

  $rootScope.$on("callGetGeoZone", function(event,args){
    $scope.getGeoZone(args.type,args.geoZoneID,args.edit,args.checked,args.showoredit);
  });
 
  $scope.getGeoZone = function(type,geoZoneID,edit,checkd,showoredit){

    $scope.editorNot = edit;

    if ($scope.editorNot) {
      if (type == 'geozone') {
        $rootScope.selectedGeozone = [];       
      }else{
        $rootScope.selectedPoint = [];
      } 
    }else{

      if (type == 'geozone') {
        $scope.selectedType = 'Zone';
        if (checkd == 1) {
          if ($rootScope.selectedGeozone.indexOf(geoZoneID) == -1) {
            $rootScope.selectedGeozone.push(geoZoneID);
          }
        }else{
          for(var i = 0; i < $scope.selectedGeozone.length; i++){
              if($scope.selectedGeozone[i] == geoZoneID){
                $scope.selectedGeozone.splice(i,1);
              }
          }  
        }
      }else{
        $scope.selectedType = 'POI';
        if(checkd == 1){
          if ($rootScope.selectedPoint.indexOf(geoZoneID) == -1) {
            $rootScope.selectedPoint.push(geoZoneID);
          }
        }else{
          for(var i = 0; i < $rootScope.selectedPoint.length; i++){
              if($rootScope.selectedPoint[i] == geoZoneID){
                $rootScope.selectedPoint.splice(i,1);
              }
          }  
        }
      }
    }

    if (type == 'geozone') {
      $scope.selectedType = 'Zone';
    }else{
      $scope.selectedType = 'POI';
    }

    $scope.geoZoneID = geoZoneID;
    $rootScope.geozoneIdToEdit = $scope.geoZoneID;
    $scope.showoredit = showoredit;

    if($scope.showoredit == 'edit'){
      $scope.showAddButton=false;
      $scope.showSaveButton=true;
      $scope.showAddpoint=false;
      $scope.showSavepoint=true;
      $scope.selectedGeozoneToEdit = $scope.geoZoneID;
      $scope.clearNGMap('edit'); 
    }

    $scope.selectedGeozoneDetails();
     
    $rootScope.$broadcast('geoZoneDetails', {type: type, geoZoneID: $scope.geoZoneID, edit: edit, checkd:checkd, showoredit:showoredit});

  }

  $rootScope.$on("editdrawedGeoZone", function(event,args){

  
    $rootScope.geoZonePath = args.editedPolygonCoords.toString(); 
    $rootScope.geoZoneType = 'polygon'; 
      
  });


  $scope.selectedGeozoneDetails = function(){

    $scope.vehicleList = [];
    $scope.selectedGeozoneObjects = [];

    if ($rootScope.geozoneIdToEdit) {
      $http({
        method  : 'get',
        url     : baseUrl + 'api-v1/geozones/getGeozoneDetails/'+$rootScope.geozoneIdToEdit, headers: {'Xtoken': $scope.authtoken}
      })
      .success(function (data){
        $scope.geoZone = data.geozone.gz[0];
        for (var i = 0; i < data.geozone.gzVehicles.length; i++) {
          $scope.selectedGeozoneObjects.push(data.geozone.gzVehicles[i].obj_gz_obj_id);
        }
        $scope.vehicleList = $scope.selectedGeozoneObjects;
      })
      .error(function (error) {

      });
    }else{
      $scope.geoZone = {};
      $scope.geoZone.gz_group_id = -1;
    }
  }


  $scope.getVehicleArray = function(checked,id){

    if (checked) {
        $scope.vehicleList.push(id); 
      }else{
        for (var i = 0; i < $scope.vehicleList.length; i++) {
            if($scope.vehicleList[i] == id) {
              $scope.vehicleList.splice(i, 1);
            }
        }
      }
  }


  //get vehicles to selct when adding new geozone//
  $scope.getVehiclesForGeozone = function(){

    $scope.Vehicles = {};

    $http({
      method  : 'get',
      url     : baseUrl + 'api-v1/reports/getVehiclesForGeozone', headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){
      $scope.Vehicles = data;
      console.log($scope.Vehicles);
    })
    .error(function (error) {

    });

  }
 
  $scope.clearGeozoneData = function(){
    $scope.geoZone = {};
    $scope.geoZone.gz_group_id = -1;
    $scope.geoZone = '';
    $scope.vehicleList = [];
    $scope.selectedGeozoneObjects = [];
  }

  $scope.setDefaultValue = function(){
    $scope.geoZone = {};
    $scope.geoZone.gz_group_id = -1;
    $scope.getVehiclesForGeozone();
  }

  $scope.saveGeoZone = function(){  

    $scope.fn = $scope.showoredit;
    $scope.geoZone.objects = $scope.vehicleList;
    $scope.geoZone.gz_org_id = $scope.get_org_ID();
    $scope.geoZone.gz_points = $rootScope.geoZonePath;
    $scope.geoZone.gz_shape = $rootScope.geoZoneType;

    if ($scope.geoZone.gz_id) {
      Online.EditGeoZone($scope.geoZone.gz_id,$scope.geoZone,$scope.auth_token)
      .success(function (data){
          $("#saveZoneModal").hide();   
          $scope.showSaveButton=false;     
          $scope.showAddButton=true;
          $scope.showSavepoint=false;
          $scope.showAddpoint=true;     
          $scope.geoZone = {};
          $scope.geoZone.gz_group_id = -1;
          $scope.selectedGeozoneToEdit = '';
          $rootScope.$broadcast('callGetZoneGroups');
      });  
    }else{
      Online.SaveGeoZone($scope.geoZone,$scope.auth_token)
      .success(function (data){
          $("#saveZoneModal").hide();        
          $scope.showAddButton=true;
          $scope.showSaveButton=false;
          $scope.showAddpoint=true;
          $scope.showSavepoint=false;
          $scope.geoZone = {};
          $scope.geoZone.gz_group_id = -1;
          $rootScope.$broadcast('callGetZoneGroups');
      });   

    }
  }

  $scope.clearNGMap = function(type){

    if (type=='add') {
      $scope.showAddButton=true;
      $scope.showSaveButton=false;
      $scope.showAddpoint=true;
      $scope.showSavepoint=false;
      $scope.selectedGeozoneToEdit = '';
    }

    
    $scope.geoZone = {};
    $scope.geoZone.gz_group_id = -1;
    $scope.vehicleList = [];
    $scope.selectedGeozoneObjects = [];

    for (var i=0; i < all_overlays.length; i++){
      all_overlays[i].overlay.setMap(null);
    }
    all_overlays = [];

    for (var i=0; i < all_markers.length; i++){
      all_markers[i].setMap(null);
    }
    all_markers = [];

    $rootScope.$broadcast('callGetZoneGroups');

    $rootScope.$broadcast('geoZoneDetails', {type: '', geoZoneID: '', edit: '', checkd: '', showoredit:''});

    $rootScope.$broadcast('getGroupsDetails');
  }

  $rootScope.$on("clearMap", function(event,args){
    $scope.clearNGMap('add');
  })

});

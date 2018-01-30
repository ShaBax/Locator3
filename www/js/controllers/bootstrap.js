'use strict';

/* Controllers */

app.filter('formatTime', function() {
  return function(ms) 
  {      
      var seconds = (ms/1000);
      var minutes = parseInt(seconds/60, 10);
      seconds = seconds%60;
      var hours = parseInt(minutes/60, 10);
      minutes = minutes%60;
      
      return hours + ':' + minutes + ':' + seconds;
    };
});
  // bootstrap controller
  app.controller('AccordionDemoCtrl', ['$scope', function($scope) {
    $scope.oneAtATime = true;
    

    $scope.groups = [
    {
      title: 'Accordion group header - #1',
      content: 'Dynamic group body - #1'
    },
    {
      title: 'Accordion group header - #2',
      content: 'Dynamic group body - #2'
    }
    ];

    $scope.items = ['Item 1', 'Item 2', 'Item 3'];

    $scope.addItem = function() {
      var newItemNo = $scope.items.length + 1;
      $scope.items.push('Item ' + newItemNo);
    };

    $scope.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };
  }])
  ; 
  app.controller('AlertDemoCtrl', ['$scope', function($scope) {
    $scope.alerts = [
    { type: 'success', msg: 'Well done! You successfully read this important alert message.' },
    { type: 'info', msg: 'Heads up! This alert needs your attention, but it is not super important.' },
    { type: 'warning', msg: 'Warning! Best check yo self, you are not looking too good...' }
    ];

    $scope.addAlert = function() {
      $scope.alerts.push({type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.'});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
  }])
  ; 
  app.controller('ButtonsDemoCtrl', ['$scope', function($scope) {
    $scope.singleModel = 1;

    $scope.radioModel = 'Middle';

    $scope.checkModel = {
      left: false,
      middle: true,
      right: false
    };
  }])
  ; 
  app.controller('CarouselDemoCtrl', ['$scope', function($scope) {
    $scope.myInterval = 5000;
    var slides = $scope.slides = [];
    $scope.addSlide = function() {
      slides.push({
        image: 'img/c' + slides.length + '.jpg',
        text: ['Carousel text #0','Carousel text #1','Carousel text #2','Carousel text #3'][slides.length % 4]
      });
    };
    for (var i=0; i<4; i++) {
      $scope.addSlide();
    }
  }])
  ; 
  app.controller('DropdownDemoCtrl', ['$scope', function($scope) {
    $scope.items = [
    'The first choice!',
    'And another choice for you.',
    'but wait! A third!'
    ];

    $scope.status = {
      isopen: false
    };

    $scope.toggled = function(open) {
      //console.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };
  }])
  ; 
  app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'items', function($scope, $modalInstance, items) {
    $scope.items = items;
    $scope.selected = {
      item: $scope.items[0]
    };

    $scope.ok = function () {
      $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }])
  ; 
  app.controller('ModalDemoCtrl', ['$scope', '$modal', '$log', function($scope, $modal, $log) {
    $scope.items = ['item1', 'item2', 'item3'];
    $scope.open = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  }])
  ; 
  app.controller('PaginationDemoCtrl', ['$scope', '$log', function($scope, $log) {
    $scope.totalItems = 64;
    $scope.currentPage = 4;

    $scope.setPage = function (pageNo) {
      $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
      $log.info('Page changed to: ' + $scope.currentPage);
    };

    $scope.maxSize = 5;
    $scope.bigTotalItems = 175;
    $scope.bigCurrentPage = 1;
  }])
  ; 
  app.controller('PopoverDemoCtrl', ['$scope', function($scope) {
    $scope.dynamicPopover = 'Hello, World!';
    $scope.dynamicPopoverTitle = 'Title';
  }])
  ; 
  app.controller('ProgressDemoCtrl', ['$scope', function($scope) {
    $scope.max = 200;

    $scope.random = function() {
      var value = Math.floor((Math.random() * 100) + 1);
      var type;

      if (value < 25) {
        type = 'success';
      } else if (value < 50) {
        type = 'info';
      } else if (value < 75) {
        type = 'warning';
      } else {
        type = 'danger';
      }

      $scope.showWarning = (type === 'danger' || type === 'warning');

      $scope.dynamic = value;
      $scope.type = type;
    };
    $scope.random();

    $scope.randomStacked = function() {
      $scope.stacked = [];
      var types = ['success', 'info', 'warning', 'danger'];

      for (var i = 0, n = Math.floor((Math.random() * 4) + 1); i < n; i++) {
        var index = Math.floor((Math.random() * 4));
        $scope.stacked.push({
          value: Math.floor((Math.random() * 30) + 1),
          type: types[index]
        });
      }
    };
    $scope.randomStacked();
  }])
  ; 
  app.controller('TabsDemoCtrl', ['$scope', function($scope) {
    $scope.tabs = [
    { title:'Dynamic Title 1', content:'Dynamic content 1' },
    { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
    ];
  }])
  ; 
  app.controller('RatingDemoCtrl', ['$scope', function($scope) {
    $scope.rate = 7;
    $scope.max = 10;
    $scope.isReadonly = false;

    $scope.hoveringOver = function(value) {
      $scope.overStar = value;
      $scope.percent = 100 * (value / $scope.max);
    };
  }])
  ; 
  app.controller('TooltipDemoCtrl', ['$scope', function($scope) {
    $scope.dynamicTooltip = 'Hello, World!';
    $scope.dynamicTooltipText = 'dynamic';
    $scope.htmlTooltip = 'I\'ve been made <b>bold</b>!';
  }])
  ; 
  app.controller('TypeaheadDemoCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.selected = undefined;
    $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    // Any function returning a promise object can be used to load values asynchronously
    $scope.getLocation = function(val) {
      return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: val,
          sensor: false
        }
      }).then(function(res){
        var addresses = [];
        angular.forEach(res.data.results, function(item){
          addresses.push(item.formatted_address);
        });
        return addresses;
      });
    };
  }])
; 
app.controller('DatepickerDemoCtrl', ['$scope', function($scope) {
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,
      class: 'datepicker'
    };

    $scope.initDate = new Date('2016-15-20');
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[2];
  }])
; 
app.controller('TimepickerDemoCtrl', ['$scope', function($scope) {
  $scope.mytime = new Date();

  $scope.hstep = 1;
  $scope.mstep = 1;

  $scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };

  $scope.ismeridian = true;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  $scope.update = function() {
    var d = new Date();
    d.setHours( 14 );
    d.setMinutes( 0 );
    $scope.mytime = d;
  };

  $scope.changed = function () {
      //console.log('Time changed to: ' + $scope.mytime);
    };

    $scope.clear = function() {
      $scope.mytime = null;
    };
  }]);





app.controller('LogoutCtrl', ['$scope','$http','$state','$rootScope', function($scope, $http,$state,$rootScope) {

  $scope.base = base;
  $scope.basePath = basePath;
  $scope.baseUrl = baseUrl;
  $scope.authtoken = $scope.get_auth_token();
  $scope.profileSuccessMessage = '';
  $scope.errorMsgFlag = false;

  $scope.getUserDetails = function(){

    $scope.userDetails = {};  
    $scope.userDetails = JSON.parse(localStorage.user_info);
  };

  $scope.getUserDetails();

  var formdata = new FormData();

  $scope.getTheFiles = function ($files) {
    angular.forEach($files, function (value, key) {
      formdata.append('file', value);
    });
  };
           
  $scope.uploadFiles = function () {

    var request = {
      method: 'POST',
      url     : baseUrl + 'uploadImage/'+$scope.userDetails.id,
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

  $scope.getTheOrgLogo = function ($files) {
    angular.forEach($files, function (value, key) {
      formdata.append('files', value);
    });
  };
           
  $scope.uploadOrgLogo = function () {

    var request = {
      method: 'POST',
      url     : baseUrl + 'uploadOrgLogo/'+$scope.userDetails.org_id,
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

  $scope.saveProfile = function(){

    $http({
      method  : 'post',
      url     : baseUrl + 'edituser/'+$scope.userDetails.id, 
      headers: {'Xtoken': $scope.authtoken},
      data: $scope.userDetails
    })
    .success(function (data){
      if (data.status == 'success') {
        localStorage.setItem('userDetails', JSON.stringify(data.userData));
       
        $scope.profileSuccessMessage = data.data;
         $scope.errorMsgFlag = false;
        $scope.uploadFiles();
        $scope.uploadOrgLogo();
      }
      else
      {
        $scope.profileSuccessMessage = false;
        $scope.errorMsgFlag = true;
        if (data.msg == 'This username is taken') {
          $scope.errorMsg = "This username is taken";
        }else{
          $scope.errorMsg = "This email is taken";
            }

      }
    })
    .error(function (error) {
 
    });

  };







$scope.editLastUserPassword = function()
{
  $scope.userDetails = {};  
    $scope.userDetails = JSON.parse(localStorage.getItem('userDetails'));
 $scope.userID = $scope.userDetails.user_id; 
 
  $http({
    method  : 'post',
    url     : baseUrl + 'editLastUserPassword/'+$scope.userID, headers: {'Xtoken': $scope.authtoken},data: $scope.editlastuserpassworddata
  })
  .success(function (data){



    if (data.status == 'success') {

          $scope.editlastPasswordSuccessMessage = true;
          $scope.editlastPasswordErrorMessage = false;
          $scope.editlastPasswordMessage = data.data;
          
        }
        else
        {
          $scope.editlastPasswordErrorMessage = true;
          $scope.editlastPasswordSuccessMessage = false;
          $scope.editlastPasswordMessage = data.data;
        }
     
  })
  .error(function (error) {
  });
}






/*

  $scope.excelrep = function(){
    
     

 alert("here");
      $http({
        method  : 'get',
        url     : baseUrl + 'ditty', headers: {'Xtoken': $scope.authtoken}
      })
      .success(function (data){
        alert("dgfdsg");
        
      })
      .error(function (error) {
      });  
   
  
  }*/





  $scope.logout = function(){

    $scope.authtoken = $scope.get_auth_token();
    
    $http({
      method  : 'post',
      url     : baseUrl + 'api-v1/user/logout',headers: {'Xtoken':$scope.authtoken}
    })
    .success(function (data){
      $scope.save_userID(-1);
      $state.go('access.signin');
    })
    .error(function (error) {
       });
  }; 

  $scope.headerAddObject = function(){
    $rootScope.$broadcast('clearVehicleDetails');
  }

  $scope.getSubUsers = function(){
    $rootScope.$broadcast('getSubUsers');
  }

  $scope.callGetSettingsNotifications = function(){

    $rootScope.$broadcast('callGetSettingsNotifications');
  }

  $scope.callreportsScheduler = function(){

    $rootScope.$broadcast('callreportsScheduler');
  }

  $scope.callGetAllSchedules = function(){
    $rootScope.$broadcast('callGetAllSchedules');
  }
 
}]);


app.controller('NavigationCtrl',  function($scope,$stateParams,$state,$http,$rootScope,NgMap,$interval,$filter,$window,Online) {
 
  $scope.backgndColor = $rootScope.get_background(); 

  $("body").css({
    "background": "url('assets/img/"+$scope.backgndColor+"')no-repeat center center fixed",
    "background-size":"100%"
  });

  $scope.baseUrl = baseUrl;
  $scope.base = base;
  $scope.NotificationTimer = null;
  $scope.check = '';
  $scope.reportVehIDs = [];
  $scope.reportDeviceIDs =[];
  $scope.historyVehIDs = []; 
  $scope.historyDeviceIDs = []; 
  $scope.report = {};
  $scope.report.rID = "1";
  $scope.today = new Date();
  $scope.fromDate = $filter('date')($scope.today.setDate($scope.today.getDate() - 7), 'dd-MM-yyyy');
  $scope.toDate = $filter('date')(new Date(), 'dd-MM-yyyy');
  $scope.fromTime = $filter('date')(new Date(), 'hh:mm:ss');
  $scope.toTime = $filter('date')(new Date(), 'hh:mm:ss');
  $scope.report.from = $scope.fromDate +" "+$scope.fromTime;
  $scope.report.to = $scope.toDate +" "+$scope.toTime; 
  $scope.option = 'all';
  $scope.history = {};
  $scope.history.from = $scope.fromDate +" "+$scope.fromTime;
  $scope.history.to = $scope.toDate +" "+$scope.toTime;
  $rootScope.eventss = {};
  $rootScope.eventss.from = $scope.fromDate +" "+$scope.fromTime;
  $rootScope.eventss.to = $scope.toDate +" "+$scope.toTime;
  $scope.selectedVehicles = [];
  $scope.selectedLiveVehicles = [];
  $scope.authtoken = $scope.get_auth_token();
  $scope.vehicleGroup={};
  $scope.objID = '';
  $rootScope.selectedMainMaintenanceTab = 'fleetExpenditure';
  $rootScope.maintenanceTab = "serviceExpense";
  $scope.userDetails = {};
  $scope.vehicleDetails = {};
  $scope.driver = {};
  $scope.driver_title ='Add Driver';
  $scope.driver_edit = false;
  $scope.settings = {};
  $scope.vehicleId = '';
  $scope.subUserCreate = false;
  $scope.subUserID = 0;
  $scope.settingsNotification = {};
  $scope.selectedNotGeozones = [];
  $scope.selectedNotObjects = [];
  $scope.selectedNotifnGeozones = [];
  $scope.selectedNotifnObjects = [];
  $scope.notificationEmail = 0;
  $scope.notificationSMS = 0;
  $scope.activeNotificationEmail = 0;
  $scope.activeNotificationSMS = 0;
  $scope.headerSettingsHighNotfns = {};
  $scope.headerSettingsNormalNotfns = {};
  $scope.driverImage = $scope.base+"final/img/profile.png";
  $scope.acSettingsSuccessMessage = '';
  $scope.acSettingsErrorMessage = '';
  $scope.subUsers = {};
  $scope.userId = '';
  $scope.selectedUserObjects = [];
  $scope.selectedSchedulerObjects = []; 
  $scope.selectedSubuserObjects = [];
  $scope.selectedReports = []; 
  $scope.selectedSubuserReports = [];
  $scope.groupId = 0;
  $scope.tripGroupId = 0;
  $scope.reportGroupId = 0;
  $scope.CommonPetrolBunkflag = false;
  $scope.CommonSalikflag = true;
  $scope.SelectedCommonZone = {};
  $scope.SelectedCommonZone = 'salik';
  $scope.allAvailableObjects = [];
  $scope.selectedLiveGroups = [];
  $scope.allAvailableGroups = [];
  $scope.selectedVehiclesForPush = [];
  $rootScope.selectedSideButton = 'Online';
  $rootScope.selectedGroups = [];
  $scope.geoPoint = {};  
  $scope.successReportSchedulerFlag = false;
  $scope.addReportShdlrButton = false;
  $scope.tripZoneId = '';
  $scope.allGroupsInitialized = false;
  $scope.allGeozoneGroupsInitialized = false;
  $rootScope.selectedGeozone = [];
  $rootScope.selectedPoint = [];
  $scope.geozonegroup = {};
  $scope.geozonegroup.gz_group_color = "red";
  $scope.selectedTripGroups = [];
  $scope.selectedReportGroups = [];
  $scope.alertSound=false;
  $scope.driverHistory  = [];
  $scope.selectedDriver = '';

  if ($scope.get_audio_sound() != -1) {
    $scope.audioSound = $scope.get_audio_sound();
  }else{
    $scope.audioSound = 0;
  }

  $rootScope.$on("callGetSettingsNotifications", function(event,args){

    $scope.reportsCreator();
    $scope.getSettingsNotifications();
  })

  $rootScope.$on("callreportsScheduler", function(event,args){

    $scope.reportsScheduler();
  })

  $rootScope.$on("getSubUsers", function(event,args){
    
    $scope.subUserCreate = false;
    $scope.settings = {};
    $scope.getSubUser();
    $scope.reportsCreator();
  });

   
  $scope.notifyUser = function(){

    $.pnotify({
      title: 'New Thing',
      text: 'Just to let you know, something happened.',
      type: 'success'
    });                                            
  };

/*  $scope.getUserDetails = function(){
    
    $scope.userDetails = {};  
    $scope.userDetails = JSON.parse(localStorage.getItem('user'));
    $scope.settingsNotification.notification_email = $scope.userDetails.email;
    $scope.userId = $scope.userDetails.id;
    $scope.ID = $scope.userDetails.organisation.id;
    $scope.orgName = $scope.userDetails.organisation.name;

  };
  $scope.getUserDetails();*/

  

  $scope.getSubUser = function(){
    var user            = $rootScope.Get_User();
    $http({
      method  : 'get',
      url     : baseUrl + 'api-v1/reports/getSubusersOfPartner/'+user.id, headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){
      $scope.subUsers = data;
    })
    .error(function (error) {

    });
  }

    
  $scope.deletethisSubUser = function(id)
  {
    $scope.subuserdeleteid = id; 
    if ($window.confirm("Are you sure you want to delete this user?")) {

      $http({
        method  : 'get',
        url     : baseUrl + 'deleteSubUser/'+$scope.subuserdeleteid, headers: {'Xtoken': $scope.authtoken}
      })
      .success(function (data){
        $scope.reportsCreator();   
      })
      .error(function (error) {

      });
    }
   }




//edit subuser password//
$scope.editSubuserPassword = function(editpasswordid)
{
 $('#editSubuserPassword').modal('show');
 $rootScope.editpasswordid = editpasswordid;

}


$scope.editpassword = function()
{
 $scope.userID = $rootScope.editpasswordid; 
 
  $http({
    method  : 'post',
    url     : baseUrl + 'editSubUserPassword/'+$scope.userID, headers: {'Xtoken': $scope.authtoken},data: $scope.editPasswordData
  })
  .success(function (data){



    if (data.status == 'success') {

          $scope.editPasswordSuccessMessage = true;
          $scope.editPasswordErrorMessage = false;
          $scope.editPasswordMessage = data.data;
          
        }
        else
        {
          $scope.editPasswordErrorMessage = true;
          $scope.editPasswordSuccessMessage = false;
          $scope.editPasswordMessage = data.data;
        }
     
  })
  .error(function (error) {
  });
}

 
/* 

  $scope.clearNotifications = function(type){

    $scope.notType = type;

     $http({
        method  : 'get',
        url     : baseUrl + 'clearPushNotifications/'+$scope.notType, headers: {'Xtoken': $scope.authtoken}
      })
      .success(function (data){
         $scope.getSettingsNotfnsHeader();
      })
      .error(function (error) {

      });
  }

  $scope.getSettingsNotfnsHeader = function(){

    $http({
      method  : 'post',
      url     : baseUrl + 'api-v1/user/getPushNotificationsHignAndNormal', headers: {'Xtoken':$scope.get_auth_token()}
    })
    .success(function (data){
      $scope.headerSettingsHighNotfns = data.high;
      $scope.headerSettingsNormalNotfns = data.normal;
      $scope.headerSettingsAlerts = data.alerts;
      $scope.alertSound=false;
      

      if($scope.headerSettingsAlerts.length!=0){

        for (var i = 1; i > 0; i--) {

          $.pnotify({
            title: 'Alert',
            text: $scope.headerSettingsAlerts[i].push_notification_content,
            type: 'success'
          });
          $scope.alertSound=true;
        };
      }
      
      if($scope.alertSound == true && $scope.get_audio_sound() == 1){
        $rootScope.audio = new Audio(base+'alert.mp3');  
        $rootScope.audio.play();
      }

    })
    .error(function (error) {
    });
  }
  $scope.getSettingsNotfnsHeader();

  $scope.MuteWindow = function(value){  
    $scope.save_audio_sound(value); 
    $scope.audioSound = $scope.get_audio_sound();
  }*/

/*  $scope.NotificationTimer = $interval(function(){
    
    $scope.getSettingsNotfnsHeader();
  }, 60000);  
*/

  //COMMON GEOZONES//

  $scope.selectCommonPointType = function(type){
    /*if(type=='salik'){
       
      $scope.CommonSalikflag = true;
      $scope.CommonPetrolBunkflag = false;
    }else{
      $scope.CommonPetrolBunkflag = true;
      $scope.CommonSalikflag = false;
    }*/
    $rootScope.$broadcast('CommonGeozones', {type: type});
  }

  //COMMON GEOZONES///


  //NOTIFICATION--settings--starts////

  $scope.addNotification = function(){

    $scope.successMessage = '';
    $scope.settingsNotification = {};
    $scope.selectedNotGeozones = [];
    $scope.selectedNotObjects = [];
    $scope.selectedNotifnGeozones = [];
    $scope.selectedNotifnObjects = [];
    $scope.notificationEmail = 0;
    $scope.notificationSMS = 0;
    $scope.activeNotificationEmail = 0;
    $scope.activeNotificationSMS = 0;
    $scope.settingsNotification.notification_email = $scope.userDetails.user_email;

    $scope.reportsCreator(); 
  }

  $scope.editNotification = function(notId){

    $rootScope.notificationId = notId;

    $scope.successMessage = '';
    $scope.settingsNotification = {};
    $scope.selectedNotGeozones = [];
    $scope.selectedNotObjects = [];
    $scope.selectedNotifnGeozones = [];
    $scope.selectedNotifnObjects = [];
    $scope.notificationEmail = 0;
    $scope.notificationSMS = 0;
    $scope.activeNotificationEmail = 1;
    $scope.activeNotificationSMS = 1;
    $http({
      method  : 'get',
      url     : baseUrl + 'getSingleSettingsNotification/'+$scope.notificationId, headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){
      $scope.settingsNotification = data.data[0];

      if ($scope.settingsNotification.notification_email) {
        $scope.notificationEmail = 1;
      }

      if ($scope.settingsNotification.notification_sms) {
        $scope.notificationSMS = 1;
      }

      for (var i = 0; i < data.objects.length; i++) {
        $scope.selectedNotifnObjects.push(data.objects[i].notification_objects_obj_device_id);
      }    
      $scope.selectedNotObjects =  $scope.selectedNotifnObjects;
      
      for (var i = 0; i < data.geozones.length; i++) {
        $scope.selectedNotifnGeozones.push(parseInt(data.geozones[i].notification_geozones_gz_id));
      }
      $scope.selectedNotGeozones = $scope.selectedNotifnGeozones;

   
      $('#addNotification').modal('show');

    })
    .error(function (error) {
    });
   
  }

  $scope.getSettingsNotifications = function(){
     
    $http({
      method  : 'get',
      url     : baseUrl + 'getSettingsNotifications', headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){
      $scope.Notifications = data;
     
    })
    .error(function (error) {
    });

  }

  $scope.selectSettingsNotObjects = function(checked,notObjectId){

    if (checked) {
      $scope.selectedNotObjects.push(notObjectId); 
    }else{
      for (var i = 0; i < $scope.selectedNotObjects.length; i++) {
          if($scope.selectedNotObjects[i] == notObjectId) {
            $scope.selectedNotObjects.splice(i, 1);
          }
      }
    }
  }

  $scope.selectNotificationGeozone = function(checked,notGeozoneId){

    if (checked) {
      $scope.selectedNotGeozones.push(notGeozoneId); 
    }else{
      for (var i = 0; i < $scope.selectedNotGeozones.length; i++) {
          if($scope.selectedNotGeozones[i] == notGeozoneId) {
            $scope.selectedNotGeozones.splice(i, 1);
          }
      }
    }
  }

  $scope.changeNotEmailStatus = function(){
    if ($scope.notificationEmail) {
      $scope.activeNotificationEmail = 1;
    }else{
      $scope.activeNotificationEmail = 0;
    }
  }

  $scope.changeNotSMSStatus = function(){
    if ($scope.notificationSMS) {
      $scope.activeNotificationSMS = 1;
    }else{
      $scope.activeNotificationSMS = 0;
    }
  }

  $scope.submitSettingsNotifications = function(){

    $scope.settingsNotification.objects = $scope.selectedNotObjects;  
    $scope.settingsNotification.geozones = $scope.selectedNotGeozones;  
      $scope.errorNotificationFlag = false;

    if ($scope.settingsNotification.notification_id) {

      $http({
        method  : 'post',
        url     : baseUrl + 'editSettingsNotification/'+$scope.settingsNotification.notification_id, headers: {'Xtoken': $scope.authtoken},data: $scope.settingsNotification
      })
      .success(function (data){
          if (data.status == 'success') {
            $scope.getSettingsNotifications();      
            $scope.successMessage = 'Notification Edited Succesfully.'; 
          }
          else
          {
              $scope.errorNotificationFlag = true;
              $scope.errorNotification = data.data.notification_email[0];
          }
      })
      .error(function (error) {

      });

    }else{

     $http({
        method  : 'post',
        url     : baseUrl + 'addNewSettingsNotification/'+$scope.get_org_ID(), headers: {'Xtoken': $scope.authtoken},data: $scope.settingsNotification
      })
      .success(function (data){
          if (data.status == 'success') {
            $scope.settingsNotification = {};
            $scope.getSettingsNotifications();  
            $scope.successMessage = 'Notification Added Succesfully.'; 
          }     
          else
          {
              $scope.errorNotificationFlag = true;
              $scope.errorNotification = data.data.notification_email[0];
          }  
      })
      .error(function (error) {

      });
    }

  }

  $scope.deleteNotification = function(notfnId){
    if ($window.confirm("Are you sure you want to delete this notification?")) {
  
      $http({
        method  : 'get',
        url     : baseUrl + 'deleteSettingsNotification/'+notfnId, headers: {'Xtoken': $scope.authtoken}
      })
      .success(function (data){
        $scope.getSettingsNotifications();
      })
      .error(function (error) {

      });
    }
  }
 
 //NOTIFICATION--settings--ends////

  $scope.setObjectToCenter = function($latitude, $longitude)
  { 
    $rootScope.$broadcast('setObjectToCenter', { latitude: $latitude, longitude: $longitude, geozoneType:'', geozoneId:'' });
  } 

  $scope.openPopUp = function($latitude, $longitude,$iding){ 
    $rootScope.$broadcast('openPopUp', { latitude: $latitude, longitude: $longitude,iding:$iding });
  } 

  $scope.showHistoryEventInfowindow = function(historyEvent){
    $rootScope.$broadcast('showHistoryEventInfowindow', {historyEvent: historyEvent});
  }

  $scope.addSubuser = function(){
    $scope.subUserCreate = false;
    $scope.subUserID = 0;
    $scope.settings = {};
    $scope.selectedUserObjects = []; 
    $scope.selectedSubuserObjects = [];
    $scope.selectedReports = []; 
    $scope.selectedSubuserReports = [];
    $scope.acSettingsSuccessMessage = '';
    $scope.acSettingsErrorMessage = '';
  }

  $scope.getReportArray = function(checked,reportId){
 
    if (checked) {
      $scope.selectedReports.push(reportId); 
    }else{
      for (var i = 0; i < $scope.selectedReports.length; i++) {
          if($scope.selectedReports[i] == reportId) {
            $scope.selectedReports.splice(i, 1);
          }
      }
    }
  }

  $scope.getVehicleArray = function(checked,vehicleId,groupID){

//alert($scope.selectedUserObjects);
//alert(vehicleId);
    if (checked) {
      $scope.selectedUserObjects.push(vehicleId); 
    }else{
      for (var i = 0; i < $scope.selectedUserObjects.length; i++) {
          if($scope.selectedUserObjects[i] == vehicleId) {
            //alert("here");
            $scope.selectedUserObjects.splice(i, 1);
            //alert($scope.selectedUserObjects);
          }
      }
    }

     if($rootScope.selectedGroups.indexOf(groupID != -1)){
                    var index = $rootScope.selectedGroups.indexOf(groupID);
                    $rootScope.selectedGroups.splice(index,1); 
                  }
  }

  $scope.getSubuser = function(subUserID){
    $scope.subUserCreate = true;
    $scope.subUserID = 0;
    $scope.acSettingsSuccessMessage = '';
    $scope.acSettingsErrorMessage = '';
    $scope.settings = {};
    $scope.selectedUserObjects = []; 
    $scope.selectedSubuserObjects = [];
    $scope.selectedReports = []; 
    $scope.selectedSubuserReports = [];

    $http({
      method  : 'get',
      url     : baseUrl + 'getSingleSubUserDetials/'+subUserID, headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){

      $scope.settings = data.data[0];

      for (var i = 0; i < data.objects.length; i++) {
        $scope.selectedSubuserObjects.push(data.objects[i].user_selected_vehicles_device_id);
      }    
      $scope.selectedUserObjects =  $scope.selectedSubuserObjects;
      
      for (var i = 0; i < data.reports.length; i++) {
        $scope.selectedSubuserReports.push(data.reports[i].user_selected_reports_report_id);
      }    
      $scope.selectedReports =  $scope.selectedSubuserReports;
        
    })
    .error(function (error) {

    });
  }


//TODAY////DEC 02//////TODAY///DEC 02/////////TODAY///DEC 02/////////TODAY///DEC 02/////////TODAY///DEC 02/////////TODAY///DEC 02///////



$scope.CheckThisGroup = function(groupselectId,SelectedGroupId){

//alert(SelectedGroupId);

//$scope.selectedUserObjects
//alert($rootScope.selectedGroups);

if (groupselectId) {

  if ($rootScope.selectedGroups.indexOf(SelectedGroupId) == -1) {
    $rootScope.selectedGroups.push(SelectedGroupId);
  }

/*
  for(var i=0;i<$scope.selectedVehiclesForPush.length;i++){
    $scope.selectedVehiclesForPush.splice(i,1);     
  } */

  for (var i = 0; i < $rootScope.Toaddsubuservehicles.length; i++) {
    if($rootScope.Toaddsubuservehicles[i].obj_gp_id == SelectedGroupId){

      $scope.selectedUserObjects.push($rootScope.Toaddsubuservehicles[i].obj_device_id); 

    }

  }
}
else
{


  if($rootScope.selectedGroups.indexOf(SelectedGroupId != -1)){
    var index = $rootScope.selectedGroups.indexOf(SelectedGroupId);
    $rootScope.selectedGroups.splice(index,1); 
  }


  for (var i = 0; i < $rootScope.Toaddsubuservehicles.length; i++) {

   if($rootScope.Toaddsubuservehicles[i].obj_gp_id == SelectedGroupId){

     if($scope.selectedUserObjects.indexOf($rootScope.Toaddsubuservehicles[i].obj_device_id) != -1){

      var index = $scope.selectedUserObjects.indexOf($rootScope.Toaddsubuservehicles[i].obj_device_id);

       $scope.selectedUserObjects.splice(index,1); 
    }

    for(var k=0;k<($scope.selectedUserObjects.length);k++){           
      if($scope.selectedUserObjects[k][0] == $rootScope.Toaddsubuservehicles[i].obj_device_id)
        $scope.selectedUserObjects.splice(k,1);     
    } 
  }
}

}

}



//TODAY///DEC 02/////////TODAY///DEC 02/////////TODAY///DEC 02/////////TODAY///DEC 02///////


 





  $scope.saveAccountsSettings = function(){

    $scope.acSettingsSuccessMessage = '';
    $scope.acSettingsErrorMessage = '';

    $scope.settings.reports = $scope.selectedReports;
    $scope.settings.vehicles = $scope.selectedUserObjects;

    if ($scope.settings.user_id) {
      $http({
        method  : 'post',
        url     : baseUrl + 'editSubUser/'+$scope.settings.user_id+'/'+$scope.get_org_ID(), headers: {'Xtoken': $scope.authtoken},data: $scope.settings
      })
      .success(function (data){
        if (data.status == 'success') {
          $scope.acSettingsSuccessMessage = data.data;
          $scope.reportsCreator();   
          //$rootScope.$broadcast('getSubUsers');
        }
      })
      .error(function (error) {

      });
    }else{
      if ($scope.subUserID == 0) {

        $http({
          method  : 'post',
          url     : baseUrl + 'addNewSubUser', headers: {'Xtoken': $scope.authtoken},data: $scope.settings
        })
        .success(function (data){
          if (data.status == 'success') {
            $scope.acSettingsSuccessMessage = data.data;
            $scope.subUserID = data.NewUserId;
            $scope.subUserCreate = true;

            $scope.reportsCreator();   
            //$rootScope.$broadcast('getSubUsers');
          }else{
            $scope.acSettingsErrorMessage = data.data.user_email[0];            
          }
        })
        .error(function (error) {

        });

      }else{

        $scope.acSettingsSuccessMessage = '';
        $scope.acSettingsErrorMessage = '';

        $http({
          method  : 'post',
          url     : baseUrl + 'addAccountSettings/'+$scope.subUserID, headers: {'Xtoken': $scope.authtoken},data: $scope.settings
        })
        .success(function (data){
          $scope.reportsCreator();   
           $rootScope.$broadcast('getSubUsers'); 
        })
        .error(function (error) {

        });
      }
    }

  }

  $scope.saveObjectGroup = function(){

    $scope.authtoken = $scope.get_auth_token();
    $scope.OrgID = $scope.userDetails.user_org_id;
    $scope.successMessage = '';
    $http({
      method  : 'post',
      url     : baseUrl + 'objGroupCreate/'+$scope.get_org_ID(), headers: {'Xtoken': $scope.authtoken},data: $scope.vehicleGroup
    })
    .success(function (data){
      $scope.vehicleGroup = {};
      $scope.successMessage = 'Group Added Succesfully.'      
    })
    .error(function (error) {

    });

  };

  $scope.getSingleVehGroup = function(vehGroupId){

    $scope.vehObjEditSuccessMessage = '';

    $http({
      method  : 'get',
      url     : baseUrl + 'getSingleObjectGroup/'+vehGroupId, headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){

      $scope.vehicleGroup = data[0];        
    })
    .error(function (error) {

    });
  }

  $scope.editObjectGroup = function(){

    $http({
      method  : 'post',
      url     : baseUrl + 'editObjGroup/'+$scope.vehicleGroup.obj_group_id, headers: {'Xtoken': $scope.authtoken},data: $scope.vehicleGroup
    })
    .success(function (data){
      $scope.vehicleGroup = {};
      $scope.vehObjEditSuccessMessage = 'Group Edited Succesfully.'    
      $('#editVehGroup').modal('hide'); 
      $scope.getGroups(); 
    })
    .error(function (error) {

    });
  }

  $scope.deleteObjectGroup = function(ID){

    if ($window.confirm("Are you sure you want to delete this group?")) {
 
      $http({
        method  : 'get',
        url     : baseUrl + 'deleteObjGroup/'+ID, headers: {'Xtoken': $scope.authtoken}
      })
      .success(function (data){
        $scope.vehicleGroup = {};
      $scope.vehObjEditSuccessMessage = 'Group Deleted Succesfully.'    
      $('#editVehGroup').modal('hide'); 
      $scope.getGroups(); 
      })
      .error(function (error) {

      });

    }
  }

  $scope.refreshDriverList = function(){

    $http({
      method  : 'get',
      url     : baseUrl + 'api-v1/user/getDriversUnderOrganisation/'+$scope.get_org_ID(), headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){

      $scope.orgdrivers=data.drivers;
      $rootScope.Set_Drivers(data.drivers);
        
    })
    .error(function (error) {

    });
  }

  $rootScope.$on("clearVehicleDetails", function(event,args){

    $scope.successMessage = '';
    $scope.vehicleDetails = {};

  })

  $scope.addObject = function(){
    
    $scope.authtoken = $scope.get_auth_token();

    $http({
      method  : 'get',
      url     : baseUrl + 'api-v1/user/getVehicleGroups', headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){

      $scope.vehgroups=data.vehicleGroups;
    })
    .error(function (error) {

    });

    $http({
      method  : 'get',
      url     : baseUrl + 'api-v1/user/getVehicleTypes', headers: {'Xtoken': $scope.get_auth_token()}
    })
    .success(function (data){

      $scope.types=data.vehicleTypes;
    })
    .error(function (error) {

    });


    $http({
      method  : 'get',
      url     : baseUrl + 'api-v1/user/getDriversUnderOrganisation/'+$scope.get_org_ID(), headers: {'Xtoken': $scope.get_auth_token()}
    })
    .success(function (data){

      $scope.orgdrivers=data.drivers;
        
    })
    .error(function (error) {

    });

    $http({
      method  : 'get',
      url     : baseUrl + 'api-v1/user/getDeviceTypes', headers: {'Xtoken':$scope.get_auth_token()}
    })
    .success(function (data){

      $scope.deviceTypes=data;
    })
    .error(function (error) {

    });

  }

  $scope.editObject = function(objID){

    $scope.successMessage = '';
    $scope.ID = objID;

      $http({
        method  : 'get',
        url     : baseUrl + 'api-v1/user/getSingleObjectDetails/'+$scope.ID, headers: {'Xtoken': $scope.authtoken}
      })
      .success(function (data){
        $scope.vehicleDetails = data[0];       
        $('#addVehicle').modal('show');
      })
      .error(function (error) {
      });  
  }

 
 $scope.deleteObject = function(objID){

    $scope.successMessage = '';
    $scope.ID = objID;

      $http({
        method  : 'get',
        url     : baseUrl + 'deleteObject/'+$scope.ID, headers: {'Xtoken': $scope.authtoken}
      })
      .success(function (data){
        $('#addVehicle').modal('hide');
        $scope.getGroups();
      })
      .error(function (error) {
      });  
  }

 
  $scope.saveObject = function(){

    if ($scope.vehicleDetails.obj_id) {

      $http({
        method  : 'post',
        url     : baseUrl + 'api-v1/user/editObject/'+$scope.vehicleDetails.obj_id, headers: {'Xtoken': $scope.authtoken},data: $scope.vehicleDetails
      })
      .success(function (data){
        if(data.status=="success")
        {
          $scope.successMessage = 'Vehicle Edited Succesfully.'; 
          $rootScope.Set_Vehicles(data.vehicles);
          $('#addVehicle').modal('hide');
        }
        // $scope.getGroups();
      })
      .error(function (error) {
      });

    }else{
    
      $scope.OrgID = $scope.userDetails.org_id;
      $scope.userID = $scope.userDetails.id;
      $scope.successMessage = '';
      $http({
        method  : 'post',
        url     : baseUrl + 'objCreate/'+$scope.OrgID+'/'+$scope.userID, headers: {'Xtoken': $scope.authtoken},data: $scope.vehicleDetails
      })
      .success(function (data){
        $scope.vehicleDetails = {};
        $scope.successMessage = 'Vehicle Added Succesfully.'; 
        $scope.getGroups();
      })
      .error(function (error) {

      });
    }
  }

  $scope.selectedOption = function(option)
  {

    $scope.selectedLiveGroups = [];
    //alert(option);
    $scope.secondOption = '';
    if (option == 'all') {
      $scope.option = 'all';
      $rootScope.$broadcast('changeLiveOptions', { option: 'all' });
    }else if (option == 'Moving') {
      $scope.option = 'Moving';
      $rootScope.$broadcast('changeLiveOptions', { option: 'Moving' });
    }else if (option == 'Idling') {
      $scope.option = 'Idling';
      $rootScope.$broadcast('changeLiveOptions', { option: 'Idling' });
    }else if (option == 'stop') {
       $scope.option = 'Stopped';
       $scope.secondOption = 'Parking';
       $rootScope.$broadcast('changeLiveOptions', { option: 'Parking' });
    } else{
      $scope.option = 'didnotrun';
    }

  }

/*  $scope.getGroups = function(){

    if ($scope.get_org_name() == -1) {
      $scope.organisationName = 'Default';
    }else{
      $scope.organisationName = $scope.get_org_name();
    }
     
    if( typeof showTabLoader !== "undefined")
      showTabLoader(); 
 
    $rootScope.groups = {};

    $http({
      method  : 'post',
      url     : baseUrl + 'api-v1/user/getObjGroupsForUser', headers: {'Xtoken':$scope.get_auth_token()}
    })
    .success(function (data)
    {

      $rootScope.groups = data.orgGroups;

      if($scope.allGroupsInitialized == false) 
      {
        $scope.allGroupsInitialized= true;
        $scope.showAllVehiclesFirst();
      }
           
      if(angular.isUndefined($rootScope.first_device_id))
      {

        if($rootScope.groups[0].vehicles.ran){

          $rootScope.first_obj_id = $rootScope.groups[0].vehicles.ran[0].obj_id;
          $rootScope.first_device_id = $rootScope.groups[0].vehicles.ran[0].obj_device_id;
        }else{
          $rootScope.first_obj_id = 0;
          $rootScope.first_device_id = 0;
        }

        $scope.dashboardObjID = $rootScope.first_obj_id;

       // $rootScope.$broadcast('vehicleDetailsforDashboard', {objID:$rootScope.first_obj_id,deviceID:$rootScope.first_device_id});
      
      }
      else
      {

        $scope.dashboardObjID = $rootScope.first_obj_id;
      }

    //  $scope.getNumbers();
      hideTabLoader();
    })
    .error(function (error) {
      hideTabLoader();
    });

  }*/
  //$scope.getGroups();

  $scope.showAllVehiclesFirst = function()
  {

    for (var i = 0; i < $rootScope.groups.length; i++) {
        $scope.allAvailableGroups.push($rootScope.groups[i].group.obj_group_id);
        for (var j = 0; j < $rootScope.groups[i].vehicles.ran.length; j++) {
          $scope.allAvailableObjects.push($rootScope.groups[i].vehicles.ran[j].obj_id);
          $scope.selectedVehicles.push([$rootScope.groups[i].vehicles.ran[j].obj_device_id,$rootScope.groups[i].vehicles.ran[j].obj_name,$rootScope.groups[i].vehicles.ran[j].obj_id]);
          //$scope.historyDeviceIDs.push([$rootScope.groups[i].vehicles.ran[j].obj_name,$rootScope.groups[i].vehicles.ran[j].obj_device_id,$rootScope.groups[i].vehicles.ran[j].obj_id]);  
        }        
    }

    $scope.selectedLiveVehicles = $scope.allAvailableObjects;
    //$scope.historyVehIDs = $scope.allAvailableObjects;
    //$scope.reportDeviceIDs = $scope.allAvailableObjects;
    $scope.selectedLiveGroups = $scope.allAvailableGroups; 
    //$scope.selectedTripGroups = $scope.allAvailableGroups;
    //$scope.selectedReportGroups = $scope.allAvailableGroups;

    //$scope.reportVehIDs = $scope.historyDeviceIDs;

    $rootScope.$broadcast('vehicleDetails', { deviceId: 0, device: 0, selectAll:1, selectedGroup: 0, selectedGroupStatus: 0 }); 
  }

/*  $scope.getNumbers = function(){

    $http({
      method  : 'get',
      url     : baseUrl + 'api-v1/user/getVehicleForUser/0', headers: {'Xtoken':$scope.get_auth_token()}
    })
    .success(function (data){
     // alert("test");
      $rootScope.allno = data.vehDetails.all;
      $rootScope.online = data.vehDetails.online;
      $rootScope.idle = data.vehDetails.idle;
      $rootScope.conpblm = data.vehDetails.not; 
      $rootScope.didnotrun  = data.vehDetails.didnotrun;   
    })
    .error(function (error) {

    });

  };
  $scope.getNumbers();*/

  $scope.getGroupVehicles = function(groupId){

    $scope.vehicles = {};

    $http({
      method  : 'get',
      url     : baseUrl + 'getvehicleUnderGroup/'+groupId, headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){
      $scope.vehicles = data.vehGroup;
    })
    .error(function (error) {

    });

  }
  
  $scope.checkAllVehicles = function(groupId,selectedGroup)
  {

       $(".objgpid_"+groupId).trigger('click');


   //objgpid_
/*   alert(groupId);
      
    if (groupId) {

      if ($scope.selectedLiveGroups.indexOf(selectedGroup) == -1) {
        $scope.selectedLiveGroups.push(selectedGroup);
      }

      for(var i=0;i<$scope.selectedVehicles.length;i++){
        $scope.selectedVehicles.splice(i,1);     
      } 
      $scope.selectedVehicles=[];

        for (var i = 0; i < $rootScope.groups.length; i++) {
          if($rootScope.groups[i].group.obj_group_id == selectedGroup){
            for (var j = 0; j < $rootScope.groups[i].vehicles.ran.length; j++) {
              if($scope.selectedLiveVehicles.indexOf($rootScope.groups[i].vehicles.ran[j].obj_id)==-1){
                $scope.selectedVehicles.push([$rootScope.groups[i].vehicles.ran[j].obj_device_id,$rootScope.groups[i].vehicles.ran[j].obj_name,$rootScope.groups[i].vehicles.ran[j].obj_id]); 
                $scope.selectedLiveVehicles.push($rootScope.groups[i].vehicles.ran[j].obj_id); 

                $scope.selectedVehicles.push([$rootScope.groups[i].vehicles.ran[j].obj_device_id,$rootScope.groups[i].vehicles.ran[j].obj_name,$rootScope.groups[i].vehicles.ran[j].obj_id]);  
              }
            }          
          }
        }
     
      $rootScope.$broadcast('vehicleDetails', { deviceId: 0, device: 0, selectAll:0, selectedGroup: selectedGroup, selectedGroupStatus: true }); 
    }else{

      if($scope.selectedLiveGroups.indexOf(selectedGroup != -1)){
        var index = $scope.selectedLiveGroups.indexOf(selectedGroup);
        $scope.selectedLiveGroups.splice(index,1); 
      }

        for (var i = 0; i < $rootScope.groups.length; i++) {
          if($rootScope.groups[i].group.obj_group_id == selectedGroup){
            for (var j = 0; j < $rootScope.groups[i].vehicles.ran.length; j++) {

              if($scope.selectedLiveVehicles.indexOf($rootScope.groups[i].vehicles.ran[j].obj_id) != -1){
                var index = $scope.selectedLiveVehicles.indexOf($rootScope.groups[i].vehicles.ran[j].obj_id);
                $scope.selectedLiveVehicles.splice(index,1); 
              }

              for(var k=0;k<($scope.selectedVehicles.length);k++){           
                if($scope.selectedVehicles[k][0] == $rootScope.groups[i].vehicles.ran[j].obj_device_id)
                  $scope.selectedVehicles.splice(k,1);     
              } 

            }          
          }
        }
      
       
      for(var i=0;i<$scope.selectedVehicles.length;i++){
        $scope.selectedVehicles.splice(i,1);     
      } 
      $scope.selectedVehicles=[];

      $rootScope.$broadcast('vehicleDetails', { deviceId: 0, device: 0, selectAll:0, selectedGroup: selectedGroup, selectedGroupStatus: false }); 

      if ($scope.selectedLiveVehicles.length == 0) {
        $rootScope.$broadcast('refreshDetails');
      }
    }*/
  }

 $scope.selected_vehicles_status = function(deviceid,uniqueId,groupid)
 {
    //alert(deviceid);
    //$scope.arrayselecteddevices
 } 
  $scope.getVehicleDetails = function(selectedDevice,deviceId,vehId,vehName,vehGroupId)
  {  

    
    if($scope.selectedLiveGroups.indexOf(vehGroupId != -1)){
      var index = $scope.selectedLiveGroups.indexOf(vehGroupId);
      $scope.selectedLiveGroups.splice(index,1); 
    }

    $scope.groupId = 0;
    

    if (selectedDevice) {
      if ($scope.selectedLiveVehicles.indexOf(selectedDevice) == -1) {
        $scope.selectedLiveVehicles.push(selectedDevice);
        $scope.selectedVehicles.push([deviceId,vehName,selectedDevice]);  
      }
    } 
    else{
            
      if($scope.selectedLiveVehicles.indexOf(vehId) != -1){
        var index = $scope.selectedLiveVehicles.indexOf(vehId);
        $scope.selectedLiveVehicles.splice(index,1); 
      }    
          
      for(var i=0;i<($scope.selectedVehicles.length);i++){
            
        if($scope.selectedVehicles[i][0]==deviceId)
          $scope.selectedVehicles.splice(i,1);     
      } 

      if ($scope.selectedLiveVehicles.length == 0) {
        $rootScope.$broadcast('refreshDetails');
      }
        
    }
    $scope.deviceId = deviceId;
    //alert($scope.selectedVehicles.length);
    $rootScope.$broadcast('vehicleDetails', { deviceId: $scope.deviceId, device: selectedDevice, selectAll:0, selectedGroup: 0, selectedGroupStatus: 0 }); 
  }

  //Zone///

  $scope.clearMap = function(){
    $rootScope.selectedGeozone = [];
    $rootScope.$broadcast('clearMap');
  }

  $scope.getZoneGroups = function(){

    if( typeof showTabLoader !== "undefined")
      showTabLoader(); 

    $scope.geoGroups = {};

    $http({
      method  : 'get',
      url     : baseUrl + 'api-v1/geozones/getGeozoneGroupsForUser', headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){

      $scope.geoGroups = data.geozonesGroupsForUser;

       $scope.rptsGeoGroups=$scope.geoGroups;

      if ($scope.allGeozoneGroupsInitialized == false) {

        if ($rootScope.selectedGeozone.indexOf($scope.geoGroups[0].geozone[0].gz_id) == -1) {
          $rootScope.selectedGeozone.push($scope.geoGroups[0].geozone[0].gz_id); 
          $rootScope.$broadcast('callGetGeoZone', { type: 'geozone', geoZoneID: $rootScope.selectedGeozone, edit:0, checked: 1, showoredit: 'show' });    
        } 
        $scope.allGeozoneGroupsInitialized = true;
      }

      hideTabLoader();    
    })
    .error(function (error) {

      hideTabLoader();
    });

  }

  $rootScope.$on("callGetZoneGroups", function(event,args){
    $scope.allGeozoneGroupsInitialized = true;
    $scope.getZoneGroups();
  })

  $scope.getGroupGeoZones = function(gzGroupId){

    $rootScope.geoZones = {};

    $http({
      method  : 'get',
      url     : baseUrl + 'getGeozoneUnderGroup/'+gzGroupId, headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){
      $rootScope.geoZones = data.geozonesUnderGroup;
    })
    .error(function (error) {

    });
  }

  //delete geozone///
  $scope.deleteGeozone = function(Id){

    if ($window.confirm("Are you sure you want to delete this geozone?")) {
    
      $http({
        method  : 'get',
        url     : baseUrl + 'deleteGeozone/'+Id, headers: {'Xtoken': $scope.authtoken}
      })
      .success(function (data){
        
        $scope.getZoneGroups();
        $scope.clearMap();
      })
      .error(function (error) {
      });
    }
  };

  $scope.editGeoGroup = function(Id){

    $http({
      method  : 'get',
      url     : baseUrl + 'getGroupName/'+Id, headers: {'Xtoken': $scope.authtoken}
    })
   .success(function (data){
      $scope.GroupNames = data.Geogroup[0]; 
      $scope.Id = Id;    
    })
  };

  ///edit geozone group//
  $scope.editGeozoneGroup = function(){

    $http({
      method  : 'post',
      url     : baseUrl + 'editGroupName/'+$scope.Id,
      headers: {'Xtoken': $scope.authtoken},
      data : $scope.GroupNames
    })
    .success(function (data){
      $scope.getZoneGroups();     
      $("#editGroup").hide();  
      angular.element(document.getElementById('addGroup')).scope().getZoneGroups(); 
    })
    .error(function (error) {

    });
    $scope.getZoneGroups();
  };

  //add geozone group//
  $scope.AddGeoGroup = function(){
    $scope.authtoken = $scope.get_auth_token();
    $scope.ID = $scope.userDetails.user_org_id;

    $scope.successMessage = '';
    $http({
      method  : 'post',
      url     : baseUrl + 'GeoGroupCreate/'+$scope.ID, headers: {'Xtoken': $scope.authtoken},data: $scope.geozonegroup
    })
    .success(function (data){
      $scope.geozonegroup = {};
      $scope.geozonegroup.gz_group_color = "red";
      $scope.successMessage = 'Geozone Group Added Succesfully.' 
      $scope.getZoneGroups();  
      $rootScope.$broadcast('callGetZoneGroups'); 
       $("#addGeoGroup").hide();        
    })
    .error(function (error) {

    });
    $scope.getZoneGroups();

  };

  //delet geozone group//
  $scope.deleteGeozoneGroup = function(id){
    if ($window.confirm("Are you sure you want to delete this geozone group?")) {
      $scope.deleteId = id;

      $http({
        method  : 'get',
        url     : baseUrl + 'deleteGeozoneGroup/'+$scope.deleteId,
         headers: {'Xtoken': $scope.authtoken} 
      })

      .success(function (data){
         
         $scope.getZoneGroups();
      })
      .error(function (error) {

      });
    }

    $scope.getZoneGroups();
  };

  $scope.showSavePoiModal = function(latitude,longitude){
    $scope.geoZonePath = '('+latitude+','+longitude+')';
  }

  $scope.saveGeoZonePoint = function(){  

      $scope.geoPoint.objects = [];
      $scope.geoPoint.gz_org_id = $scope.get_org_ID();
      $scope.geoPoint.gz_points = $scope.geoZonePath;
      $scope.geoPoint.gz_shape = 'marker';

        $http({
          method  : 'post',
          url     : baseUrl + 'addGeozone', headers: {'Xtoken': $scope.authtoken}, data: $scope.geoPoint
        })
        .success(function (data){
            $("#savePOIModal").hide();               
            $scope.geoPoint = {};         
        });      
  }

  //Zone///

  ///DRIVERS//
  
  $scope.getDrivers = function(){

    if( typeof showTabLoader !== "undefined")
      showTabLoader(); 

    $scope.drivers={};
    $http({
      method  : 'get',
      url     : baseUrl + 'api-v1/user/getDrivers', headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){
      $scope.drivers = data.data;
      hideTabLoader();
    })
    .error(function (error) {
      hideTabLoader();
    });

  };

  $scope.getDriverHistory = function(driverId){

    $scope.driverHistory = [];
    $scope.selectedDriver = driverId;

    if( typeof showTabLoader !== "undefined")
      showTabLoader(); 
 
    $http({
      method  : 'get',
      url     : baseUrl + 'getDriverHistory/'+driverId, headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){
      $scope.driverHistory = data;
      hideTabLoader();
    })
    .error(function (error) {
      hideTabLoader();
    });

  };

  $scope.closeDriverHistory = function(){
    $scope.driverHistory = [];
    $scope.selectedDriver = '';
  }

  $scope.addDriver = function(){

      $scope.driver = {};
      $scope.driverImage = $scope.base+"final/img/profile.png";
      $scope.successMessage = '';
      $scope.driver_edit = false;
      $scope.driver_title = 'Add Driver';
  }

  $scope.editDriver = function(driverID){

    $scope.successMessage = '';
    $scope.driver_title = 'Edit Driver';
    $scope.driver_edit = true;

    $http({
      method  : 'get',
      url     : baseUrl + 'api-v1/user/getSingleDriver/'+driverID, headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){
      $scope.driver = data[0]; 
      if ($scope.driver.driver_image) {
        $scope.driverImage = $scope.base+"final/assets/drivers/"+$scope.driver.driver_image;
      }else{
        $scope.driverImage = $scope.base+"final/img/profile.png";
      }          
    })
    .error(function (error) {

    });
  }

  $scope.deleteDriver = function(driverID){

    if ($window.confirm("Are you sure you want to delete this driver?")) {
 
      $http({
        method  : 'get',
        url     : baseUrl + 'deleteDriver/'+driverID, headers: {'Xtoken': $scope.authtoken}
      })
      .success(function (data){
        $scope.successMessage = 'Driver Edited Succesfully.';
        $scope.driver = {};

        $scope.getDrivers();  
      })
      .error(function (error) {

      });

    }
  }

  $scope.makeEnable = function(){
    $scope.driver_edit = false;
  }

  $scope.SubmitDriver = function(){
    
    $scope.authtoken = $scope.get_auth_token();
    $scope.OrgID = $scope.get_org_ID();
    $scope.successMessage = '';

    if ($scope.driver.driver_id) {

      $http({
        method  : 'post',
        url     : baseUrl + 'api-v1/user/editDriver/'+$scope.driver.driver_id, headers: {'Xtoken': $scope.authtoken},data: $scope.driver
      })
      .success(function (data){
        if (data.status == 'success') {
          $scope.successMessage = 'Driver Edited Succesfully.';
          $scope.getDrivers();
          $scope.uploadDriverImage(data.driverId);   
        }            
      })
      .error(function (error) {

      });

    }else{

      $http({
        method  : 'post',
        url     : baseUrl + 'api-v1/user/addDriver/'+$scope.OrgID, headers: {'Xtoken': $scope.authtoken},data: $scope.driver
      })
      .success(function (data){
        if (data.status == 'success') {
          $scope.successMessage = 'Driver Added Succesfully.'; 
          
          $scope.getDrivers();
          $scope.uploadDriverImage(data.driverID);
          $scope.driver = {}; 
         // $scope.editObject($scope.get_org_ID()) ;  
           $scope.vehicleDetails.obj_driver_id = data.driverID;
          $scope.refreshDriverList();
         $('#addDriver').modal('hide');

            
        }
      })
      .error(function (error) {

      });

    }

  };

  var formdata = new FormData();

  $scope.uploadedFile = function(element) {

    $scope.currentFile = element.files[0];

    var reader = new FileReader();

    reader.onload = function(event) {

      $scope.driverImage = event.target.result

      $scope.$apply(function($scope) {

        $scope.files = element.files;

      });
    }
    reader.readAsDataURL(element.files[0]);
  }

  $scope.getTheDriverImage = function ($files) {
    angular.forEach($files, function (value, key) {
      formdata.append('file', value);
    });
  };
           
  $scope.uploadDriverImage = function (id) {
    $scope.Id = id;
    var request = {
      method: 'POST',
      url     : baseUrl + 'api-v1/user/uploadDriverImage/'+$scope.Id,
      data: formdata,
      headers: {
        'Content-Type': undefined,
        'Xtoken': $scope.authtoken
      }
    };
                
    $http(request)
    .success(function (d) {
      $scope.successMessage = 'Driver Image Changed Succesfully.';
      $('#addDriver').modal('hide');
    })
    .error(function () {
    });
  }

  //DRIVERS///

  ////HISTORY///

  $scope.checkAllTripVehicles = function(groupId,selectedGroup){

    if (groupId) {

      if ($scope.selectedTripGroups.indexOf(selectedGroup) == -1) {
        $scope.selectedTripGroups.push(selectedGroup);
      }

        for (var i = 0; i < $rootScope.groups.length; i++) {
          if($rootScope.groups[i].group.obj_group_id == selectedGroup){
            for (var j = 0; j < $rootScope.groups[i].vehicles.ran.length; j++) {
              if($scope.historyVehIDs.indexOf($rootScope.groups[i].vehicles.ran[j].obj_id) == -1){
                $scope.historyVehIDs.push($rootScope.groups[i].vehicles.ran[j].obj_id); 
                $scope.historyDeviceIDs.push([$rootScope.groups[i].vehicles.ran[j].obj_name,$rootScope.groups[i].vehicles.ran[j].obj_device_id,$rootScope.groups[i].vehicles.ran[j].obj_id]);  
              }
            }          
          }
        }
  
    }else{

      if($scope.selectedTripGroups.indexOf(selectedGroup != -1)){
        var index = $scope.selectedTripGroups.indexOf(selectedGroup);
        $scope.selectedTripGroups.splice(index,1); 
      }

        for (var i = 0; i < $rootScope.groups.length; i++) {
          if($rootScope.groups[i].group.obj_group_id == selectedGroup){
            for (var j = 0; j < $rootScope.groups[i].vehicles.ran.length; j++) {
              if($scope.historyVehIDs.indexOf($rootScope.groups[i].vehicles.ran[j].obj_id) != -1){
                var index = $scope.historyVehIDs.indexOf($rootScope.groups[i].vehicles.ran[j].obj_id);
                $scope.historyVehIDs.splice(index,1); 
              }
              for(var k=0;k<($scope.historyDeviceIDs.length);k++){           
                if($scope.historyDeviceIDs[k][1] == $rootScope.groups[i].vehicles.ran[j].obj_device_id)
                  $scope.historyDeviceIDs.splice(k,1);     
              } 
            }          
          }
        }
     
    }
  }

  $scope.selectedVehicleforHistory = function(vehName,deviceId,vehID,selectedvehID,vehGroupId){

    if($scope.selectedTripGroups.indexOf(vehGroupId != -1)){
      var index = $scope.selectedTripGroups.indexOf(vehGroupId);
      $scope.selectedTripGroups.splice(index,1); 
    }

    if (selectedvehID) {
      if ($scope.historyVehIDs.indexOf(vehID) == -1) {
        $scope.historyVehIDs.push(vehID);
        $scope.historyDeviceIDs.push([vehName,deviceId,vehID]);  
      }
    }else{
            
      if($scope.historyVehIDs.indexOf(vehID) != -1){
        var index = $scope.historyVehIDs.indexOf(vehID);
        $scope.historyVehIDs.splice(index,1); 
      }    
      for(var i=0;i<($scope.historyDeviceIDs.length);i++){
            
        if($scope.historyDeviceIDs[i][1] == deviceId)
          $scope.historyDeviceIDs.splice(i,1);     
      } 
    }
  }

  $scope.todays = function(page){

    $(".historyRouteTab").addClass("active");
    $(".historyVehicleTab").removeClass("active");
    
    if (page == 'report') {
      $scope.today = new Date();
      $scope.fromDate = $filter('date')(new Date(), 'dd-MM-yyyy');
      $scope.toDate = $filter('date')($scope.today.setDate($scope.today.getDate() + 1), 'dd-MM-yyyy');
      $scope.report.from = $scope.fromDate +" "+'00:00:00';
      $scope.report.to = $scope.toDate +" "+'00:00:00';

    }else if (page == 'history') {

      $scope.today = new Date();
      $scope.fromDate = $filter('date')(new Date(), 'dd-MM-yyyy');
      $scope.toDate = $filter('date')($scope.today.setDate($scope.today.getDate() + 1), 'dd-MM-yyyy');
      $scope.history.from = $scope.fromDate +" "+'00:00:00';
      $scope.history.to = $scope.toDate +" "+'00:00:00';

      $scope.submitSearch($scope.history.from,$scope.history.to);

    }else if (page == 'events')
    {
      $scope.today = new Date();
      $scope.fromDate = $filter('date')(new Date(), 'dd-MM-yyyy');
      $scope.toDate = $filter('date')($scope.today.setDate($scope.today.getDate() + 1), 'dd-MM-yyyy');
      $rootScope.eventss.from = $scope.fromDate +" "+'00:00:00';
      $rootScope.eventss.to = $scope.toDate +" "+'00:00:00';

      $scope.showEvents($rootScope.eventss.from,$rootScope.eventss.to);
    }
    
  }

  $scope.yesterday = function(page){

    $(".historyRouteTab").addClass("active");
    $(".historyVehicleTab").removeClass("active");

    if (page == 'report') {
      $scope.today = new Date();
      $scope.fromDate = $filter('date')($scope.today.setDate($scope.today.getDate() - 1), 'dd-MM-yyyy');
      $scope.toDate = $filter('date')(new Date(), 'dd-MM-yyyy');
      $scope.report.from = $scope.fromDate +" "+'00:00:00';
      $scope.report.to = $scope.toDate +" "+'00:00:00';

    }else if (page == 'history') {

      $scope.today = new Date();
      $scope.fromDate = $filter('date')($scope.today.setDate($scope.today.getDate() - 1), 'dd-MM-yyyy');
      $scope.toDate = $filter('date')(new Date(), 'dd-MM-yyyy');
      $scope.history.from = $scope.fromDate +" "+'00:00:00';
      $scope.history.to = $scope.toDate +" "+'00:00:00';

      $scope.submitSearch($scope.history.from,$scope.history.to);
    }else if (page == 'events'){
      $scope.today = new Date();
      $scope.fromDate = $filter('date')($scope.today.setDate($scope.today.getDate() - 1), 'dd-MM-yyyy');
      $scope.toDate = $filter('date')(new Date(), 'dd-MM-yyyy');
      $rootScope.eventss.from = $scope.fromDate +" "+'00:00:00';
      $rootScope.eventss.to = $scope.toDate +" "+'00:00:00';

       $scope.showEvents($rootScope.eventss.from,$rootScope.eventss.to);
    }
    
  }

  $scope.lastweek = function(page){

    $(".historyRouteTab").addClass("active");
    $(".historyVehicleTab").removeClass("active");

    if (page == 'report') {
      $scope.today = new Date();
      $scope.fromDate = $filter('date')($scope.today.setDate($scope.today.getDate() - 7), 'dd-MM-yyyy');
      $scope.toDate = $filter('date')(new Date(), 'dd-MM-yyyy');
      $scope.report.from = $scope.fromDate +" "+'00:00:00';
      $scope.report.to = $scope.toDate +" "+'00:00:00';

    }else if (page == 'history') {

      $scope.today = new Date();
      $scope.fromDate = $filter('date')($scope.today.setDate($scope.today.getDate() - 7), 'dd-MM-yyyy');
      $scope.toDate = $filter('date')(new Date(), 'dd-MM-yyyy');
      $scope.history.from = $scope.fromDate +" "+'00:00:00';
      $scope.history.to = $scope.toDate +" "+'00:00:00';

     $scope.submitSearch($scope.history.from,$scope.history.to);
    }else if (page == 'events'){
      $scope.today = new Date();
      $scope.fromDate = $filter('date')($scope.today.setDate($scope.today.getDate() - 7), 'dd-MM-yyyy');
      $scope.toDate = $filter('date')(new Date(), 'dd-MM-yyyy');
      $rootScope.eventss.from = $scope.fromDate +" "+'00:00:00';
      $rootScope.eventss.to = $scope.toDate +" "+'00:00:00';

      $scope.showEvents($rootScope.eventss.from,$rootScope.eventss.to);
    }
    
  }

  $scope.showEvents = function(){

    showTabLoader(); 

    $scope.from = $rootScope.eventss.from;
    $scope.to = $rootScope.eventss.to ;
    $rootScope.tripHistory = {};
    $rootScope.stops = {};
    $rootScope.idling = {};
    $rootScope.geoZones = {};
    $rootScope.events = {};
    $rootScope.details = {};
    $rootScope.tripHistoryDetails = {};
    $scope.tripZoneId = '';

    var request = Online.getAllEvents($scope.from,$scope.to,$scope.selectedVehicles,$scope.authtoken);
    $rootScope.requests.push(request);
    request.promise.then(function (data){
      $rootScope.clearRequest(request);

      $rootScope.events = data;
      hideTabLoader();
    })
    .error(function (error) {
      hideTabLoader();
    });
  }

  $scope.showEvent = function(){

    showTabLoader(); 

    $scope.from = $("#datetimepicker15").find("input").val();
    $scope.to = $("#datetimepicker25").find("input").val();

    var request = Online.getAllEvents($scope.from,$scope.to,$scope.selectedVehicles,$scope.authtoken);
    $rootScope.requests.push(request);
    request.promise.then(function (data){
      $rootScope.clearRequest(request);

      $rootScope.events = data;
      hideTabLoader();
    })
    .error(function (error) {
      hideTabLoader();
    });
  }

  $scope.routeClick = function(){ 
    $scope.submitSearch();
  };

  $scope.submitSearch = function(from,to){

    $(".historyRouteTab").addClass("active");
    $(".historyVehicleTab").removeClass("active");

    $scope.from = from;
    $scope.to = to;
    $rootScope.tripHistory = {};
    $rootScope.stops = {};
    $rootScope.idling = {};
    $rootScope.geoZones = {};
    $rootScope.events = {};
    $rootScope.details = {};
    $rootScope.tripHistoryDetails = {};
    $scope.tripZoneId = '';
   
    if(angular.isUndefined($scope.from)){
      $scope.from = $("#datetimepicker1").find("input").val();
    }
    if(angular.isUndefined($scope.to)){
      $scope.to = $("#datetimepicker2").find("input").val();
    }

    if ($scope.historyDeviceIDs.length == 0) 
    {
      alert('Please select one or more objects');
    }
    else
    {

      $rootScope.showLoading();
      Online.getTripHistory($scope.from,$scope.to,$scope.historyDeviceIDs,$scope.authtoken).success(function(data){
         $scope.trips = data.trips;
         $rootScope.hideLoading();
      }).error(function(error)
      {
        $rootScope.hideLoading(); 
      });
      /*****************************************************/
      $scope.comparedate  = function (datetime1,datetime2)
      {
          var datetime1   = $filter('date')(datetime1, 'dd-MM-yyyy','UTC');
          var datetime2   = $filter('date')(datetime2, 'dd-MM-yyyy','UTC');
         if(datetime1==datetime2)
         {
            return 0;
         }
         else
         {
            return 1;
         }
      };

      $scope.getdate  = function (datetime)
      {
          var datetime   = $filter('date')(datetime, 'dd-MM-yyyy');
          return datetime;
      };

      $scope.gettime  = function (datetime)
      {
          var datetime   = $filter('date')(datetime, 'HH:mm:ss');
          return datetime;
      };
      $scope.getduration  = function (datetime)
      {
          var datetime   = $filter('date')(datetime, 'HH:mm:ss','UTC');
          return datetime;
      };
      $scope.getkm  = function (str)
      {
          return (str/1000).toFixed(1);
      };
      /******************  FSZ END   ***********************/

    }
  };

  $scope.showOnlineEventInfowindow = function(onlineEvent){
    $rootScope.$broadcast('showOnlineEventInfowindow', {onlineEvent: onlineEvent});
  }

/*********************FSZ*********************************/
  $scope.ShortRoutOnMap = function(tripsdata)
  {

    $scope.deviceId         =   tripsdata.deviceId;
    $scope.checkedTrip      =   tripsdata.startPositionId;
    $rootScope.tripHistory  =   {};
    $rootScope.stops        =   {};
    $rootScope.idling       =   {};
    $rootScope.geoZones     =   {};
    $rootScope.events       =   {};
    $rootScope.details      =   {};
    $rootScope.tripHistoryDetails = {};
    $scope.tripZoneId = '';
    $scope.selectedtrip = tripsdata;

    $rootScope.$broadcast('RouteDetails', { tripsdata:tripsdata});
  }
/*********************************************************/
  $scope.showCurrentTrack = function(deviceId,tripId){

    $scope.deviceId         =   deviceId;
    $scope.checkedTrip      =   tripId;
    $rootScope.tripHistory  =   {};
    $rootScope.stops        =   {};
    $rootScope.idling       =   {};
    $rootScope.geoZones     =   {};
    $rootScope.events       =   {};
    $rootScope.details      =   {};
    $rootScope.tripHistoryDetails = {};
    $scope.tripZoneId = '';

    $rootScope.$broadcast('trackDetails', { deviceId: $scope.deviceId, tripId: tripId });
  }

  $scope.showGeozoneOnMap = function(geozone){
    
    $scope.tripZoneId = geozone.trip_geozone_geozone_id;
    
    $rootScope.$broadcast('showGeozoneOnMap', { geozone: geozone });
  }

  $scope.showsalikOnMap = function(salik){
    
    $scope.tripZoneId = salik.trip_geozone_geozone_id;
     
    $rootScope.$broadcast('showGeozoneOnMap', { geozone: salik });
  }



  /////HISTORY///

 
  

  
  ///REPORT//

  $scope.rptGeoType='';

  $scope.callGeozonePopUP = function(rID){

    if(rID==17 || rID==25){

      $scope.getZoneGroups();
       
        if(rID==17)
          $scope.rptGeoType='Geozones';
        else
          $scope.rptGeoType='POIs';

      $('#GeoZoneForReport').modal('show');
    }
  }

  $scope.checkAllReportVehicles = function(groupId,selectedGroup){

    if (groupId) {

      if ($scope.selectedReportGroups.indexOf(selectedGroup) == -1) {
        $scope.selectedReportGroups.push(selectedGroup);
      }

        for (var i = 0; i < $rootScope.groups.length; i++) {
          if($rootScope.groups[i].group.obj_group_id == selectedGroup){
            for (var j = 0; j < $rootScope.groups[i].vehicles.ran.length; j++) {
              if($scope.reportDeviceIDs.indexOf($rootScope.groups[i].vehicles.ran[j].obj_id) == -1){
                $scope.reportDeviceIDs.push($rootScope.groups[i].vehicles.ran[j].obj_id); 
                $scope.reportVehIDs.push([$rootScope.groups[i].vehicles.ran[j].obj_name,$rootScope.groups[i].vehicles.ran[j].obj_device_id,$rootScope.groups[i].vehicles.ran[j].obj_id]);  
              }
            }          
          }
        }
  
    }else{

      if($scope.selectedReportGroups.indexOf(selectedGroup != -1)){
        var index = $scope.selectedReportGroups.indexOf(selectedGroup);
        $scope.selectedReportGroups.splice(index,1); 
      }

        for (var i = 0; i < $rootScope.groups.length; i++) {
          if($rootScope.groups[i].group.obj_group_id == selectedGroup){
            for (var j = 0; j < $rootScope.groups[i].vehicles.ran.length; j++) {
              if($scope.reportDeviceIDs.indexOf($rootScope.groups[i].vehicles.ran[j].obj_id) != -1){
                var index = $scope.reportDeviceIDs.indexOf($rootScope.groups[i].vehicles.ran[j].obj_id);
                $scope.reportDeviceIDs.splice(index,1); 
              }
              for(var k=0;k<($scope.reportVehIDs.length);k++){           
                if($scope.reportVehIDs[k][1] == $rootScope.groups[i].vehicles.ran[j].obj_device_id)
                  $scope.reportVehIDs.splice(k,1);     
              } 
            }          
          }
        }
     
    }
  }

  $scope.selectedVehicleforReport = function(vehName,deviceId,vehID,selectedvehID,vehGroupId){

    if($scope.selectedReportGroups.indexOf(vehGroupId != -1)){
      var index = $scope.selectedReportGroups.indexOf(vehGroupId);
      $scope.selectedReportGroups.splice(index,1); 
    }

    if (selectedvehID) {
      if ($scope.reportDeviceIDs.indexOf(vehID) == -1) {
        $scope.reportDeviceIDs.push(vehID);
        $scope.reportVehIDs.push([vehName,deviceId,vehID]);  
      }
    }else{
            
      if($scope.reportDeviceIDs.indexOf(vehID) != -1){
        var index = $scope.reportDeviceIDs.indexOf(vehID);
        $scope.reportDeviceIDs.splice(index,1); 
      }    
          
      for(var i=0;i<($scope.reportVehIDs.length);i++){
            
        if($scope.reportVehIDs[i][1] == deviceId)
          $scope.reportVehIDs.splice(i,1);     
      } 
    }
  }

  $scope.createReport = function(makepdf=0,toSendEmail=0,toExcel=0){ 

    if($scope.report.rID==17 || $scope.report.rID==25){

      $scope.callGeozonePopUP($scope.report.rID);
      return;
    }

    $scope.reportFrom = $("#dateReportFrom").val();
    $scope.reportTo = $("#dateReportTo").val();    
   
    if ($scope.reportVehIDs.length == 0) {
      alert('Please select one or more objects');
    }else{
      $rootScope.$broadcast('onlineCreateReport', {rID:$scope.report.rID, from:$scope.reportFrom, to:$scope.reportTo, vehIDs:$scope.reportVehIDs, makepdf:makepdf,rptGzIDs:'',toSendEmail:toSendEmail,toExcel:toExcel});
    }

  };

  $scope.rpt_gz={};
  $scope.createGZReport = function(makepdf=0,toSendEmail=0,toExcel=0){ 
 
    $scope.reportFrom = $("#dateReportFrom").val();
    $scope.reportTo = $("#dateReportTo").val();   
     
    if ($scope.reportVehIDs.length == 0) {
      alert('Please select one or more objects');
    }else{
      $('#GeoZoneForReport').modal('hide');
      $rootScope.$broadcast('onlineCreateReport', {rID:$scope.report.rID, from:$scope.reportFrom, to:$scope.reportTo, vehIDs:$scope.reportVehIDs, makepdf:makepdf,rptGzIDs:$scope.rpt_gz,toSendEmail:toSendEmail,toExcel:toExcel});
    }

  };

  $scope.reportsScheduler = function(){

    $scope.ObjectsForReportScheduler = {};
    $http({
      method  : 'get',
      url     : baseUrl + 'api-v1/reports/getVehiclesForGeozone', headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){
      $scope.ObjectsForReportScheduler = data;
    })
    .error(function (error) {
    }); 

    $http({
      method  : 'get',
      url     : baseUrl + 'getAllReportSchedulers', headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){
       $scope.reportSchedulers = data.reportSchedulers;
    })
    .error(function (error) {
    });

    $http({
      method  : 'get',
      url     : baseUrl + 'api-v1/reports/getReportNames', headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){
      $scope.reportNames = data;
    })
    .error(function (error) {
    });

    $http({
      method  : 'get',
      url     : baseUrl + 'getReportGroupNames', headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){
      $scope.reportGroups = data;
    })
    .error(function (error) {
    });
  }

  $scope.getVehicleSchedleObjects = function(checked,scheduleobjectId){
    
    if (checked) {
      $scope.selectedSchedulerObjects.push(scheduleobjectId); 
    }else{
      for (var i = 0; i < $scope.selectedSchedulerObjects.length; i++) {
          if($scope.selectedSchedulerObjects[i] == scheduleobjectId) {
            $scope.selectedSchedulerObjects.splice(i, 1);
          }
      }
    }
  }

  $scope.editReportScheduler = function(objectID){

    $scope.successMessage = '';
    $scope.reportScheduleobjid = objectID;
    $scope.selectedSchedulerObjects = [];
    $scope.successReportSchedulerFlag = false;
    $scope.successReportScheduler = "";    
    $scope.errorReportSchedulerFlag = false;
    $scope.errorReportScheduler = "";
    $scope.addReportShdlrButton = true;

      $http({
        method  : 'get',
        url     : baseUrl + 'getSingleReportScheduler/'+$scope.reportScheduleobjid, headers: {'Xtoken': $scope.authtoken}
      })
      .success(function (data){
        $scope.reportSchedule = data.SinglereportScheduler.data[0];    
        for (var i = 0; i < data.SinglereportScheduler.objectIDs.length; i++) {
          $scope.selectedSchedulerObjects.push(data.SinglereportScheduler.objectIDs[i]);
        }
        
      })
      .error(function (error) {
      });  
   
  }

  $scope.addNewReportScheduler = function(){

    $scope.successReportSchedulerFlag = false;
    $scope.successReportScheduler = "";    
    $scope.errorReportSchedulerFlag = false;
    $scope.errorReportScheduler = "";
    $scope.reportSchedule = {};
    $scope.selectedSchedulerObjects = [];
    $scope.addReportShdlrButton = false;
  }

  $scope.submitReportScheduler = function(){

    $scope.successReportSchedulerFlag = false;
    $scope.successReportScheduler = "";    
    $scope.errorReportSchedulerFlag = false;
    $scope.errorReportScheduler = "";
    $scope.reportSchedule.objects = $scope.selectedSchedulerObjects;

      if ($scope.reportSchedule.report_scheduler_id) {

          $http({
            method  : 'post',
            url     : baseUrl + 'editReportScheduler/'+$scope.reportSchedule.report_scheduler_id, headers: {'Xtoken': $scope.authtoken},data: $scope.reportSchedule
          })
          .success(function (data){
            if (data.status == 'success') {
              $scope.successReportSchedulerFlag = true;
              $scope.successReportScheduler = "Successfully edited report scheduler";       
              $scope.reportsScheduler();     
            }else{
              $scope.errorReportSchedulerFlag = true;
              $scope.errorReportScheduler = data.data.report_scheduler_emails[0];
            } 
          })
          .error(function (error) { 
          });

      }else{

          $http({
            method  : 'post',
            url     : baseUrl + 'addReportScheduler/'+$scope.get_org_ID(), headers: {'Xtoken': $scope.authtoken},data: $scope.reportSchedule
          })
          .success(function (data){
            if (data.status == 'success') {
              $scope.successReportSchedulerFlag = true;
              $scope.successReportScheduler = "Successfully added report scheduler";       
              $scope.reportsScheduler();     
            }else{
              $scope.errorReportSchedulerFlag = true;
              $scope.errorReportScheduler = data.data.report_scheduler_emails[0];
            }          
          })
          .error(function (error) {
          });
      }
  }

  $scope.deleteReportScheduler = function(schedulerId){
    if ($window.confirm("Are you sure you want to delete this scheduler?")) {

      $http({
        method  : 'get',
        url     : baseUrl + 'deleteReportScheduler/'+schedulerId,
        headers: {'Xtoken': $scope.authtoken} 
      })
      .success(function (data){
         
         $scope.reportsScheduler();
      })
      .error(function (error) {

      });
    }
  }

  $scope.reportsCreator = function(){

    $scope.Vehicles = {};
    $rootScope.Toaddsubuservehicles = {};

    $http({
      method  : 'get',
      url     : baseUrl + 'api-v1/reports/getReportNames', headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){
      $scope.reportNames = data;
    })
    .error(function (error) {
    });
    $http({
      method  : 'get',
      url     : baseUrl + 'api-v1/reports/getReportGroupNames', headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){
      $scope.reportGroups = data;
    })
    .error(function (error) {
    });
    $http({
      method  : 'get',
      url     : baseUrl + 'api-v1/reports/getVehiclesForGeozone', headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){

      $scope.Vehicles = data;

      $rootScope.Toaddsubuservehicles = $scope.Vehicles;
       
    })
    .error(function (error) {

    });

    $http({
      method  : 'get',
      url     : baseUrl + 'api-v1/reports/getObjectGroupsToAddSubuser', headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){
      $scope.ObjectGroups = data;
       
    })
    .error(function (error) {

    });
    
    $http({
      method  : 'get',
      url     : baseUrl + 'api-v1/geozones/getallGeozones', headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){
      $scope.Geozonepolygons = data.geozone.polygon;
      $scope.Geozonemarkers = data.geozone.markers;
       
    })
    .error(function (error) {

    });
    var user            = $rootScope.Get_User();

    $http({
      method  : 'get',
      url     : baseUrl + 'api-v1/reports/getSubusersOfPartner/'+user.id, headers: {'Xtoken': $scope.authtoken}
    })
    .success(function (data){
      $scope.subUsers = data;
    })
    .error(function (error) {

    });
  }

  //REPORT///

  ///DASHBOARD///

  $scope.getVehicleDetailsforDashboard = function(objID,deviceID){
 
    $scope.dashboardObjID = objID;
    $rootScope.$broadcast('vehicleDetailsforDashboard', {objID:objID,deviceID:deviceID});
  }

  ///DASHBOARD///

  //service//
  $scope.getVehicleName = function(deviceID,name,objID){

    $rootScope.maintenanceObjID = objID;
    $scope.check = deviceID;
    $rootScope.$broadcast('vehicleName', {deviceID:deviceID,name:name});
  }  

  //remainder
  $scope.getRemainder = function(deviceID,name,objID){

    $rootScope.maintenanceObjID = objID;
    $scope.checkk = deviceID;
    $rootScope.$broadcast('RemainderName', {deviceID:deviceID,name:name});
  }

  $scope.serviceEntry = function(){

    $rootScope.selectedMainMaintenanceTab = 'fleetExpenditure';
    $rootScope.maintenanceTab = "serviceExpense";
    $rootScope.$broadcast('Entry', {});
    $scope.vehicle[i].Selected = false;
  }

  //REMAINDER//

  ///REMAINDER///

  $scope.serviceRemainder = function(){
    
    $rootScope.selectedMainMaintenanceTab = 'reminder';
    $rootScope.maintenanceTab = "serviceRemainder";
    $rootScope.$broadcast('Remainder', {});
  }

  ///REMAINDER///

  //FUEL//

  $scope.FuelEntry = function(){

    $rootScope.selectedMainMaintenanceTab = 'fleetExpenditure';
    $rootScope.maintenanceTab = "fuelExpense";
    $rootScope.$broadcast('Fuel', {});
  }

  //FUEL//

 //DOCUMENT//

  $scope.DocumentReminder = function(){

    $rootScope.selectedMainMaintenanceTab = 'reminder';
    $rootScope.maintenanceTab = "DocumentReminder";
    $rootScope.$broadcast('Document', {});
  }

  //DOCUMENT//

  $scope.sideButtonClick = function(Name){

    $rootScope.$broadcast('clearGeozoneMap');

    if(Name == 'Analytics'){
      $scope.getVehicleDetailsforDashboard($rootScope.allVehiclespositonsData.group.vehicles[0].id,$rootScope.allVehiclespositonsData.group.vehicles[0].uniqueId);
      //$scope.getGroups(); 
      //$rootScope.$broadcast('vehicleDetailsforDashboard', {objID:$rootScope.first_obj_id,deviceID:$rootScope.first_device_id});
    }

    if (Name == 'Zone') {
      $scope.getZoneGroups();
      //$rootScope.$broadcast('callGetGeoZone', { type: 'geozone', geoZoneID: $rootScope.selectedGeozone, edit:0, checked: 1, showoredit: 'show' }); 
    }

    if (Name == 'Report') {
      $scope.reportsCreator();
    }
    if (Name == 'Maintanance') {
      $rootScope.maintenanceObjID = $rootScope.first_obj_id;
      $rootScope.$broadcast('vehicleName', {deviceID:$rootScope.first_device_id,name:''});
      $rootScope.$broadcast('RemainderName', {deviceID:$rootScope.first_device_id,name:''});
    }
    $rootScope.selectedSideButton = Name;
    $rootScope.selectedMainMaintenanceTab = 'fleetExpenditure';
    $rootScope.maintenanceTab = "serviceExpense";
    $scope.option = 'all';
    $scope.tripZoneId = '';
    $rootScope.$broadcast('selectedType', {value:Name});
  }

});


app.directive('ngFiles', ['$parse', function ($parse) {

  function fn_link(scope, element, attrs) {
    var onChange = $parse(attrs.ngFiles);
    element.on('change', function (event) {
      onChange(scope, { $files: event.target.files });
    });
  };

  return {
    link: fn_link
  }
}]);
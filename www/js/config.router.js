'use strict';

/**
 * Config for the router
 */
angular.module('app')
  .run(
    [          '$rootScope', '$state', '$stateParams', '$http','$location',
      function ($rootScope,   $state,   $stateParams, $http, $location) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams; 

          $rootScope.$on('$locationChangeSuccess', function () {
            if ($location.absUrl() == base+'final/') {
              window.location = base+"final/#/app/online";
            }
          });

          $rootScope.$on('$stateChangeStart', function (event,toState) {

            var nextPage = toState.name;

            if (nextPage != 'access.signin') {
              var authourization=1;
              /*$http({
                method  : 'post',
                url     : baseUrl + 'api-v1/user/getLoginStatus', 
                headers: {'Xtoken': $rootScope.get_auth_token()}
              })
              .success(function (data){
                var authourization = data.data;

              if(authourization == -1 && nextPage=='access.forgotpwd') {
                  $state.go('access.forgotpwd'); 
                  }else if (authourization == -1) {
                  $state.go('access.signin');
                  }else {
                  $state.go('app.online');       
                }                              
              })       */         
            }
            else
            {

              if(nextPage=='access.forgotpwd') {
                  $state.go('access.forgotpwd'); 
                  }else if (authourization == -1) {
                  $state.go('access.signin');
                  }else {
                  $state.go('app.online');       
                }                              
                
            }
          });   

          $rootScope.showLoading = function(){

            $(".siteLoader").show();
             
          }
          $rootScope.hideLoading = function(){
            $(".siteLoader").hide();
            
            if ($rootScope.requests.length  > 0) {
              var request = $rootScope.requests;
              request.cancel("Cancelled");
              $rootScope.clearRequest(request);
            }

          }

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

          $rootScope.get_background = function () {
            if(localStorage.backGroundColor) {
              return localStorage.backGroundColor;
            } else {
              return 'bg.jpg';
            }
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

          $rootScope.get_org_ID = function () {
            if(localStorage.org_ID) {
              return localStorage.org_ID;
            } else {
              return '-1';
            }
          }
          $rootScope.save_org_ID = function (org_ID) {
            localStorage.org_ID = org_ID;                      
            return localStorage.org_ID;
          }

          $rootScope.get_org_name = function () {
            if(localStorage.org_name) {
              return localStorage.org_name;
            } else {
              return '-1';
            }
          }
          $rootScope.save_org_name = function (org_name) {
            localStorage.org_name = org_name;                      
            return localStorage.org_name;
          }

          $rootScope.get_audio_sound = function () {
            if(localStorage.sound) {
              return localStorage.sound;
            } else {
              return '-1';
            }
          }
          $rootScope.save_audio_sound = function (sound) {
            localStorage.sound = sound;                      
            return localStorage.sound;
          }
          /******************************************************/
          $rootScope.Set_User = function(user) 
          {
            document.cookie         =   user.uid;
            localStorage.user_info  =   JSON.stringify(user);                      
            return JSON.parse(localStorage.user_info);
          }

          $rootScope.Get_User = function() 
          {
            if(localStorage.user_info)
            {
              return JSON.parse(localStorage.user_info);
            }                    
            else
            {
              return -1;
            }
          }

          $rootScope.Set_Vehicles = function(vehicles) 
          {
            localStorage.vehicles_info = JSON.stringify(vehicles);                      
            return JSON.parse(localStorage.vehicles_info);
          }

          $rootScope.Get_Vehicles = function() 
          {
            if(localStorage.vehicles_info)
            { 
              return JSON.parse(localStorage.vehicles_info);
            }                    
            else
            {
              return [];
            }
          }

          $rootScope.Set_Drivers = function(drivers) 
          {
            localStorage.drivers = JSON.stringify(drivers);                      
            return JSON.parse(localStorage.drivers);
          }

          $rootScope.Get_Drivers = function() 
          {
            if(localStorage.drivers)
            { 
              return JSON.parse(localStorage.drivers);
            }                    
            else
            {
              return [];
            }
          }



          $rootScope.Set_Groups = function(groups) 
          {
            localStorage.groups_info = JSON.stringify(groups);                      
            return JSON.parse(localStorage.groups_info);
          }

          $rootScope.Get_Groups = function() 
          {
            if(localStorage.groups_info)
            {
              return JSON.parse(localStorage.groups_info);
            }                    
            else
            {
              return -1;
            }
          }
          /******************************************************/

      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider', 'JQ_CONFIG', 'MODULE_CONFIG', 
      function ($stateProvider,   $urlRouterProvider, JQ_CONFIG, MODULE_CONFIG) {
          var layout = "tpl/app.html";
          /*if(window.location.href.indexOf("material") > 0){
            layout = "tpl/blocks/material.layout.html";
            $urlRouterProvider
              .otherwise('/app/dashboard-v3');
          }else{
            $urlRouterProvider
              .otherwise('/app/dashboard-v1');
          }*/
          
          $stateProvider
              .state('app', {
                  abstract: true,
                  url: '/app',
                  templateUrl: layout
              })
              /*.state('app.dashboard', {
                  url: '/dashboard',
                  templateUrl: 'tpl/app_dashboard.html',
                  resolve: load(['js/controllers/dashboard.js','js/model/dashboard.js'])
              })*/
              .state('app.online', {
                  url: '/online',
                  templateUrl: 'tpl/app_online.html',
                  resolve: load(['js/controllers/online.js','js/controllers/geozone.js','js/model/online.js'])
              }) 
               /*.state('app.maintenance', {
                  url: '/maintenance',
                  templateUrl: 'tpl/app_maintenance.html',
                  resolve: load(['js/controllers/maintenance.js','js/model/maintenance.js'])
              })   */          
              .state('access', {
                  url: '/access',
                  template: '<div ui-view class="fade-in-right-big smooth"></div>'
              })
              .state('access.signin', {
                  url: '/signin',
                  templateUrl: 'tpl/page_signin.html',
                  resolve: load( ['js/controllers/signin.js','js/model/signin.js'] )
              })
              .state('access.forgotpwd', {
                  url: '/forgotpwd',
                  templateUrl: 'tpl/page_forgotpwd.html',
                  resolve: load( ['js/controllers/signin.js','js/model/signin.js'] )

              })
              .state('access.404', {
                  url: '/404',
                  templateUrl: 'tpl/page_404.html'
              });

          function load(srcs, callback) {
            return {
                deps: ['$ocLazyLoad', '$q',
                  function( $ocLazyLoad, $q ){
                    var deferred = $q.defer();
                    var promise  = false;
                    srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
                    if(!promise){
                      promise = deferred.promise;
                    }
                    angular.forEach(srcs, function(src) {
                      promise = promise.then( function(){
                        if(JQ_CONFIG[src]){
                          return $ocLazyLoad.load(JQ_CONFIG[src]);
                        }
                        angular.forEach(MODULE_CONFIG, function(module) {
                          if( module.name == src){
                            name = module.name;
                          }else{
                            name = src;
                          }
                        });
                        return $ocLazyLoad.load(name);
                      } );
                    });
                    deferred.resolve();
                    return callback ? promise.then(function(){ return callback(); }) : promise;
                }]
            }
          }


      }
    ]
  );

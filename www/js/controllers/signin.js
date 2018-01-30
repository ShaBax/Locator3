'use strict';
/* Controllers */
  // signin controller
app.controller('SigninFormController', function($scope, $http, $state, $rootScope, Login) {
  
  $scope.user = {};
  $scope.authError = null;
  $scope.userVehicles = {};
  $scope.authErrorMSG =null;
  $scope.authSuccessMSGS =null;
  $scope.showError = false;
  
    $scope.login = function() {

      $(".preloader").show();
     
      Login.dologin( $scope.user.user_name, $scope.user.user_password )
      .success(function (data) {
        
        if(data.responseCode != 200)
        {
          $scope.authError = data.data;
          $scope.showError = true;
		      $(".preloader").hide();
        } else if(data.responseCode == 200) {

          if (data.partner_id) {
            $(".preloader").hide();
            $scope.authError = 'Incorrect Login Credentials';
            $scope.showError = true;
          }else{
            $scope.showError = false;
            $scope.save_auth_token(data.token);    
            $rootScope.Set_User(data.user);
            $rootScope.Set_Vehicles(data.vehicles);
            $rootScope.Set_Groups(data.groups);
            //$rootScope.Set_Drivers(data.drivers);
            if (data.user.id) {
              $scope.save_userID(data.user.id);   
            }

            if (data.user.organisation != '') {
              $scope.save_org_ID(data.user.organisation.id); 
              $scope.save_org_name(data.user.organisation.name);
            }
/*
            if (data.user) {
              
              localStorage.setItem('user', JSON.stringify(data.user));

            }

            $rootScope.userVehicles = data.userVehicles;         
            $rootScope.vehDetails = data.vehDetails;
*/
            window.location=base+"final/#/app/online";
	
            $scope.myFunction = function() {
            location.reload();
            }
            $scope.myFunction(); 
          }
        }
      })
      .error(function (error) {

      });
      
    };

    $scope.forgotPassword = function(){

      Login.forgotPassword($scope.email)
      .success(function (data){
        if(data.status == 'error'){
          $scope.authErrorFlag = true;
          $scope.authErrorMSG = 'This email is not registered.';
         }else{
          $scope.authSuccessFlag = true;
          $scope.authErrorFlag = false;
          $scope.authSuccessMSGS = 'Please check your email to get your new password.';
        }
      })
    }

});
var myApp = angular.module('myApp');
myApp.factory('httpInterceptor', function ($q, $rootScope, $log) {

    var loadingCount = 0;

    return {
        request: function (config) {
            if(++loadingCount === 1) $rootScope.$broadcast('loading:progress');
            return config || $q.when(config);
        },

        response: function (response) {
            if(--loadingCount === 0) $rootScope.$broadcast('loading:finish');
            return response || $q.when(response);
        },

        responseError: function (response) {
            if(response.status == 0){
                showSpinner4();
            }
            if(--loadingCount === 0) $rootScope.$broadcast('loading:finisherror');
            return $q.reject(response);
        }
    };

}).config(function ($httpProvider) {

    $httpProvider.interceptors.push('httpInterceptor');

});

myApp.factory('Login', function($http) {
    var Login = {};
    Login.dologin = function(user_name, user_password) {
        return  $http({method: "post", url: baseUrl + 'Login',
            data: {
                user_name: user_name,
                user_password: user_password,
            }
        });
    } 
    return Login;
});


myApp.factory('Objects', function($http) {

    var Objects = {};
    
    Objects.getDashboardDetails = function(token) {
        return  $http({method: "get", url: baseUrl + 'getVehicleForUser/0', headers: {'Xtoken': token}});
    },
    Objects.getVehiclesList = function(token) {
        return  $http({method: "get", url: baseUrl + 'getObjGroupsForUser', headers: {'Xtoken': token}});
    },
    Objects.getReportNames = function(token) {
        return  $http({method: "get", url: baseUrl + 'getReportNames', headers: {'Xtoken': token}});
    },
    Objects.createReport = function(vehicleArray,details, token) {
        return  $http({method: "post", url: baseUrl + 'ReportCreator', headers: {'Xtoken': token}, 
            data: {
                vehIDs: vehicleArray,
                fromDate: details.from, 
                toDate:details.to, 
                reportID:details.reportID, 
                toPDF: 0 
            }  
        });
    },
    Objects.showVehicleDetails = function(objID,deviceID,from,to,token){          
        return $http({ method  : 'get',  url : baseUrl + 'showVehicle/'+objID+'/'+deviceID+'/'+from+'/'+to, headers: {'Xtoken': token}}) ;     
    },
    Objects.getVehicleDetails = function(token){
        return  $http({method: "get", url: baseUrl + 'getVehicleForUser/0', headers: {'Xtoken': token} });      
    },
    Objects.getVehDetails = function(deviceID,tripID,token){
        return  $http({method: "get", url: baseUrl + 'GetCurrentTrack/'+deviceID+'/'+tripID, headers: {'Xtoken': token} });  
    },
    Objects.getAllShareLocations = function(deviceID,token){
        return  $http({method: "get", url: baseUrl + 'getAllShareLocations/'+deviceID, headers: {'Xtoken': token} });  
    },
    Objects.getTrips = function(from,to,vehicleArray,token){
        return  $http({method: "post", url: baseUrl + 'getTripsHistory/'+from+'/'+to, headers: {'Xtoken': token},data:{vehIDs:vehicleArray} });  
    },
    Objects.getNotifications = function(token){
        return  $http({method: "get", url: baseUrl + 'getPushNotificationsHignAndNormal', headers: {'Xtoken': token}});  
    },
    Objects.addNewShareLocation = function(data,token){
        return  $http({method: "post", url: baseUrl + 'AddNewShareLocation', headers: {'Xtoken': token},data:data });  
    }
    return Objects;
}); 

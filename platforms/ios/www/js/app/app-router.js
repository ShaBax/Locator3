'use strict';
app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {

    $urlRouterProvider.otherwise('/appmain');

    $stateProvider.state('appmain', {
        url: '/appmain',
        templateUrl: 'templates/app-main.html',
        controller: 'AppMainCtrl'
    });

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    });

    $stateProvider.state('dashboard', {
        url: '/dashboard',
        templateUrl: 'templates/dashboard.html',
        controller: 'DashboardCtrl'
    });   

    $stateProvider.state('vehicles', {
        url: '/vehicles',
        templateUrl: 'templates/vehicles.html',
        controller: 'VehiclesCtrl'
    });
     $stateProvider.state('tripVehicles', {
        url: '/tripVehicles',
        templateUrl: 'templates/trip-vehicles.html',
        controller: 'VehiclesCtrl'
    });

    $stateProvider.state('trips', {
        url: '/trips',
        params:{objId:null,objDeviceId:null,objName:null},
        templateUrl: 'templates/trips.html',
        controller: 'TripsCtrl'
    });

    $stateProvider.state('live', {
        url: '/live',
        //params:{objId:null,objDeviceId:null,tripId:null,selectedGroup:null,selectedGroupStatus:null},
        params:{objDeviceId:null,tripId:null},
        templateUrl: 'templates/live.html',
        controller: 'LiveCtrl'
    });

    $stateProvider.state('report', {
        url: '/report',
        templateUrl: 'templates/report.html',
        controller: 'ReportCtrl'
    });

    $stateProvider.state('report_listing', {
        url: '/report_listing',
        templateUrl: 'templates/report_listing_details.html',
        controller: 'ReportListingCtrl'
    });

    $stateProvider.state('summary', {
        url: '/summary',
        params:{objId:null,objDeviceId:null},
        templateUrl: 'templates/summery.html',
        controller: 'SummeryCtrl'
    });

    $stateProvider.state('alert', {
        url: '/alerts',
        params:{objId:null,objDeviceId:null},
        templateUrl: 'templates/alert.html',
        controller: 'AlertCtrl'
    });
  

}]);
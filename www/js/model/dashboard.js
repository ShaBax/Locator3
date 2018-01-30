app.factory('Dashboard', function($http) {
    var Dashboard = {};

    Dashboard.getVehicleDetails = function(token){
    	return  $http({method: "get", url: baseUrl + '', headers: {'Xtoken': token} });      
    }

    return Dashboard;
});
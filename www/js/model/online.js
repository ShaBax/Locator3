app.factory('Online', function($http,$q) {
    var Online = {};
    
    Online.getdriverinfo = function(driverUniqueId)
    {        
      return  $http({method: "post", url: baseUrl + 'api-v1/user/getdriverinfo',data:{driveruid:driverUniqueId}, headers: {'Xtoken':localStorage.loginToken} });          
    },
    Online.OnPosition = function()
    {        
      return  $http({method: "post", url: baseUrl + 'api-v1/user/getOnPosition', headers: {'Xtoken':localStorage.loginToken} });          
    },
    Online.getVehicleDetails = function(token){
    	return  $http({method: "get", url: baseUrl + 'api-v1/user/getVehicleForUserForWebsite/0/1', headers: {'Xtoken':localStorage.loginToken} });      
    
    },
    Online.getTripHistory = function(from,to,historyVehIDs,token)
    {
      return  $http({method: "post", url: baseUrl + 'api-v1/reports/trips', headers: {'Xtoken':localStorage.loginToken}, data: {vehIDs:historyVehIDs,from:from,to:to}});     
    },
    Online.getCurrentRoute = function(tripsdata,token)
    {
      return  $http({method: "post", url: baseUrl + 'api-v1/reports/getroute', headers: {'Xtoken':localStorage.loginToken}, data: {tripsdata:tripsdata}});     
    },


    Online.getVehDetails = function(deviceID,tripID,token){

        var canceller = $q.defer();

        var cancel = function(reason) {
          canceller.resolve(reason);
        };

        var promise = $http({method: "get", url: baseUrl + 'api-v1/user/GetCurrentTrack/'+deviceID+'/'+tripID, headers: {'Xtoken':localStorage.loginToken}, timeout: canceller.promise })
          .then(function(response) {
            return response.data;
          });

        return {
          promise: promise,
          cancel: cancel
        };
    },

    Online.createReport = function(vehIDs,fromDate,toDate,reportID,toPDF,rptGzIDs,token,toSendEmail){

        var canceller = $q.defer();

        var cancel = function(reason) {
          canceller.resolve(reason);
        };

        var promise = $http({method : 'post',url : baseUrl + 'ReportCreator', headers: {'Xtoken': token}, timeout: canceller.promise, data: {vehIDs: vehIDs,fromDate: fromDate, toDate:toDate, reportID:reportID, toPDF: toPDF, rptGzIDs:rptGzIDs,toSendEmail:toSendEmail} })

          .then(function(response) {
            return response.data;
          });

        return {
          promise: promise,
          cancel: cancel
        };
    },



    Online.getAllEvents = function(from,to,selectedVehicles,token){

        var canceller = $q.defer();

        var cancel = function(reason) {
          canceller.resolve(reason);
        };

        var promise = $http({method: "post", url: baseUrl + 'getAllEvents/'+from+'/'+to, headers: {'Xtoken': token}, timeout: canceller.promise, data: {vehicles: selectedVehicles}  })
          .then(function(response) {
            return response.data;
          });

        return {
          promise: promise,
          cancel: cancel
        };
    },

    Online.SaveGeoZone = function(details,token){   	 
    	return  $http({method: "post", url: baseUrl + 'api-v1/geozones/addGeozone', headers: {'Xtoken': token}, data: details });  
    },
    Online.EditGeoZone = function(geozoneId,details,token){        
        return  $http({method: "post", url: baseUrl + 'api-v1/geozones/editGeozone/'+geozoneId, headers: {'Xtoken': token}, data: details });  
    },
    Online.getZoneDetails = function(geoZoneID,token){	     	
        return $http({ method  : 'get',  url : baseUrl + 'api-v1/geozones/getGeozoneDetails/'+geoZoneID,headers: {'Xtoken': token}}) ;     
    },
    Online.showVehicle = function(option,objID,deviceID,from,to,token){          
        return $http({ method  : 'post',  url : baseUrl + 'api-v1/dashboard/showVehicle',data:{option:option,id:objID,deviceid:deviceID,from:from,to:to}, headers: {'Xtoken': token}}) ;     
    },
    Online.getVehicleName = function(deviceID,token){          
        return $http({ method  : 'get',  url : baseUrl + 'getVehicleName/'+deviceID, headers: {'Xtoken': token}}) ;     
    },
    Online.getServiceBydate = function(deviceID,from,to,token){          
        return $http({ method  : 'get',  url : baseUrl + 'getServiceBydate/'+deviceID+'/'+from+'/'+to, headers: {'Xtoken': token}}) ;     
    },
    Online.getServiceRemainder = function(deviceID,token){          
        return $http({ method  : 'get',  url : baseUrl + 'getServiceRemainder/'+deviceID, headers: {'Xtoken': token}}) ;     
    },
    Online.getRemainderBydate = function(deviceID,from,to,token){          
        return $http({ method  : 'get',  url : baseUrl + 'getRemainderBydate/'+deviceID+'/'+from+'/'+to, headers: {'Xtoken': token}}) ;     
    },
    Online.getVehiclesForGeozone = function(token){          
        return $http({ method  : 'get',  url : baseUrl + 'api-v1/reports/getVehiclesForGeozone', headers: {'Xtoken':localStorage.loginToken}}) ;     
    },
    Online.getDocumentBydate = function(deviceID,from,to,token){          
        return $http({ method  : 'get',  url : baseUrl + 'getDocumentBydate/'+deviceID+'/'+from+'/'+to, headers: {'Xtoken': token}}) ;     
    },
    Online.getFuelBydate = function(deviceID,from,to,token){          
        return $http({ method  : 'get',  url : baseUrl + 'getFuelBydate/'+deviceID+'/'+from+'/'+to, headers: {'Xtoken':localStorage.loginToken}}) ;     
    }
    
    return Online;
});
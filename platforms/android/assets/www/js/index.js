function onDeviceReady() {
    $('body').addClass(device.platform.toLowerCase());

    // Bind events
    $(document).on("resume", onResume);
    $('#do-check').on("click", checkState);

    // Register change listeners for iOS
    if(device.platform === "iOS") {
        cordova.plugins.diagnostic.registerBluetoothStateChangeHandler(function(state){
            alert("Bluetooth state changed to: "+state);
            checkState();
        });
    }

    // iOS+Android settings
    $('#request-camera').on("click", function(){
        cordova.plugins.diagnostic.requestCameraAuthorization(function(granted){
            alert("Successfully requested camera authorization: authorization was " + (granted ? "GRANTED" : "DENIED"));
            checkState();
        }, function(error){
            alert(error);
        });
    });

    $('#settings').on("click", function(){
        cordova.plugins.diagnostic.switchToSettings(function(){
            alert("Successfully opened settings");
        }, function(error){
            alert(error);
        });
    });

    $('#request-microphone').on("click", function(){
        cordova.plugins.diagnostic.requestMicrophoneAuthorization(function(granted){
            alert("Successfully requested microphone authorization: authorization was " + (granted ? "GRANTED" : "DENIED"));
            checkState();
        }, function(error){
            alert(error);
        });
    });


    // iOS settings
    var onLocationRequestChange = function(status){
        alert("Location authorization status is: "+status);
        checkState();
    };
    $('#request-location-always').on("click", function(){
        cordova.plugins.diagnostic.requestLocationAuthorization(onLocationRequestChange, function(error){
            alert(error);
        }, "always");
    });

    $('#request-location-in-use').on("click", function(){
        cordova.plugins.diagnostic.requestLocationAuthorization(onLocationRequestChange, function(error){
            alert(error);
        }, "when_in_use");
    });

    $('#request-camera-roll').on("click", function(){
        cordova.plugins.diagnostic.requestCameraRollAuthorization(function(status){
            alert("Successfully requested camera roll authorization: authorization status is now " + status);
            checkState();
        }, function(error){
            alert(error);
        });
    });

    // Android settings
    $('#request-location').on("click", function(){
        cordova.plugins.diagnostic.requestLocationAuthorization(function(status){
            alert("Successfully requested location authorization: authorization status is now " + status);
        }, function(error){
            alert(error);
        });
    });

    $('#location-settings').on("click", function(){
        cordova.plugins.diagnostic.switchToLocationSettings();
    });

    $('#mobile-data-settings').on("click", function(){
        cordova.plugins.diagnostic.switchToMobileDataSettings();
    });

    $('#bluetooth-settings').on("click", function(){
        cordova.plugins.diagnostic.switchToBluetoothSettings();
    });

    $('#wifi-settings').on("click", function(){
        cordova.plugins.diagnostic.switchToWifiSettings();
    });

    // Android set state
    $('#enable-wifi').on("click", function(){
        cordova.plugins.diagnostic.setWifiState(function(){
            alert("Successfully enabled Wifi");
            setTimeout(checkState, 100);
        }, function(error){
            alert(error);
        }, true);
    });

    $('#disable-wifi').on("click", function(){
        cordova.plugins.diagnostic.setWifiState(function(){
            alert("Successfully disabled Wifi");
            setTimeout(checkState, 100);
        }, function(error){
            alert(error);
        }, false);
    });

    $('#enable-bluetooth').on("click", function(){
        cordova.plugins.diagnostic.setBluetoothState(function(){
            alert("Successfully enabled Bluetooth");
            setTimeout(checkState, 1000);
        }, function(error){
            alert(error);
        }, true);
    });

    $('#disable-bluetooth').on("click", function(){
        cordova.plugins.diagnostic.setBluetoothState(function(){
            alert("Successfully disabled Bluetooth");
            setTimeout(checkState, 1000);
        }, function(error){
            alert(error);
        }, false);
    });

    $('#get-location').on("click", function(){
        var posOptions = { timeout: 35000, enableHighAccuracy: true, maximumAge: 5000 };
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            alert("Current position: "+lat+","+lon);
        }, function (err) {
            alert("Position error: code="+ err.code + "; message=" + err.message);
            alert("Position error\ncode="+ err.code + "\nmessage=" + err.message);
        }, posOptions);
    });

    $('#use-camera').on("click", function(){
        navigator.camera.getPicture(function(){
            alert("Successfully took a photo");
        }, function(err){
            alert("Camera error: "+ err);
            alert("Camera error: "+err);
        }, {
            saveToPhotoAlbum: false,
            destinationType: Camera.DestinationType.DATA_URL
        });
    });


    if(device.platform === "iOS") {
        // Make dummy Bluetooth request to cause authorization request on iOS
        bluetoothSerial.isEnabled(
            function () {
                // list the available BT ports:
                bluetoothSerial.list(
                    function (results) {
                        alert(JSON.stringify(results));
                    },
                    function (error) {
                        alert(JSON.stringify(error));
                    }
                );
            },
            function () {
                alert("Bluetooth is not enabled/supported");
            }
        );
    }

    setTimeout(checkState, 500);
}


function checkState(){
    alert("Checking state...");

    $('#state li').removeClass('on off');

    // Location
    var onGetLocationAuthorizationStatus;
    cordova.plugins.diagnostic.isLocationEnabled(function(enabled){
        $('#state .location').addClass(enabled ? 'on' : 'off');
    }, onError);

    cordova.plugins.diagnostic.isLocationAuthorized(function(enabled){
        $('#state .location-authorization').addClass(enabled ? 'on' : 'off');
    }, onError);

    cordova.plugins.diagnostic.getLocationAuthorizationStatus(function(status){
        $('#state .location-authorization-status').find('.value').text(status.toUpperCase());
        onGetLocationAuthorizationStatus(status); // platform-specific
    }, onError);


    if(device.platform === "iOS"){
        cordova.plugins.diagnostic.isLocationEnabledSetting(function(enabled){
            $('#state .location-setting').addClass(enabled ? 'on' : 'off');
        }, onError);

        onGetLocationAuthorizationStatus = function(status){
            $('.request-location').toggle(status === "not_determined");
        }
    }

    if(device.platform === "Android"){
        cordova.plugins.diagnostic.isGpsLocationEnabled(function(enabled){
            $('#state .gps-location').addClass(enabled ? 'on' : 'off');
        }, onError);

        cordova.plugins.diagnostic.isNetworkLocationEnabled(function(enabled){
            $('#state .network-location').addClass(enabled ? 'on' : 'off');
        }, onError);

        cordova.plugins.diagnostic.getLocationMode(function(mode){
            $('#state .location-mode').find('.value').text(mode.toUpperCase());
        }, onError);

        onGetLocationAuthorizationStatus = function(status){
            $('#request-location').toggle(status != "GRANTED" && status != "DENIED_ALWAYS");
        };

        cordova.plugins.diagnostic.hasBluetoothLESupport(function(supported){
            $('#state .bluetooth-le-support').addClass(supported ? 'on' : 'off');
        }, onError);

        cordova.plugins.diagnostic.hasBluetoothLEPeripheralSupport(function(supported){
            $('#state .bluetooth-le-peripheral-support').addClass(supported ? 'on' : 'off');
        }, onError);
    }


    // Camera
    var onGetCameraAuthorizationStatus;
    cordova.plugins.diagnostic.isCameraEnabled(function(enabled){
        $('#state .camera').addClass(enabled ? 'on' : 'off');
    }, onError);

    cordova.plugins.diagnostic.isCameraPresent(function(enabled){
        $('#state .camera-present').addClass(enabled ? 'on' : 'off');
    }, onError);

    cordova.plugins.diagnostic.isCameraAuthorized(function(enabled){
        $('#state .camera-authorized').addClass(enabled ? 'on' : 'off');
    }, onError);

    cordova.plugins.diagnostic.getCameraAuthorizationStatus(function(status){
        $('#state .camera-authorization-status').find('.value').text(status.toUpperCase());
        onGetCameraAuthorizationStatus(status);
    }, onError);

    if(device.platform === "iOS"){
        cordova.plugins.diagnostic.isCameraRollAuthorized(function(enabled){
            $('#state .camera-roll-authorized').addClass(enabled ? 'on' : 'off');
        }, onError);

        cordova.plugins.diagnostic.getCameraRollAuthorizationStatus(function(status){
            $('#state .camera-roll-authorization-status').find('.value').text(status.toUpperCase());
            $('#request-camera-roll').toggle(status === "not_determined");
        }, onError);

        onGetCameraAuthorizationStatus = function(status){
            $('#request-camera').toggle(status === "not_determined");
        }
    }

    if(device.platform === "Android"){
        onGetCameraAuthorizationStatus = function(status){
            $('#request-camera').toggle(status != "GRANTED" && status != "DENIED_ALWAYS");
        }
    }

    // Wifi
    cordova.plugins.diagnostic.isWifiEnabled(function(enabled){
        $('#state .wifi').addClass(enabled ? 'on' : 'off');

        if(device.platform === "Android") {
            $('#enable-wifi').toggle(!enabled);
            $('#disable-wifi').toggle(!!enabled);
        }
    }, onError);

    // Bluetooth
    cordova.plugins.diagnostic.isBluetoothEnabled(function(enabled){
        $('#state .bluetooth-available').addClass(enabled ? 'on' : 'off');

        if(device.platform === "Android") {
            $('#enable-bluetooth').toggle(!enabled);
            $('#disable-bluetooth').toggle(!!enabled);
        }
    }, onError);

    if(device.platform === "iOS"){
        cordova.plugins.diagnostic.getBluetoothState(function(state){
            $('#state .bluetooth-state').find('.value').text(state.toUpperCase());
        }, onError);
    }

    // Microphone
    var onGetMicrophoneAuthorizationStatus;

    cordova.plugins.diagnostic.isMicrophoneAuthorized(function(enabled){
        $('#state .microphone-authorized').addClass(enabled ? 'on' : 'off');
    }, onError);

    cordova.plugins.diagnostic.getMicrophoneAuthorizationStatus(function(status){
        $('#state .microphone-authorization-status').find('.value').text(status.toUpperCase());
        onGetMicrophoneAuthorizationStatus(status);
    }, onError);

    if(device.platform === "iOS"){
        onGetMicrophoneAuthorizationStatus = function(status){
            $('#request-microphone').toggle(status === "not_determined");
        }
    }

    if(device.platform === "Android"){
        onGetMicrophoneAuthorizationStatus = function(status){
            $('#request-microphone').toggle(status != "GRANTED" && status != "DENIED_ALWAYS");
        }
    }
}

function onError(error){
    alert("An error occurred: "+error);
}

function onResume(){
    checkState();
}


$(document).on("deviceready", onDeviceReady);
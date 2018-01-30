app.factory('Login', function($http) {
    var Login = {};
    Login.dologin = function(user_name, user_password) {
        return  $http({method: "post", url: baseUrl + 'api-v1/user/postlogin',
            data: {
                user_name: user_name,
                user_password: user_password,
            }
        });
    }, 
    Login.forgotPassword = function(user_email) {
        return  $http({method: "post", url: baseUrl + 'forgotpassword',
            data: {
                user_email: user_email
                
            }
        });
    }  



    return Login;
});
var app = angular.module('index', []);

app.controller('indexController', function($scope, $http){
    $scope.page = '/static/login';
    $scope.scoutWindow = '';
    $scope.loginPage = {
        username: "",
        password: ""
    };
    $scope.CurrentUser = {};
    $scope.scouts = [];
    $scope.login = function(){
        $http.get('/authenticate?username=' + $scope.loginPage.username + '&password=' + $scope.loginPage.password).then(function(response){
            if(response.data){
                $scope.CurrentUser = response.data;
                $http.get('/scouts').then(function(scoutResp){
                    if(scoutResp.data){
                        $scope.page = '/static/main';
                        $scope.scouts = scoutResp.data;
                    } else {
                        alert('error; try again');
                    }
                });

            } else {
                alert('Unsuccessful login.')
            }
        });
    };
});
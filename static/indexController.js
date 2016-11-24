var app = angular.module('index', []);

app.controller('indexController', function ($scope, $http) {
    $scope.page = '/static/login.html';
    $scope.scoutWindow = '/static/scout.html';
    $scope.selectedScout = {};
    $scope.loginPage = {
        username: "",
        password: ""
    };
    $scope.newEval = {
        Day: "",
        Knowledge: 0,
        Skill: 0,
        Confidence: 0,
        Motivation: 0,
        Enthusiasm: 0,
        Recommend: 0,
        Comments: ""
    };
    $scope.resetEval = function() {
            $scope.newEval = {
        Day: "",
        Knowledge: 0,
        Skill: 0,
        Confidence: 0,
        Motivation: 0,
        Enthusiasm: 0,
        Recommend: 0,
        Comments: ""
    };
    }
    $scope.ratingOptions = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    $scope.recommendOptions = [{name: 'No Recommendation', value: 1},
                                {name: 'Partial Recommendation', value: 2},
                                {name: 'Full Recommendation', value: 3}];
    $scope.CurrentUser = {};
    $scope.scouts = [];
    $scope.login = function () {
        $http.get('/authenticate?username=' + $scope.loginPage.username + '&password=' + $scope.loginPage.password).then(function (response) {
            if (response.data) {
                $scope.CurrentUser = response.data;
                var url = "";
                if ($scope.CurrentUser.IsAdmin) {
                    url = '/scouts';
                } else {
                    url = '/scouts?courseid=' + $scope.CurrentUser.CourseID;
                }
                $http.get(url).then(function (scoutResp) {
                    if (scoutResp.data) {
                        $scope.page = '/static/main.html';
                        $scope.scouts = scoutResp.data;
                    } else {
                        alert('error; try again');
                    }
                });

            } else {
                alert('Unsuccessful login.');
            }
        });
    };
    $scope.itemClick = function (s) {
        if (s.ScoutID != $scope.CurrentUser.ScoutID) {
            $http.get('/scouts/' + s.ScoutID + '/evaluations').then(function (response) {
                if (response.data) {
                    $('.mainPage').css('filter', 'blur(7px)');
                    $('.mainPage').css('-webkit-filter', 'blur(7px)');
                    $('.modal').fadeIn('slow');
                    $('.scoutWindow').fadeIn('slow');
                    $scope.selectedScout = s;
                    $scope.selectedScout.evaluations = response.data;
                } else {
                    alert('Could not get evaluations.');
                }
            });
        }
    };
    $scope.exit = function () {
        $('.mainPage').css('filter', '');
        $('.mainPage').css('-webkit-filter', '');
        $('.modal').fadeOut('slow');
        $('.scoutWindow').fadeOut('slow');
        $scope.resetEval();
    };
    $scope.createEval = function () {
        var d = new Date();
        var ticks = ((d.getTime() * 10000) + 621355968000000000);
        $scope.newEval.IsFinal = $scope.CurrentUser.IsElevated,
            $scope.newEval.Created = d;
        $scope.newEval.LastModified = d;
        $scope.newEval.EvaluatorID = $scope.CurrentUser.ScoutID;
        $scope.newEval.EvaluatorPosition = $scope.CurrentUser.Position;
        $scope.newEval.ScoutID = $scope.selectedScout.ScoutID;
        $scope.newEval.EvalID = String($scope.CurrentUser.ScoutID) + String(ticks) + String($scope.selectedScout.ScoutID);
        $http.post('/evaluations', $scope.newEval).then(function (response) {
            if (response.status == 200) {
                alert('Evaluation saved.');
                $scope.resetEval();
            } else {
                alert('Could not save evaluation.');
            }
        });
    };
    $scope.editEval = function (s) {
        $('#eval-' + s + ' .staticStat').hide();
        $('#eval-' + s + ' .editStat').show();
    };
    $scope.saveEval = function (s, e) {
        $('#eval-' + s + ' .staticStat').show();
        $('#eval-' + s + ' .editStat').hide();
        e.LastModified = new Date();
        $http.put('/evaluations/' + e.EvalID, e).then(function (response) {
            if (response.status != 200) {
                alert('Could not save evaluation; please try again.');
            } else {
                console.log('Successfully saved evaluation.');
            }
        });
    };
    $scope.checkEditable = function (evaluatorID) {
        return evaluatorID != $scope.CurrentUser.ScoutID;
    };
    $scope.isDayFinal = function () {
        if ($scope.CurrentUser.IsElevated) {
            $scope.newEval.Day = "Final";
            return true;
        } else {
            return false;
        }
    };
    $scope.convertRecommendationNumber = function(number) {
        switch (number) {
            case 1:
            return 'No Recommendation';
            case 2:
            return 'Partial Recommendation';
            case 3:
            return 'Full Recommendation';
            default:
            return 'Select One'
        }
    }
});
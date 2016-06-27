/**
 * Created by Administrator on 2016/5/4.
 */
angular.module('loginApp', ['fastmap.uikit', 'ngCookies', 'dataService']).controller('loginCtrl', ["$scope", "$cookies", "dsManage",
    function($scope, $cookies, dsManage) {
        $scope.$on("startLogin", function(event, data) {
            dsManage.login(data.userName, data.password).then(function(rest) {
                if (rest) {
                    if (rest.access_token) {
                        window.location.href = "./task/taskSelection.html?access_token=" + rest.access_token;
                    } else {
                        swal("登陆出错", data, "error");
                    }
                }
            });
        });
    }
]);
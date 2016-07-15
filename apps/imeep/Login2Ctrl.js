/**
 * Created by Administrator on 2016/5/4.
 */
angular.module('loginApp', ['fastmap.uikit', 'ngCookies', 'dataService']).controller('loginCtrl', ["$scope", "$cookies", "dsManage",
    function($scope, $cookies, dsManage) {
        //登录事件监听;
        $scope.$on("startLogin", function(event, data) {
            dsManage.login(data.userName, data.password).then(function(rest) {
                if (rest) {
                    $cookies.put('FM_USER_ID', rest.userId);
                    if(data.remember){
                        $cookies.put('FM_USER_NAME', data.userName);
                        $cookies.put('FM_REAL_NAME', rest.userRealName);
                        $cookies.put('FM_USER_PWDS', data.password);
                    }
                    window.location.href = "./task/taskSelection.html?access_token=" + rest.access_token;
                } else {
                    swal("登陆出错", data, "error");
                }
            });
        });

    }
]);
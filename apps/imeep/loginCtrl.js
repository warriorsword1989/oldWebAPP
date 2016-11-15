/**
 * Created by Administrator on 2016/5/4.
 */
angular.module('loginApp', ['fastmap.uikit', 'ngCookies', 'dataService']).controller('loginCtrl', ['$scope', '$cookies', 'dsManage',
    function ($scope, $cookies, dsManage) {
        // 登录事件监听;
        var height = document.documentElement.clientHeight;
        var width = document.documentElement.clientWidth;
        var percent = height / 1019;
        $scope.percentData = percent;
        $scope.loginLogo = {
            height: 1000 * percent + 'px',
            width: 1320 * percent + 'px',
            'padding-left': 250 * percent + 'px',
            'padding-top': 380 * percent + 'px',
            margin: 'auto',
            'background-size': '100% 100%'
        };
        $scope.loginBackground = {
            'padding-top': (height - (1000 * percent)) / 2 + 'px',
            width: width + 'px',
            height: height + 'px'
        };
        $scope.loginEntryDiv = {
            width: 360 * percent + 'px',
            'font-size': 14 * percent + 'px'
        };
        $scope.$broadcast('setPercent', {
            percent: percent
        });
        $scope.$on('startLogin', function (event, data) {
            dsManage.login(data.userName, data.password).then(function (rest) {
                if (rest && rest.access_token) {
                    var cookieObj = {
                        userId: rest.userId
                    };
                    // $cookies.put('FM_USER_ID', rest.userId);
                    if (data.remember) {
                        cookieObj.userName = data.userName;
                        cookieObj.userRealName = rest.userRealName;
                        cookieObj.userPwd = data.password;
                        // $cookies.put('FM_USER_NAME', data.userName);
                        // $cookies.put('FM_REAL_NAME', rest.userRealName);
                        // $cookies.put('FM_USER_PWDS', data.password);
                    }
                    var d = new Date();
                    d.setDate(d.getDate() + 1);
                    $cookies.putObject('FM-WEBEDITOR-USER-' + rest.access_token, cookieObj, {
                        path: '/',
                        expires: d
                    });
                    window.location.href = './task/taskPage.html?access_token=' + rest.access_token;
                } else {
                    $scope.$broadcast('errorMessage', {
                        error: rest
                    });
                }
            });
        });
    }
]);

/**
 * Created by Administrator on 2016/5/4.
 */
angular.module('loginApp', ['fastmap.uikit', 'ng-backstretch', 'ngCookies']).controller('loginPageCtrl', function ($scope, $http, $cookies) {
    // 设置切换的北景图片;
    $scope.images = [
        '../../images/poi/main/bg_road.png',
        '../../images/poi/main/bg_poi.png',
        '../../images/poi/main/bg_world.jpg'
    ];
    // 登录的事件监听;
    $scope.$on('startLogin', function (event, data) {
        // 请求登录接口;
        $http({
            method: 'GET',
            url: App.Util.getFullUrl('man/userInfo/login/'),
            params: {
                parameter: {
                    userNickName: data.userName,
                    userPassword: data.password
                }
            }
        }).success(function (data) {
            if (data.data.access_token) {
                // $cookies.put('FM_USER_ID',data.data.userId);
                // $cookies.put('FM_USER_NAME',data.data.realName);
                // $cookies.put('FM_USER_TYPE',data.data.userType);
                // $cookies.put('FM_USER_ROLES',data.data.roleCode.join(","));
                // $cookies.put('FM_USER_GROUPS',(data.data.userGroups ? data.data.userGroups : []).join(","));
                window.location.href = './task/taskSelection.html?access_token=' + data.data.access_token;
            } else {
                swal('登陆出错', data.errmsg, 'error');
            }
        });
    });
});

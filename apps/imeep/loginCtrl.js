/**
 * Created by Administrator on 2016/5/4.
 */
angular.module('loginApp', ['fastmap.uikit','ngCookies']).controller('loginCtrl', function($scope, $http, $cookies) {
    $scope.$on("startLogin", function(event, data) {
        //请求登录接口;
        $http({
            method: 'GET',
            url: App.Util.getFullUrl('user/login/'),
            params: {
                id: data.userName,
                secret: data.password,
                moduleCode: 'rowEditor',
                parameter: "",
                access_token: null
            }
        }).success(function(data) {
            if (data.errcode == 0) {
                if (data) {
                    $cookies.put('FM_USER_ID',data.data.userId);
                    $cookies.put('FM_USER_NAME',data.data.realName);
                    $cookies.put('FM_USER_TYPE',data.data.userType);
                    $cookies.put('FM_USER_ROLES',data.data.roleCode.join(","));
                    $cookies.put('FM_USER_GROUPS',(data.data.userGroups ? data.data.userGroups : []).join(","));
                    window.location.href = "./task/taskSelection.html?access_token=" + data.data.access_token;
                }
            } else if (data.errcode < 0) {
                swal("登陆出错", data.errmsg, "error");
            }
        })
    });
});
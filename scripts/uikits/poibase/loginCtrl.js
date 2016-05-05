/**
 * Created by Administrator on 2016/5/4.
 */
angular.module('loginApp', ['fastmap.uikit']).controller('loginCtrl',function($scope,$http){

    var interface_url = App.Util.getFullUrl('user/login/');

    $scope.$on("startLogin", function(event){
        $scope.show_error = true;

        if($scope.valid_type==3&&!$scope.username||!$scope.pwd){
            return false;
        }
        //请求登录接口;
        $http({
            method:'GET',
            url:interface_url,
            params:{
                id: $scope.username,
                secret: $scope.pwd,
                moduleCode: 'rowEditor',
                parameter: "",
                access_token:null
            }
        }).success(function(data) {
            if(data.errcode=='0'){
                if (data) {
                    document.cookie="FM_USER_ID="+escape(data.data.userId)+';path=/';
                    document.cookie="FM_USER_NAME="+data.data.realName+';path=/';
                    document.cookie="FM_USER_TYPE="+data.data.userType+';path=/';
                    document.cookie="FM_USER_ROLES="+data.data.roleCode.join(",")+';path=/';
                    document.cookie="FM_USER_GROUPS="+(data.data.userGroups ? data.data.userGroups : []).join(",")+';path=/';
                    window.location.href = "./projectManage.html?access_token=" + data.data.access_token;
                }
            }
            if(data.errcode=='-1'){
                alert(data.errmsg+'用户！')
            }
        })
    });
});
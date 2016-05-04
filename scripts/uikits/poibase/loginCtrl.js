/**
 * Created by Administrator on 2016/5/4.
 */
var myApp =  angular.module('login', []);

myApp.controller('poiLogin',function($scope,$http){

    var interface_url = App.Config.serviceUrl+'/user/login/';
    $scope.submitData = function(type){
        alert(type)
        $scope.show_error = true;

        //var interface_url = App.Util.getFullUrl('user/login/');

        if($scope.show_type==3&&!$scope.username||!$scope.pwd){
            return false;
        }
        //请求登录接口;
        $http({
                method:'GET',
                url:interface_url,
                params:{
                    id: $scope.username,
                    secret: $scope.pwd,
                    moduleCode: type,
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
                        window.location.href = "../pages/projectList.html?access_token=" + data.data.access_token;
                    }
                }
                if(data.errcode=='-1'){
                    alert(data.errmsg+'用户！')
                }
            })
    }
});
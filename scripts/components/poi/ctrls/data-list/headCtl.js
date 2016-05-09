angular.module('app',['oc.lazyLoad', 'ui.bootstrap', 'dataService']).controller('headCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', 'poi', function($scope, $ocll, $rs, $q, poi) {
    $scope.goback = function() {
        var pathName = window.document.location.pathname;
        var appName = pathName.substring(0, pathName.indexOf('/poibase'));
        alert('pathName:' +pathName)
        alert('appName:'+appName)
        if (pathName == appName + "/poibase/projecManage.html") {
            this.logout();
        } else {
            window.document.location.href = window.document.referrer;
        }
    };
    $scope.logout = function() {
    	var appPath = window.document.location.pathname;
        var appName = appPath.substring(0, appPath.indexOf('/poibase'));
        window.location.href = appName + "/poibase/login.html";
        this.clearCookie();
    };
        var arr = document.cookie.split('; ');
        for(var i=0;i<arr.length;i++){
            if(arr[i].indexOf('FM_USER_NAME') > -1){
                realName = arr[i].split('=')[1];
                break;
            }
        }
    $scope.realName = realName
}]);
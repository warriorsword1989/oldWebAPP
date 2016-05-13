angular.module('app').controller('headCtl', ['$scope', function($scope) {
    $scope.goback = function() {
        var pathName = window.document.location.pathname;
        var appName = pathName.substring(0, pathName.indexOf('/poibase'));
        if (pathName == appName + "/poibase/projectManage.html") {
        	$scope.logout();
        } else {
            window.document.location.href = window.document.referrer;
        }
    };
    $scope.logout = function() {
    	var appPath = window.document.location.pathname;
        var appName = appPath.substring(0, appPath.indexOf('/poibase'));
        window.location.href = appName + "/poibase/login.html";
        $scope.clearCookie();
    };
    $scope.clearCookie = function() {
    };
    var realName = "";
    var arr = document.cookie.split('; ');
    for(var i=0;i<arr.length;i++){
        if(arr[i].indexOf('FM_USER_NAME') > -1){
            realName = arr[i].split('=')[1];
            break;
        }
    }
    $scope.realName = realName;
}]);
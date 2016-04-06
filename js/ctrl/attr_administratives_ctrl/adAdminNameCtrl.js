/**
 * Created by zhaohang on 2016/4/6.
 */

var otherApp = angular.module("mapApp", []);
otherApp.controller("adAdminNameController", function ($scope, $timeout, $ocLazyLoad) {
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    $scope.adAdminNameData = objectEditCtrl.data;
    $scope.initData = function(){

    }
    if(objectEditCtrl.data) {

    }
    objectEditCtrl.updateObject=function() {

    }
});
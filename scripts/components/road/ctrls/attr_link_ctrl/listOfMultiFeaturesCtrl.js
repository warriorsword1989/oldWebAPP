/**
 * Created by zhongxiaoming on 2016/11/18.
 * 多个要素显示栏ctrl
 */

var listOfMultiFeaturesApp = angular.module('app');
listOfMultiFeaturesApp.controller('listOfMultiFeaturesController', function ($scope, $timeout, $ocLazyLoad) {
    var objectCtrl = fastmap.uikit.ObjectEditController();

  // 同时选中的多个要素
    $scope.datas = objectCtrl.datas;

    $scope.changFeature = function (pid) {
        for (var i = 0, len = $scope.datas.length; i < len; i++) {
            if (pid == $scope.datas[i].pid) {
                objectCtrl.setCurrentObject('RDLINK', $scope.datas[i]);
            }
        }
    };

    $scope.deleteLimit = function (pid) {
        for (var i = 0, len = $scope.datas.length; i < len; i++) {
            if (pid == $scope.datas[i].pid) {
                objectCtrl.datas.splice(i, 1);
            }
        }
    };
});

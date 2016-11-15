/**
 * Created by liuyang on 2016/10/21.
 */
var rawApp = angular.module('app', []);
rawApp.controller('RawFieldController', ['$scope', '$ocLazyLoad', 'appPath', 'dsEdit', '$timeout', function ($scope, $ocLazyLoad, appPath, dsEdit, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var layerCtrl = fastmap.uikit.LayerController();
    var poiLayer = layerCtrl.getLayerById('poi');
    var transform = new fastmap.mapApi.MecatorTranform();
    var selectCtrl = fastmap.uikit.SelectController();

    $scope.rawRelationshap = null;
    $scope.raw = {};
    $scope.raw.rawTplShow = false; // 用于控制同一POI制作面板是否显示

    $scope.$on('showRawshap', function (data) {
        $scope.initializeData();
    });

    /**
     * 初始化方法
     */
    $scope.initializeData = function () {
        $scope.raw.rawTplShow = true;
        $scope.distance = selectCtrl.selectedFeatures.distance.toFixed(1);
    };

    $scope.initializeData();

    $scope.changeRawField = function (num) {

    };

    /**
     * 保存
     */
    $scope.saveRaw = function () {
        $scope.raw.rawTplShow = false;
    };

    /**
     * 取消
     */
    $scope.clearRaw = function () {
        $scope.raw = {};
        $scope.raw.rawTplShow = false;
    };
}]);

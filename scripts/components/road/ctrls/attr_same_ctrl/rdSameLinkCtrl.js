/**
 * Created by wuzhen on 2016/8/11.
 */
var sameLinkApp = angular.module("app",[]);
sameLinkApp.controller("SameLinkController",['$scope','dsEdit',function($scope,dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var rdSameLayer = layerCtrl.getLayerById('rdSame');

    /**
     * 初始化方法
     */
    $scope.initializeData = function (){
        if($scope.rsSameLinkForm) {
            $scope.rsSameLinkForm.$setPristine();
        }

        $scope.rdSameLinkList = objCtrl.data;//获取数据
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());//记录原始数据值
    };


    $scope.initializeData();

    $scope.delete = function (){
        dsEdit.delete($scope.rdSameLinkList.pid, "RDSAMELINK").then(function(data) {
            if (data) {
                rdSameLayer.redraw();
                $scope.rdSameLinkList = null;
                $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false})
            }
        });
    };

    $scope.save = function (){

    };

    //监听保存 删除 取消 初始化
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeData);

}]);
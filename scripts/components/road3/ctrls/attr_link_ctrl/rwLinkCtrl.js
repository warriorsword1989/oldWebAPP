/**
 * Created by zhaohang on 2016/4/7.
 */
var rwLinkZone = angular.module("app");
rwLinkZone.controller("rwLinkController",["$scope" , "appPath",function($scope,appPath) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();


    $scope.kind = [
        {"id": 1, "label": "铁路"},
        {"id": 2, "label": "磁悬浮"},
        {"id": 3, "label": "地铁/轻轨"}
    ];
    $scope.form = [
        {"id": 0, "label": "无"},
        {"id": 1, "label": "桥"},
        {"id": 2, "label": "隧道"}
    ];
    $scope.scale = [
        {"id": 0, "label": "2.5w"},
        {"id": 1, "label": "20w"},
        {"id": 2, "label": "100w"}
    ];
    $scope.detailFlag = [
        {"id": 0, "label": "不应用"},
        {"id": 1, "label": "只存在于详细区域"},
        {"id": 2, "label": "只存在于广域区域"},
        {"id": 3, "label": "存在于详细和广域区域"}
    ];

    $scope.initializeData = function(){
        $scope.rwLinkData = objCtrl.data;
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
    };


    $scope.save = function(){

    };

    $scope.delete = function(){

    };
    $scope.cancel = function(){

    };

    $scope.rwLinkName=function(){
        var showOtherObj={
            "loadType":"subAttrTplContainer",
            "propertyCtrl": appPath.road + 'ctrls/attr_administratives_ctrl/adAdminNameCtrl',
            "propertyHtml": appPath.root + appPath.road + 'tpls/attr_adminstratives_tpl/adAdminNameTpl.html'
        }
        $scope.$emit("transitCtrlAndTpl", showOtherObj);
    };
    /**
     * 增加铁路名
     */
    $scope.addRdName = function () {
        var newName = fastmap.dataApi.rwLinkName({"linkPid": $scope.linkData.pid});
        $scope.linkData.names.unshift(newName)
    };

    /**
     * 初始化方法执行
     */
    if (objCtrl.data) {
        $scope.initializeData();
    }

    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeData);
}]);

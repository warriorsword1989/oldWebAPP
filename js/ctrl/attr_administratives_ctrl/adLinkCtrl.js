/**
 * Created by zhaohang on 2016/4/5.
 */
var adLinkApp = angular.module("lazymodule", []);
adLinkApp.controller("adLinkController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var outPutCtrl = fastmap.uikit.OutPutController();
    var highLightLayer = fastmap.uikit.HighLightController();

    var test = {"pid":1,"kind":1,"form":1,"scale":0,"meshId":2,"length":16666,"geometry":"56.66,77.98","editFlag":1,"sNodePid":2,"eNodePid":7};

    $scope.form = [
        {"id": 0, "label": "未调查"},
        {"id": 1, "label": "无属性"},
        {"id": 2, "label": "海岸线"},
        {"id": 6, "label": "特别行政区界(K)"},
        {"id": 7, "label": "特别行政区界(G)"},
        {"id": 8, "label": "未定行政区划界"},
        {"id": 9, "label": "南海诸岛范围线"},

    ];
    $scope.scale = [
        {"id": 0, "label": "2.5w"},
        {"id": 1, "label": "20w"},
        {"id": 2, "label": "100w"}
    ];

    $scope.initializeData = function(){
        var linkData = fastmap.dataApi.adlink(test);
        objCtrl.data = linkData;
        $scope.adLinkData = objCtrl.data;
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
    };
    $scope.initializeData();

    $scope.save = function(){

    };

    $scope.delete = function(){

    };
    $scope.cancel = function(){

    };

    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeData);
})
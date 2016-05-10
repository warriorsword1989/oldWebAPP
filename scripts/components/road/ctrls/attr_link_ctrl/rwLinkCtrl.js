/**
 * Created by zhaohang on 2016/4/7.
 */
var rwLinkZone = angular.module("mapApp");
rwLinkZone.controller("rwLinkController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var outPutCtrl = fastmap.uikit.OutPutController();
    var highLightLayer = fastmap.uikit.HighLightController();


    var test = {"linkPid":734278,"featurePid":3465,"sNodePid":486548,"eNodePid":897765,"kind":1,"form":0,
        "geometry":"56.66,77.98","length":66666,"scale":0,"detailFlag":0,"meshId":33,"editFlag":1,
        "color":"CD6839",
        "links":[
            {
                "nameId":1,"regionId":1,"nameGroupid":1,"langCode":"CHI","nameClass":1,"name":"gfdr","phonetic":"","srcFlag":0
            },
            {
                "nameId":4,"regionId":1,"nameGroupid":2,"langCode":"CHI","nameClass":1,"name":"desafesdr","phonetic":"","srcFlag":0
            }
        ]};

    $scope.kind = [
        {"id": 1, "label": "铁路"},
        {"id": 2, "label": "磁悬浮"},
        {"id": 2.5, "label": "地铁/轻轨"}
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
        var rwLink = fastmap.dataApi.rwLink(test);
        objCtrl.data = rwLink;
        $scope.rwLinkData = objCtrl.data;
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


    $scope.rwLinkName=function(){
        var showOtherObj={
            "loadType":"subAttrTplContainer",
            "propertyCtrl":'components/road/ctrls/attr_administratives_ctrl/adAdminNameCtrl',
            "propertyHtml":'js/tepl/attr_adminstratives_tpl/adAdminNameTpl.html'
        }
        $scope.$emit("transitCtrlAndTpl", showOtherObj);
    }
})

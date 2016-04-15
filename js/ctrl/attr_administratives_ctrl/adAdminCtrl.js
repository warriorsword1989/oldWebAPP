/**
 * Created by zhaohang on 2016/4/5.
 */
var adAdminZone = angular.module("lazymodule", []);
adAdminZone.controller("adAdminController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();

    $scope.isbase=true;


    var test = {"regionId":1,"adminId":0,"extendId":0,"adminType":0,"capital":0,"population":0,
        "geometry":"56.66,77.98","linkPid":0,"side":0,"jisCode":0,"meshId":0,"editFlag":1,
        "memo":"备注信息","names":[
            {
                "nameId":1,"regionId":1,"nameGroupid":1,"langCode":"CHI","nameClass":1,"name":"gfdr","phonetic":"","srcFlag":0
            },
            {
                "nameId":4,"regionId":1,"nameGroupid":2,"langCode":"CHI","nameClass":1,"name":"desafesdr","phonetic":"","srcFlag":0
            }
        ]};


    $scope.adminType = [
        {"id": 0, "label": "国家地区级"},
        {"id": 1, "label": "省/直辖市/自治区"},
        {"id": 2, "label": "地级市/自治州/省直辖县"},
        {"id": 2.5, "label": "DUMMY 地级市"},
        {"id": 3, "label": "地级市市区(GCZone)"},
        {"id": 3.5, "label": "地级市市区(未作区界)"},
        {"id": 4, "label": "区县/自治县"},
        {"id": 4.5, "label": "DUMMY 区县"},
        {"id": 4.8, "label": "DUMMY 区县(地级市下无区县)"},
        {"id": 5, "label": "区中心部"},
        {"id": 6, "label": "城镇/街道"},
        {"id": 7, "label": "飞地"},
        {"id": 8, "label": "KDZone"},
        {"id": 9, "label": "AOI"}
    ];
    $scope.capital = [
        {"id": 0, "label": "未定义"},
        {"id": 1, "label": "首都"},
        {"id": 2, "label": "省会/直辖市"},
        {"id": 3, "label": "地级市"}
    ];
    $scope.population = [
        {"id": 0, "label": "100w"},
        {"id": 1, "label": "200w"}

    ];

    $scope.initializeData = function(){
        //var adAdmin = fastmap.dataApi.adadmin(test);
        //objCtrl.data = adAdmin;
        //$scope.adAdminData = objCtrl.data;
        $scope.adAdminData=test;
       // objCtrl.setOriginalData(objCtrl.data.getIntegrate());
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


    $scope.otherAdminName=function(){
        var showOtherObj={
            "loadType":"subAttrTplContainer",
            "propertyCtrl":'ctrl/attr_administratives_ctrl/adAdminNameCtrl',
            "propertyHtml":'js/tepl/attr_adminstratives_tpl/adAdminNameTpl.html'
        }
        $scope.$emit("transitCtrlAndTpl", showOtherObj);
    }

    $scope.clickBasic=function(boolValue){
        $scope.isbase=boolValue;
        $scope.$apply();
    }

})

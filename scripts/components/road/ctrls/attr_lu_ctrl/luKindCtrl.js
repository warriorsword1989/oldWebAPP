/**
 * Created by mali on 2016/8/27.
 */
var formOfWayApp = angular.module("app");
formOfWayApp.controller("luKindCtrl",function($scope){
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    $scope.kindOpt = [
        {"id": 0, "label": "未分类","isCheck":false},
        {"id": 1, "label": "大学","isCheck":false},
        {"id": 2, "label": "购物中心","isCheck":false},
        {"id": 3, "label": "医院","isCheck":false},
        {"id": 4, "label": "体育场","isCheck":false},
        {"id": 5, "label": "公墓","isCheck":false},
        {"id": 6, "label": "地上停车场","isCheck":false},
        {"id": 7, "label": "工业区","isCheck":false},
        {"id": 11, "label": "机场","isCheck":false},
        {"id": 12, "label": "机场跑道","isCheck":false},
        {"id": 21, "label": "BUA面","isCheck":false},
        {"id": 22, "label": "邮编面","isCheck":false},
        {"id": 23, "label": "FM面","isCheck":false},
        {"id": 24, "label": "车场面","isCheck":false},
        {"id": 30, "label": "休闲娱乐","isCheck":false},
        {"id": 31, "label": "景区","isCheck":false},
        {"id": 32, "label": "会展中心","isCheck":false},
        {"id": 33, "label": "火车站","isCheck":false},
        {"id": 34, "label": "文化场馆","isCheck":false},
        {"id": 35, "label": "商务区","isCheck":false},
        {"id": 36, "label": "商业区","isCheck":false},
        {"id": 37, "label": "小区","isCheck":false},
        {"id": 38, "label": "广场","isCheck":false},
        {"id": 39, "label": "特色区域","isCheck":false},
        {"id": 40, "label": "地下停车场","isCheck":false},
        {"id": 41, "label": "地铁出入口面","isCheck":false}
    ];

    $scope.initFn = function(){
        //现实种类面板时初始化显示状态;
        for(var i=0;i<$scope.kindOpt.length;i++){
            $scope.kindOpt[i].isCheck = false;
        }
        $scope.luLinkData = objCtrl.data;
        for(var i=0;i<$scope.kindOpt.length;i++){
            for(var j=0;j<$scope.luLinkData.linkKinds.length;j++){
                if($scope.luLinkData.linkKinds[j].kind==$scope.kindOpt[i].id){
                    $scope.kindOpt[i].isCheck = true;
                }
            }
        }
    }

    //编辑种类时；
    $scope.getCheck=function(item){
        var tempObj = {};
        //tempObj.linkPid = $scope.luLinkData.linkKinds[0].linkPid;
        //tempObj.rowId = $scope.luLinkData.linkKinds[0].rowId;
        $scope.luLinkData.linkKinds = [];
        for(var i=0;i<$scope.kindOpt.length;i++){
            if($scope.kindOpt[i].isCheck){
                tempObj.kind = $scope.kindOpt[i].id;
                $scope.luLinkData.linkKinds.push(fastmap.dataApi.luLinkKind(tempObj))
            }
        }
        objCtrl.objRefresh();
    }


    $scope.initFn();
    eventController.off(eventController.eventTypes.SELECTEDVEHICLECHANGE);
    eventController.on(eventController.eventTypes.SELECTEDVEHICLECHANGE, $scope.initFn);
})
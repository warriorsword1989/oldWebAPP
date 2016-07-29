/**
 * Created by liuyang on 2016/7/26.
 */

var rdSlopeApp = angular.module("app");
rdSlopeApp.controller("rdSlopeCtl",['$scope','dsEdit',function($scope,dsEdit) {
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var relationData = layerCtrl.getLayerById('relationData');
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.initializeData = function(){
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        console.log(objCtrl.data.getIntegrate())
        $scope.slopeData = objCtrl.data;
        conversionSystem();
        /*var links = $scope.slopeData.links,highLightFeatures=[];
        for(var i= 0,len=links.length;i<len;i++) {
            highLightFeatures.push({
                id: links[i]["linkPid"].toString(),
                layerid:'rdLink',
                type:'rdgsc',
                index:links[i].zlevel,
                style:{
                    size:5
                }
            })
        }*/
        /*highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();*/

    };
    $scope.initializeData();
    $scope.refreshData = function () {
        dsEdit.getByPid(parseInt($scope.slopeData.pid), "RDELECTRONICEYE").then(function(data){
        	if (data) {
                objCtrl.setCurrentObject("RDELECTRONICEYE", data);
                $scope.initializeData();
            }
        });
    };

    /*十进制转二进制*/
    function conversionSystem(){
        $scope.slopeData.location = parseInt(objCtrl.data.location,10).toString(2);
        if(objCtrl.data.location){
            if(objCtrl.data.location.length == 1){
                $scope.slopeData.locationLeft = 0;
                $scope.slopeData.locationRight = 0;
                $scope.slopeData.locationTop = $scope.slopeData.location;
            }else if(objCtrl.data.location.length == 2){
                $scope.slopeData.locationLeft = 0;
                $scope.slopeData.locationRight = $scope.slopeData.location.substr(0,1);
                $scope.slopeData.locationTop = $scope.slopeData.location.substr(1,1);
            }else if(objCtrl.data.location.length == 3){
                $scope.slopeData.locationLeft = $scope.slopeData.location.substr(0,1);
                $scope.slopeData.locationRight = $scope.slopeData.location.substr(1,1);
                $scope.slopeData.locationTop = $scope.slopeData.location.substr(2,1);
            }
        }
    }

    /*二进制转十进制*/
    function bin2dec(bin){
        c = bin.split("");
        len = c.length;
        dec = 0;
        for(i=0; i<len; i++){
            temp = 1;
            if(c[i] == 1){
                for(j=i+1; j<len; j++) temp *= 2;
                dec += temp;
            } else if(c[i] != 0) {
                return false;
            }
        }
        return dec;
    }
    $scope.changeLocationLeft = function(){
        if($scope.slopeData.locationLeft == 0){
            $scope.slopeData.locationLeft = 1;
        }else{
            $scope.slopeData.locationLeft = 0
        }
    };
    $scope.changeLocationRight = function(){
        if($scope.slopeData.locationRight == 0){
            $scope.slopeData.locationRight = 1;
        }else{
            $scope.slopeData.locationRight = 0
        }
    };
    $scope.changeLocationTop = function(){
        if($scope.slopeData.locationTop == 0){
            $scope.slopeData.locationTop = 1;
        }else{
            $scope.slopeData.locationTop = 0
        }
    };
    
    /*电子眼类型*/
    $scope.elecEyeType = [
        {"id": 0, "label": "未调查"},
        {"id": 1, "label": "限速摄像头"},
        {"id": 2, "label": "雷达测速摄像头"},
        {"id": 3, "label": "移动式测速"},
        {"id": 10, "label": "交通信号灯摄像头"},
        {"id": 11, "label": "路况监控摄像头"},
        {"id": 12, "label": "单行线摄像头"},
        {"id": 13, "label": "非机动车道摄像头"},
        {"id": 14, "label": "高速/城市高速出入口摄像头"},
        {"id": 15, "label": "公交车道摄像头"},
        {"id": 16, "label": "禁止左/右转摄像头"},
        {"id": 17, "label": "禁止掉头摄像头"},
        {"id": 18, "label": "应急车道摄像头"},
        {"id": 19, "label": "交通标线摄像头"},
        {"id": 20, "label": "区间测速开始"},
        {"id": 21, "label": "区间测速结束"},
        {"id": 98, "label": "其他"}
    ];
    
    /*作用方向*/
    $scope.directArray = [
        {id:0,label:'未调查'},
        {id:2,label:'顺方向'},
        {id:3,label:'逆方向'}  
    ];

    $scope.save = function(){
        objCtrl.data.location = bin2dec($scope.slopeData.locationLeft+ '' + $scope.slopeData.locationRight + '' + $scope.slopeData.locationTop);
        objCtrl.save();
        if(!objCtrl.changedProperty){
            swal("操作成功",'属性值没有变化！', "success");
            return ;
        }
        var param = {
            "command": "UPDATE",
            "type": "RDELECTRONICEYE",
            "dbId": App.Temp.dbId,
            "data": objCtrl.changedProperty
        };
        dsEdit.save(param).then(function (data) {
            if (data) {
                if (selectCtrl.rowkey) {
                    var stageParam = {
                        "rowkey": selectCtrl.rowkey.rowkey,
                        "stage": 3,
                        "handler": 0
                    };
                    dsFcc.changeDataTipsState(JSON.stringify(stageParam)).then(function(data){
                        selectCtrl.rowkey.rowkey = undefined;
                    });
                }
                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                relationData.redraw();
                swal("操作成功", "修改信号灯成功！", "success");
            }
            $scope.refreshData();
        })
    };

    $scope.delete = function(){
        var objId = parseInt($scope.slopeData.pid);
        var param = {
            "command": "DELETE",
            "type": "RDELECTRONICEYE",
            "dbId": App.Temp.dbId,
            "objId": objId
        };
        dsEdit.save(param).then(function (data) {
            var info = null;
            if (data) {
                $scope.slopeData = null;
                relationData.redraw();
            }
        })
    };
    $scope.cancel = function(){
    };
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeData);
}]);
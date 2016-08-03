/**
 * Created by wangmingdong on 2016/7/20.
 */

var rdTrafficSignalApp = angular.module("app");
rdTrafficSignalApp.controller("trafficSignalCtl",['$scope','dsEdit',function($scope,dsEdit) {
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var relationData = layerCtrl.getLayerById('relationData');
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.initializeData = function(){
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        $scope.trafficSignalData = objCtrl.data;
        conversionSystem();
        /*var links = $scope.trafficSignalData.links,highLightFeatures=[];
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
        dsEdit.getByPid(parseInt($scope.trafficSignalData.pid), "RDTRAFFICSIGNAL").then(function(data){
        	if (data) {
                objCtrl.setCurrentObject("RDTRAFFICSIGNAL", data);
                $scope.initializeData();
            }
        });
    };

    /*十进制转二进制*/
    function conversionSystem(){
        $scope.trafficSignalData.location = parseInt(objCtrl.data.location,10).toString(2);
        if(objCtrl.data.location){
            if(objCtrl.data.location.length == 1){
                $scope.trafficSignalData.locationLeft = 0;
                $scope.trafficSignalData.locationRight = 0;
                $scope.trafficSignalData.locationTop = $scope.trafficSignalData.location;
            }else if(objCtrl.data.location.length == 2){
                $scope.trafficSignalData.locationLeft = 0;
                $scope.trafficSignalData.locationRight = $scope.trafficSignalData.location.substr(0,1);
                $scope.trafficSignalData.locationTop = $scope.trafficSignalData.location.substr(1,1);
            }else if(objCtrl.data.location.length == 3){
                $scope.trafficSignalData.locationLeft = $scope.trafficSignalData.location.substr(0,1);
                $scope.trafficSignalData.locationRight = $scope.trafficSignalData.location.substr(1,1);
                $scope.trafficSignalData.locationTop = $scope.trafficSignalData.location.substr(2,1);
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
        if($scope.trafficSignalData.locationLeft == 0){
            $scope.trafficSignalData.locationLeft = 1;
        }else{
            $scope.trafficSignalData.locationLeft = 0
        }
    };
    $scope.changeLocationRight = function(){
        if($scope.trafficSignalData.locationRight == 0){
            $scope.trafficSignalData.locationRight = 1;
        }else{
            $scope.trafficSignalData.locationRight = 0
        }
    };
    $scope.changeLocationTop = function(){
        if($scope.trafficSignalData.locationTop == 0){
            $scope.trafficSignalData.locationTop = 1;
        }else{
            $scope.trafficSignalData.locationTop = 0
        }
    };
    
    /*信号灯类型*/
    $scope.lampType = [
        {"id": 0, "label": "机动车信号灯"},
        {"id": 1, "label": "非机动车信号灯"},
        {"id": 2, "label": "车道信号灯"},
        {"id": 3, "label": "方向指示灯"},
        {"id": 4, "label": "闪光警告信号灯"},
        {"id": 5, "label": "道路与铁路平交道口信号灯"}
    ];


    $scope.save = function(){
        objCtrl.data.location = bin2dec($scope.trafficSignalData.locationLeft+ '' + $scope.trafficSignalData.locationRight + '' + $scope.trafficSignalData.locationTop);
        objCtrl.save();
        if(!objCtrl.changedProperty){
            swal("操作成功",'属性值没有变化！', "success");
            return ;
        }
        var param = {
            "command": "UPDATE",
            "type": "RDTRAFFICSIGNAL",
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
        var objId = parseInt($scope.trafficSignalData.pid);
        var param = {
            "command": "DELETE",
            "type": "RDTRAFFICSIGNAL",
            "dbId": App.Temp.dbId,
            "objId": objId
        };
        dsEdit.save(param).then(function (data) {
            var info = null;
            if (data) {
                $scope.trafficSignalData = null;
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
/**
 * Created by wangmingdong on 2016/7/20.
 */

var rdGscApp = angular.module("app");
rdGscApp.controller("trafficSignalCtl",['$scope','dsEdit',function($scope,dsEdit) {
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var rdgsc = layerCtrl.getLayerById('relationData');
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.initializeData = function(){
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        $scope.reGscData = objCtrl.data;
        var links = $scope.reGscData.links,highLightFeatures=[];
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
        }
        /*highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();*/

    };
    // $scope.initializeData();
    $scope.refreshData = function () {
        dsEdit.getByPid(parseInt($scope.reGscData.pid), "RDGSC").then(function(data){
        	if (data) {
                objCtrl.setCurrentObject("RDGSC", data.data);
                $scope.initializeData();
            }
        });
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
        objCtrl.save();
        if(!objCtrl.changedProperty){
            swal("操作成功",'属性值没有变化！', "success");
            return ;
        }
        var param = {
            "command": "UPDATE",
            "type": "RDGSC",
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
                rdgsc.redraw();
                swal("操作成功", "修改立交成功！", "success");
            }
            $scope.refreshData();
        })
    };

    $scope.delete = function(){
        var objId = parseInt($scope.reGscData.pid);
        var param = {
            "command": "DELETE",
            "type": "RDGSC",
            "dbId": App.Temp.dbId,
            "objId": objId
        };
        dsEdit.save(param).then(function (data) {
            var info = null;
            if (data) {
                rdgsc.redraw();
                $scope.reGscData = null;
                rdgsc.redraw();
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
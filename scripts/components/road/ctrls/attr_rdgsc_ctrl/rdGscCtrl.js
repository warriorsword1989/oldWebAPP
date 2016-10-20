/**
 * Created by zhaohang on 2016/4/7.
 */

var rdGscApp = angular.module("app");
rdGscApp.controller("rdGscController",['$scope','dsEdit','dsFcc',function($scope,dsEdit,dsFcc) {
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var rdgsc = layerCtrl.getLayerById('relationData');
    var selectCtrl = fastmap.uikit.SelectController();
    var outPutCtrl = fastmap.uikit.OutPutController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    $scope.initializeData = function(){
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        $scope.reGscData = objCtrl.data;
        var links = $scope.reGscData.links,highLightFeatures=[];
        /*for(var i= 0,len=links.length;i<len;i++) {
            highLightFeatures.push({
                // id: links[i]["linkPid"].toString(),
                // layerid:'rdLink',
                // type:'rdgsc',
                // index:links[i].zlevel,
                // style:{
                //     size:5
                // }

                id: links[i]["linkPid"].toString(),
                layerid: 'rdLink',
                type: 'line',
                style: {}

            })
        }
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();*/

        //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if($scope.rdGscForm) {
            $scope.rdGscForm.$setPristine();
        }
    };
    $scope.initializeData();
    $scope.refreshData = function () {
        dsEdit.getByPid(parseInt($scope.reGscData.pid), "RDGSC").then(function(data){
        	if (data) {
                objCtrl.setCurrentObject("RDGSC", data);
                $scope.initializeData();
            }
        });
    };
    /*处理标识*/
    $scope.processFlag = [
        {"id": 0, "label": "无"},
        {"id": 1, "label": "人工赋值"},
        {"id": 2, "label": "程序赋值"},
        {"id": 3, "label": "特殊处理"}

    ];
    /*$scope.getLevels = function(){
        $scope.zlevel = [];
        for(var i=0;i<$scope.reGscData.links.length;i++){
            $scope.zlevel.push({id:$scope.reGscData.links[i].zlevel,label:$scope.reGscData.links[i].zlevel});
        }
    };
    $scope.getLevels();*/

    $scope.tableName = [
        {"id": "RD_LINK", "label": "RD_LINK"},
        {"id": "LC_LINK ", "label": "LC_LINK "},
        {"id": "RW_LINK", "label": "RW_LINK"},
        {"id": "CMG_BUILDLINK", "label": "CMG_BUILDLINK"},
        {"id": "RD_GSC_LINK", "label": "RD_GSC_LINK"}
    ];

    $scope.save = function(){
        if(objCtrl.data.links){
            for(var i=0,len=objCtrl.data.links.length;i<len;i++){
                delete objCtrl.data.links[i].id;
            }
        }
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
        for(var i=0;i<objCtrl.data.links.length;i++){
            for(var j=0;j<objCtrl.originalData.links.length;j++){
                if(objCtrl.data.links[i].linkPid == objCtrl.originalData.links[j].linkPid && objCtrl.data.links[i].zlevel != objCtrl.originalData.links[j].zlevel){
                    objCtrl.changedProperty.links[i].zlevel = objCtrl.data.links[i].zlevel;
                    objCtrl.changedProperty.links[i].linkPid = objCtrl.data.links[i].linkPid;
                }
            }
        }
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
                // swal("操作成功", "修改立交成功！", "success");
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
                $scope.reGscData = null;
                rdgsc.redraw();
                $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false})
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
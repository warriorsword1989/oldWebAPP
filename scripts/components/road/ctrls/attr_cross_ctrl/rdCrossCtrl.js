/**
 * Created by liuzhaoxia on 2015/12/11.
 */
var selectApp = angular.module("app");
selectApp.controller("rdCrossController", ['$scope','dsEdit','dsFcc','appPath',function ($scope,dsEdit,dsFcc,appPath) {
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var outPutCtrl = fastmap.uikit.OutPutController();
    var rdcross = layerCtrl.getLayerById('relationData');
    var eventController = fastmap.uikit.EventController();
    var selectCtrl = fastmap.uikit.SelectController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    $scope.initializeRdCrossData = function () {
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        $scope.rdCrossData = objCtrl.data;
        var links = $scope.rdCrossData.links,highLightFeatures=[];

        for(var i= 0,len=links.length;i<len;i++) {
            highLightFeatures.push({
                id: links[i]["linkPid"].toString(),
                layerid:'rdLink',
                type:'line',
                style:{}
            })
        }
        highLightFeatures.push({
            id:$scope.rdCrossData.pid.toString(),
            layerid:'relationData',
            type:'relationData',
            style:{}
        });
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
        //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if($scope.rdCrossForm) {
            $scope.rdCrossForm.$setPristine();
        }
    };
    if (objCtrl.data) {
        $scope.initializeRdCrossData();
    }
    $scope.refreshData = function () {
        dsEdit.getByPid(parseInt($scope.rdCrossData.pid), "RDCROSS").then(function(data){
    		if (data) {
                objCtrl.setCurrentObject("RDCROSS", data.data);
                $scope.initializeRdCrossData();
            }
    	});
    };
    $scope.showCrossNames=function(nameItem) {
        var crossNamesObj = {
            "loadType":"subAttrTplContainer",
            "propertyCtrl":appPath.road + 'ctrls/attr_cross_ctrl/namesCtrl',
            "propertyHtml":appPath.root + appPath.road + 'tpls/attr_cross_tpl/namesTpl.html'
        };
        $scope.$emit("transitCtrlAndTpl", crossNamesObj);
        $scope.rdCrossData["oridiRowId"]=nameItem.rowId;
    };

    $scope.addRdCrossName = function () {
        var newName = fastmap.dataApi.rdCrossName({"linkPid": $scope.rdCrossData.pid,"name":"路口名"});
        $scope.rdCrossData.names.unshift(newName)
    };

    $scope.minuscrossName=function(id){
        $scope.rdCrossData.names.splice(id, 1);
    };

    $scope.changeColor=function(index){
        $("#crossnameSpan"+index).css("color","#FFF");
    };
    $scope.backColor=function(index){
        $("#crossnameSpan"+index).css("color","darkgray");
    };

    $scope.save = function () {
        objCtrl.save();
        var param = {
            "command": "UPDATE",
            "type": "RDCROSS",
            "dbId": App.Temp.dbId,
            "data": objCtrl.changedProperty
        };

        if(!objCtrl.changedProperty){
            swal("操作成功",'属性值没有变化！', "success");
            return;
        }

        dsEdit.save(param).then(function (data) {
            var info = [];
            if (data) {
                if (selectCtrl.rowkey) {
                    var stageParam = {
                        "rowkey": selectCtrl.rowkey.rowkey,
                        "stage": 3,
                        "handler": 0

                    };
                    dsFcc.changeDataTipsState(JSON.stringify(stageParam)).then(function(data){
                    	var info = null;
                        if (data.errcode==0) {
                            var sinfo={
                                "op":"修改RDCROSS状态成功",
                                "type":"",
                                "pid": ""
                            };
                            data.data.log.push(sinfo);
                            info=data.data.log;
                        }else{
                            info=[{
                                "op":data.errcode,
                                "type":data.errmsg,
                                "pid": data.errid
                            }];
                        }
                        outPutCtrl.pushOutput(info);
                        if (outPutCtrl.updateOutPuts !== "") {
                            outPutCtrl.updateOutPuts();
                        }
                        selectCtrl.rowkey.rowkey = undefined;
                    });
                }
                var sinfo={
                    "op":"修改RDCROSS成功",
                    "type":"",
                    "pid": ""
                };

                objCtrl.setOriginalData(objCtrl.data.getIntegrate());

                data.data.log.push(sinfo);
                    info=data.data.log;
                }else{
                    info=[{
                        "op":data.errcode,
                        "type":data.errmsg,
                        "pid": data.errid
                    }];
                }
            outPutCtrl.pushOutput(info);
            if (outPutCtrl.updateOutPuts !== "") {
                outPutCtrl.updateOutPuts();
            }
            $scope.refreshData();
        })
    };
    $scope.delete = function () {
        var objId = parseInt($scope.rdCrossData.pid);
        var param = {
            "command": "DELETE",
            "type": "RDCROSS",
            "dbId": App.Temp.dbId,
            "objId": objId
        };
        dsEdit.save(param).then(function (data) {
            if (data) {
                rdcross.redraw();
                $scope.rdCrossData = null;
            }
            if (outPutCtrl.updateOutPuts !== "") {
                outPutCtrl.updateOutPuts();
            }
        })
    };

    $scope.cancel=function(){
    };
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeRdCrossData);
}]);
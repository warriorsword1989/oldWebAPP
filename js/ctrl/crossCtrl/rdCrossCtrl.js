/**
 * Created by liuzhaoxia on 2015/12/11.
 */
var selectApp = angular.module("mapApp", ['oc.lazyLoad']);
selectApp.controller("rdCrossController", function ($scope,$timeout,$ocLazyLoad) {
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var outPutCtrl = fastmap.uikit.OutPutController();
    var highLightLayer = fastmap.uikit.HighLightController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var rdcross = layerCtrl.getLayerById('rdcross');
    var eventController = fastmap.uikit.EventController();
    var selectCtrl = fastmap.uikit.SelectController();
    var highLightLink = new fastmap.uikit.HighLightRender(rdLink, {
        map: map,
        highLightFeature: "linksOfCross",
        initFlag: true
    });
    highLightLayer.pushHighLightLayers(highLightLink);
    $scope.initializeRdCrossData = function () {
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        $scope.rdCrossData = objCtrl.data;
        var links = $scope.rdCrossData.links,linkArr=[];
        for(var i= 0,len=links.length;i<len;i++) {
            linkArr.push(links[i]["linkPid"]);
        }
        highLightLink.drawLinksOfCrossForInit( linkArr, []);
    };
    if (objCtrl.data) {
        $scope.initializeRdCrossData();
    }
    $scope.refreshData = function () {
        Application.functions.getRdObjectById(parseInt($scope.rdCrossData.pid), "RDCROSS", function (data) {
            objCtrl.setCurrentObject("RDCROSS", data.data);
            $scope.initializeRdCrossData();
        })
    };
    $scope.showCrossNames=function(nameItem) {
        var crossNamesObj = {
            "loadType":"subAttrTplContainer",
            "propertyCtrl":'ctrl/crossCtrl/namesOfCrossCtrl',
            "propertyHtml":'js/tepl/crossTepl/namesOfCross.html'
        };
        $scope.$emit("transitCtrlAndTpl", crossNamesObj);
        $scope.rdCrossData["oridiRowId"]=nameItem.rowId;
    };

    $scope.addRdCrossName = function () {
        var newName = fastmap.dataApi.rdcrossname({"linkPid": $scope.rdCrossData.pid,"name":"路口名"});
        $scope.rdCrossData.names.unshift(newName)
    };

    $scope.minuscrossName=function(id){
        $scope.rdCrossData.names.splice(id, 1);
    }

    $scope.changeColor=function(index){
        $("#crossnameSpan"+index).css("color","#FFF");
    }
    $scope.backColor=function(index){
        $("#crossnameSpan"+index).css("color","darkgray");
    }

    $scope.save = function () {
        objCtrl.save();
        var param = {
            "command": "UPDATE",
            "type": "RDCROSS",
            "projectId": Application.projectid,
            "data": objCtrl.changedProperty
        };
        Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
            var info = [];
            if (data.data) {
                if (selectCtrl.rowkey) {
                    var stageParam = {
                        "rowkey": selectCtrl.rowkey.rowkey,
                        "stage": 3,
                        "handler": 0

                    }
                    Application.functions.changeDataTipsState(JSON.stringify(stageParam), function (data) {
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
                    })
                }
                var sinfo={
                    "op":"修改RDCROSS成功",
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
            $scope.refreshData();
        })

    };
    $scope.delete = function () {
        var objId = parseInt($scope.rdCrossData.pid);
        var param = {
            "command": "DELETE",
            "type": "RDCROSS",
            "projectId": Application.projectid,
            "objId": objId
        }
        Application.functions.saveProperty(JSON.stringify(param), function (data) {
            var info = null;
            if (data.errcode==0) {
                rdcross.redraw();
                $scope.rdCrossData = null;
                var sinfo={
                    "op":"删除RDCROSS成功",
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
        })
    }

    $scope.cancel=function(){
    }
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeRdCrossData);
});
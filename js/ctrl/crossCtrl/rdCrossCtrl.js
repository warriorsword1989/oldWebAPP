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
    objCtrl.setOriginalData($.extend(true, {}, objCtrl.data));
    var highLightLink = new fastmap.uikit.HighLightRender(rdLink, {
        map: map,
        highLightFeature: "linksOfCross",
        initFlag: true
    });
    highLightLayer.pushHighLightLayers(highLightLink);
    $scope.initializeRdCrossData = function () {

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
    objCtrl.updateRdCross=function() {
        $scope.initializeRdCrossData();
    };
    $scope.refreshData = function () {
        Application.functions.getRdObjectById(parseInt($scope.rdCrossData.pid), "RDCROSS", function (data) {
            objCtrl.data = data.data;
            $scope.initializeRdCrossData();
        })
    };
    $scope.showNames=function() {
        if(! $scope.$parent.$parent.suspendFlag) {
            $scope.$parent.$parent.suspendFlag = true;
        }
        $scope.$parent.$parent.suspendObjURL = "";
        $ocLazyLoad.load('ctrl/crossCtrl/namesOfCrossCtrl').then(function () {
            $scope.$parent.$parent.suspendObjURL = "js/tepl/crossTepl/namesOfCross.html";
        })
    };

    $scope.$parent.$parent.save = function () {
        objCtrl.setCurrentObject($scope.rdCrossData);
        objCtrl.save();
        var param = {
            "command": "UPDATE",
            "type": "RDCROSS",
            "projectId": 11,
            "data": objCtrl.changedProperty
        };


        Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
            var info = [];
            if (data.data) {
                if ($scope.$parent.$parent.rowkeyOfDataTips !== undefined) {
                    var stageParam = {
                        "rowkey": $scope.$parent.$parent.rowkeyOfDataTips,
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
                        $scope.$parent.$parent.rowkeyOfDataTips = undefined;
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
    $scope.$parent.$parent.delete = function () {
        var objId = parseInt($scope.rdCrossData.pid);
        var param = {
            "command": "DELETE",
            "type": "RDCROSS",
            "projectId": 11,
            "objId": objId
        }
        Application.functions.saveProperty(JSON.stringify(param), function (data) {
            var info = null;
            if (data.errcode==0) {
                rdcross.redraw();
                $scope.rdCrossData = null;
                $scope.$parent.$parent.objectEditURL = "";
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

    $scope.$parent.$parent.cancel=function(){
        $scope.$parent.$parent.panelFlag = false;
        $scope.$parent.$parent.objectFlag = false;
        $scope.$parent.$parent.objectEditURL="";
    }
});
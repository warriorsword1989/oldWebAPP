/**
 * Created by zhaohang on 2016/4/7.
 */

var rdGscApp = angular.module("lazymodule", []);
rdGscApp.controller("rdGscController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();

    var test = {"pid":66666, "geometry":"56.66,77.98","processFlag":1,"links":[
            {
                "pid":66666,"zlevel":1,"linkPid":1121,"startEnd":1,"tableName":"RD_LINK"
            },
            {
                "pid":66666,"zlevel":2,"linkPid":2332,"startEnd":2,"tableName":"LC_LINK "
            }
        ]};

    /*处理标识*/
    $scope.processFlag = [
        {"id": 0, "label": "无"},
        {"id": 1, "label": "人工赋值"},
        {"id": 2, "label": "程序赋值"},
        {"id": 3, "label": "特殊处理"}

    ];
    $scope.zlevel = [
        {"id": 0, "label": "0"},
        {"id": 1, "label": "1"},
        {"id": 2, "label": "2"}
    ];
    $scope.tableName = [
        {"id": "RD_LINK", "label": "RD_LINK"},
        {"id": "LC_LINK ", "label": "LC_LINK "},
        {"id": "RW_LINK", "label": "RW_LINK"},
        {"id": "CMG_BUILDLINK", "label": "CMG_BUILDLINK"}
    ];
    $scope.initializeData = function(){
        var gscData = fastmap.dataApi.rdgsc(test);
        objCtrl.data = gscData;
        $scope.reGscData = objCtrl.data;
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
    };
    $scope.initializeData();

    $scope.save = function(){
        objCtrl.save();
        var param = {
            "command": "UPDATE",
            "type": "RDGSC",
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
                                "op":"修改RDGSC状态成功",
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
                    "op":"修改RDGSC成功",
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

    $scope.delete = function(){
        var objId = parseInt($scope.rdCrossData.pid);
        var param = {
            "command": "DELETE",
            "type": "RDGSC",
            "projectId": Application.projectid,
            "objId": objId
        }
        Application.functions.saveProperty(JSON.stringify(param), function (data) {
            var info = null;
            if (data.errcode==0) {
                rdcross.redraw();
                $scope.rdCrossData = null;
                var sinfo={
                    "op":"删除RDGSC成功",
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
    };
    $scope.cancel = function(){

    };

    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeData);
})
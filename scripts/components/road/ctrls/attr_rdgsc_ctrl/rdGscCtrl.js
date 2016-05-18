/**
 * Created by zhaohang on 2016/4/7.
 */

var rdGscApp = angular.module("mapApp");
rdGscApp.controller("rdGscController",function($scope) {
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var rdgsc = layerCtrl.getLayerById('rdGsc');
    var selectCtrl = fastmap.uikit.SelectController();
    var outPutCtrl = fastmap.uikit.OutPutController();
    // var highRenderCtrl = fastmap.uikit.HighRenderController();
    $scope.initializeData = function(){
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        $scope.reGscData = objCtrl.data;
        var links = $scope.reGscData.links,highLightFeatures=[];
        for(var i= 0,len=links.length;i<len;i++) {
            highLightFeatures.push({
                id: links[i]["linkPid"].toString(),
                layerid:'referenceLine',
                type:'rdgsc',
                index:links[i].zlevel,
                style:{
                    size:5
                }
            })
        }
        /*highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();*/


        if($(".ng-dirty")) {
            $.each($('.ng-dirty'), function (i, v) {
                if($scope.rdGscForm!=undefined) {
                    $scope.rdGscForm.$setPristine();
                }
            });

        }
    };
    $scope.initializeData();
    $scope.refreshData = function () {
        Application.functions.getRdObjectById(parseInt($scope.reGscData.pid), "RDGSC", function (data) {
            objCtrl.setCurrentObject("RDGSC", data.data);
            $scope.initializeData();
        })
    };
    /*处理标识*/
    $scope.processFlag = [
        {"id": 0, "label": "无"},
        {"id": 1, "label": "人工赋值"},
        {"id": 2, "label": "程序赋值"},
        {"id": 3, "label": "特殊处理"}

    ];
    $scope.getLevels = function(){
        $scope.zlevel = [];
        for(var i=0;i<$scope.reGscData.links.length;i++){
            $scope.zlevel.push({id:i,label:i});
        }
    }
    $scope.getLevels();

    $scope.tableName = [
        {"id": "rd_link", "label": "RD_LINK"},
        {"id": "lc_link ", "label": "LC_LINK "},
        {"id": "rw_link", "label": "RW_LINK"},
        {"id": "cmg_buildlink", "label": "CMG_BUILDLINK"},
        {"id": "rd_gsc_link", "label": "RD_GSC_LINK"}
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

                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                data.data.log.push(sinfo);
                info=data.data.log;
                rdgsc.redraw();
                swal("操作成功", "修改立交成功！", "success");
            }else{
                info=[{
                    "op":data.errcode,
                    "type":data.errmsg,
                    "pid": data.errid
                }];
                swal("操作失败", "问题原因：" + data.errmsg, "error");
            }
            outPutCtrl.pushOutput(info);
            if (outPutCtrl.updateOutPuts !== "") {
                outPutCtrl.updateOutPuts();
            }
            $scope.refreshData();
        })
    };

    $scope.delete = function(){
        var objId = parseInt($scope.reGscData.pid);
        var param = {
            "command": "DELETE",
            "type": "RDGSC",
            "projectId": Application.projectid,
            "objId": objId
        }
        Application.functions.saveProperty(JSON.stringify(param), function (data) {
            var info = null;
            if (data.errcode==0) {
                rdgsc.redraw();
                $scope.reGscData = null;
                var sinfo={
                    "op":"删除RDGSC成功",
                    "type":"",
                    "pid": ""
                };
                data.data.log.push(sinfo);
                info=data.data.log;
                rdgsc.redraw();
                swal("删除成功", "删除RDGSC成功！", "success");
            }else{
                info=[{
                    "op":data.errcode,
                    "type":data.errmsg,
                    "pid": data.errid
                }];
                swal("删除失败", "问题原因：" + data.errmsg, "error");
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
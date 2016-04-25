/**
 * Created by zhaohang on 2016/4/25.
 */
var adNodeApp = angular.module("lazymodule", []);
adNodeApp.controller("adNodeController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var adLink = layerCtrl.getLayerById("referenceLine");
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var editLayer = layerCtrl.getLayerById('edit');
    var toolTipsCtrl = fastmap.uikit.ToolTipsController();
    var outputCtrl = fastmap.uikit.OutPutController({});
    $scope.form = [
        {"id": 0, "label": "无"},
        {"id": 1, "label": "图廓点"},
        {"id": 7, "label": "角点"}
    ];
    $scope.editFlag = [
        {"id": 0, "label": "不可编辑"},
        {"id": 1, "label": "可编辑"}
    ];

    $scope.initializeData = function(){
        $scope.adNodeData = objCtrl.data;
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
    };
    $scope.initializeData();

    $scope.save = function(){
        objCtrl.save();
        var param = {
            "command": "UPDATE",
            "type":"ADNODE",
            "projectId": Application.projectid,
            "data": objCtrl.changedProperty
        }
        if(!objCtrl.changedProperty){
            swal("操作失败", '沒有做任何操作', "error");
            return;
        }
        if(objCtrl.changedProperty && objCtrl.changedProperty.forms && objCtrl.changedProperty.forms.length > 0){
            $.each(objCtrl.changedProperty.forms,function(i,v){
                if(v.linkPid || v.pid){
                    delete v.linkPid;
                    delete v.pid;
                }
            });
            objCtrl.changedProperty.forms.filter(function(v){
                return v;
            });
        }

        Application.functions.saveProperty(JSON.stringify(param), function (data) {
            var restrict = layerCtrl.getLayerById("referenceLine");
            restrict.redraw();
            var info = null;
            if (data.errcode==0) {
                swal("操作成功",'保存成功！', "success");
                var sinfo={
                    "op":"修改ADNODE成功",
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
            outputCtrl.pushOutput(info);
            if(outputCtrl.updateOutPuts!=="") {
                outputCtrl.updateOutPuts();
            }
        });
    };
    $scope.delete = function(){

    };
    $scope.cancel = function(){

    };

    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeData);
})

/**
 * Created by zhaohang on 2016/4/5.
 */
var adLinkApp = angular.module("lazymodule", []);
adLinkApp.controller("adLinkController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var adLink = layerCtrl.getLayerById("referenceLine");
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var editLayer = layerCtrl.getLayerById('edit');
    var toolTipsCtrl = fastmap.uikit.ToolTipsController();
    var outputCtrl = fastmap.uikit.OutPutController({});
    $scope.form = [
        {"id": 0, "label": "未调查"},
        {"id": 1, "label": "无属性"},
        {"id": 2, "label": "海岸线"},
        {"id": 6, "label": "特别行政区界(K)"},
        {"id": 7, "label": "特别行政区界(G)"},
        {"id": 8, "label": "未定行政区划界"},
        {"id": 9, "label": "南海诸岛范围线"},

    ];
    $scope.scale = [
        {"id": 0, "label": "2.5w"},
        {"id": 1, "label": "20w"},
        {"id": 2, "label": "100w"}
    ];

    $scope.initializeData = function(){
       /* var linkData = fastmap.dataApi.adLink(test);
        objCtrl.data = linkData;*/
        $scope.adLinkData = objCtrl.data;
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
    };
    $scope.initializeData();

    $scope.save = function(){
        objCtrl.save();
        if(objCtrl.changedProperty.limits){
            if(objCtrl.changedProperty.limits.length > 0){
                $.each(objCtrl.changedProperty.limits,function(i,v){
                    delete v.pid;
                });
            }
        }
        if(objCtrl.changedProperty.limitTrucks){
            if(objCtrl.changedProperty.limitTrucks.length > 0){
                $.each(objCtrl.changedProperty.limitTrucks,function(i,v){
                    delete v.pid;
                });
            }
        }
        var param = {
            "command": "UPDATE",
            "type":"ADLINK",
            "projectId": Application.projectid,
            "data": objCtrl.changedProperty
        };
        Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
            var info = null;
            if (data.errcode==0) {
                adLink.redraw();
                if(shapeCtrl.shapeEditorResult.getFinalGeometry()!==null) {
                    if (typeof map.currentTool.cleanHeight === "function") {
                        map.currentTool.cleanHeight();
                    }
                    if (toolTipsCtrl.getCurrentTooltip()) {
                        toolTipsCtrl.onRemoveTooltip();
                    }
                    editLayer.drawGeometry = null;
                    editLayer.clear();
                    shapeCtrl.stopEditing();
                    editLayer.bringToBack();
                    $(editLayer.options._div).unbind();
                }
                swal("操作成功",'保存成功！', "success");
                var sInfo={
                    "op":"修改道路link成功",
                    "type":"",
                    "pid": ""
                };
                data.data.log.push(sInfo);
                for(var i=0; i<data.data.log.length-1;i++){
                    if(data.data.log[i].rowId){
                        data.data.log[i].rowId=$scope.linkData.pid;
                    }

                }

                info=data.data.log;

            } else {
                swal("操作失败", data.errmsg, "error");
                info=[{
                    "op":data.errcode,
                    "type":data.errmsg,
                    "pid": data.errid
                }];
            }
            outputCtrl.pushOutput(info);
            if (outputCtrl.updateOutPuts !== "") {
                outputCtrl.updateOutPuts();
            }
        })
    };

    $scope.delete = function(){
        var objId = parseInt($scope.adLinkData.pid);
        var param = {
            "command": "DELETE",
            "type":"ADLINK",
            "projectId": Application.projectid,
            "objId": objId
        }
        Application.functions.saveProperty(JSON.stringify(param), function (data) {
            var info = null;
            if (data.errcode==0) {
                var sinfo={
                    "op":"删除行政区划线成功",
                    "type":"",
                    "pid": ""
                };
                data.data.log.push(sinfo);
                info=data.data.log;
                outputCtrl.pushOutput(info);
                if (outputCtrl.updateOutPuts !== "") {
                    outputCtrl.updateOutPuts();
                }
            }else{
                info=[{
                    "op":data.errcode,
                    "type":data.errmsg,
                    "pid": data.errid
                }];
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
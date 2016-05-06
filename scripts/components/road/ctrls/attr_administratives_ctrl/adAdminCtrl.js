/**
 * Created by zhaohang on 2016/4/5.
 */
var adAdminZone = angular.module("lazymodule", ['ui.tree', 'ngRoute', 'ui.bootstrap']);
adAdminZone.controller("adAdminController",function($scope,$timeout,$document) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var outputCtrl = fastmap.uikit.OutPutController({});
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var editLayer = layerCtrl.getLayerById('edit');
    var adAdmin = layerCtrl.getLayerById("adAdmin");
    var selectCtrl = fastmap.uikit.SelectController();
    var hLayer = layerCtrl.getLayerById('highlightlayer');
    $scope.isbase=true;

    $scope.adminType = [
        {"id": 0, "label": "国家地区级"},
        {"id": 1, "label": "省/直辖市/自治区"},
        {"id": 2, "label": "地级市/自治州/省直辖县"},
        {"id": 2.5, "label": "DUMMY 地级市"},
        {"id": 3, "label": "地级市市区(GCZone)"},
        {"id": 3.5, "label": "地级市市区(未作区界)"},
        {"id": 4, "label": "区县/自治县"},
        {"id": 4.5, "label": "DUMMY 区县"},
        {"id": 4.8, "label": "DUMMY 区县(地级市下无区县)"},
        {"id": 5, "label": "区中心部"},
        {"id": 6, "label": "城镇/街道"},
        {"id": 7, "label": "飞地"},
        {"id": 8, "label": "KDZone"},
        {"id": 9, "label": "AOI"}
    ];
    $scope.capital = [
        {"id": 0, "label": "未定义"},
        {"id": 1, "label": "首都"},
        {"id": 2, "label": "省会/直辖市"},
        {"id": 3, "label": "地级市"}
    ];
    $scope.population = [
        {"id": "0", "label": "100w"},
        {"id": "1", "label": "200w"}

    ];

    $scope.initializeData = function(){
        $scope.adAdminData = objCtrl.data;
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        var linkArr =$scope.adAdminData.geometry.coordinates, points = [];
        var points = fastmap.mapApi.point(linkArr[0], linkArr[1]);
        selectCtrl.onSelected({
            geometry: points,
            id: $scope.adAdminData.pid
        });

        var highLightFeatures=[];
        highLightFeatures.push({
            id:$scope.adAdminData.pid.toString(),
            layerid:'adAdmin',
            type:'adadmin',
            style:{src: '../../images/road/img/heightStar.svg'}
        })
        var highLightRender = new fastmap.uikit.HighLightRender(hLayer);
        highLightRender.highLightFeatures = highLightFeatures;
        highLightRender.drawHighlight();
    };
    if(objCtrl.data){
        $scope.initializeData();
    }

    $scope.cancel = function(){

    };




    $scope.otherAdminName=function(){
        var showOtherObj={
            "loadType":"subAttrTplContainer",
            "propertyCtrl":'components/road/ctrls/attr_administratives_ctrl/adAdminNameCtrl',
            "propertyHtml":'../../scripts/components/road/tpls/attr_adminstratives_tpl/adAdminNameTpl.html'
        }
        $scope.$emit("transitCtrlAndTpl", showOtherObj);
    }

    $scope.openTree=function(){
            var showOrdinaryObj={
                "loadType":"subAttrTplContainer",
                "propertyCtrl":'components/road/ctrls/attr_administratives_ctrl/adAdminOfLevelCtrl',
                "propertyHtml":'../../scripts/components/road/tpls/attr_adminstratives_tpl/adAdminOfLevelTpl.html'
            }
            $scope.$emit("transitCtrlAndTpl", showOrdinaryObj);
    }

    $scope.save = function(){
        objCtrl.save();
        var param = {
            "command": "UPDATE",
            "type":"ADADMIN",
            "projectId": Application.projectid,
            "data": objCtrl.changedProperty
        };

        if(!objCtrl.changedProperty){
            swal("操作成功",'属性值没有变化！', "success");
            return;
        }
        Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
            var info = null;
            if (data.errcode==0) {
                adAdmin.redraw();
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

                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                var sInfo={
                    "op":"修改行政区划代表点成功",
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
        var objId = parseInt($scope.adAdminData.regionId);
        var param = {
            "command": "DELETE",
            "type":"ADADMIN",
            "projectId": Application.projectid,
            "objId": objId
        }
        Application.functions.saveProperty(JSON.stringify(param), function (data) {
            var info = null;
            if (data.errcode==0) {
                adAdmin.redraw();
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
                var sinfo={
                    "op":"删除行政区划代表点成功",
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

    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeData);


})

/**
 * Created by wuz on 2016/6/24.
 */
var rwLinkZone = angular.module("app");
rwLinkZone.controller("rwLinkController",["$scope" , "appPath","dsEdit",function($scope,appPath,dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var layerCtrl = fastmap.uikit.LayerController();
    var selectCtrl = fastmap.uikit.SelectController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var toolTipsCtrl = fastmap.uikit.ToolTipsController();
    var editLayer = layerCtrl.getLayerById('edit');
    var rwLink = layerCtrl.getLayerById("rwLink");
    var rwNode = layerCtrl.getLayerById("rwNode");


    $scope.kind = [
        {"id": 1, "label": "铁路"},
        {"id": 2, "label": "磁悬浮"},
        {"id": 3, "label": "地铁/轻轨"}
    ];
    $scope.form = [
        {"id": 0, "label": "无"},
        {"id": 1, "label": "桥"},
        {"id": 2, "label": "隧道"}
    ];
    $scope.scale = [
        {"id": 0, "label": "2.5w"},
        {"id": 1, "label": "20w"},
        {"id": 2, "label": "100w"}
    ];
    $scope.detailFlag = [
        {"id": 0, "label": "不应用"},
        {"id": 1, "label": "只存在于详细区域"},
        {"id": 2, "label": "只存在于广域区域"},
        {"id": 3, "label": "存在于详细和广域区域"}
    ];


    $scope.initializeData = function(){
        $scope.rwLinkData = objCtrl.data;
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());

        var linkArr = $scope.rwLinkData.geometry.coordinates,points = [];
        for (var i = 0, len = linkArr.length; i < len; i++){
            var pointOfLine = fastmap.mapApi.point(linkArr[i][0],linkArr[i][1]);
            points.push(pointOfLine);
        }
        var line = fastmap.mapApi.lineString(points);
        selectCtrl.onSelected({
            geometry:line,
            id:$scope.rwLinkData.pid
        });
        var highLightFeatures = [];
        highLightFeatures.push({
            id:$scope.rwLinkData.pid.toString(),
            layerid:'rwLink',
            type:'line',
            style:{}
        });
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
    };


    $scope.save = function(){
        objCtrl.save();
        var chaged =  objCtrl.changedProperty;
        if(!chaged){
            swal("保存提示", '属性值没有变化，不需要保存！', "info");
            return ;
        }
        if(objCtrl.data.names){
            for (var i = 0 ,len = objCtrl.data.names.length; i < len ; i ++){
                if(!objCtrl.data.names[i].nameGroupid){
                    swal("保存提示", '名称组号存在为空，不能保存！', "info");
                    return
                }
            }
        }
        //console.info(objCtrl.changedProperty);
        dsEdit.update($scope.rwLinkData.pid, "RWLINK", chaged).then(function(data) {
            if (data) {
                rwLink.redraw();
                if (shapeCtrl.shapeEditorResult.getFinalGeometry() !== null) {
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
                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
            }
        })
    };

    $scope.delete = function(){
        dsEdit.delete($scope.rwLinkData.pid, "RWLINK").then(function(data) {
            if (data) {
                rwLink.redraw();
                rwNode.redraw();
                $scope.rwLinkData = null;
                highRenderCtrl._cleanHighLight();
                highRenderCtrl.highLightFeatures.length = 0;
                editLayer.clear();
                $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false})
            }
        });
    };
    $scope.cancel = function(){

    };

    // $scope.rwLinkName=function(){
    //     var showOtherObj={
    //         "loadType":"subAttrTplContainer",
    //         "propertyCtrl": appPath.road + 'ctrls/attr_administratives_ctrl/adAdminNameCtrl',
    //         "propertyHtml": appPath.root + appPath.road + 'tpls/attr_adminstratives_tpl/adAdminNameTpl.html'
    //     }
    //     $scope.$emit("transitCtrlAndTpl", showOtherObj);
    // };
    /**
     * 增加铁路名
     */
    $scope.addRdName = function () {
        var newName = fastmap.dataApi.rwLinkName({"linkPid": $scope.rwLinkData.pid});
        $scope.rwLinkData.names.unshift(newName);
    };

    $scope.minusName = function (id) {
        $scope.rwLinkData.names.splice(id, 1);
    };
    $scope.changeColor = function (ind, ord) {
        $("#nameSpan" + ind).css("color", "#FFF");
    };
    $scope.backColor = function (ind, ord) {
        $("#nameSpan" + ind).css("color", "darkgray");
    };
    $scope.showNames = function (nameItem,index) {
        objCtrl.data.rwName = objCtrl.data.names[index]; //将需要编辑的name保存在rwName中
        var showNamesObj = {
            "loadType":"subAttrTplContainer",
            "propertyCtrl": appPath.road + 'ctrls/attr_link_ctrl/namesOfRwDetailCtrl',
            "propertyHtml": appPath.root + appPath.road + 'tpls/attr_link_tpl/namesOfRwDetailTpl.html',
            callback:function (){
                eventController.fire('CHANGELINKNAME',{});
            }
        };
        $scope.$emit("transitCtrlAndTpl", showNamesObj);
    };

    /**
     * 初始化方法执行
     */
    if (objCtrl.data) {
        $scope.initializeData();
    }

    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeData);
}]);

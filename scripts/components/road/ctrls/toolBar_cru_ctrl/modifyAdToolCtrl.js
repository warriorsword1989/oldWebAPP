/**
 * Created by zhaohang on 2016/4/12.
 */
var modifyAdApp = angular.module("lazymodule", []);
modifyAdApp.controller("modifyAdToolController", function ($scope) {
    var selectCtrl = fastmap.uikit.SelectController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var layerCtrl = fastmap.uikit.LayerController();
    var adLink = layerCtrl.getLayerById('adLink');
    var tooltipsCtrl=fastmap.uikit.ToolTipsController();
    var editLayer = layerCtrl.getLayerById('edit');

    map.currentTool = shapeCtrl.getCurrentTool();
    $scope.type = "";
    $scope.modifyShape = function (type, num,event) {
        event.stopPropagation();
        $scope.$emit("SWITCHCONTAINERSTATE",
            {
                "attrContainerTpl":false,
                "subAttrContainerTpl":false
            })
        $("#popoverTips").hide();
        if (shapeCtrl.getCurrentTool()['options']) {
            shapeCtrl.stopEditing();
        }
        var feature = null;
        $scope.changeBtnClass(num);
        if(!$scope.classArr[num]){
            map.currentTool.disable();
            map._container.style.cursor = '';
            return;
        }
        map.currentTool.disable();
        if (shapeCtrl.shapeEditorResult) {
            if(tooltipsCtrl.getCurrentTooltip()){
                tooltipsCtrl.onRemoveTooltip();
            }
            if(type==="pathVertexInsert") {
                if(selectCtrl.selectedFeatures){
                    tooltipsCtrl.setEditEventType('insertDot');
                    tooltipsCtrl.setCurrentTooltip('开始插入形状点！');
                }else{
                    tooltipsCtrl.setCurrentTooltip('正要插入形状点,先选择线！');
                    return;
                }
            }else if(type==="pathVertexReMove") {
                if(selectCtrl.selectedFeatures){
                    tooltipsCtrl.setEditEventType('deleteDot');
                    tooltipsCtrl.setCurrentTooltip('删除此形状点！');
                }else{
                    tooltipsCtrl.setCurrentTooltip('正要删除形状点,先选择线！');
                    return;
                }
            }else if(type==="pathVertexMove") {
                if(selectCtrl.selectedFeatures){
                    tooltipsCtrl.setEditEventType('moveDot');
                    tooltipsCtrl.setCurrentTooltip('拖拽修改形状点位置！');
                }else{
                    tooltipsCtrl.setCurrentTooltip('正要移动形状点先选择线！');
                    return;
                }
            }else if(type==="pathBreak") {
                if(selectCtrl.selectedFeatures){
                    tooltipsCtrl.setEditEventType('pathBreak');
                    tooltipsCtrl.setCurrentTooltip('开始打断link！');

                }else{
                    tooltipsCtrl.setCurrentTooltip('正要开始打断link,先选择线！');
                    return;
                }
            }else if(type==="pathNodeMove") {
                if(selectCtrl.selectedFeatures){
                    tooltipsCtrl.setEditEventType('pathNodeMove');
                    tooltipsCtrl.setCurrentTooltip('开始移动node！');
                }
            }else if(type === 'naviTool'){
                map._container.style.cursor = '';

                editLayer.drawGeometry = null;
                shapeCtrl.stopEditing();
                editLayer.bringToBack();
                map.currentTool.disable();
                editLayer.clear();
                shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
                return;
            }
            if (!selectCtrl.selectedFeatures){
                return;
            }
            feature = selectCtrl.selectedFeatures.geometry;
            layerCtrl.pushLayerFront('edit');
            var sObj = shapeCtrl.shapeEditorResult;
            editLayer.drawGeometry = feature;
            editLayer.draw(feature, editLayer);
            sObj.setOriginalGeometry(feature);
            sObj.setFinalGeometry(feature);

            shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType[type]);
            map.currentTool.snapHandler.addGuideLayer(adLink);
            shapeCtrl.startEditing();
            shapeCtrl.on("startshapeeditresultfeedback",saveOrEsc);
            shapeCtrl.on("stopshapeeditresultfeedback",function(){
                shapeCtrl.off("startshapeeditresultfeedback",saveOrEsc);
            });
            function saveOrEsc (event) {
                if(event.changeTooltips){
                    tooltipsCtrl.setStyleTooltip("color:black;");
                    tooltipsCtrl.setChangeInnerHtml("点击空格键保存操作或者按ESC键取消!");
                }

            }

        }

    };
})
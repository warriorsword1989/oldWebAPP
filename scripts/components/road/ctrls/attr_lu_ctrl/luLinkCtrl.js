/**
 * Created by mali on 2016/7/22.
 */
angular.module("app").controller("luLinkController",["$scope","dsEdit" , function($scope,dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var luLink = layerCtrl.getLayerById("luLink");
    var luNode=layerCtrl.getLayerById("luNode");
    var luFace=layerCtrl.getLayerById("luFace");
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var editLayer = layerCtrl.getLayerById('edit');
    var toolTipsCtrl = fastmap.uikit.ToolTipsController();
    var outputCtrl = fastmap.uikit.OutPutController({});
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.kind = [
        {"id": 0, "label": "假想线"},
        {"id": 1, "label": "AOIZONE边界线"},
        {"id": 2, "label": "KDZONE边界线"}
    ];
    $scope.form = [
        {"id": 0, "label": "未调查"},
        {"id": 1, "label": "无属性"}
    ];
    $scope.scale = [
        {"id": 0, "label": "2.5w"},
        {"id": 1, "label": "20w"},
        {"id": 2, "label": "100w"}
    ];

    //初始化
    $scope.initializeData = function(){
        $scope.luLinkData = objCtrl.data;
        //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if($scope.luLinkForm) {
            $scope.luLinkForm.$setPristine();
        }

        objCtrl.setOriginalData(objCtrl.data.getIntegrate());//存储原始数据
        var linkArr =$scope.luLinkData.geometry.coordinates, points = [];
        for (var i = 0, len = linkArr.length; i < len; i++) {
            var pointOfLine = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
            points.push(pointOfLine);
        }
        var line = fastmap.mapApi.lineString(points);
        selectCtrl.onSelected({//存储选择数据信息
            geometry: line,
            id: $scope.luLinkData.pid
        });
        var highLightFeatures = [];
        highLightFeatures.push({
            id:$scope.luLinkData.pid.toString(),
            layerid:'luLink',
            type:'line',
            style:{}
        });
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
    };
    if (objCtrl.data) {
        $scope.initializeData();
    }
    //保存
    $scope.save = function(){
        objCtrl.save();
        var changed = objCtrl.changedProperty;
        if(!changed){
            swal("操作成功",'属性值没有变化！', "success");
            return;
        }
        //保存调用方法
        dsEdit.update($scope.luLinkData.pid, "LULINK", changed).then(function(data) {
            if (data) {
                // zoneLink.redraw();//线重绘
                // zoneNode.redraw();//点重绘
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

    //删除
    $scope.delete = function(){
        dsEdit.delete($scope.luLinkData.pid, "LULINK").then(function(data) {
            if (data) {
                luLink.redraw();//线重绘
                luNode.redraw();//点重绘
                luFace.redraw();
                $scope.luLinkData = null;
                highRenderCtrl._cleanHighLight();
                highRenderCtrl.highLightFeatures.length = 0;
                if (map.floatMenu) {
                    map.removeLayer(map.floatMenu);
                    map.floatMenu = null;
                }
                var editorLayer = layerCtrl.getLayerById("edit");
                editorLayer.clear();
                $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false})
            }
        });
    };
    $scope.cancel = function(){

    };

    //监听保存，修改,删除，取消，和初始化
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeData);
}]);
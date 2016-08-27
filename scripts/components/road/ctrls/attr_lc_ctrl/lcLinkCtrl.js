/**
 * Created by linglong on 2016/8/12.
 */
angular.module("app").controller("lcLinkController",["$scope","dsEdit" , function($scope,dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var lcLink = layerCtrl.getLayerById("lcLink");
    var lcNode=layerCtrl.getLayerById("lcNode");
    var lcFace=layerCtrl.getLayerById("lcFace");
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var editLayer = layerCtrl.getLayerById('edit');
    var toolTipsCtrl = fastmap.uikit.ToolTipsController();
    var outputCtrl = fastmap.uikit.OutPutController({});
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.lcLinkData = null;
    $scope.kind = [
        {"id": 0, "label": "未分类"},
        {"id": 1, "label": "海岸线"},
        {"id": 2, "label": "河川"},
        {"id": 3, "label": "湖沼地"},
        {"id": 4, "label": "水库"},
        {"id": 5, "label": "港湾"},
        {"id": 6, "label": "运河"},
        {"id": 7, "label": "单线河"},
        {"id": 8, "label": "水系假想线"},
        {"id": 11, "label": "公园"},
        {"id": 12, "label": "高尔夫球场"},
        {"id": 13, "label": "滑雪场"},
        {"id": 14, "label": "树林林地"},
        {"id": 15, "label": "草地"},
        {"id": 16, "label": "绿化带"},
        {"id": 17, "label": "岛"},
        {"id": 18, "label": "绿地假象线"}
    ];
    $scope.form = [
        {"id": 0, "label": "未调查"},
        {"id": 1, "label": "暗沙"},
        {"id": 2, "label": "浅滩"},
        {"id": 3, "label": "珊瑚礁"},
        {"id": 4, "label": "礁"},
        {"id": 8, "label": "湖泊(国界内)"},
        {"id": 9, "label": "湖泊(国界外)"},
        {"id": 10, "label": "界河"}
    ];
    //初始化
    $scope.initializeData = function(){
        $scope.lcLinkData = objCtrl.data;
        //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if($scope.lcLinkForm) {
            $scope.lcLinkForm.$setPristine();
        }
        //存储原始数据
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());

        var linkArr =$scope.lcLinkData.geometry.coordinates, points = [];
        for (var i = 0, len = linkArr.length; i < len; i++) {
            var pointOfLine = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
            points.push(pointOfLine);
        }
        var line = fastmap.mapApi.lineString(points);
        selectCtrl.onSelected({//存储选择数据信息
            geometry: line,
            id: $scope.lcLinkData.pid
        });

        //高亮新增的lclink
        var highLightFeatures = [];
        highLightFeatures.push({
            id:$scope.lcLinkData.pid.toString(),
            layerid:'lcLink',
            type:'line',
            style:{}
        });
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
    };

    //保存
    $scope.save = function(){
        objCtrl.save();
        var changed = objCtrl.changedProperty;
        if(!changed){
            swal("操作成功",'属性值没有变化！', "success");
            return;
        }
        //保存调用方法
        dsEdit.update($scope.lcLinkData.pid, "LCLINK", changed).then(function(data) {
            if (data) {
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
                if($scope.lcLinkForm) {
                    $scope.lcLinkForm.$setPristine();
                }
            }
        })
    };

    //删除
    $scope.delete = function(){
        dsEdit.delete($scope.lcLinkData.pid, "LCLINK").then(function(data) {
            if (data) {
                //重绘点线面;
                lcLink.redraw();
                lcNode.redraw();
                lcFace.redraw();
                $scope.lcLinkData = null;
                highRenderCtrl._cleanHighLight();
                highRenderCtrl.highLightFeatures.length = 0;
                if (map.floatMenu) {
                    map.removeLayer(map.floatMenu);
                    map.floatMenu = null;
                }
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
    if (objCtrl.data) {
        $scope.initializeData();
    }
}]);
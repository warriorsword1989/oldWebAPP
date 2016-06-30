/**
 * Created by zhaohang on 2016/4/5.
 */
var adLinkApp = angular.module("app");
adLinkApp.controller("adLinkController",["$scope","dsEdit" , function($scope,dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var adLink = layerCtrl.getLayerById("adLink");
    var adNode=layerCtrl.getLayerById("adnode");
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var editLayer = layerCtrl.getLayerById('edit');
    var toolTipsCtrl = fastmap.uikit.ToolTipsController();
    var outputCtrl = fastmap.uikit.OutPutController({});
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.kind = [
        {"id": 0, "label": "假想线"},
        {"id": 1, "label": "省,直辖市边界"},
        {"id": 2, "label": "市行政区界"},
        {"id": 3, "label": "区县边界"},
        {"id": 4, "label": "乡镇边界"},
        {"id": 5, "label": "村边界"},
        {"id": 6, "label": "国界"},
        {"id": 7, "label": "百万产品范围框"}

    ];
    $scope.form = [
        {"id": 0, "label": "未调查"},
        {"id": 1, "label": "无属性"},
        {"id": 2, "label": "海岸线"},
        {"id": 6, "label": "特别行政区界(K)"},
        {"id": 7, "label": "特别行政区界(G)"},
        {"id": 8, "label": "未定行政区划界"},
        {"id": 9, "label": "南海诸岛范围线"}

    ];
    $scope.scale = [
        {"id": 0, "label": "2.5w"},
        {"id": 1, "label": "20w"},
        {"id": 2, "label": "100w"}
    ];

    //初始化
    $scope.initializeData = function(){
        $scope.adLinkData = objCtrl.data;
        //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if($scope.adLinkForm) {
            $scope.adLinkForm.$setPristine();
        }

        objCtrl.setOriginalData(objCtrl.data.getIntegrate());//存储原始数据
        var linkArr =$scope.adLinkData.geometry.coordinates, points = [];
        for (var i = 0, len = linkArr.length; i < len; i++) {
            var pointOfLine = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
            points.push(pointOfLine);
        }
        var line = fastmap.mapApi.lineString(points);
        selectCtrl.onSelected({//存储选择数据信息
            geometry: line,
            id: $scope.adLinkData.pid
        });
        var highLightFeatures = [];
        highLightFeatures.push({
            id:$scope.adLinkData.pid.toString(),
            layerid:'adLink',
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
        if(!objCtrl.changedProperty){
            swal("操作成功",'属性值没有变化！', "success");
            return;
        }
        //保存调用方法
        dsEdit.update($scope.adLinkData.pid, "ADLINK", objCtrl.changedProperty).then(function(data) {
            if (data) {
                adLink.redraw();//线重绘
                adNode.redraw();//点重绘
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
        dsEdit.delete($scope.adLinkData.pid, "ADLINK").then(function(data) {
            if (data) {
                adLink.redraw();//线重绘
                adNode.redraw();//点重绘
                $scope.adLinkData = null;
                highRenderCtrl._cleanHighLight();
                highRenderCtrl.highLightFeatures.length = 0;
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
}])
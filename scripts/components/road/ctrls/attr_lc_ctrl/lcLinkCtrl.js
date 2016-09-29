/**
 * Created by linglong on 2016/8/12.
 */
angular.module("app").controller("lcLinkController",["$scope","dsEdit",'$ocLazyLoad' , function($scope,dsEdit,$ocLazyLoad) {
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
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
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

    $scope.showPopover=function(){
        var showPopoverObj = {
            "loadType":"subAttrTplContainer",
            "propertyCtrl":'scripts/components/road/ctrls/attr_lc_ctrl/lcLinkTypeCtrl',
            "propertyHtml":'../../../scripts/components/road/tpls/attr_lc_tpl/lcLinkType.html'
        };
        $scope.$emit('transitCtrlAndTpl', showPopoverObj);
        eventController.fire(eventController.eventTypes.SELECTEDVEHICLECHANGE)
    }



    //监听保存，修改,删除，取消，和初始化
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeData);
    if (objCtrl.data) {
        $scope.initializeData();
    }
}]);
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
        {"id": 0, "label": "未分类"},
        {"id": 1, "label": "大学"},
        {"id": 2, "label": "购物中心"},
        {"id": 3, "label": "医院"},
        {"id": 4, "label": "体育场"},
        {"id": 5, "label": "公墓"},
        {"id": 6, "label": "地上停车场"},
        {"id": 7, "label": "工业区"},
        {"id": 11, "label": "机场"},
        {"id": 12, "label": "机场跑道"},
        {"id": 21, "label": "BUA面"},
        {"id": 22, "label": "邮编面"},
        {"id": 23, "label": "FM面"},
        {"id": 24, "label": "车场面"},
        {"id": 30, "label": "休闲娱乐"},
        {"id": 31, "label": "景区"},
        {"id": 32, "label": "会展中心"},
        {"id": 33, "label": "火车站"},
        {"id": 34, "label": "文化场馆"},
        {"id": 35, "label": "商务区"},
        {"id": 36, "label": "商业区"},
        {"id": 37, "label": "小区"},
        {"id": 38, "label": "广场"},
        {"id": 39, "label": "特色区域"},
        {"id": 40, "label": "地下停车场"},
        {"id": 41, "label": "地铁出入口面"}
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
                if($scope.zoneLinkForm) {
                    $scope.zoneLinkForm.$setPristine();
                }
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
                $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false});
            }
        });
    };
    $scope.cancel = function(){

    };
    //修改道路形态
    $scope.addKind = function() {
        var addKindObj={
            "loadType":"subAttrTplContainer",
            "propertyCtrl":'scripts/components/road/ctrls/attr_lu_ctrl/luKindCtrl',
            "propertyHtml":'../../../scripts/components/road/tpls/attr_lu_tpl/luKindTpl.html'
        }
        $scope.$emit("transitCtrlAndTpl", addKindObj);
    };
    //监听保存，修改,删除，取消，和初始化
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeData);
}]);
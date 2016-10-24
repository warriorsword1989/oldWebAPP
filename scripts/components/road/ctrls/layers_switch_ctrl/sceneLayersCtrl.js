/*
 * Created by liwanchong on 2016 / 2 / 24.
 */
angular.module('app').controller('scenceLayersController', function($scope) {
    var layerCtrl = fastmap.uikit.LayerController();
    var eventController = fastmap.uikit.EventController();
    var guideLayer = layerCtrl.getLayerById("guideLineLayer");
    $scope.selectedScenceId = 1; // 默认选中常规场景
    $scope.scenceArray = [{
        "id": 1,
        "label": "常规场景",
        "dataLayers": [{
            "layerId": "rdLink"
        }, {
            "layerId": "rdNode"
        }, {
            "layerId": "rwLink"
        }, {
            "layerId": "poi"
        }, {
            "layerId": "rdCross",
            "requestType": "RDCROSS"
        }]
    }, {
        "id": 2,
        "label": "行政区划场景",
        "dataLayers": [{
            "layerId": "rdLink"
        }, {
            "layerId": "rdNode"
        }, {
            "layerId": "rwLink"
        }, {
            "layerId": "adNode"
        }, {
            "layerId": "adLink"
        }, {
            "layerId": "adFace"
        }, {
            "layerId": "adAdmin"
        }]
    }, {
        "id": 3,
        "label": "互联网RTIC场景",
        "dataLayers": [{
            "layerId": "rdNode"
        }, {
            "layerId": "rdLink"
        }, {
            "layerId": "rdIntRtic"
        }]
    }, {
        "id": 4,
        "label": "车厂RTIC场景",
        "dataLayers": [{
            "layerId": "rdNode"
        }, {
            "layerId": "rdLink"
        }, {
            "layerId": "rdLinkRtic"
        }]
    },{
        "id": 5,
        "label": "CRF场景",
        "dataLayers": [{
            "layerId": "rdNode"
        },{
            "layerId": "rdLink"
        }, {
            "layerId": "rwLink"
        }, {
            "layerId": "poi"
        }, {
            "layerId": "crfData",
            "requestType": "RDINTER,RDROAD,RDOBJECT"
        }]
    },{
        "id": 6,
        "label": "同一关系场景",
        "dataLayers": [{
            "layerId": "rdNode"
        }, {
            "layerId": "rdLink"
        }, {
            "layerId": "adNode"
        }, {
            "layerId": "adLink"
        }, {
            "layerId": "zoneLink"
        }, {
            "layerId": "zoneNode"
        }, {
            "layerId": "luLink"
        }, {
            "layerId": "luNode"
        },{
            "layerId": "rdSame"
        }]
    },{
        "id": 7,
        "label": "限速场景",
        "dataLayers": [{
            "layerId": "rdLink"
        }, {
            "layerId": "rdNode"
        }, {
            "layerId": "rwLink"
        }, {
            "layerId": "poi"
        }, {
            "layerId": "rdLinkSpeedLimit"
        }, {
            "layerId": "relationData",
            "requestType": "RDSPEEDLIMIT"
        }]
    },{
        "id": 8,
        "label": "详细车道场景",
        "dataLayers": [{
            "layerId": "rdLink"
        }, {
            "layerId": "rdNode"
        }, {
            "layerId": "rwLink"
        }, {
            "layerId": "poi"
        }, {
            "layerId": "relationData",
            "requestType": "RDLANE,RDLANECONNEXITY"
        }, {
            "layerId": "workPoint",
            "requestType": "1202,1508,1113"
        }]
    }];

    $scope.dataLayers = [];
    var reqType;
    for (var i = 0; i < layerCtrl.layers.length; i++) {
        if (layerCtrl.layers[i].options.groupId == "dataLayers" || layerCtrl.layers[i].options.groupId == "worklayer") {
            reqType = layerCtrl.layers[i].options.requestType.split(",");
            for (var j = 0; j < reqType.length; j++) {
                $scope.dataLayers.push({
                    "id": layerCtrl.layers[i].options.id + "-" + reqType[j],
                    "label": layerCtrl.layers[i].options.name + (reqType.length == 1 ? "" : ("-" + fastmap.uikit.FeatureConfig.featureName(reqType[j]))),
                    "layerId": layerCtrl.layers[i].options.id,
                    "requestType": reqType[j],
                    "single": reqType.length == 1,
                    "selected": layerCtrl.layers[i].options.visible&& layerCtrl.layers[i].url.parameter["types"].indexOf(reqType[j])>-1   //wt++ 当一个图层中含有多个要素请求时，只勾选其中一个时候，第二次初始化的时候应当判断url parameter里面的type字段，做为该要素测checkbox是否勾选
                });
            }
        }
    }
    $scope.backgroundLayers = [];
    for (var i = 0; i < layerCtrl.layers.length; i++) {
        if (layerCtrl.layers[i].options.groupId == "backgroundLayers") {
            $scope.backgroundLayers.push(layerCtrl.layers[i].options);
        }
    }

    function resetDataLayers(dataLayers) {
        var vLayerIds = [];
        var layer, aReqType,
            bReqType,
            cReqType;
        for (var i = 0; i < dataLayers.length; i++) {
            layer = layerCtrl.getLayerById(dataLayers[i].layerId);
            if(dataLayers[i].layerId == "workPoint" && dataLayers[i]["requestType"]==""){//特殊处理tips图层,requestType默认为空
                layer.options.visible = true;
            }
            if (dataLayers[i]["requestType"]) {
                cReqType = [];
                aReqType = dataLayers[i]["requestType"].split(",");
                bReqType = layer.options.requestType.split(",");
                for (var j = 0; j < aReqType.length; j++) {
                    if (bReqType.indexOf(aReqType[j]) >= 0) {
                        cReqType.push(aReqType[j]);
                    }
                }
                layer.url.parameter["types"] = cReqType;
                // 注意：只有在可见的情况下才能重绘
                // 在不可见时，只要修改visible即可，重绘会报错
                layer.options.visible = true;
            } else {
                if (layer.options.requestType) {
                    layer.url.parameter["types"] = layer.options.requestType.split(",");
                }
                layer.options.visible = true;
            }
            // 更新页面上的数据图层的复选框
            for (var j = 0; j < $scope.dataLayers.length; j++) {
                if ($scope.dataLayers[j].layerId == dataLayers[i].layerId) {
                    if (dataLayers[i]["requestType"]) {
                        if (cReqType.length > 0) {
                            if (cReqType.indexOf($scope.dataLayers[j].requestType) >= 0) {
                                $scope.dataLayers[j].selected = true;
                            } else {
                                $scope.dataLayers[j].selected = false;
                            }
                        } else {
                            $scope.dataLayers[j].selected = false;
                        }
                    } else {
                        $scope.dataLayers[j].selected = true;
                    }
                }
            }
            vLayerIds.push(dataLayers[i]["layerId"]);
        }
        for (var k = 0; k < layerCtrl.layers.length; k++) {
            if (layerCtrl.layers[k].options.groupId == "dataLayers") {
                if (vLayerIds.indexOf(layerCtrl.layers[k].options.id) < 0) {
                    layerCtrl.layers[k].options.visible = false;
                }
            }
        }
        // 更新页面上的数据图层的复选框
        for (var m = 0; m < $scope.dataLayers.length; m++) {
            if (vLayerIds.indexOf($scope.dataLayers[m].layerId) < 0) {
                $scope.dataLayers[m].selected = false;
            }
        }
    }
    $scope.selectScence = function(item, event) {
        if (item.id == $scope.selectedScenceId) {
            return;
        }
        $scope.selectedScenceId = item.id;
        // event.stopPropagation();
        resetToolAndMap();
        $scope.$emit("SWITCHCONTAINERSTATE", {
            "attrContainerTpl": false,
            "subAttrContainerTpl": false
        });
        var layers = item.dataLayers || [];
        resetDataLayers(layers);
        eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
            layerArr: layerCtrl.layers
        });
    };
    $scope.changeScence = function(item, event) {
        if (item.id == $scope.selectedScenceId) {
            return;
        }
        $scope.selectedScenceId = item.id;

        var layers = item.dataLayers || [];
        resetDataLayers(layers);
        eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
            layerArr: layerCtrl.layers
        });
    };
    // $scope.$on("changeSceneLayers", function (event,data) {
    //     for(var i = 0;i<$scope.scenceArray.length;i++){
    //         if($scope.scenceArray[i].label == data.data){
    //             $scope.changeScence($scope.scenceArray[i]);
    //         }
    //     }
    // });
    eventController.on(eventController.eventTypes.CHANGESCENE, function (data) {
        for(var i = 0;i<$scope.scenceArray.length;i++){
            if($scope.scenceArray[i].label == data.data){
                $scope.changeScence($scope.scenceArray[i]);
            }
        }
    });
    $scope.toggleDataLayer = function(item, event) {
        //单击checkbox的处理
        item.selected = !item.selected;
        if (item.single) {
            layerCtrl.getLayerById(item.layerId).options.visible = item.selected;
            //引导线图层随workPoint隐藏或显示
            layerCtrl.getLayerById(item.layerId).options.visible = item.selected;
            guideLayer.options.visible = item.selected;
            eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
                layerArr: layerCtrl.layers
            });
        } else {
            var layer = layerCtrl.getLayerById(item.layerId);
            if (item.selected) {
                // 由不可见到可见时，清空初始化的全部请求对象，只赋值当前选中的对象
                if (!layer.options.visible) {
                    layer.url.parameter["types"] = [];
                }
                layer.url.parameter["types"].push(item.requestType);
            } else {
                layer.url.parameter["types"].splice(layer.url.parameter["types"].indexOf(item.requestType), 1)
            }
            if (layer.options.visible) {
                layer.redraw();
            } else {
                layer.options.visible = true;
                eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
                    layerArr: layerCtrl.layers
                });
            }
        }
    };
    $scope.toggleBgLayer = function(item, event) {
        item.visible = !item.visible;
        if (item.visible && item.singleSelect) {
            for (var i = 0; i < $scope.backgroundLayers.length; i++) {
                if ($scope.backgroundLayers[i].id != item.id && $scope.backgroundLayers[i].singleSelect) {
                    $scope.backgroundLayers[i].visible = false;
                }
            }
        }
        eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
            layerArr: layerCtrl.layers
        });
    };
    var resetToolAndMap = function() {
        var editLayer = layerCtrl.getLayerById('edit');
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var highRenderCtrl = fastmap.uikit.HighRenderController();
        if (map.floatMenu) {
            map.removeLayer(map.floatMenu);
            map.floatMenu = null;
        }
        if (map.currentTool && typeof map.currentTool.cleanHeight === "function") {
            map.currentTool.cleanHeight();
            map.currentTool.disable(); //禁止当前的参考线图层的事件捕获
        }
        highRenderCtrl._cleanHighLight();
        highRenderCtrl.highLightFeatures.length = 0;
        if (tooltipsCtrl.getCurrentTooltip()) {
            tooltipsCtrl.onRemoveTooltip();
        }
        editLayer.drawGeometry = null;
        shapeCtrl.stopEditing();
        editLayer.bringToBack();
        $(editLayer.options._div).unbind();
        shapeCtrl.shapeEditorResult.setFinalGeometry(null);
        shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
        editLayer.clear();
    };
});
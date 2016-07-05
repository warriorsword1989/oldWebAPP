/*
 * Created by liwanchong on 2016 / 2 / 24.
 */
angular.module('app').controller('sceneLayersController', function($scope) {
    var layerCtrl = fastmap.uikit.LayerController();
    var eventController = fastmap.uikit.EventController();
    var defaultScenceConfig = [{
        "layerId": "rdNode"
    }, {
        "layerId": "rdLink"
    }, {
        "layerId": "rwNode"
    }, {
        "layerId": "rwLink"
    }, {
        "layerId": "relationData",
        "requestType": "RDRESTRICTION,RDSPEEDLIMIT,RDBRANCH,RDCROSS"
    }];
    $scope.scenceArray = [{
        "id": 1,
        "label": "线限速场景",
        "selected": false,
        "dataLayers": [{
            "layerId": "rdLink",
            "requestType": ""
        }, {
            "layerId": "relationData",
            "requestType": "RDRESTRICTION,RDSPEEDLIMIT"
        }]
    }, {
        "id": 2,
        "label": "条件限速",
        "selected": false
    }, {
        "id": 3,
        "label": "互联网RTIC场景",
        "selected": false
    }, {
        "id": 4,
        "label": "行政区划场景",
        "selected": false,
        "dataLayers": [{
            "layerId": "rdNode"
        }, {
            "layerId": "rdLink"
        }, {
            "layerId": "rwLink"
        }, {
            "layerId": "adNode"
        }, {
            "layerId": "adLink"
        }, {
            "layerId": "adFace"
        }, {
            "layerId": "rwLink"
        }]
    }, {
        "id": 5,
        "label": "复杂要素",
        "selected": false
    }, {
        "id": 6,
        "label": "常规场景",
        "selected": false,
        "dataLayers": [{
            "layerId": "rdNode"
        }, {
            "layerId": "rdLink"
        }, {
            "layerId": "rwNode"
        }, {
            "layerId": "rwLink"
        }, {
            "layerId": "relationData",
            "requestType": "RDRESTRICTION,RDSPEEDLIMIT,RDBRANCH,RDCROSS"
        }]
    }, {
        "id": 7,
        "label": "车场RTIC场景",
        "selected": false
    }, {
        "id": 8,
        "label": "TMC",
        "selected": false
    }, {
        "id": 9,
        "label": "自然语音场景",
        "selected": false
    }, {
        "id": 10,
        "label": "13cy-HW场景",
        "selected": false
    }, {
        "id": 11,
        "label": "NBT高速出入口场景",
        "selected": false
    }, {
        "id": 12,
        "label": "CRF场景",
        "selected": false
    }, {
        "id": 13,
        "label": "同一关系场景",
        "selected": false
    }];
    $scope.dataLayers = [];
    var reqType;
    for (var i = 0; i < layerCtrl.layers.length; i++) {
        if (layerCtrl.layers[i].options.groupId == "dataLayers") {
            reqType = layerCtrl.layers[i].options.requestType.split(",");
            for (var j = 0; j < reqType.length; j++) {
                $scope.dataLayers.push({
                    "id": layerCtrl.layers[i].options.id + "-" + reqType[j],
                    "label": layerCtrl.layers[i].options.name + (reqType.length == 1 ? "" : ("-" + fastmap.uikit.FeatureConfig.featureName(reqType[j]))),
                    "layerId": layerCtrl.layers[i].options.id,
                    "requestType": reqType[j],
                    "single": reqType.length == 1,
                    "selected": layerCtrl.layers[i].options.visible
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
    $scope.toggleScence = function(item, event) {
        event.stopPropagation();
        resetToolAndMap();
        $scope.$emit("SWITCHCONTAINERSTATE", {
            "attrContainerTpl": false,
            "subAttrContainerTpl": false
        });
        item['selected'] = !item['selected'];
        if (item['selected']) {
            for (var i = 0; i < $scope.scenceArray.length; i++) {
                if ($scope.scenceArray[i].id != item.id) {
                    $scope.scenceArray[i].selected = false;
                }
            }
        }
        if (item['selected']) {
            layers = item.dataLayers || [];
        } else {
            layers = defaultScenceConfig;
        }
        resetDataLayers(layers);
        eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
            layerArr: layerCtrl.layers
        });
    };
    $scope.toggleDataLayer = function(item, event) {
        //单击checkbox的处理
        item.selected = !item.selected;
        if (item.single) {
            layerCtrl.getLayerById(item.layerId).options.visible = item.selected;
            eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
                layerArr: layerCtrl.layers
            });
        } else {
            var layer = layerCtrl.getLayerById(item.layerId);
            if (item.selected) {
                layer.url.parameter["types"].push(item.requestType);
            } else {
                layer.url.parameter["types"].splice(layer.url.parameter["types"].indexOf(item.requestType), 1)
            }
            if (layer.options.visible) {
                layer.redraw();
            } else {
                eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
                    layerArr: layerCtrl.layers
                });
            }
        }
    };
    $scope.toggleBgLayer = function(item, event) {
        item.visible = !item.visible;
        if (item.visible) {
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
/**
 * Created by liwanchong on 2015/10/29.
 */
var myApp = angular.module("app");
angular.module("app").controller('linkObjectController', ['$scope', '$ocLazyLoad', "dsEdit", "appPath", function($scope, $ocLazyLoad, dsEdit, appPath) {
    var objectCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var rdLink = layerCtrl.getLayerById("referenceLine");
    var rdNode = layerCtrl.getLayerById("rdNode");
    var editLayer = layerCtrl.getLayerById('edit');
    var rdCross = layerCtrl.getLayerById("relationData");
    var outputCtrl = fastmap.uikit.OutPutController({});
    var toolTipsCtrl = fastmap.uikit.ToolTipsController();
    var eventController = fastmap.uikit.EventController();
    var selectCtrl = fastmap.uikit.SelectController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    $scope.speedAndDirect = shapeCtrl.shapeEditorResult.getFinalGeometry();
    $scope.brigeIndex = 0;
    $scope.modelArray = [false, false, false, false, false, false];
    //改变模块的背景
    $scope.initializeLinkData = function() {
        for (var layer in layerCtrl.layers) {
            if (layerCtrl.layers[layer].options.requestType === "RDLINKINTRTIC" && layerCtrl.layers[layer].options.visible) {
                for (var i = 0; i < $scope.modelArray.length; i++) {
                    if (i == 4) {
                        //初始化鼠标提示
                        $scope.toolTipText = '请选择方向！';
                        tooltipsCtrl.setCurrentTooltip($scope.toolTipText);
                        $scope.modelArray[i] = true;
                        map.currentTool.disable();
                    } else {
                        $scope.modelArray[i] = false;
                    }
                }
                $ocLazyLoad.load(appPath.road + 'ctrls/attr_link_ctrl/rticCtrl').then(function() {
                    if (objectCtrl.updateObject) {
                        objectCtrl.updateObject();
                    }
                    $scope.currentURL = appPath.root + appPath.road + "tpls/attr_link_tpl/rticTpl.html";
                });
                break;
            } else if (layer == layerCtrl.layers.length - 1) {
                for (var i = 0; i < $scope.modelArray.length; i++) {
                    if (i == 0) {
                        $scope.modelArray[i] = true;
                    } else {
                        $scope.modelArray[i] = false;
                    }
                }
                $ocLazyLoad.load(appPath.road + 'ctrls/attr_link_ctrl/basicCtrl').then(function() {
                    if (objectCtrl.updateObject) {
                        objectCtrl.updateObject();
                    }
                    $scope.currentURL = appPath.root + appPath.road + "tpls/attr_link_tpl/basicTpl.html";
                });
            }
        }
        $scope.dataTipsData = selectCtrl.rowKey;
        objectCtrl.setOriginalData(objectCtrl.data.getIntegrate());
        $scope.linkData = objectCtrl.data;
        $scope.currentURL = "";
        //随着地图的变化 高亮的线不变
        if ($scope.dataTipsData && $scope.dataTipsData.f_array && $scope.dataTipsData.f_array.length > 0) {
            var linksArr = [];
            var highLightFeatures = [];
            for (var item in $scope.dataTipsData.f_array) {
                linksArr.push($scope.dataTipsData.f_array[item].id);
                highLightFeatures.push({
                    id: $scope.dataTipsData.f_array[item].id,
                    layerid: 'referenceLine',
                    type: 'line',
                    style: {}
                })
            }
            highRenderCtrl.highLightFeatures = highLightFeatures;
            highRenderCtrl.drawHighlight();
        } else {
            highRenderCtrl.highLightFeatures.push({
                id: $scope.linkData.pid.toString(),
                layerid: 'referenceLine',
                type: 'line',
                style: {}
            });
            highRenderCtrl.drawHighlight();
        }
        var linkArr = $scope.linkData.geometry.coordinates,
            points = [];
        for (var i = 0, len = linkArr.length; i < len; i++) {
            var pointOfLine = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
            points.push(pointOfLine);
        }
        var pointOfSelect = selectCtrl.selectedFeatures["point"];
        var line = fastmap.mapApi.lineString(points);
        selectCtrl.onSelected({
            geometry: line,
            id: $scope.linkData.pid,
            type: "Link",
            direct: $scope.linkData.direct,
            snode: $scope.linkData.sNodePid,
            enode: $scope.linkData.eNodePid,
            point: pointOfSelect
        });
    };
    //初始化controller调用
    if (objectCtrl.data) {
        $scope.initializeLinkData();
    }
    //获取某个模块的信息
    $scope.changeModule = function(url, ind) {
        for (var i = 0; i < $scope.modelArray.length; i++) {
            if (ind == i && ind == 4) {
                for (var layer in layerCtrl.layers) {
                    if (layerCtrl.layers[layer].options.requestType === "RDLINKINTRTIC") {
                        layerCtrl.layers[layer].options.isUpDirect = false;
                        layerCtrl.layers[layer].options.visible = true;
                        eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
                            layerArr: layerCtrl.layers
                        });
                        break;
                    }
                }
                $scope.modelArray[i] = true;
            } else if (ind == i) {
                for (var layer in layerCtrl.layers) {
                    if (layerCtrl.layers[layer].options.requestType === "RDLINKINTRTIC") {
                        layerCtrl.layers[layer].options.isUpDirect = true;
                        layerCtrl.layers[layer].options.visible = false;
                        eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
                            layerArr: layerCtrl.layers
                        });
                        break;
                    }
                }
                $scope.modelArray[i] = true;
            } else {
                $scope.modelArray[i] = false;
            }
        }
        $scope.$emit("SWITCHCONTAINERSTATE", {
            "subAttrContainerTpl": false
        })
        if (url === "basicModule") {
            $ocLazyLoad.load('scripts/components/road3/ctrls/attr_link_ctrl/basicCtrl').then(function() {
                $scope.currentURL = "../../../scripts/components/road3/tpls/attr_link_tpl/basicTpl.html";
            });
        } else if (url === "paginationModule") {
            $ocLazyLoad.load('scripts/components/road3/ctrls/attr_link_ctrl/pedestrianNaviCtrl').then(function() {
                $scope.currentURL = "../../../scripts/components/road3/tpls/attr_link_tpl/pedestrianNaviTepl.html";
            });
        } else if (url === "realtimeModule") {
            $ocLazyLoad.load('scripts/components/road3/ctrls/attr_link_ctrl/rticCtrl').then(function() {
                $scope.currentURL = "../../../scripts/components/road3/tpls/attr_link_tpl/rticTpl.html";
            });
        } else if (url === "limitedModule") {
            $ocLazyLoad.load('scripts/components/road3/ctrls/attr_link_ctrl/limitedCtrl').then(function() {
                $scope.currentURL = "../../../scripts/components/road3/tpls/attr_link_tpl/limitTpl.html";
            });
        } else if (url == "nameModule") { //道路名
            $ocLazyLoad.load('scripts/components/road3/ctrls/attr_link_ctrl/namesCtrl').then(function() {
                $scope.currentURL = "../../../scripts/components/road3/tpls/attr_link_tpl/namesTpl.html";
            });
        } else if (url == "speedModule") { //限速
            $ocLazyLoad.load('scripts/components/road3/ctrls/attr_link_ctrl/speedCtrl').then(function() {
                $scope.currentURL = "../../../scripts/components/road3/tpls/attr_link_tpl/speedTpl.html";
            });
        }
    }
    $scope.angleOfLink = function(pointA, pointB) {
        var PI = Math.PI,
            angle;
        if ((pointA.x - pointB.x) === 0) {
            angle = PI / 2;
        } else {
            angle = Math.atan((pointA.y - pointB.y) / (pointA.x - pointB.x));
        }
        return angle;
    };
    $scope.changeDirect = function(direct) {
        map.currentTool.disable();
        map.currentTool = shapeCtrl.getCurrentTool();
        map.currentTool.disable();
        var containerPoint;
        var endNum = parseInt($scope.linkData.geometry.coordinates.length / 2);
        var point = {
            x: $scope.linkData.geometry.coordinates[0][0],
            y: $scope.linkData.geometry.coordinates[0][1]
        };
        var pointVertex = {
            x: $scope.linkData.geometry.coordinates[endNum][0],
            y: $scope.linkData.geometry.coordinates[endNum][1]
        };
        containerPoint = map.latLngToContainerPoint([point.y, point.x]);
        pointVertex = map.latLngToContainerPoint([pointVertex.y, pointVertex.x]);
        var angle = $scope.angleOfLink(containerPoint, pointVertex);
        var marker = {
            flag: true,
            pid: $scope.linkData.pid,
            point: point,
            type: "marker",
            angle: angle,
            orientation: direct.toString()
        };
        var editLayer = layerCtrl.getLayerById('edit');
        layerCtrl.pushLayerFront('edit');
        var sObj = shapeCtrl.shapeEditorResult;
        editLayer.drawGeometry = marker;
        editLayer.draw(marker, editLayer);
        sObj.setOriginalGeometry(marker);
        sObj.setFinalGeometry(marker);
        shapeCtrl.setEditingType("transformDirect");
        shapeCtrl.startEditing();
    };
    $scope.save = function() {
        if ($scope.linkData.forms.length == 0) {
            var newForm = fastmap.dataApi.rdLinkForm({
                "linkPid": $scope.linkData.pid,
                "formOfWay": 1
            });
            $scope.linkData.forms.push(newForm);
        }
        /*如果普通限制修改时间段信息*/
        if ($scope.linkData.limits) {
            $.each($scope.linkData.limits, function(i, v) {
                $.each($("#popularLimitedDiv").find(".muti-date"), function(m, n) {
                    if (i == m) {
                        v.timeDomain = $(n).attr('date-str');
                        delete v.pid;
                    }
                });
            });
        }
        /*如果卡车限制修改时间段信息*/
        if ($scope.linkData.limitTrucks) {
            $.each($scope.linkData.limitTrucks, function(i, v) {
                // console.log(v.pid)
                $.each($("#trafficLimited").find(".muti-date"), function(m, n) {
                    if (i == m) {
                        v.timeDomain = $(n).attr('date-str');
                        // delete v.pid;
                    }
                });
            });
        }
        /*如果道路名新增*/
        if ($scope.linkData.names) {
            $.each($scope.linkData.names, function(i, v) {
                if (v.pid) delete v.pid;
            });
        }
        objectCtrl.save();
        if (!objectCtrl.changedProperty) {
            swal("保存提示", '属性值没有变化，不需要保存！', "info");
            return;
        }
        if (objectCtrl.changedProperty.limits) {
            if (objectCtrl.changedProperty.limits.length > 0) {
                $.each(objectCtrl.changedProperty.limits, function(i, v) {
                    delete v.pid;
                });
            }
        }
        if (objectCtrl.changedProperty.limitTrucks) {
            if (objectCtrl.changedProperty.limitTrucks.length > 0) {
                $.each(objectCtrl.changedProperty.limitTrucks, function(i, v) {
                    delete v.pid;
                });
            }
        }
        dsEdit.update($scope.linkData.pid, "RDLINK", objectCtrl.changedProperty).then(function(data) {
            if (data) {
                rdLink.redraw();
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
                objectCtrl.setOriginalData(objectCtrl.data.getIntegrate());
            }
        })
    };
    $scope.delete = function() {
        dsEdit.delete($scope.linkData.pid, "RDLINK").then(function(data) {
            if (data) {
                rdLink.redraw();
                rdNode.redraw();
                rdCross.redraw();
                $scope.linkData = null;
                var editorLayer = layerCtrl.getLayerById("edit")
                editorLayer.clear();
            }
        });
    }
    $scope.changeLink = function(ind, linkId) {
        $scope.brigeIndex = ind;
        //        Application.functions.getRdObjectById(linkId, "RDLINK", function (data) {
        //            if (data.errcode === -1) {
        //                return;
        //            }
        //            var linkArr = data.data.geometry.coordinates,points = [];
        //            for (var i = 0, len = linkArr.length; i < len; i++) {
        //                var point = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
        //                points.push(point);
        //            }
        //            map.panTo({lat: points[0].y, lon: points[0].x});
        //            var line = fastmap.mapApi.lineString(points);
        //            selectCtrl.onSelected({geometry: line, id: data.data.pid});
        //            objectCtrl.setCurrentObject("RDLINK",data.data);
        //            var linkObj = {
        //                "loadType":"attrTplContainer",
        //                "propertyCtrl":"scripts/components/road3/ctrls/attr_link_ctrl/rdLinkCtrl",
        //                "propertyHtml":"../../../scripts/components/road3/tpls/attr_link_tpl/rdLinkTpl.html"
        //            };
        //            $scope.$emit("transitCtrlAndTpl", linkObj);
        //        });
        dsEdit.getByPid(linkId, "RDLINK").then(function(data) {
            if (data) {
                var linkArr = data.geometry.coordinates,
                    points = [];
                for (var i = 0, len = linkArr.length; i < len; i++) {
                    var point = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
                    points.push(point);
                }
                map.panTo({
                    lat: points[0].y,
                    lon: points[0].x
                });
                var line = fastmap.mapApi.lineString(points);
                selectCtrl.onSelected({
                    geometry: line,
                    id: data.pid
                });
                objectCtrl.setCurrentObject("RDLINK", data);
                var linkObj = {
                    "loadType": "attrTplContainer",
                    "propertyCtrl": appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl",
                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html"
                };
                $scope.$emit("transitCtrlAndTpl", linkObj);
            }
        });
    }
    $scope.cancel = function() {}
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT, $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeLinkData);
}]);
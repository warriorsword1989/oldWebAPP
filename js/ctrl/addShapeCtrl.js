/**
 * Created by liwanchong on 2015/10/28.
 */
var addShapeApp = angular.module('mapApp', ['oc.lazyLoad']);
addShapeApp.controller("addShapeController", ['$scope', '$ocLazyLoad', function ($scope, $ocLazyLoad) {
        var layerCtrl = fastmap.uikit.LayerController();
        var featCodeCtrl = fastmap.uikit.FeatCodeController();

        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var selectCtrl = fastmap.uikit.SelectController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var highLightLayer = fastmap.uikit.HighLightController();
        var rdLink = layerCtrl.getLayerById('referenceLine');
        var transform = new fastmap.mapApi.MecatorTranform();
        $scope.limitRelation = {};
        $scope.addShapeClaArr = $scope.$parent.$parent.classArr;
        //两点之间的距离
        $scope.distance = function (pointA, pointB) {
            var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
            return Math.sqrt(len);
        };
        $scope.includeAngle = function (pointA, pointB) {
            var angle, dValue = pointA.x - pointB.x,
                PI = Math.PI;

            if (dValue === 0) {
                angle = PI / 2;
            } else {
                angle = Math.atan((pointA.y - pointB.y) / (pointA.x - pointB.x));
            }
            return angle;
        };
        $scope.arrToReduce = function (arrA, arrB) {
            var arr = [], obj = {};
            for (var i = 0, len = arrB.length; i < len; i++) {
                obj[arrB[i]] = true;
            }

            for (var j = 0, lenJ = arrA.length; j < lenJ; j++) {
                if (!obj[arrA[j]]) {
                    arr.push(arrA[j]);
                }


            }

            return arr;
        };
        $scope.containsNode = function (arr, node) {
            var obj = {}, flag = false;
            for (var i = 0, len = arr.length; i < len; i++) {
                obj[arr[i]] = true;
                if (obj[node]) {
                    flag = true;
                    break;
                }
            }
            return flag;
        };
        $scope.addShape = function (type, num) {
            if (tooltipsCtrl.getCurrentTooltip()) {
                tooltipsCtrl.onRemoveTooltip();
            }
            if (type === "restriction") {
                shapeCtrl.setEditingType("restriction")
                map.currentTool.disable();//禁止当前的参考线图层的事件捕获
                if (typeof map.currentTool.cleanHeight === "function") {
                    map.currentTool.cleanHeight();
                }
                $scope.$parent.$parent.changeBtnClass(num);
                tooltipsCtrl.setEditEventType('restriction');
                tooltipsCtrl.setCurrentTooltip('正要新建交限,先选择线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({map: map, currentEditLayer: rdLink});
                map.currentTool.enable();
                $scope.excitLineArr = [];
                rdLink.on("getId", function (data) {
                    if (data.index === 0) {
                        $scope.limitRelation.inLinkPid = parseInt(data.id);
                        tooltipsCtrl.setStyleTooltip("color:black;");
                        tooltipsCtrl.setChangeInnerHtml("已经选择进入线,选择进入点!");
                    } else if (data.index === 1) {
                        $scope.limitRelation.nodePid = parseInt(data.id);
                        tooltipsCtrl.setStyleTooltip("color:red;");
                        tooltipsCtrl.setChangeInnerHtml("已经选择进入点,选择退出线!");
                    } else if (data.index > 1) {
                        $scope.excitLineArr.push(parseInt(data.id));
                        $scope.limitRelation.outLinkPids = $scope.excitLineArr;
                        tooltipsCtrl.setChangeInnerHtml("已选退出线,点击空格键保存!");
                    }
                    featCodeCtrl.setFeatCode($scope.limitRelation);
                })

            }
            else if (type === "link") {
                map.currentTool.disable();//禁止当前的参考线图层的事件捕获
                if (typeof map.currentTool.cleanHeight === "function") {
                    map.currentTool.cleanHeight();
                }
                $scope.$parent.$parent.changeBtnClass(num);
                if (shapeCtrl.shapeEditorResult) {
                    shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point(0, 0)]));
                    selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                    layerCtrl.pushLayerFront('edit');
                }
                shapeCtrl.setEditingType('drawPath');
                shapeCtrl.startEditing();
                tooltipsCtrl.setEditEventType('drawPath');
                tooltipsCtrl.setCurrentTooltip('开始画线！');
                tooltipsCtrl.setStyleTooltip("color:black;");
                tooltipsCtrl.setChangeInnerHtml("双击地图结束画线!");
                tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存画线,或者按ESC键取消!");
            } else if (type === "speedLimit") {
                var minLen = 100000, pointsOfDis, pointForAngle, angle;
                map.currentTool = shapeCtrl.getCurrentTool();
                map.currentTool.disable();

                if (selectCtrl.selectedFeatures) {
                    if (selectCtrl.selectedFeatures.direct === 1) {
                        tooltipsCtrl.setEditEventType('speedLimit');
                        var point = selectCtrl.selectedFeatures.point;
                        var link = selectCtrl.selectedFeatures.geometry.components;
                        for (var i = 0, len = link.length; i < len; i++) {
                            pointsOfDis = $scope.distance(point, link[i]);
                            if (pointsOfDis < minLen) {
                                minLen = pointsOfDis;
                                pointForAngle = link[i];
                            }
                        }
                        angle = $scope.includeAngle(point, pointForAngle);
                        console.log(angle);
                        console.log("angle  " + angle)
                        var marker = {
                            flag: false,
                            point: point,
                            type: "marker",
                            angle: angle,
                            orientation: "2",
                            pointForDirect: point
                        };
                        var editLayer = layerCtrl.getLayerById('edit');
                        layerCtrl.pushLayerFront('edit');
                        var sobj = shapeCtrl.shapeEditorResult;
                        editLayer.drawGeometry = marker;
                        editLayer.draw(marker, editLayer);
                        sobj.setOriginalGeometry(marker);
                        sobj.setFinalGeometry(marker);
                        shapeCtrl.setEditingType("transformDirect");
                        shapeCtrl.startEditing();
                        tooltipsCtrl.setCurrentTooltip("选择方向!");
                    } else {
                        tooltipsCtrl.setEditEventType('speedLimit');
                        tooltipsCtrl.setCurrentTooltip('请点击空格,创建限速!');
                        shapeCtrl.setEditingType("transformDirect");
                    }

                }


            } else if(type==="rdBranch") {
                shapeCtrl.setEditingType("rdBranch")
                map.currentTool.disable();//禁止当前的参考线图层的事件捕获
                if (typeof map.currentTool.cleanHeight === "function") {
                    map.currentTool.cleanHeight();
                }
                $scope.$parent.$parent.changeBtnClass(num);
                tooltipsCtrl.setEditEventType('rdBranch');
                tooltipsCtrl.setCurrentTooltip('正要新建分歧,先选择线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({map: map, currentEditLayer: rdLink});
                map.currentTool.enable();
                $scope.excitLineArr = [];
                rdLink.on("getId", function (data) {
                    if (data.index === 0) {
                        $scope.limitRelation.inLinkPid = parseInt(data.id);
                        tooltipsCtrl.setStyleTooltip("color:black;");
                        tooltipsCtrl.setChangeInnerHtml("已经选择进入线,选择进入点!");
                    } else if (data.index === 1) {
                        $scope.limitRelation.nodePid = parseInt(data.id);
                        tooltipsCtrl.setStyleTooltip("color:red;");
                        tooltipsCtrl.setChangeInnerHtml("已经选择进入点,选择退出线!");
                    } else if (data.index > 1) {
                        $scope.excitLineArr.push(parseInt(data.id));
                        $scope.limitRelation.outLinkPid = $scope.excitLineArr[0];
                        tooltipsCtrl.setChangeInnerHtml("已选退出线,点击空格键保存!");
                    }
                    featCodeCtrl.setFeatCode($scope.limitRelation);
                })

            }  else if (type === "rdcross") {
                var linksArr = [], nodesArr = [];
                shapeCtrl.toolsSeparateOfEditor("linksOfCross", {map: map, layer: rdLink, type: "rectangle"})
                var highLightLink = new fastmap.uikit.HighLightRender(rdLink, {
                    map: map,
                    highLightFeature: "linksOfCross",
                    initFlag: true
                });
                highLightLayer.pushHighLightLayers(highLightLink);
                map.on("dataOfBoxEvent", function (event) {
                    var data = event.data, options = {};
                    if (linksArr.length === 0) {
                        linksArr = data["crossLinks"];
                        nodesArr = data["crossNodes"];
                    } else {
                        highLightLink.drawLinksOfCrossForInit([], []);
                        if (data['nodes'].length === 1) {
                            if ($scope.containsNode(nodesArr, data["nodes"][0])) {
                                linksArr = $scope.arrToReduce(linksArr, data["links"]);
                                nodesArr = $scope.arrToReduce(nodesArr, data["nodes"]);
                            } else {
                                linksArr = linksArr.concat(data["links"]);
                                nodesArr = nodesArr.concat(data["nodes"]);
                            }

                        } else {
                            linksArr.length = 0;
                            nodesArr.length = 0;
                            linksArr = data["crossLinks"];
                            nodesArr = data["crossNodes"];
                        }
                    }

                    highLightLink.drawLinksOfCrossForInit(linksArr, nodesArr);
                    options = {"nodePids": nodesArr, "linkPids": linksArr};
                    selectCtrl.onSelected(options);
                });


            }
        }

    }]
)

/**
 * Created by liwanchong on 2015/10/28.
 */
var addShapeApp = angular.module('mapApp', ['oc.lazyLoad']);
addShapeApp.controller("addShapeController", ['$scope', '$ocLazyLoad', function ($scope, $ocLazyLoad) {
        var layerCtrl = fastmap.uikit.LayerController();
        var featCodeCtrl = fastmap.uikit.FeatCodeController();
        var editlayer = layerCtrl.getLayerById('edit');
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var selectCtrl = fastmap.uikit.SelectController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var highLightLayer = fastmap.uikit.HighLightController();
        var rdLink = layerCtrl.getLayerById('referenceLine');
        var objCtrl=fastmap.uikit.ObjectEditController();
        var eventController = fastmap.uikit.EventController();
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
        /*初始化功能按钮*/
        $scope.initCurrentTool = function () {
            $("#node").removeClass('node_true').addClass('node_false');
            $("#link").removeClass('link_true').addClass('link_false');
            $("#relation").removeClass('relation_true').addClass('relation_false');
            $("#tips").removeClass('tips_true').addClass('tips_false');
            $("#cross").removeClass('cross_true').addClass('cross_false');
            $("#addNode").removeClass('addNode_true').addClass('addNode_false');
            $("#addLink").removeClass('addLink_true').addClass('addLink_false');
            $("#addRelation").removeClass('addRelation_true').addClass('addRelation_false');
            $("#insertDot").removeClass('insertDot_true').addClass('insertDot_false');
            $("#deleteDot").removeClass('deleteDot_true').addClass('deleteDot_false');
            $("#moveDot").removeClass('moveDot_true').addClass('moveDot_false');
            $("#pathBreak").removeClass('pathBreak_true').addClass('pathBreak_false');
        }
        $scope.addShape = function (type, num, event) {

            if (event)
                event.stopPropagation();
            if($scope.$parent.$parent.panelFlag) {
                $scope.$parent.$parent.panelFlag = false;
                $scope.$parent.$parent.objectFlag = false;
            }
            if(!$scope.$parent.$parent.outErrorArr[3]) {
                $scope.$parent.$parent.outErrorArr[0]=false;
                $scope.$parent.$parent.outErrorArr[1]=false;
                $scope.$parent.$parent.outErrorArr[2]=false;
                $scope.$parent.$parent.outErrorArr[3]=true;
                $scope.$parent.$parent.outErrorUrlFlag = false;
            }
            if($scope.$parent.$parent.suspendFlag) {
                $scope.$parent.$parent.suspendFlag = false;
            }
            $("#popoverTips").hide();
            $scope.initCurrentTool();
            editlayer.clear();
            editlayer.bringToBack();
            shapeCtrl.shapeEditorResult.setFinalGeometry(null);
            shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
            rdLink.clearAllEventListeners()
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
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
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
                map.currentTool = shapeCtrl.getCurrentTool();
                tooltipsCtrl.setEditEventType('drawPath');
                tooltipsCtrl.setCurrentTooltip('开始画线！');
                tooltipsCtrl.setStyleTooltip("color:black;");
                tooltipsCtrl.setChangeInnerHtml("点击最后一个点结束画线!");
                tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存画线,或者按ESC键取消!");
            } else if (type === "speedLimit") {

                var minLen = 100000, pointsOfDis, pointForAngle, angle;
                map.currentTool = shapeCtrl.getCurrentTool();
                map.currentTool.disable();
                if (typeof map.currentTool.cleanHeight === "function") {
                    map.currentTool.cleanHeight();
                }
                $scope.$parent.$parent.changeBtnClass(num);
                if (shapeCtrl.shapeEditorResult) {
                    shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point(0, 0)]));
                    selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                    layerCtrl.pushLayerFront('edit');
                }
                shapeCtrl.setEditingType('pointVertexAdd');
                shapeCtrl.startEditing();
                map.currentTool = shapeCtrl.getCurrentTool();
                tooltipsCtrl.setEditEventType('pointVertexAdd');
                tooltipsCtrl.setCurrentTooltip('开始增加限速！');
                tooltipsCtrl.setStyleTooltip("color:black;");
                tooltipsCtrl.setChangeInnerHtml("点击增加限速!");
                tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存,或者按ESC键取消!");

                eventController.on(eventController.eventTypes.RESETCOMPLETE, function (e) {
                    var pro = e.property;
                    Application.functions.getRdObjectById(pro.id, "RDLINK", function (data) {
                        if (data.errcode == 0) {
                            selectCtrl.onSelected({
                                geometry: data.data.geometry.coordinates,
                                id: data.data.pid,
                                direct: pro.direct,
                                point: $.extend(true, {}, shapeCtrl.shapeEditorResult.getFinalGeometry())
                            });

                            var linkArr = data.data.geometry.coordinates || data.geometry.coordinates, points = [];
                            if (pro.direct == 1) {
                                tooltipsCtrl.setEditEventType('speedLimit');
                                var point = shapeCtrl.shapeEditorResult.getFinalGeometry();
                                var link = linkArr;
                                for (var i = 0, len = link.length; i < len; i++) {
                                    pointsOfDis = $scope.distance(map.latLngToContainerPoint([point.y, point.x]), map.latLngToContainerPoint([link[i][1], link[i][0]]));
                                    if (pointsOfDis < minLen) {
                                        minLen = pointsOfDis;
                                        pointForAngle = link[i];
                                    }
                                }
                                angle = $scope.includeAngle(map.latLngToContainerPoint([point.y, point.x]), map.latLngToContainerPoint([pointForAngle[1], pointForAngle[0]]));
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
                                shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                                tooltipsCtrl.setEditEventType('speedLimit');
                                tooltipsCtrl.setCurrentTooltip('请点击空格,创建限速!');
                                shapeCtrl.setEditingType("transformDirect");
                            }
                        } else {
                        }
                    })
                });
            } else if (type === "rdBranch") {
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
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
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

            } else if (type === "rdcross") {
                map.currentTool.disable();//禁止当前的参考线图层的事件捕获

                if (typeof map.currentTool.cleanHeight === "function") {
                    map.currentTool.cleanHeight();
                }
                var linksArr = [], nodesArr = [];
                shapeCtrl.toolsSeparateOfEditor("linksOfCross", {map: map, layer: rdLink, type: "rectangle"})
                var highLightLink = new fastmap.uikit.HighLightRender(rdLink, {
                    map: map,
                    highLightFeature: "linksOfCross",
                    initFlag: true
                });
                highLightLayer.pushHighLightLayers(highLightLink);
                eventController.on(eventController.eventTypes.GETBOXDATA, function (event) {
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


            } else if (type === "laneConnexity") {
                map.currentTool.disable();//禁止当前的参考线图层的事件捕获

                if (typeof map.currentTool.cleanHeight === "function") {
                    map.currentTool.cleanHeight();
                }
                if(! $scope.$parent.$parent.panelFlag ) {
                    $scope.$parent.$parent.panelFlag = true;
                    $scope.$parent.$parent.objectFlag = true;
                }
                var obj = {};
                obj["showTransitData"]=[]
                obj["showAdditionalData"] = [];
                obj["showNormalData"] = [];
                obj["inLaneInfoArr"] = [];
                $scope.$parent.$parent.objectEditURL = "";
                objCtrl.setCurrentObject(obj);
                $ocLazyLoad.load("ctrl/connexityCtrl/addConnexityCtrl/addLaneconnexityCtrl").then(function () {
                    $scope.$parent.$parent.objectEditURL = "js/tepl/connexityTepl/addConnexityTepl/addLaneconnexityTepl.html";

                });
            } else if (type === "node") {
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

                shapeCtrl.setEditingType('pointVertexAdd');
                shapeCtrl.startEditing();
                map.currentTool = shapeCtrl.getCurrentTool();
                tooltipsCtrl.setEditEventType('pointVertexAdd');
                tooltipsCtrl.setCurrentTooltip('开始增加节点！');
                tooltipsCtrl.setStyleTooltip("color:black;");
                tooltipsCtrl.setChangeInnerHtml("点击增加节点!");
                tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存,或者按ESC键取消!");
            }
        }

    }]
)

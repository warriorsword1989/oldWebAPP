/**
 * Created by liwanchong on 2015/10/28.
 */
var addShapeApp = angular.module('app');
addShapeApp.controller("addShapeController", ['$scope', '$ocLazyLoad','dsRoad','appPath', function ($scope, $ocLazyLoad, dsRoad, appPath) {
        var layerCtrl = fastmap.uikit.LayerController();
        var featCodeCtrl = fastmap.uikit.FeatCodeController();
        var editLayer = layerCtrl.getLayerById('edit');
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var selectCtrl = fastmap.uikit.SelectController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var rdLink = layerCtrl.getLayerById('referenceLine');
        var rdnode = layerCtrl.getLayerById('referenceNode');
        var highRenderCtrl = fastmap.uikit.HighRenderController();
        var objCtrl = fastmap.uikit.ObjectEditController();
        var eventController = fastmap.uikit.EventController();
        $scope.limitRelation = {};
        /**
         * 两点之间的距离
         * @param pointA
         * @param pointB
         * @returns {number}
         */
        $scope.distance = function (pointA, pointB) {
            var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
            return Math.sqrt(len);
        };
        /**
         * 两点之间的夹角
         * @param pointA
         * @param pointB
         * @returns {*}
         */
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
        /**
         * 数组去重
         * @param arr
         * @returns {Array}
         */
        $scope.distinctArr = function (arr) {
            var dObj = {};
            for (var i = 0, len = arr.length; i < len; i++) {
                dObj[arr[i]] = true;
            }
            return Object.keys(dObj);
        };
        /**
         *  路口创建中的方法 根据node删除对象中的重复
         * @param nodesArr
         * @param linksArr
         * @param nodes
         * @returns {{link: Array, node: Array}}
         */
        $scope.minusArrByNode = function (nodesArr, linksArr, nodes) {
            var nodesObj = {}, linksObj = {};
            for (var i = 0, lenI = nodesArr.length; i < lenI; i++) {
                nodesObj[nodesArr[i]] = true;
            }
            for (var j = 0, lenJ = linksArr.length; j < lenJ; j++) {
                linksObj[linksArr[j]] = true;
            }
            for (var m = 0, lenM = nodes.length; m < lenM; m++) {
                if (nodesObj[nodes[m]["node"]]) {
                    delete nodesObj[nodes[m]["node"]];
                }
                if (linksObj[nodes[m]["link"]]) {
                    delete linksObj[nodes[m]["link"]];
                }
            }
            var obj = {
                link: Object.keys(linksObj),
                node: Object.keys(nodesObj)
            };
            return obj;
        };
        /**
         *   路口创建中的方法 根据link删除对象中的重复
         * @param linksArr
         * @param nodesArr
         * @param links
         * @returns {{link: Array, node: Array}}
         */
        $scope.minusArrByLink = function (linksArr, nodesArr, links) {
            var nodesObj = {}, linksObj = {};
            for (var j = 0, lenJ = linksArr.length; j < lenJ; j++) {
                linksObj[linksArr[j]] = true;
            }
            for (var i = 0, lenI = nodesArr.length; i < lenI; i++) {
                nodesObj[nodesArr[i]] = true;
            }
            for (var m = 0, lenM = links.length; m < lenM; m++) {
                if (links[m]["nodes"]) {
                    if (nodesObj[links[m]["nodes"][0]]) {
                        delete nodesObj[links[m]["nodes"][0]];
                    } else if (nodesObj[links[m]["nodes"][1]]) {
                        delete nodesObj[links[m]["nodes"][1]];
                    }
                } else if (links[m]["links"]) {
                    delete linksObj[links[m]["link"]];
                }
            }
            var obj = {
                link: Object.keys(linksObj),
                node: Object.keys(nodesObj)
            };
            return obj;
        };
        /**
         * 路口创建中的方法 新增一个node点
         * @param nodesArr
         * @param linksArr
         * @param nodes
         * @param node
         */
        $scope.addArrByNode = function (nodesArr, linksArr, nodes, node) {
            for (var i = 0, lenI = nodes.length; i < lenI; i++) {
                for (var j = 0, lenJ = node.length; j < lenJ; j++) {
                    if (nodes[i]["link"] === node[j]["link"]) {
                        linksArr.push(node[j]["link"]);
                        nodesArr.push(node[j]["node"]);
                    } else {
                        nodesArr.push(node[j]["node"]);
                    }
                }
            }
            nodes = nodes.concat(node);
        };
        /**
         *  路口创建中的方法 增加一个link
         * @param linksArr
         * @param nodesArr
         * @param links
         * @param nodes
         * @param link
         */
        $scope.addArrByLink = function (linksArr, nodesArr, links, nodes, link) {
            for (var i = 0, lenI = link.length; i < lenI; i++) {
                linksArr.push(link[i]["link"]);
                nodesArr = nodesArr.concat(link[i]["node"]);
                links.push(link[i]["link"]);
                nodes = nodesArr.concat(link[i]["node"]);
            }
        };
        /**
         *  路口创建中的方法 是否包含某个link
         * @param linksArr
         * @param links
         */
        $scope.containLink = function (linksArr, links) {
            var flag = false, linksObj = {};
            for (var i = 0, len = linksArr.length; i < len; i++) {
                linksObj[linksArr[i]] = true;
            }
            for (var j = 0, lenJ = links.length; j < lenJ; j++) {
                if (linksObj[j]["links"]) {
                    flag = true;
                    break;
                }
            }

        };
        /**
         *  路口创建中的方法 是否包含某个node
         * @param arr
         * @param node
         * @returns {boolean}
         */
        $scope.containsNode = function (arr, node) {
            var obj = {}, flag = false;
            for (var i = 0, len = arr.length; i < len; i++) {
                obj[arr[i]] = true;
            }
            for (var j = 0, lenJ = node.length; j < lenJ; j++) {
                if (obj[node[j]["node"]]) {
                    flag = true;
                    break;
                }
            }
            return flag;
        };

        /**
         *  路口创建中的方法 提取框选中的数据为创建路口
         * @param data
         * @returns {{links: Array, nodes: Array}}
         */
        $scope.getDataFromRectangleForCross = function (data) {
            var borderData = data.data, border = data.border, linkArr = [], nodeArr = [];
            var points = border._latlngs;
            var transform = new fastmap.mapApi.MecatorTranform();
            var point0 = new fastmap.mapApi.Point(points[1].lng, points[1].lat);
            var point1 = new fastmap.mapApi.Point(points[2].lng, points[2].lat);
            var point2 = new fastmap.mapApi.Point(points[3].lng, points[3].lat);
            var point3 = new fastmap.mapApi.Point(points[0].lng, points[0].lat);
            var lineString = new fastmap.mapApi.LinearRing([point0, point1, point2, point3, point0]);
            var polygon = new fastmap.mapApi.Polygon([lineString]);
            for (var item in borderData) {
                var properties = borderData[item]["data"]["properties"],
                    coordinates = borderData[item]["line"]["points"];
                var startPoint = coordinates[0],
                    endPoint = coordinates[coordinates.length - 1];
                if (polygon.containsPoint(startPoint)) {
                    if (polygon.containsPoint(endPoint)) {
                        linkArr.push({
                            "node": [parseInt(properties.snode), parseInt(properties.enode)],
                            "link": parseInt(properties.id)
                        });

                    } else {
                        var sObj = {
                            "node": parseInt(properties.snode),
                            "link": parseInt(properties.id)
                        }
                        nodeArr.push(sObj);
                    }


                } else if (polygon.containsPoint(endPoint)) {

                    if (polygon.containsPoint(startPoint)) {
                        linkArr.push({
                            "node": [parseInt(properties.snode), parseInt(properties.enode)],
                            "link": parseInt(properties.id)
                        });
                    } else {
                        var eObj = {
                            "node": parseInt(properties.enode),
                            "link": parseInt(properties.id)
                        };
                        nodeArr.push(eObj);
                    }
                }
            }
            return {
                links: linkArr,
                nodes: nodeArr
            }
        };
        /**
         * 创建上下线分离
         * @param event
         */
        $scope.upAndDown = function (event) {
            var type = event.currentTarget.type;
            if (type === 'chooseOver') {
                dsRoad.getByCondition($scope.param).then(function (data) {
                    var highLightFeatures = [];
                    highRenderCtrl.highLightFeatures.length = 0;
                    highRenderCtrl._cleanHighLight();
                    $scope.linkMulity = [];
                    $scope.links = data.data;
                    for (var i = 0; i < $scope.links.length; i++) {
                        $scope.linkMulity.push($scope.links[i].pid);
                        if (i == 0) {
                            highLightFeatures.push({
                                id: $scope.links[i].pid.toString(),
                                layerid: 'referenceLine',
                                type: 'line',
                                style: {
                                    color: 'red'
                                }
                            });
                        } else if (i == $scope.links.length - 1) {
                            highLightFeatures.push({
                                id: $scope.links[i].pid.toString(),
                                layerid: 'referenceLine',
                                type: 'line',
                                style: {
                                    color: 'green'
                                }
                            });
                        }
                        else {
                            highLightFeatures.push({
                                id: $scope.links[i].pid.toString(),
                                layerid: 'referenceLine',
                                type: 'line',
                                style: {}
                            });
                        }
                    }
                    highRenderCtrl.highLightFeatures = highLightFeatures;
                    highRenderCtrl.drawHighlight();

                })
            }
            else if (type === "RETRYLINK") {
                var links = $scope.linkMulity;
                var highLightFeatures1 = [];
                map.currentTool = new fastmap.uikit.SelectPath(
                    {
                        map: map,
                        currentEditLayer: rdLink,
                        linksFlag: true,
                        shapeEditor: shapeCtrl
                    });
                tooltipsCtrl.setCurrentTooltip('选择需要删除或新增的线！');
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    for (var j = 0; j < links.length; j++) {
                        if (data.id == links[j]) {
                            links = links.slice(0, j);
                            break;
                        }
                    }
                    highRenderCtrl.highLightFeatures.length = 0;
                    highRenderCtrl._cleanHighLight();
                    for (var i = 0; i < links.length; i++) {
                        if (i == 0) {
                            highLightFeatures1.push({
                                id: links[i].toString(),
                                layerid: 'referenceLine',
                                type: 'line',
                                style: {
                                    color: 'red'
                                }
                            });
                        } else if (i == links.length - 1) {
                            highLightFeatures1.push({
                                id: links[i].toString(),
                                layerid: 'referenceLine',
                                type: 'line',
                                style: {
                                    color: 'green'
                                }
                            });
                        }
                        else {
                            highLightFeatures1.push({
                                id: links[i].toString(),
                                layerid: 'referenceLine',
                                type: 'line',
                                style: {}
                            });
                        }
                    }
                    highRenderCtrl.highLightFeatures = highLightFeatures1;
                    highRenderCtrl.drawHighlight();
                    $scope.linkMulity = links;
                });


            } else if (type === fastmap.mapApi.ShapeOptionType.PATHBUFFER) {
                if ($scope.linkMulity) {
                    tooltipsCtrl.setCurrentTooltip('上下线分离请用鼠标滚轮调整间距！');
                } else {
                    tooltipsCtrl.setCurrentTooltip('上下线分离,先选择link！');
                    return;
                }
                map.scrollWheelZoom.disable();
                map.currentTool.disable();

                $scope.param1 = {};
                $scope.param1["dbId"] = App.Temp.dbId;
                $scope.param1["type"] = "RDLINK";
                $scope.param1["data"] = {
                    "linkPids": $scope.linkMulity
                };

                dsRoad.getByCondition($scope.param1).then(function (data) {
                    var linkArr = data.data, points = [];
                    for (var i = 0, len = linkArr.length; i < len; i++) {
                        var pointOfLine = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
                        points.push(pointOfLine);
                    }
                    var line = fastmap.mapApi.lineString(points);
                    this.transform = new fastmap.mapApi.MecatorTranform();
                    var scale = this.transform.scale(map);
                    var linwidth = 6.6 / scale;
                    selectCtrl.onSelected({
                        geometry: line,
                        id: $scope.linkMulity,
                        linkWidth: linwidth,
                        type: 'Buffer'
                    });
                    feature = selectCtrl.selectedFeatures;

                    layerCtrl.pushLayerFront('edit');
                    var sObj = shapeCtrl.shapeEditorResult;
                    editLayer.drawGeometry = feature;
                    editLayer.draw(feature, editLayer);
                    sObj.setOriginalGeometry(feature);
                    sObj.setFinalGeometry(feature);
                    shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType["PATHBUFFER"]);
                    shapeCtrl.startEditing();
                    tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存画线,或者按ESC键取消!");
                });

            }
        };
        /**
         * 添加geometry
         * @param type
         * @param num
         * @param event
         */
        $scope.addShape = function (type, num, event) {
            if (map.floatMenu) {
                map.removeLayer(map.floatMenu);
                map.floatMenu = null;
            }
            if (event) {
                event.stopPropagation();
            }
            highRenderCtrl._cleanHighLight();
            highRenderCtrl.highLightFeatures.length = 0;
            $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false})
            $("#popoverTips").hide();
            editLayer.clear();
            editLayer.bringToBack();
            shapeCtrl.shapeEditorResult.setFinalGeometry(null);
            shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
            rdLink.clearAllEventListeners();
            if (tooltipsCtrl.getCurrentTooltip()) {
                tooltipsCtrl.onRemoveTooltip();
            }

            if (map.currentTool && typeof map.currentTool.cleanHeight === "function") {
                map.currentTool.cleanHeight();
                map.currentTool.disable();//禁止当前的参考线图层的事件捕获
            }
            $scope.changeBtnClass(num);

            //连续点击两次按钮
            if (num !== 7) {
                if (!$scope.classArr[num]) {
                    map.currentTool.disable();
                    map._container.style.cursor = '';
                    return;
                }
            }

            if (type === "RDRESTRICTION") {
                $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": true});
                var restrictionObj = {};
                restrictionObj["showTransitData"] = []
                restrictionObj["showAdditionalData"] = [];
                restrictionObj["showNormalData"] = [];
                restrictionObj["inLaneInfoArr"] = [];
                objCtrl.setOriginalData(restrictionObj);
                var addRestrictionObj = {
                    "loadType": "attrTplContainer",
                    "propertyCtrl": appPath.road + 'ctrls/toolBar_cru_ctrl/addRestrictionCtrl/addRdrestrictionCtrl',
                    "propertyHtml": appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/addRestrictionTepl/addRdrestrictionTpl.html'
                }
                $scope.$emit("transitCtrlAndTpl", addRestrictionObj);
            }
            else if (type === "RDLINK") {
                if (shapeCtrl.shapeEditorResult) {
                    shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point(0, 0)]));
                    selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                    layerCtrl.pushLayerFront('edit');
                }
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.DRAWPATH);
                shapeCtrl.startEditing();
                //重置创建link时   扑捉工具中的值
                shapeCtrl.getCurrentTool().clickcount = 1;
                shapeCtrl.getCurrentTool().catches.length = 0;
                shapeCtrl.getCurrentTool().snodePid = 0;
                shapeCtrl.getCurrentTool().enodePid = 0;

                map.currentTool = shapeCtrl.getCurrentTool();
                map.currentTool.enable();
                shapeCtrl.editFeatType = "rdLink";

                //把点和线图层放到捕捉工具中
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                map.currentTool.snapHandler.addGuideLayer(rdnode);
                tooltipsCtrl.setEditEventType(fastmap.mapApi.ShapeOptionType.DRAWPATH);
                tooltipsCtrl.setCurrentTooltip('开始画线！');
                tooltipsCtrl.setStyleTooltip("color:black;");
                tooltipsCtrl.setChangeInnerHtml("双击最后一个点结束画线!");
                tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存画线,或者按ESC键取消!");
            }
            else if (type === "RDSPEEDLIMIT") {
                var minLen = 100000, pointsOfDis, pointForAngle, angle;
                if (shapeCtrl.shapeEditorResult) {
                    shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point(0, 0)]));
                    selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                    layerCtrl.pushLayerFront('edit');
                }
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.POINTVERTEXADD);
                shapeCtrl.startEditing();
                map.currentTool = shapeCtrl.getCurrentTool();
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                tooltipsCtrl.setEditEventType('pointVertexAdd');
                tooltipsCtrl.setCurrentTooltip('点击增加限速!！');
                tooltipsCtrl.setStyleTooltip("color:black;");
                eventController.on(eventController.eventTypes.RESETCOMPLETE, function (e) {
                    var pro = e.property;
                    dsRoad.getRdObjectById(pro.id, "RDLINK").then(function (data) {
                        if (data.errcode == 0) {
                            selectCtrl.onSelected({
                                geometry: data.data.geometry.coordinates,
                                id: data.data.pid,
                                direct: pro.direct,
                                point: $.extend(true, {}, shapeCtrl.shapeEditorResult.getFinalGeometry())
                            });

                            var linkArr = data.data.geometry.coordinates || data.geometry.coordinates, points = [];
                            if (pro.direct == 1) {
                                tooltipsCtrl.setEditEventType(fastmap.dataApi.GeoLiveModelType.RDSPEEDLIMIT);
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
                                var marker = {
                                    flag: true,
                                    point: point,
                                    type: "marker",
                                    angle: angle,
                                    orientation: "2",
                                    pointForDirect: point
                                };
                                layerCtrl.pushLayerFront('edit');
                                var sObj = shapeCtrl.shapeEditorResult;
                                editLayer.drawGeometry = marker;
                                editLayer.draw(marker, editLayer);
                                sObj.setOriginalGeometry(marker);
                                sObj.setFinalGeometry(marker);
                                shapeCtrl.setEditingType("transformDirect");
                                shapeCtrl.startEditing();
                                tooltipsCtrl.setCurrentTooltip("选择方向!");
                                tooltipsCtrl.setChangeInnerHtml("点击空格保存,或者按ESC键取消!");
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
            }
            //else if (type === "RDBRANCH") {
            //    shapeCtrl.setEditingType("addRdBranch");
            //    shapeCtrl.editFeatType = 0;
            //    tooltipsCtrl.setEditEventType('rdBranch');
            //    tooltipsCtrl.setCurrentTooltip('正要新建分歧,先选择线！');
            //    map.currentTool = new fastmap.uikit.SelectForRestriction({
            //        map: map,
            //        createBranchFlag: true,
            //        currentEditLayer: rdLink
            //    });
            //    map.currentTool.enable();
            //    $scope.excitLineArr = [];
            //    $scope.limitRelation.branchType = 0;
            //    eventController.on(eventController.eventTypes.GETLINKID, function (data) {
            //        if (data.index === 0) {
            //            $scope.limitRelation.inLinkPid = parseInt(data.id);
            //            highRenderCtrl.highLightFeatures.push({
            //                id:  $scope.limitRelation.inLinkPid.toString(),
            //                layerid: 'referenceLine',
            //                type: 'line',
            //                style: {}
            //            });
            //            highRenderCtrl.drawHighlight();
            //            tooltipsCtrl.setStyleTooltip("color:black;");
            //            tooltipsCtrl.setChangeInnerHtml("已经选择进入线,选择进入点!");
            //        } else if (data.index === 1) {
            //            $scope.limitRelation.nodePid = parseInt(data.id);
            //            highRenderCtrl.highLightFeatures.push({
            //                id:  $scope.limitRelation.nodePid.toString(),
            //                layerid: 'referenceLine',
            //                type: 'rdnode',
            //                style: {}
            //            });
            //            highRenderCtrl.drawHighlight();
            //            tooltipsCtrl.setStyleTooltip("color:red;");
            //            tooltipsCtrl.setChangeInnerHtml("已经选择进入点,选择退出线!");
            //        } else if (data.index > 1) {
            //            $scope.excitLineArr.push(parseInt(data.id));
            //            highRenderCtrl.highLightFeatures.push({
            //                id:  data.id.toString(),
            //                layerid: 'referenceLine',
            //                type: 'line',
            //                style: {}
            //            });
            //            highRenderCtrl.drawHighlight();
            //            $scope.limitRelation.outLinkPid = $scope.excitLineArr[0];
            //            tooltipsCtrl.setChangeInnerHtml("已选退出线,点击空格键保存!");
            //        }
            //        featCodeCtrl.setFeatCode($scope.limitRelation);
            //    })
            //
            //}
            else if (type === "RDCROSS") {
                var linksArr = [], nodesArr = [], nodes = [], links = [], options = {};
                tooltipsCtrl.setCurrentTooltip('请框选路口组成Node！');
                shapeCtrl.toolsSeparateOfEditor("addRdCross", {
                    map: map,
                    layer: rdLink,
                    type: "rectangle"
                })
                map.currentTool = shapeCtrl.getCurrentTool();
                eventController.on(eventController.eventTypes.GETBOXDATA, function (event) {
                    tooltipsCtrl.setCurrentTooltip('已选择路口，按空格保存或者esc取消！');
                    var data = $scope.getDataFromRectangleForCross(event), highlightFeatures = [];
                    if (nodesArr.length === 0) {
                        for (var nodeNum = 0, nodeLen = data["nodes"].length; nodeNum < nodeLen; nodeNum++) {
                            nodesArr.push(data["nodes"][nodeNum]["node"]);
                        }
                        for (var linkNum = 0, linkLen = data["links"].length; linkNum < linkLen; linkNum++) {
                            nodesArr = nodesArr.concat(data["links"][linkNum]["node"]);
                            linksArr.push(data["links"][linkNum]["link"]);
                        }
                        nodes = nodes.concat(data["nodes"]);
                        links = links.concat(data["links"]);

                    } else {
                        if (data['nodes']) {
                            if ($scope.containsNode(nodesArr, data["nodes"])) {
                                var minusObj = $scope.minusArrByNode(nodesArr, linksArr, data['nodes']);
                                linksArr = minusObj["link"];
                                nodesArr = minusObj["node"];
                            } else {
                                $scope.addArrByNode(nodesArr, linksArr, nodes, data["nodes"]);
                            }

                        } else if (data['links']) {
                            if ($scope.containLink(linksArr, data["links"])) {
                                var minusLink = $scope.minusArrByLink(linksArr, nodesArr, data["links"]);
                                linksArr = minusLink["link"];
                                nodesArr = minusLink["node"];
                            } else {
                                $scope.addArrByLink(linksArr, nodesArr, links, nodes, data["links"]);
                            }

                        }
                    }
                    linksArr = $scope.distinctArr(linksArr);
                    nodesArr = $scope.distinctArr(nodesArr);
                    for (var i = 0, lenI = linksArr.length; i < lenI; i++) {

                        highlightFeatures.push({
                            id: linksArr[i].toString(),
                            layerid: 'referenceLine',
                            type: 'line',
                            style: {}
                        })
                    }
                    for (var j = 0, lenJ = nodesArr.length; j < lenJ; j++) {
                        highlightFeatures.push({
                            id: nodesArr[j].toString(),
                            layerid: 'referenceLine',
                            type: 'node',
                            style: {}
                        })
                    }
                    highRenderCtrl.highLightFeatures = highlightFeatures;
                    highRenderCtrl.drawHighlight();
                    options = {"nodePids": nodesArr, "linkPids": linksArr};
                    selectCtrl.onSelected(options);
                });


            }
            else if (type === "RDLANECONNEXITY") {
                $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": true})
                var obj = {};
                obj["showTransitData"] = []
                obj["showAdditionalData"] = [];
                obj["showNormalData"] = [];
                obj["inLaneInfoArr"] = [];
                objCtrl.setOriginalData(obj);
                var addLaneObj = {
                    "loadType": "attrTplContainer",
                    "propertyCtrl": appPath.road + 'ctrls/toolBar_cru_ctrl/addConnexityCtrl/addLaneconnexityCtrl',
                    "propertyHtml": appPath.root +appPath.road + 'tpls/toolBar_cru_tpl/addConnexityTepl/addLaneconnexityTpl.html'
                }
                $scope.$emit("transitCtrlAndTpl", addLaneObj);
            }
            else if (type === "RDNODE") {
                if (shapeCtrl.shapeEditorResult) {
                    shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point(0, 0)]));
                    selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                    layerCtrl.pushLayerFront('edit');
                }

                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.POINTVERTEXADD);
                shapeCtrl.startEditing();
                map.currentTool = shapeCtrl.getCurrentTool();
                shapeCtrl.editFeatType = "rdLink";
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                tooltipsCtrl.setEditEventType('pointVertexAdd');
                tooltipsCtrl.setCurrentTooltip('开始增加节点！');
                tooltipsCtrl.setStyleTooltip("color:black;");
                tooltipsCtrl.setChangeInnerHtml("点击增加节点!");
                tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存,或者按ESC键取消!");
            }
            else if (type === 'RDGSC') {
                tooltipsCtrl.setEditEventType('rdgsc');
                tooltipsCtrl.setCurrentTooltip('正要新建立交,请框选立交点位！');
                shapeCtrl.toolsSeparateOfEditor("addRdGsc", {
                    map: map,
                    layer: rdLink,
                    type: "rectangle"
                });
                map.currentTool = shapeCtrl.getCurrentTool();
                eventController.on(eventController.eventTypes.GETBOXDATA, function (event) {
                    var data = event.data, highlightFeatures = [],
                        rectangleData = {       //矩形框信息geoJson
                            "type": "Polygon",
                            "coordinates": [[]]
                        },
                        latArr = event.border._latlngs;
                    /*过滤框选后的数组，去重*/
                    for (var i = 0; i < data.length; i++) {
                        for (var j = 0; j < data.length; j++) {
                            if (i != j && data[i]) {
                                if (data[i].data.properties.id == data[j].data.properties.id) {
                                    data.splice(i, 1);
                                }
                            }
                        }
                    }
                    for (var rec = 0; rec < latArr.length; rec++) {
                        var tempArr = [];
                        tempArr.push(latArr[rec].lng);
                        tempArr.push(latArr[rec].lat);
                        rectangleData.coordinates[0].push(tempArr);
                        if (rec == latArr.length - 1) {
                            rectangleData.coordinates[0].push(rectangleData.coordinates[0][0]);
                        }
                    }
                    /*高亮link*/
                    for (var i = 0, lenI = data.length; i < lenI; i++) {
                        highlightFeatures.push({
                            id: data[i].data.properties.id.toString(),
                            layerid: 'referenceLine',
                            type: 'RDGSC',
                            index: i,
                            style: {
                                size: 5
                            }
                        })
                    }
                    highRenderCtrl.highLightFeatures = highlightFeatures;
                    highRenderCtrl.drawHighlight();
                    /*运算两条线的交点坐标*/
                    $scope.segmentsIntr = function (a, b) {    //([{x:_,y:_},{x:_,y:_}],[{x:_,y:_},{x:_,y:_}]) a,b为两条直线
                        var area_abc = (a[0].x - b[0].x) * (a[1].y - b[0].y) - (a[0].y - b[0].y) * (a[1].x - b[0].x);
                        var area_abd = (a[0].x - b[1].x) * (a[1].y - b[1].y) - (a[0].y - b[1].y) * (a[1].x - b[1].x);
                        // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);
                        if (area_abc * area_abd >= 0) {
                            return false;
                        }

                        var area_cda = (b[0].x - a[0].x) * (b[1].y - a[0].y) - (b[0].y - a[0].y) * (b[1].x - a[0].x);
                        var area_cdb = area_cda + area_abc - area_abd;
                        if (area_cda * area_cdb >= 0) {
                            return false;
                        }

                        //计算交点坐标
                        var t = area_cda / ( area_abd - area_abc );
                        var dx = t * (a[1].x - a[0].x),
                            dy = t * (a[1].y - a[0].y);
                        return {x: (a[0].x + dx).toFixed(5), y: (a[0].y + dy).toFixed(5)};//保留小数点后5位
                    }
                    /*去除重复的坐标点，保留一个*/
                    var ArrUnique = function (arr) {
                        for (var i = 0; i < arr.length; i++) {
                            for (var j = 0; j < arr.length; j++) {
                                if (i != j) {
                                    if (arr[i].x == arr[j].x && arr[i].y == arr[j].y) {
                                        arr.splice(j, 1);
                                    }
                                }
                            }
                        }
                        /*清除空数组*/
                        arr.filter(function (v) {
                            if (v.length > 0) {
                                return v;
                            }
                        })
                        return arr;
                    }
                    /*当坐标数组拆分组合完成后*/
                    var crossGeos = [],
                        loopTime = (data.length * data.length - 1) / 2,   //循环次数C(n,2)
                        jsonData = {
                            'geometry': rectangleData,
                            'linkObjs': []
                        };
                    if (data.length > 1) {
                        for (var i = 0; i < loopTime - 1; i++) {
                            for (var j = i + 1; j < data.length; j++) {
                                if (i != j) {
                                    var lineGeoArr = function (mark) {
                                        return [data[mark].line.points[0], data[mark].line.points[1]];
                                    }
                                    crossGeos.push($scope.segmentsIntr(lineGeoArr(i), lineGeoArr(j)));
                                }
                            }
                        }
                        crossGeos = ArrUnique(crossGeos);
                    }
                    /*点击调整link层级高低*/
                    $scope.changeLevel = function () {
                        editLayer.drawGeometry = null;
                        map.currentTool.options.repeatMode = false;
                        shapeCtrl.stopEditing();
                        editLayer.bringToBack();
                        $(editLayer.options._div).unbind();
                        $scope.changeBtnClass("");
                        shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                        shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
                        editLayer.clear();
                        $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false});
                        map._container.style.cursor = '';
                        map.currentTool = new fastmap.uikit.SelectPath(
                            {
                                map: map,
                                currentEditLayer: rdLink,
                                linksFlag: true,
                                shapeEditor: shapeCtrl
                            });
                        map.currentTool.enable();
                        rdLink.options.selectType = 'link';
                        rdLink.options.editable = true;
                        eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                            /*把当前link的level_index升高一级*/
                            for (var i = 0, lenI = jsonData.linkObjs.length; i < lenI; i++) {
                                if (jsonData.linkObjs[i].pid == data.id) {
                                    for (var j = 0, lenJ = jsonData.linkObjs.length; j < lenJ; j++) {
                                        if (jsonData.linkObjs[j].level_index == jsonData.linkObjs[i].level_index + 1) {
                                            jsonData.linkObjs[j].level_index--;
                                        }
                                    }
                                    jsonData.linkObjs[i].level_index = +1;
                                }
                            }
                            /*重绘link颜f色*/
                            for (var i = 0; i < jsonData.linkObjs.length; i++) {
                                highlightFeatures.push({
                                    id: jsonData.linkObjs[i].pid.toString(),
                                    layerid: 'referenceLine',
                                    type: 'RDGSC',
                                    index: jsonData.linkObjs[i].level_index,
                                    style: {
                                        size: 5
                                    }
                                });
                                highRenderCtrl.highLightFeatures = highlightFeatures;
                                highRenderCtrl.drawHighlight();
                            }
                        })
                    }
                    //判断相交点数
                    if (crossGeos.length == 0) {
                        tooltipsCtrl.setCurrentTooltip('所选区域无相交点，请重新选择立交点位！');
                    } else if (crossGeos.length > 1) {
                        tooltipsCtrl.setCurrentTooltip('不能有多个相交点，请重新选择立交点位！');
                    } else {
                        //map.currentTool.disable();//禁止当前的参考线图层的事件捕获
                        /*重组linkData格式*/
                        for (var linkMark = 0; linkMark < data.length; linkMark++) {
                            var tempObj = {'pid': data[linkMark].data.properties.id, 'level_index': linkMark};
                            jsonData.linkObjs.push(tempObj);
                        }
                        tooltipsCtrl.setCurrentTooltip("点击link调整层级,空格保存,或者按ESC键取消!");
                        $scope.changeLevel();
                        selectCtrl.onSelected(jsonData);
                    }
                });
            }
            //else if (type === '3dBranch') {
            //    var highLightFeatures = [],
            //        linkDirect = 0;
            //    shapeCtrl.setEditingType(fastmap.dataApi.GeoLiveModelType.RDBRANCH);
            //    shapeCtrl.editFeatType = 3;
            //    tooltipsCtrl.setEditEventType('rdBranch');
            //    tooltipsCtrl.setCurrentTooltip('正要新建3D分歧,先选择线！');
            //    map.currentTool = new fastmap.uikit.SelectForRestriction({
            //        map: map,
            //        createBranchFlag: true,
            //        currentEditLayer: rdLink
            //    });
            //    map.currentTool.enable();
            //    $scope.excitLineArr = [];
            //    $scope.limitRelation.branchType = 3;
            //    /*获取退出线*/
            //    $scope.getOutLink = function (dataId) {
            //        $scope.limitRelation.outLinkPid = parseInt(dataId);
            //        if (highLightFeatures.length === 3) {
            //            highLightFeatures.pop();
            //        }
            //        highRenderCtrl._cleanHighLight();
            //        highLightFeatures.push({
            //            id: $scope.limitRelation.outLinkPid.toString(),
            //            layerid: 'referenceLine',
            //            type: 'line',
            //            style: {}
            //        });
            //        highRenderCtrl.drawHighlight();
            //        tooltipsCtrl.setChangeInnerHtml("已选退出线,点击空格键保存!");
            //    }
            //    eventController.on(eventController.eventTypes.GETLINKID, function (data) {
            //        if (data.index === 0) {
            //            $scope.limitRelation.inLinkPid = parseInt(data.id);
            //            highLightFeatures.push({
            //                id: $scope.limitRelation.inLinkPid.toString(),
            //                layerid: 'referenceLine',
            //                type: 'line',
            //                style: {}
            //            });
            //            highRenderCtrl.highLightFeatures = highLightFeatures;
            //            highRenderCtrl.drawHighlight();
            //            tooltipsCtrl.setChangeInnerHtml("已经选择进入线,选择进入点!");
            //            linkDirect = data["properties"]["direct"];
            //            if (linkDirect == 2 || linkDirect == 3) {
            //                $scope.limitRelation.nodePid = parseInt(linkDirect == 2 ? data["properties"]['enode'] : data["properties"]['snode']);
            //                highLightFeatures.push({
            //                    id: $scope.limitRelation.nodePid.toString(),
            //                    layerid: 'referenceLine',
            //                    type: 'rdnode',
            //                    style: {}
            //                });
            //                highRenderCtrl.drawHighlight();
            //                map.currentTool.selectedFeatures.push($scope.limitRelation.nodePid.toString());
            //                tooltipsCtrl.setChangeInnerHtml("已经选择进入点,选择退出线!");
            //            }
            //        } else if (data.index === 1) {
            //            if (linkDirect == 2 || linkDirect == 3) {
            //                $scope.getOutLink(data.id);
            //            }
            //            else {
            //                $scope.limitRelation.nodePid = parseInt(data.id);
            //                tooltipsCtrl.setChangeInnerHtml("已经选择进入点,选择退出线!");
            //            }
            //        } else if (data.index > 1) {
            //            $scope.getOutLink(data.id);
            //            $scope.limitRelation.outLinkPid = data.id;
            //
            //        }
            //        featCodeCtrl.setFeatCode($scope.limitRelation);
            //    })
            //}
            else if (type === 'RDMULTIDIGITIZED') {
                var highLightFeatures = [];
                var linkDirect = 0;
                var realNodeId = '';
                shapeCtrl.setEditingType(fastmap.dataApi.GeoLiveModelType.RDBRANCH);
                shapeCtrl.editFeatType = 3;
                tooltipsCtrl.setEditEventType('rdBranch');
                tooltipsCtrl.setCurrentTooltip('正要新建上下线分离,先选择线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink
                });
                map.currentTool.enable();
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    if (data.index === 0) {
                        $scope.limitRelation.inLinkPid = parseInt(data.id);
                        highLightFeatures.push({
                            id: $scope.limitRelation.inLinkPid.toString(),
                            layerid: 'referenceLine',
                            type: 'line',
                            style: {}
                        });
                        highRenderCtrl.highLightFeatures = highLightFeatures;
                        highRenderCtrl.drawHighlight();
                        linkDirect = data["properties"]["direct"];
                        if (linkDirect == 2) {
                            realNodeId = data["properties"]["enode"];
                        } else if (linkDirect == 3) {
                            realNodeId = data["properties"]["snode"];
                        }
                        tooltipsCtrl.setChangeInnerHtml("已经选择进入线,选择点!");
                    } else if (data.index === 1) {
                        $scope.limitRelation.nodePid = parseInt(data.id);
                        if (linkDirect != 1) {
                            if ($scope.limitRelation.nodePid == realNodeId) {

                            } else {
                                swal("操作失败", "点方向与道路方向不符，请重新选择！", "error");
                                return;
                            }
                        }
                        highLightFeatures.push({
                            id: $scope.limitRelation.nodePid.toString(),
                            layerid: 'referenceLine',
                            type: 'node',
                            style: {}
                        });
                        highRenderCtrl.highLightFeatures = highLightFeatures;
                        highRenderCtrl.drawHighlight();
                        $scope.param = {};
                        $scope.param["command"] = "CREATE";
                        $scope.param["dbId"] = App.Temp.dbId;
                        $scope.param["type"] = "RDLINK";
                        $scope.param["data"] = {
                            "linkPid": $scope.limitRelation.inLinkPid,
                            "nodePidDir": $scope.limitRelation.nodePid
                        }
                        if (!map.floatMenu) {
                            map.floatMenu = new L.Control.FloatMenu("000", data.event.originalEvent, {
                                items: [{
                                    'text': "<a class='glyphicon glyphicon-apple'></a>",
                                    'title': "选择完成",
                                    'type': 'chooseOver',
                                    'class': "feaf",
                                    callback: $scope.upAndDown
                                }, {
                                    'text': "<a class='glyphicon glyphicon-apple'></a>",
                                    'title': "重新选择线",
                                    'type': 'RETRYLINK',
                                    'class': "feaf",
                                    callback: $scope.upAndDown
                                }, {
                                    'text': "<a class='glyphicon glyphicon-apple'></a>",
                                    'title': "上下线分离",
                                    'type': 'pathBuffer',
                                    'class': "feaf",
                                    callback: $scope.upAndDown
                                }]
                            })
                            map.addLayer(map.floatMenu);
                            map.floatMenu.setVisible(true);
                        }
                    }

                });
            }
            //新增加的分歧(实景分歧);
            else if (type.split('_').length==2) {
                var typeArr = type.split('_');
                var currentActiveBranch = '';
                //保存所有需要高亮的图层数组;
                var highLightFeatures = [],linkDirect = 0;
                //设置快捷键保存的事件类型;
                shapeCtrl.setEditingType(typeArr[0]);
                //根据不同的分歧种类构建limitRelation的参数;
                switch (typeArr[1]){
                    case 'REALIMAGE':currentActiveBranch='实景图';$scope.limitRelation.branchType = 5; break;
                    case 'SIGNBOARDNAME':currentActiveBranch='方向看板';$scope.limitRelation.branchType = 9; break;
                    case 'SIGNASREAL':currentActiveBranch='实景看板';$scope.limitRelation.branchType = 6; break;
                    case 'SERIESBRANCH':currentActiveBranch='连续分歧';$scope.limitRelation.branchType = 7; break;
                    case 'BIGCROSSSCHEMATIC':currentActiveBranch='大路口交叉点模式';$scope.limitRelation.branchType = 8; break;
                    case 'NORMALROAD':currentActiveBranch='普通道路方面';$scope.limitRelation.branchType = 1; break;
                    case 'HIGHWAY':currentActiveBranch='高速分歧';$scope.limitRelation.branchType = 0; break;
                    case '3D':currentActiveBranch='3D分歧';$scope.limitRelation.branchType = 3; break;
                }
                //地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdBranch');
                tooltipsCtrl.setCurrentTooltip('正要新建'+currentActiveBranch+'分歧,先选择线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({map: map, createBranchFlag: true, currentEditLayer: rdLink});
                map.currentTool.enable();
                //获取退出线并高亮;
                $scope.getOutLink = function (dataId) {
                    $scope.limitRelation.outLinkPid = parseInt(dataId);
                    if (highLightFeatures.length === 3) {
                        highLightFeatures.pop();
                    }
                    highRenderCtrl._cleanHighLight();
                    highLightFeatures.push({
                        id: $scope.limitRelation.outLinkPid.toString(),
                        layerid: 'referenceLine',
                        type: 'line',
                        style: {}
                    });
                    highRenderCtrl.drawHighlight();
                    tooltipsCtrl.setChangeInnerHtml("已选退出线,点击空格键保存!");
                }
                //选择分歧监听事件;
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    if (data.index === 0) {
                        $scope.limitRelation.inLinkPid = parseInt(data.id);
                        highLightFeatures.push({
                            id: $scope.limitRelation.inLinkPid.toString(),
                            layerid: 'referenceLine',
                            type: 'line',
                            style: {}
                        });
                        highRenderCtrl.highLightFeatures = highLightFeatures;
                        highRenderCtrl.drawHighlight();
                        tooltipsCtrl.setChangeInnerHtml("已经选择进入线,选择进入点!");
                        linkDirect = data["properties"]["direct"];
                        if (linkDirect == 2 || linkDirect == 3) {
                            $scope.limitRelation.nodePid = parseInt(linkDirect == 2 ? data["properties"]['enode'] : data["properties"]['snode']);
                            highLightFeatures.push({
                                id: $scope.limitRelation.nodePid.toString(),
                                layerid: 'referenceLine',
                                type: 'rdnode',
                                style: {}
                            });
                            highRenderCtrl.drawHighlight();
                            map.currentTool.selectedFeatures.push($scope.limitRelation.nodePid.toString());
                            tooltipsCtrl.setChangeInnerHtml("已经选择进入点,选择退出线!");
                        }
                    } else if (data.index === 1) {
                        if (linkDirect == 2 || linkDirect == 3) {
                            $scope.getOutLink(data.id);
                        }
                        else {
                            $scope.limitRelation.nodePid = parseInt(data.id);
                            tooltipsCtrl.setChangeInnerHtml("已经选择进入点,选择退出线!");
                        }
                    } else if (data.index > 1) {
                        $scope.getOutLink(data.id);
                        $scope.limitRelation.outLinkPid = data.id;

                    }
                    featCodeCtrl.setFeatCode($scope.limitRelation);
                })
            }
        }

    }]
)
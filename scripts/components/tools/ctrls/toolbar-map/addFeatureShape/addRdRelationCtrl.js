/**
 * Created by liuyang on 2016/8/5.
 */
angular.module('app').controller("addRdRelationCtrl", ['$scope', '$ocLazyLoad', 'dsEdit', 'appPath','$timeout',
    function($scope, $ocLazyLoad, dsEdit, appPath,$timeout) {
        var layerCtrl = fastmap.uikit.LayerController();
        var featCodeCtrl = fastmap.uikit.FeatCodeController();
        var editLayer = layerCtrl.getLayerById('edit');
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var selectCtrl = fastmap.uikit.SelectController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var rdLink = layerCtrl.getLayerById('rdLink');
        var rwLink = layerCtrl.getLayerById('rwLink');
        var rdnode = layerCtrl.getLayerById('rdNode');
        var highRenderCtrl = fastmap.uikit.HighRenderController();
        var objCtrl = fastmap.uikit.ObjectEditController();
        var eventController = fastmap.uikit.EventController();
        $scope.jsonData = null;
        $scope.limitRelation = {};
        /**
         * 两点之间的距离
         * @param pointA
         * @param pointB
         * @returns {number}
         */
        $scope.distance = function(pointA, pointB) {
            var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
            return Math.sqrt(len);
        };
        /**
         * 两点之间的夹角
         * @param pointA
         * @param pointB
         * @returns {*}
         */
        $scope.includeAngle = function(pointA, pointB) {
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
        $scope.distinctArr = function(arr) {
            var dObj = {};
            for (var i = 0, len = arr.length; i < len; i++) {
                dObj[arr[i]] = true;
            }
            return Object.keys(dObj);
        };
        /**
         * 数据中是否有rdLink
         * @param data
         * @returns {boolean}
         */
        $scope.containsRdLink = function(data) {
            return data.filter(function(item) {
                return item["type"] === "RDLINK";
            }).length !== 0;
        };
        /**
         * 数据中是否有rwLink
         * @param data
         * @returns {boolean}
         */
        $scope.containsRwLink = function(data) {
            return data.filter(function(item) {
                return item["type"] === "RWLINK";
            }).length !== 0;
        };
        /**
         * 运算两条线的交点坐标
         * @param a
         * @param b
         * @returns {*}
         */
        $scope.segmentsIntr = function(a, b) { //([{x:_,y:_},{x:_,y:_}],[{x:_,y:_},{x:_,y:_}]) a,b为两条直线
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
            var t = area_cda / (area_abd - area_abc);
            var dx = t * (a[1].x - a[0].x),
                dy = t * (a[1].y - a[0].y);
            return {
                x: (a[0].x + dx).toFixed(5),
                y: (a[0].y + dy).toFixed(5)
            }; //保留小数点后5位
        };
        /**
         * 去除重复的坐标点，保留一个
         * @param arr
         * @returns {*}
         * @constructor
         */
        $scope.ArrUnique = function(arr) {
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
            arr.filter(function(v) {
                if (v.length > 0) {
                    return v;
                }
            });
            return arr;
        };
        $scope.changeIndexCallback = function(data) {
            $scope.jsonData.linkObjs.sort(function(a, b) {
                if (a["zlevel"] < b["zlevel"]) {
                    return 1
                } else if (a["zlevel"] > b["zlevel"]) {
                    return -1;
                } else {
                    return 0;
                }
            });
            /*把当前link的zlevel升高一级*/
            for (var zLevelNum = 0, zLevelLen = $scope.jsonData.linkObjs.length; zLevelNum < zLevelLen; zLevelNum++) {
                if ($scope.jsonData.linkObjs[zLevelNum].pid == data.id) {
                    if (($scope.jsonData.linkObjs[zLevelNum].zlevel) <= zLevelLen - 1 && zLevelNum !== 0) {
                        $scope.jsonData.linkObjs[zLevelNum - 1].zlevel -= 1;
                        $scope.jsonData.linkObjs[zLevelNum].zlevel += 1;
                        break;
                    }
                }
            }
            /*重绘link颜f色*/
            for (var i = 0; i < $scope.jsonData.linkObjs.length; i++) {
                highRenderCtrl.highLightFeatures.push({
                    id: $scope.jsonData.linkObjs[i].pid.toString(),
                    layerid: $scope.jsonData.linkObjs[i]["type"] === "RDLINK" ? 'rdLink' : 'rwLink',
                    type: 'RDGSC',
                    index: $scope.jsonData.linkObjs[i].zlevel,
                    style: {
                        size: 5
                    }
                });
                highRenderCtrl.drawHighlight();
            }
        };
        /**
         * 调整link层级高低
         */
        $scope.changeLevel = function() {
                editLayer.drawGeometry = null;
                map.currentTool.options.repeatMode = false;
                shapeCtrl.stopEditing();
                editLayer.bringToBack();
                $(editLayer.options._div).unbind();
                $scope.changeBtnClass("");
                shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
                editLayer.clear();
                $scope.$emit("SWITCHCONTAINERSTATE", {
                    "attrContainerTpl": false
                });
                map._container.style.cursor = '';
                if ($scope.containsRdLink($scope.jsonData.linkObjs)) {
                    map.currentTool = new fastmap.uikit.SelectPath({
                        map: map,
                        currentEditLayer: rdLink,
                        linksFlag: true,
                        shapeEditor: shapeCtrl
                    });
                    map.currentTool.enable();
                }
                if ($scope.containsRwLink($scope.jsonData.linkObjs)) {
                    map.currentTool.rwEvent = new fastmap.uikit.SelectPath({
                        map: map,
                        currentEditLayer: rwLink,
                        linksFlag: true,
                        shapeEditor: shapeCtrl
                    });
                    map.currentTool.rwEvent.enable();
                }
                rdLink.options.selectType = 'link';
                rdLink.options.editable = true;
                eventController.off(eventController.eventTypes.GETLINKID, $scope.changeIndexCallback)
                eventController.on(eventController.eventTypes.GETLINKID, $scope.changeIndexCallback)
            }
            /**
             *  路口创建中的方法 根据node删除对象中的重复
             * @param nodesArr
             * @param linksArr
             * @param nodes
             * @returns {{link: Array, node: Array}}
             */
        $scope.minusArrByNode = function(nodesArr, linksArr, nodes) {
            var nodesObj = {},
                linksObj = {};
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
            return {
                link: Object.keys(linksObj),
                node: Object.keys(nodesObj)
            };
        };
        /**
         *   路口创建中的方法 根据link删除对象中的重复
         * @param linksArr
         * @param nodesArr
         * @param links
         * @returns {{link: Array, node: Array}}
         */
        $scope.minusArrByLink = function(linksArr, nodesArr, links) {
            var nodesObj = {},
                linksObj = {};
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
            return {
                link: Object.keys(linksObj),
                node: Object.keys(nodesObj)
            };
        };
        /**
         * 路口创建中的方法 新增一个node点
         * @param nodesArr
         * @param linksArr
         * @param nodes
         * @param node
         */
        $scope.addArrByNode = function(nodesArr, linksArr, nodes, node) {
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
        $scope.addArrByLink = function(linksArr, nodesArr, links, nodes, link) {
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
        $scope.containLink = function(linksArr, links) {
            var flag = false,
                linksObj = {};
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
        $scope.containsNode = function(arr, node) {
            var obj = {},
                flag = false;
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
        $scope.getDataFromRectangleForCross = function(data) {
            var borderData = data.data,
                border = data.border,
                linkArr = [],
                nodeArr = [];
            var points = border._latlngs;
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
         * 添加geometry
         * @param type
         * @param num
         * @param event
         */
        $scope.addShape = function(type) {
            //大于17级才可以选择地图上各种geometry
            if (map.getZoom() < 17) {
                swal("提示","地图缩放等级必须大于16级才可操作","info");
                return;
            }
            //重置选择工具
            $scope.resetToolAndMap();
            $scope.$emit("SWITCHCONTAINERSTATE", {
                "attrContainerTpl": false,
                "subAttrContainerTpl": false
            });
            $("#popoverTips").hide();
            if (type === "RDRESTRICTION") {
                $scope.resetOperator("addRelation", type);
                $scope.$emit("SWITCHCONTAINERSTATE", {
                    "attrContainerTpl": true
                });
                var restrictionObj = {};
                restrictionObj["showTransitData"] = [];
                restrictionObj["showAdditionalData"] = [];
                restrictionObj["showNormalData"] = [];
                restrictionObj["inLaneInfoArr"] = [];
                objCtrl.setOriginalData(restrictionObj);
                var addRestrictionObj = {
                    "loadType": "attrTplContainer",
                    "propertyCtrl": appPath.road + 'ctrls/toolBar_cru_ctrl/addRestrictionCtrl/addRdrestrictionCtrl',
                    "propertyHtml": appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/addRestrictionTepl/addRdrestrictionTpl.html'
                };
                $scope.$emit("transitCtrlAndTpl", addRestrictionObj);
            }  else if (type === "RDSPEEDLIMIT") {
                $scope.resetOperator("addRelation", type);
                var minLen = 100000,
                    pointsOfDis, pointForAngle, angle;
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
                eventController.on(eventController.eventTypes.RESETCOMPLETE, function(e) {
                    var pro = e.property;
                    dsEdit.getByPid(pro.id, "RDLINK").then(function(data) {
                        if (data) {
                            selectCtrl.onSelected({
                                geometry: data.geometry.coordinates,
                                id: data.pid,
                                direct: pro.direct,
                                point: $.extend(true, {}, shapeCtrl.shapeEditorResult.getFinalGeometry())
                            });
                            var linkArr = data.geometry.coordinates,
                                points = [];
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
                                    flag: false,
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
                                eventController.on(eventController.eventTypes.DIRECTEVENT,function(event){
                                    selectCtrl.selectedFeatures.direct = parseInt(event.geometry.orientation);
                                    tooltipsCtrl.setChangeInnerHtml("点击空格保存,或者按ESC键取消!");
                                })
                            } else {
                                shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                                tooltipsCtrl.setEditEventType('speedLimit');
                                tooltipsCtrl.setCurrentTooltip('请点击空格,创建限速!');
                                shapeCtrl.setEditingType("transformDirect");
                            }
                        } else {}
                    })
                });
            } else if (type === "RDCROSS") {
                $scope.resetOperator("addRelation", type);
                var linksArr = [],
                    nodesArr = [],
                    nodes = [],
                    links = [],
                    options = {};
                tooltipsCtrl.setCurrentTooltip('请框选路口组成Node！');
                shapeCtrl.toolsSeparateOfEditor("addRdCross", {
                    map: map,
                    layer: [rdLink],
                    type: "rectangle"
                });
                map.currentTool = shapeCtrl.getCurrentTool();
                eventController.off(eventController.eventTypes.GETBOXDATA);
                eventController.on(eventController.eventTypes.GETBOXDATA, function(event) {
                    tooltipsCtrl.setCurrentTooltip('已选择路口，按空格保存或者esc取消！');
                    var data = $scope.getDataFromRectangleForCross(event),
                        highlightFeatures = [];
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
                            layerid: 'rdLink',
                            type: 'line',
                            style: {}
                        })
                    }
                    for (var j = 0, lenJ = nodesArr.length; j < lenJ; j++) {
                        highlightFeatures.push({
                            id: nodesArr[j].toString(),
                            layerid: 'rdLink',
                            type: 'node',
                            style: {}
                        })
                    }
                    highRenderCtrl.highLightFeatures = highlightFeatures;
                    highRenderCtrl.drawHighlight();
                    options = {
                        "nodePids": nodesArr,
                        "linkPids": linksArr
                    };
                    selectCtrl.onSelected(options);
                });
            } else if (type === "RDLANECONNEXITY") {
                $scope.resetOperator("addRelation", type);
                $scope.$emit("SWITCHCONTAINERSTATE", {
                    "attrContainerTpl": true
                });
                var obj = {};
                obj["showTransitData"] = [];
                obj["showAdditionalData"] = [];
                obj["showNormalData"] = [];
                obj["inLaneInfoArr"] = [];
                objCtrl.setOriginalData(obj);
                var addLaneObj = {
                    "loadType": "attrTplContainer",
                    "propertyCtrl": appPath.road + 'ctrls/toolBar_cru_ctrl/addConnexityCtrl/addLaneconnexityCtrl',
                    "propertyHtml": appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/addConnexityTepl/addLaneconnexityTpl.html'
                };
                $scope.$emit("transitCtrlAndTpl", addLaneObj);
            }  else if (type === 'RDGSC') {
                $scope.resetOperator("addRelation", type);
                tooltipsCtrl.setEditEventType('rdgsc');
                tooltipsCtrl.setCurrentTooltip('正要新建立交,请框选立交点位！');
                shapeCtrl.toolsSeparateOfEditor("addRdGsc", {
                    map: map,
                    layer: [rdLink, rwLink],
                    type: "rectangle"
                });
                map.currentTool = shapeCtrl.getCurrentTool();
                eventController.on(eventController.eventTypes.GETBOXDATA, function(event) {
                    $scope.jsonData = null;
                    var data = event.data,
                        highlightFeatures = [],
                        containObj = {},
                        dealData = [],
                        rectangleData = { //矩形框信息geoJson
                            "type": "Polygon",
                            "coordinates": [
                                []
                            ]
                        },
                        latArr = event.border._latlngs;
                    /*过滤框选后的数组，去重*/
                    for (var num = 0, numLen = data.length; num < numLen; num++) {
                        if (!containObj[data[num].data.properties.id]) {
                            dealData.push(data[num]);
                            containObj[data[num].data.properties.id] = true;
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
                    for (var i = 0, lenI = dealData.length; i < lenI; i++) {
                        highlightFeatures.push({
                            id: dealData[i].data.properties.id.toString(),
                            layerid: dealData[i].data.properties.featType == "RDLINK" ? 'rdLink' : 'rwLink',
                            type: 'RDGSC',
                            index: i,
                            style: {
                                size: 5
                            }
                        })
                    }
                    highRenderCtrl.highLightFeatures = highlightFeatures;
                    highRenderCtrl.drawHighlight();
                    /*当坐标数组拆分组合完成后*/
                    var crossGeos = [],
                        loopTime = (dealData.length * dealData.length - 1) / 2; //循环次数C(n,2)
                    $scope.jsonData = {
                        'geometry': rectangleData,
                        'linkObjs': []
                    };
                    if (dealData.length > 1) {
                        for (var i = 0; i < loopTime - 1; i++) {
                            for (var j = i + 1; j < dealData.length; j++) {
                                if (i != j) {
                                    var lineGeoArr = function(mark) {
                                        return [dealData[mark].line.points[0], dealData[mark].line.points[1]];
                                    }
                                    crossGeos.push($scope.segmentsIntr(lineGeoArr(i), lineGeoArr(j)));
                                }
                            }
                        }
                        crossGeos = $scope.ArrUnique(crossGeos);
                    }
                    //判断相交点数
                    if (crossGeos.length == 0) {
                        tooltipsCtrl.setCurrentTooltip('所选区域无相交点，请重新选择立交点位！');
                    } else if (crossGeos.length > 1) {
                        tooltipsCtrl.setCurrentTooltip('不能有多个相交点，请重新选择立交点位！');
                    } else {
                        //map.currentTool.disable();//禁止当前的参考线图层的事件捕获
                        /*重组linkData格式*/
                        for (var linkMark = 0; linkMark < dealData.length; linkMark++) {
                            var tempObj = {
                                'pid': dealData[linkMark].data.properties.id,
                                'type': dealData[linkMark].data.properties.featType,
                                'zlevel': linkMark
                            };
                            $scope.jsonData.linkObjs.push(tempObj);
                        }
                        tooltipsCtrl.setCurrentTooltip("点击link调整层级,空格保存,或者按ESC键取消!");
                        $scope.changeLevel();
                        selectCtrl.onSelected($scope.jsonData);
                    }
                });
            }  else if (type === 'TRAFFIC_SIGNAL') {     //信号灯
                $scope.resetOperator("addRelation", type);
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.TRAFFICSIGNAL);
                tooltipsCtrl.setCurrentTooltip('请选择制作信号灯的路口！');
                layerCtrl.pushLayerFront('edit'); //置顶editLayer
                //初始化选择点工具
                map.currentTool = new fastmap.uikit.SelectNode({
                    map: map,
                    nodesFlag: true,
                    shapeEditor: shapeCtrl
                });
                map.currentTool.enable();
                //需要捕捉的图层
                eventController.off(eventController.eventTypes.GETNODEID, selectObjCallback);
                eventController.on(eventController.eventTypes.GETNODEID, selectObjCallback);
                function selectObjCallback(data){
                    $scope.$emit("SWITCHCONTAINERSTATE", {
                        "subAttrContainerTpl": false
                    });
                    //地图小于17级时不能选择
                    if (map.getZoom < 17) {
                        return;
                    }
                    map.closePopup();//如果有popup的话清除它
                    if (map.floatMenu) {
                        map.removeLayer(map.floatMenu);
                        map.floatMenu = null;
                    }
                    //清除上一个选择的高亮
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures = [];
                    var tempHighlight = [];
                    tempHighlight.push({
                        id: data.id.toString(),
                        layerid: 'rdLink',
                        type: 'node',
                        style: {}
                    });
                    highRenderCtrl.highLightFeatures = tempHighlight;
                    highRenderCtrl.drawHighlight();
                    tooltipsCtrl.setCurrentTooltip('点击空格保存信号灯,或者按ESC键取消!');
                }
            } else if(type === "RD_GATE"){ //大门
                $scope.resetOperator("addRelation", type);
                //保存所有需要高亮的图层数组;线方向
                var highLightFeatures = [],linkDirect = 0;
                //设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.GATE);
                //地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdGate');
                tooltipsCtrl.setCurrentTooltip('请选择进入线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList:['line','point']
                });
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink);

                $scope.gate = {};
                var automaticCommand = function (){ //自动计算退出线
                    var param = {};
                    param["dbId"] = App.Temp.dbId;
                    param["type"] = "RDLINK";
                    param["data"] = { "nodePid": $scope.gate.nodePid };
                    dsEdit.getByCondition(param).then(function(continueLinks) {
                        if (continueLinks.errcode === -1) {
                            return;
                        }
                        if(continueLinks.data){
                            if(continueLinks.data.length > 2){
                                featCodeCtrl.setFeatCode({});
                                swal("错误信息", "退出线有多条，不允许创建大门", "error");
                                tooltipsCtrl.setCurrentTooltip("退出线有多条，不允许创建大门!");
                                return ;
                            }
                            for(var i = 0 ,len = continueLinks.data.length; i < len ; i ++){
                                if(continueLinks.data[i].pid != $scope.gate.inLinkPid){
                                    $scope.gate.outLinkPid = continueLinks.data[i].pid ;

                                    highLightFeatures.push({
                                        id: $scope.gate.outLinkPid.toString(),
                                        layerid: 'rdLink',
                                        type: 'line',
                                        style: {}
                                    });
                                    highRenderCtrl.drawHighlight();
                                    map.currentTool.selectedFeatures.push($scope.gate.outLinkPid.toString());

                                    featCodeCtrl.setFeatCode($scope.gate);
                                    tooltipsCtrl.setCurrentTooltip("已选退出线,点击空格键保存!");
                                    break;
                                }
                            }
                        }
                    });
                };

                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID,function (data){
                    if (data.index === 0) { //进入线;
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];

                        map.currentTool.snapHandler.addGuideLayer(rdnode);

                        $scope.gate.inLinkPid = parseInt(data.id);
                        highLightFeatures.push({
                            id: $scope.gate.inLinkPid.toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {
                                color: '#21ed25'
                            }
                        });
                        highRenderCtrl.highLightFeatures = highLightFeatures;
                        highRenderCtrl.drawHighlight();
                        tooltipsCtrl.setCurrentTooltip("已经选择进入线,选择进入点!");
                        linkDirect = data["properties"]["direct"];
                        if (linkDirect == 2 || linkDirect == 3) { //单方向
                            map.currentTool.snapHandler.snaped = false;
                            map.currentTool.clearCross();
                            map.currentTool.snapHandler._guides = [];

                            $scope.gate.nodePid = parseInt(linkDirect == 2 ? data["properties"]['enode'] : data["properties"]['snode']);
                            highLightFeatures.push({
                                id: $scope.gate.nodePid.toString(),
                                layerid: 'rdLink',
                                type: 'node',
                                style: {
                                    color: 'yellow'
                                }
                            });
                            highRenderCtrl.drawHighlight();
                            map.currentTool.selectedFeatures.push($scope.gate.nodePid.toString());

                            automaticCommand();
                            // featCodeCtrl.setFeatCode($scope.gate);
                            // tooltipsCtrl.setCurrentTooltip("已选进入点,请选择退出线!");
                        }
                    } else if (data.index === 1){ //进入点
                        //清除鼠标十字
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];

                        //map.currentTool.snapHandler.addGuideLayer(rdLink); //增加吸附图层

                        $scope.gate.nodePid = parseInt(data.id);
                        highLightFeatures.push({
                            id: $scope.gate.nodePid.toString(),
                            layerid: 'rdLink',
                            type: 'node',
                            style: {
                                color: 'yellow'
                            }
                        });
                        highRenderCtrl.drawHighlight();
                        map.currentTool.selectedFeatures.push($scope.gate.nodePid.toString());

                        automaticCommand();


                    } else if (data.index >= 2){ //退出线
                        $scope.gate.outLinkPid = parseInt(data.id);

                        if (highLightFeatures.length === 3) {
                            highLightFeatures.pop();
                            highRenderCtrl._cleanHighLight();
                        }

                        highLightFeatures.push({
                            id: $scope.gate.outLinkPid.toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {}
                        });
                        highRenderCtrl.drawHighlight();
                        map.currentTool.selectedFeatures.push($scope.gate.outLinkPid.toString());
                        featCodeCtrl.setFeatCode($scope.gate);
                        tooltipsCtrl.setCurrentTooltip("已选退出线,点击空格键保存!");
                    }
                });
            } else if (type === 'RD_WARNINGINFO'){ //警示信息
                $scope.resetOperator("addRelation", type);
                //保存所有需要高亮的图层数组;线方向
                var highLightFeatures = [],linkDirect = 0;
                //设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.WARNINGINFO);
                //地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdWarningInfo');
                tooltipsCtrl.setCurrentTooltip('请选择进入线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList:['line','point']
                });
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink);

                $scope.warningInfo = {};
                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID,function (data){
                    if (data.index === 0) { //进入线;
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];

                        map.currentTool.snapHandler.addGuideLayer(rdnode);

                        $scope.warningInfo.inLinkPid = parseInt(data.id);
                        highLightFeatures.push({
                            id: $scope.warningInfo.inLinkPid.toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {
                                color: '#21ed25'
                            }
                        });
                        highRenderCtrl.highLightFeatures = highLightFeatures;
                        highRenderCtrl.drawHighlight();
                        tooltipsCtrl.setCurrentTooltip("已经选择进入线,选择进入点!");
                        linkDirect = data["properties"]["direct"];
                        if (linkDirect == 2 || linkDirect == 3) { //单方向
                            map.currentTool.snapHandler.snaped = false;
                            map.currentTool.clearCross();
                            map.currentTool.snapHandler._guides = [];

                            $scope.warningInfo.nodePid = parseInt(linkDirect == 2 ? data["properties"]['enode'] : data["properties"]['snode']);
                            highLightFeatures.push({
                                id: $scope.warningInfo.nodePid.toString(),
                                layerid: 'rdLink',
                                type: 'rdnode',
                                style: {
                                    color: 'yellow'
                                }
                            });
                            highRenderCtrl.drawHighlight();
                            map.currentTool.selectedFeatures.push(nodePid.toString());

                            featCodeCtrl.setFeatCode($scope.warningInfo);
                            tooltipsCtrl.setCurrentTooltip("已选进入点,点击空格键保存!");
                        }
                    } else if (data.index === 1){ //进入点
                        $scope.warningInfo.nodePid = parseInt(data.id);
                        highLightFeatures.push({
                            id: $scope.warningInfo.nodePid.toString(),
                            layerid: 'rdLink',
                            type: 'rdnode',
                            style: {
                                color: '#21ed25'
                            }
                        });
                        highRenderCtrl.drawHighlight();
                        map.currentTool.selectedFeatures.push($scope.warningInfo.nodePid.toString());
                        featCodeCtrl.setFeatCode($scope.warningInfo);
                        tooltipsCtrl.setCurrentTooltip("已选进入点,点击空格键保存!");
                    }
                });
            } else if(type === "ELECTRONIC_EYE"){   //电子眼
                $scope.resetOperator("addRelation", type);
                var minLen = 100000,
                    pointsOfDis, pointForAngle, angle;
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
                tooltipsCtrl.setCurrentTooltip('请选择电子眼位置点！');
                tooltipsCtrl.setStyleTooltip("color:black;");
                eventController.off(eventController.eventTypes.RESETCOMPLETE);
                eventController.on(eventController.eventTypes.RESETCOMPLETE, function(e) {
                    var pro = e.property;
                    dsEdit.getByPid(pro.id, "RDLINK").then(function(data) {
                        if (data) {
                            selectCtrl.onSelected({
                                geometry: data.geometry.coordinates,
                                id: data.pid,
                                direct: pro.direct,
                                point: $.extend(true, {}, shapeCtrl.shapeEditorResult.getFinalGeometry())
                            });
                            var linkArr = data.geometry.coordinates,
                                points = [];
                            if (pro.direct == 1) {
                                tooltipsCtrl.setEditEventType(fastmap.dataApi.GeoLiveModelType.RDELECTRONICEYE);
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
                                    flag: false,
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
                                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.ELECTRONICEYE);
                                shapeCtrl.startEditing();
                                tooltipsCtrl.setCurrentTooltip("点击方向图标开始修改方向！");
                                eventController.on(eventController.eventTypes.DIRECTEVENT,function(event){
                                    selectCtrl.selectedFeatures.direct = parseInt(event.geometry.orientation);
                                    tooltipsCtrl.setChangeInnerHtml("点击空格保存,或者按ESC键取消!");
                                })
                            } else {
                                shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                                // tooltipsCtrl.setEditEventType(fastmap.dataApi.GeoLiveModelType.RDELECTRONICEYE);
                                tooltipsCtrl.setCurrentTooltip('请点击空格,创建电子眼!');
                                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.ELECTRONICEYE);
                            }
                        } else {}
                    })
                });
            } else if (type === 'RDSLOPE'){ //坡度
                $scope.resetOperator("addRelation", type);
                var highLightFeatures = [];
                var linkPids = [];//推荐的退出线
                var continueLinkPid = null;//退出线或者连续link的另一个端点
                var linkLength = 0;//长度
                var slopeData = {nodePid:null,linkPid:null};
                var exLinkPids = [];//所有的连续link

                highRenderCtrl.highLightFeatures.length = 0;
                highRenderCtrl._cleanHighLight();
                //设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDSLOPE);
                //地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdSlope');
                tooltipsCtrl.setCurrentTooltip('请选择坡度起始点！！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList:['point','line']
                });
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdnode);

                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID,function (data){
                    if (data.index === 0){ //进入点
                        slopeData.nodePid = parseInt(data.id);
                        highLightFeatures.push({
                            id: data.id.toString(),
                            layerid: 'rdLink',
                            type: 'rdnode',
                            style: {
                                color: '#21ed25'
                            }
                        });
                        var param = {};
                        param["dbId"] = App.Temp.dbId;
                        param["type"] = "RDLINK";
                        param["data"] = {
                            "nodePid": data.id
                        };
                        dsEdit.getByCondition(param).then(function(linkData) {
                            if (linkData.errcode === -1) {
                                return;
                            }
                            //排除10级道路（人行道）,提供推荐退出线
                            if(linkData.data){
                                if (linkData.data.length == 1 && linkData.kind != 10) {     //直接作为退出线并高亮
                                    dsEdit.getByPid(linkData.data[0].pid, "RDLINK").then(function (exLink) {   //查询退出线的长度
                                        linkLength += exLink.length;
                                        slopeData.linkPid = parseInt(linkData.data[0].pid);
                                        highLightFeatures.push({
                                            id: linkData.data[0].pid.toString(),
                                            layerid: 'rdLink',
                                            type: 'line',
                                            style: {
                                                color: 'red'
                                            }
                                        });
                                        highRenderCtrl.highLightFeatures = highLightFeatures;
                                        highRenderCtrl.drawHighlight();

                                        //判断此退出线是否有多个挂接link
                                        var param1 = {};
                                        param1["dbId"] = App.Temp.dbId;
                                        param1["type"] = "RDLINK";
                                        if (linkData.data[0].sNodePid == slopeData.nodePid) {
                                            param1["data"] = {
                                                "nodePid": linkData.data[0].eNodePid
                                            };
                                        } else {
                                            param1["data"] = {
                                                "nodePid": linkData.data[0].sNodePid
                                            };
                                        }
                                        dsEdit.getByCondition(param1).then(function (continueLinks) {
                                            if (continueLinks.errcode === -1) {
                                                return;
                                            }
                                            if (continueLinks.data) {
                                                if (continueLinks.data.length > 2 ||continueLinks.data.length == 1 ) {
                                                    tooltipsCtrl.setCurrentTooltip("Link长度为："+linkLength+"米，点击空格保存坡度信息,或者按ESC键取消!");
                                                    eventController.off(eventController.eventTypes.GETLINKID);//不再寻找连续link
                                                } else if (continueLinks.data.length == 2) {
                                                    if(continueLinks.data[0].pid == slopeData.linkPid){
                                                        continueLinkPid = continueLinks.data[1].pid;
                                                    } else {
                                                        continueLinkPid = continueLinks.data[0].pid;
                                                    }
                                                    if (linkLength && linkLength < 100) {
                                                        tooltipsCtrl.setCurrentTooltip("Link长度为："+linkLength+"米，请选择坡度接续link!");
                                                        return;
                                                    }
                                                }
                                            }
                                        });
                                    });
                                }else if(linkData.data.length > 1) {
                                    //推荐退出线
                                    for (var index in linkData.data) {
                                        if(linkData.data[index].kind != 10){
                                            linkPids.push(linkData.data[index].pid);
                                            highLightFeatures.push({
                                                id:linkData.data[index].pid.toString(),
                                                layerid: 'rdLink',
                                                type: 'line',
                                                style: {
                                                    color: '#FF79BC'
                                                }
                                            });
                                        }
                                    }
                                    highRenderCtrl.highLightFeatures = highLightFeatures;
                                    highRenderCtrl.drawHighlight();
                                    tooltipsCtrl.setCurrentTooltip("请选择坡度退出线!");
                                }
                            }
                        });
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];
                        map.currentTool.snapHandler.addGuideLayer(rdLink);
                    } else{ //选择一条推荐的线作为退出线!;
                        if (slopeData.linkPid) {//已有退出线，不再进行逻辑判断
                            //连续link的处理如下
                            if (data.id == continueLinkPid) {   //所选的link是推荐link
                                exLinkPids.push(parseInt(data.id));
                                slopeData.linkPids = exLinkPids;
                                highRenderCtrl._cleanHighLight();
                                highLightFeatures.push({
                                    id: data.id.toString(),
                                    layerid: 'rdLink',
                                    type: 'line',
                                    style: {
                                        // color: 'red'
                                    }
                                });
                                highRenderCtrl.highLightFeatures = highLightFeatures;
                                highRenderCtrl.drawHighlight();
                                dsEdit.getByPid(parseInt(data.id), "RDLINK").then(function (conLinkDetail) {   //查询连续link的长度
                                    if (conLinkDetail) {
                                        linkLength += conLinkDetail.length;

                                        //判断此退出线是否有多个挂接link
                                        var param1 = {};
                                        param1["dbId"] = App.Temp.dbId;
                                        param1["type"] = "RDLINK";
                                        if (conLinkDetail.sNodePid == continueLinkPid) {
                                            param1["data"] = {
                                                "nodePid": conLinkDetail.eNodePid
                                            };
                                        } else {
                                            param1["data"] = {
                                                "nodePid": conLinkDetail.sNodePid
                                            };
                                        }
                                        dsEdit.getByCondition(param1).then(function (continueLinks) {
                                            if (continueLinks.errcode === -1) {
                                                return;
                                            }
                                            if (continueLinks.data) {
                                                if (continueLinks.data.length > 2) {
                                                    eventController.off(eventController.eventTypes.GETLINKID);//不再寻找连续link
                                                } else if (continueLinks.data.length == 2) {
                                                    if(continueLinks.data[0].pid == slopeData.linkPid){
                                                        continueLinkPid = continueLinks.data[1].pid;
                                                    } else {
                                                        continueLinkPid = continueLinks.data[0].pid;
                                                    }
                                                    if (linkLength && linkLength < 100) {
                                                        tooltipsCtrl.setCurrentTooltip("Link长度为："+linkLength+"米，请选择坡度接续link!");
                                                        return;
                                                    }
                                                }
                                            }
                                        });
                                    }
                                });
                            } else {
                                map.currentTool.selectedFeatures.pop();
                                return;
                            }
                        } else if (linkPids.indexOf(parseInt(data.id)) > -1) {   //所选的link在推荐link中
                            slopeData.linkPid = parseInt(data.id);
                            highLightFeatures.length = 0;
                            highRenderCtrl.highLightFeatures.length = 0;
                            highRenderCtrl._cleanHighLight();
                            highLightFeatures.push({
                                id: slopeData.nodePid.toString(),
                                layerid: 'rdLink',
                                type: 'rdnode',
                                style: {}
                            });
                            highLightFeatures.push({
                                id: data.id.toString(),
                                layerid: 'rdLink',
                                type: 'line',
                                style: {
                                    color: 'red'
                                }
                            });
                            highRenderCtrl.highLightFeatures = highLightFeatures;
                            highRenderCtrl.drawHighlight();
                            dsEdit.getByPid(slopeData.linkPid, "RDLINK").then(function (exLinkDetail) {   //查询退出线的长度
                                if (exLinkDetail) {
                                    linkLength += exLinkDetail.length;

                                    //判断此退出线是否有多个挂接link
                                    var param1 = {};
                                    param1["dbId"] = App.Temp.dbId;
                                    param1["type"] = "RDLINK";
                                    if (exLinkDetail.sNodePid == slopeData.nodePid) {
                                        param1["data"] = {
                                            "nodePid": exLinkDetail.eNodePid
                                        };
                                    } else {
                                        param1["data"] = {
                                            "nodePid": exLinkDetail.sNodePid
                                        };
                                    }
                                    dsEdit.getByCondition(param1).then(function (continueLinks) {
                                        if (continueLinks.errcode === -1) {
                                            return;
                                        }
                                        if (continueLinks.data) {
                                            if (continueLinks.data.length > 2) {
                                                eventController.off(eventController.eventTypes.GETLINKID);//不再寻找连续link
                                            } else if (continueLinks.data.length == 2) {
                                                if(continueLinks.data[0].pid == slopeData.linkPid){
                                                    continueLinkPid = continueLinks.data[1].pid;
                                                } else {
                                                    continueLinkPid = continueLinks.data[0].pid;
                                                }
                                                if (linkLength && linkLength < 100) {
                                                    tooltipsCtrl.setCurrentTooltip("Link长度为："+linkLength+"米，请选择坡度接续link!");
                                                    return;
                                                }
                                            }
                                        }
                                    });
                                }
                            });
                        } else {
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
                    }
                    shapeCtrl.shapeEditorResult.setFinalGeometry(slopeData);
                    tooltipsCtrl.setEditEventType('slopeData');
                    tooltipsCtrl.setCurrentTooltip("Link长度为："+linkLength+"米，点击空格保存坡度信息,或者按ESC键取消!");
                    shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDSLOPE);
                });
            } else if (type === 'RDDIRECTROUTE') {    //顺行
                $scope.resetOperator("addRelation", type);
                //保存所有需要高亮的图层数组;
                var highLightFeatures = [],
                    linkDirect = 0;
                //设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType('rdDirectRoute');
                //地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdDirectRoute');
                tooltipsCtrl.setCurrentTooltip('正要新建顺行,先选择线！');
                $scope.directRoute = {};
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList:['line','point','line']
                });
                map.currentTool.enable();
                //map.currentTool.snapHandler.addGuideLayer(rdnode);
                map.currentTool.snapHandler.addGuideLayer(rdLink); //添加自动吸附的图层
                //获取退出线并高亮;
                $scope.getOutLink = function(dataId) {
                    $scope.directRoute.outLinkPid = parseInt(dataId);
                    if (highLightFeatures.length === 3) {
                        highLightFeatures.pop();
                    }
                    highRenderCtrl._cleanHighLight();
                    highLightFeatures.push({
                        id: $scope.directRoute.outLinkPid.toString(),
                        layerid: 'rdLink',
                        type: 'line',
                        style: {}
                    });
                    highRenderCtrl.drawHighlight();
                    tooltipsCtrl.setCurrentTooltip("已选退出线,点击空格键保存!");
                }
                //选择分歧监听事件;
                eventController.on(eventController.eventTypes.GETLINKID, function(data) {
                    if (data.index === 0) {
                        //清除吸附的十字
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];

                        map.currentTool.snapHandler.addGuideLayer(rdnode);

                        //进入线;
                        $scope.directRoute.inLinkPid = parseInt(data.id);
                        highLightFeatures.push({
                            id: $scope.directRoute.inLinkPid.toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {
                                color: '#21ed25'
                            }
                        });
                        highRenderCtrl.highLightFeatures = highLightFeatures;
                        highRenderCtrl.drawHighlight();
                        tooltipsCtrl.setCurrentTooltip('已经选择进入线,选择进入点!');
                        linkDirect = data["properties"]["direct"];
                        if (linkDirect == 2 || linkDirect == 3) {
                            $scope.directRoute.nodePid = parseInt(linkDirect == 2 ? data["properties"]['enode'] : data["properties"]['snode']);
                            highLightFeatures.push({
                                id: $scope.directRoute.nodePid.toString(),
                                layerid: 'rdLink',
                                type: 'rdnode',
                                style: {
                                    color: 'yellow'
                                }
                            });
                            highRenderCtrl.drawHighlight();
                            map.currentTool.selectedFeatures.push($scope.directRoute.nodePid.toString());
                            tooltipsCtrl.setCurrentTooltip("已经选择进入点,选择退出线!");

                            //清除吸附的十字
                            map.currentTool.snapHandler.snaped = false;
                            map.currentTool.clearCross();
                            map.currentTool.snapHandler._guides = [];
                            map.currentTool.snapHandler.addGuideLayer(rdLink);
                        }
                    } else if (data.index === 1) {
                        if (linkDirect == 2 || linkDirect == 3) {
                            $scope.getOutLink(data.id);
                        } else {
                            $scope.directRoute.nodePid = parseInt(data.id);
                            highLightFeatures.push({
                                id: $scope.directRoute.nodePid.toString(),
                                layerid: 'rdLink',
                                type: 'rdnode',
                                style: {
                                    color: 'yellow'
                                }
                            });
                            highRenderCtrl.drawHighlight();
                            tooltipsCtrl.setCurrentTooltip("已经选择进入点,选择退出线!");

                            //清除吸附的十字
                            map.currentTool.snapHandler.snaped = false;
                            map.currentTool.clearCross();
                            map.currentTool.snapHandler._guides = [];

                            map.currentTool.snapHandler.addGuideLayer(rdLink);
                        }
                    } else if (data.index > 1) {
                        $scope.getOutLink(data.id);
                        $scope.directRoute.outLinkPid = parseInt(data.id);
                    }
                    featCodeCtrl.setFeatCode($scope.directRoute);
                })
            } else if (type === 'RDSPEEDBUMP'){ //减速带
                $scope.resetOperator("addRelation", type);
                //保存所有需要高亮的图层数组;线方向
                var highLightFeatures = [],linkDirect = 0;
                //设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDSPEEDBUMP);
                //地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdSpeedBump');
                tooltipsCtrl.setCurrentTooltip('请选择进入线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList:['line','point']
                });
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink);

                $scope.speedBumpInfo = {};
                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID,function (data){
                    if (data.index === 0) { //进入线;
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];

                        map.currentTool.snapHandler.addGuideLayer(rdnode);

                        $scope.speedBumpInfo.inLinkPid = parseInt(data.id);
                        highLightFeatures.push({
                            id: $scope.speedBumpInfo.inLinkPid.toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {
                                color: '#21ed25'
                            }
                        });
                        highRenderCtrl.highLightFeatures = highLightFeatures;
                        highRenderCtrl.drawHighlight();
                        tooltipsCtrl.setCurrentTooltip("已经选择进入线,选择进入点!");
                        linkDirect = data["properties"]["direct"];
                        if (linkDirect == 2 || linkDirect == 3) { //单方向
                            map.currentTool.snapHandler.snaped = false;
                            map.currentTool.clearCross();
                            map.currentTool.snapHandler._guides = [];

                            $scope.speedBumpInfo.nodePid = parseInt(linkDirect == 2 ? data["properties"]['enode'] : data["properties"]['snode']);
                            highLightFeatures.push({
                                id: $scope.speedBumpInfo.nodePid.toString(),
                                layerid: 'rdLink',
                                type: 'rdnode',
                                style: {
                                    color: 'yellow'
                                }
                            });
                            highRenderCtrl.drawHighlight();
                            map.currentTool.selectedFeatures.push($scope.speedBumpInfo.nodePid.toString());

                            featCodeCtrl.setFeatCode($scope.speedBumpInfo);
                            tooltipsCtrl.setCurrentTooltip("已选进入点,点击空格键保存!");
                        }
                    } else if (data.index === 1){ //进入点
                        $scope.speedBumpInfo.nodePid = parseInt(data.id);
                        highLightFeatures.push({
                            id: $scope.speedBumpInfo.nodePid.toString(),
                            layerid: 'rdLink',
                            type: 'rdnode',
                            style: {
                                color: '#21ed25'
                            }
                        });
                        highRenderCtrl.drawHighlight();
                        map.currentTool.selectedFeatures.push($scope.speedBumpInfo.nodePid.toString());
                        featCodeCtrl.setFeatCode($scope.speedBumpInfo);
                        tooltipsCtrl.setCurrentTooltip("已选进入点,点击空格键保存!");
                    }
                });
            } else if(type === "RDSE"){ //分叉口提示
                $scope.resetOperator("addRelation", type);
                //保存所有需要高亮的图层数组;线方向
                var highLightFeatures = [],linkDirect = 0;
                //设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDSE);
                //地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdSe');
                tooltipsCtrl.setCurrentTooltip('请选择进入线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList:['line','point']
                });
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink);

                $scope.rdSe = {};
                var automaticCommand = function (){ //自动计算退出线
                    var param = {};
                    param["dbId"] = App.Temp.dbId;
                    param["type"] = "RDLINK";
                    param["data"] = { "nodePid": $scope.rdSe.nodePid };
                    dsEdit.getByCondition(param).then(function(continueLinks) {
                        console.info(continueLinks);
                        if (continueLinks.errcode === -1) {
                            return;
                        }
                        if(continueLinks.data){
                            if(continueLinks.data.length > 2){
                                featCodeCtrl.setFeatCode({});
                                swal("错误信息", "退出线有多条，不允许创建分叉口提示", "error");
                                tooltipsCtrl.setCurrentTooltip("退出线有多条，不允许创建分叉口提示!");
                                return ;
                            }
                            for(var i = 0 ,len = continueLinks.data.length; i < len ; i ++){
                                if(continueLinks.data[i].pid != $scope.rdSe.inLinkPid){
                                    $scope.rdSe.outLinkPid = continueLinks.data[i].pid ;

                                    highLightFeatures.push({
                                        id: $scope.rdSe.outLinkPid.toString(),
                                        layerid: 'rdLink',
                                        type: 'line',
                                        style: {}
                                    });
                                    highRenderCtrl.drawHighlight();
                                    map.currentTool.selectedFeatures.push($scope.rdSe.outLinkPid.toString());

                                    featCodeCtrl.setFeatCode($scope.rdSe);
                                    tooltipsCtrl.setCurrentTooltip("已选退出线,点击空格键保存!");
                                    break;
                                }
                            }
                        }
                    });
                };
                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID,function (data) {
                    if (data.index === 0) { //进入线;
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];

                        map.currentTool.snapHandler.addGuideLayer(rdnode);

                        $scope.rdSe.inLinkPid = parseInt(data.id);
                        highLightFeatures.push({
                            id: $scope.rdSe.inLinkPid.toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {
                                color: '#21ed25'
                            }
                        });
                        highRenderCtrl.highLightFeatures = highLightFeatures;
                        highRenderCtrl.drawHighlight();
                        tooltipsCtrl.setCurrentTooltip("已经选择进入线,选择进入点!");
                        linkDirect = data["properties"]["direct"];
                        if (linkDirect == 2 || linkDirect == 3) { //单方向
                            map.currentTool.snapHandler.snaped = false;
                            map.currentTool.clearCross();
                            map.currentTool.snapHandler._guides = [];

                            $scope.rdSe.nodePid = parseInt(linkDirect == 2 ? data["properties"]['enode'] : data["properties"]['snode']);
                            highLightFeatures.push({
                                id: $scope.rdSe.nodePid.toString(),
                                layerid: 'rdLink',
                                type: 'node',
                                style: {
                                    color: 'yellow'
                                }
                            });
                            highRenderCtrl.drawHighlight();
                            map.currentTool.selectedFeatures.push($scope.rdSe.nodePid.toString());

                            automaticCommand();
                            // featCodeCtrl.setFeatCode($scope.rdSe);
                            // tooltipsCtrl.setCurrentTooltip("已选进入点,请选择退出线!");
                        }
                    } else if (data.index >= 2){ //退出线
                        $scope.rdSe.outLinkPid = parseInt(data.id);

                        if (highLightFeatures.length === 3) {
                            highLightFeatures.pop();
                            highRenderCtrl._cleanHighLight();
                        }

                        highLightFeatures.push({
                            id: $scope.rdSe.outLinkPid.toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {}
                        });
                        highRenderCtrl.drawHighlight();
                        map.currentTool.selectedFeatures.push($scope.rdSe.outLinkPid.toString());
                        featCodeCtrl.setFeatCode($scope.rdSe);
                        tooltipsCtrl.setCurrentTooltip("已选退出线,点击空格键保存!");
                    }
                });
            } else if(type === "RDTOLLGATE"){ //收费站
                $scope.resetOperator("addRelation", type);
                //保存所有需要高亮的图层数组;线方向
                var highLightFeatures = [],linkDirect = 0;
                //设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDTOLLGATE);
                //地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdTollgate');
                tooltipsCtrl.setCurrentTooltip('请选择进入线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList:['line','point']
                });
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink);

                $scope.rdTollgateData = {};
                var automaticCommand = function (){ //自动计算退出线
                    var param = {};
                    param["dbId"] = App.Temp.dbId;
                    param["type"] = "RDLINK";
                    param["data"] = { "nodePid": $scope.rdTollgateData.nodePid };
                    dsEdit.getByCondition(param).then(function(continueLinks) {
                        console.info(continueLinks);
                        if (continueLinks.errcode === -1) {
                            return;
                        }
                        if(continueLinks.data){
                            if(continueLinks.data.length > 2){
                                featCodeCtrl.setFeatCode({});
                                swal("错误信息", "退出线有多条，不允许创建收费站", "error");
                                tooltipsCtrl.setCurrentTooltip("退出线有多条，不允许创建收费站!");
                                return ;
                            }
                            for(var i = 0 ,len = continueLinks.data.length; i < len ; i ++){
                                if(continueLinks.data[i].pid != $scope.rdTollgateData.inLinkPid){
                                    $scope.rdTollgateData.outLinkPid = continueLinks.data[i].pid ;

                                    highLightFeatures.push({
                                        id: $scope.rdTollgateData.outLinkPid.toString(),
                                        layerid: 'rdLink',
                                        type: 'line',
                                        style: {}
                                    });
                                    highRenderCtrl.drawHighlight();
                                    map.currentTool.selectedFeatures.push($scope.rdTollgateData.outLinkPid.toString());

                                    featCodeCtrl.setFeatCode($scope.rdTollgateData);
                                    tooltipsCtrl.setCurrentTooltip("已选退出线,点击空格键保存!");
                                    break;
                                }
                            }
                        }
                    });
                };

                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID,function (data){
                    if (data.index === 0) { //进入线;
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];

                        map.currentTool.snapHandler.addGuideLayer(rdnode);

                        $scope.rdTollgateData.inLinkPid = parseInt(data.id);
                        highLightFeatures.push({
                            id: $scope.rdTollgateData.inLinkPid.toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {
                                color: '#21ed25'
                            }
                        });
                        highRenderCtrl.highLightFeatures = highLightFeatures;
                        highRenderCtrl.drawHighlight();
                        tooltipsCtrl.setCurrentTooltip("已经选择进入线,选择进入点!");
                        linkDirect = data["properties"]["direct"];
                        if (linkDirect == 2 || linkDirect == 3) { //单方向
                            map.currentTool.snapHandler.snaped = false;
                            map.currentTool.clearCross();
                            map.currentTool.snapHandler._guides = [];

                            $scope.rdTollgateData.nodePid = parseInt(linkDirect == 2 ? data["properties"]['enode'] : data["properties"]['snode']);
                            highLightFeatures.push({
                                id: $scope.rdTollgateData.nodePid.toString(),
                                layerid: 'rdLink',
                                type: 'node',
                                style: {
                                    color: 'yellow'
                                }
                            });
                            highRenderCtrl.drawHighlight();
                            map.currentTool.selectedFeatures.push($scope.rdTollgateData.nodePid.toString());

                            automaticCommand();
                            // featCodeCtrl.setFeatCode($scope.rdTollgateData);
                            // tooltipsCtrl.setCurrentTooltip("已选进入点,请选择退出线!");
                        }
                    } else if (data.index === 1){ //进入点
                        //清除鼠标十字
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];

                        //map.currentTool.snapHandler.addGuideLayer(rdLink); //增加吸附图层

                        $scope.rdTollgateData.nodePid = parseInt(data.id);
                        highLightFeatures.push({
                            id: $scope.rdTollgateData.nodePid.toString(),
                            layerid: 'rdLink',
                            type: 'node',
                            style: {
                                color: 'yellow'
                            }
                        });
                        highRenderCtrl.drawHighlight();
                        map.currentTool.selectedFeatures.push($scope.rdTollgateData.nodePid.toString());

                        automaticCommand();


                    } else if (data.index >= 2){ //退出线
                        $scope.rdTollgateData.outLinkPid = parseInt(data.id);

                        if (highLightFeatures.length === 3) {
                            highLightFeatures.pop();
                            highRenderCtrl._cleanHighLight();
                        }

                        highLightFeatures.push({
                            id: $scope.rdTollgateData.outLinkPid.toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {}
                        });
                        highRenderCtrl.drawHighlight();
                        map.currentTool.selectedFeatures.push($scope.rdTollgateData.outLinkPid.toString());
                        featCodeCtrl.setFeatCode($scope.rdTollgateData);
                        tooltipsCtrl.setCurrentTooltip("已选退出线,点击空格键保存!");
                    }
                });
            } else if (type === "RDVOICEGUIDE"){ //语音引导
                $scope.resetOperator("addRelation", type);
                //保存所有需要高亮的图层数组;线方向
                var highLightFeatures = [],linkDirect = 0;
                //设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDVOICEGUIDE);
                //地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdVoiceguide');
                tooltipsCtrl.setCurrentTooltip('请选择进入线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList:['line','point','line']
                });
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink);

                $scope.rdVoiceguide = {};
                $scope.rdVoiceguide.outLinkPids = [];

                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID,function (data){
                    if (data.index === 0) { //进入线;
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];

                        map.currentTool.snapHandler.addGuideLayer(rdnode);

                        $scope.rdVoiceguide.inLinkPid = parseInt(data.id);
                        highLightFeatures.push({
                            id: $scope.rdVoiceguide.inLinkPid.toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {
                                color: '#21ed25'
                            }
                        });
                        highRenderCtrl.highLightFeatures = highLightFeatures;
                        highRenderCtrl.drawHighlight();
                        tooltipsCtrl.setCurrentTooltip("已经选择进入线,选择进入点!");
                        linkDirect = data["properties"]["direct"];
                        if (linkDirect == 2 || linkDirect == 3) { //单方向
                            map.currentTool.snapHandler.snaped = false;
                            map.currentTool.clearCross();
                            map.currentTool.snapHandler._guides = [];

                            $scope.rdVoiceguide.nodePid = parseInt(linkDirect == 2 ? data["properties"]['enode'] : data["properties"]['snode']);
                            highLightFeatures.push({
                                id: $scope.rdVoiceguide.nodePid.toString(),
                                layerid: 'rdLink',
                                type: 'node',
                                style: {
                                    color: 'yellow'
                                }
                            });
                            highRenderCtrl.drawHighlight();
                            map.currentTool.selectedFeatures.push($scope.rdVoiceguide.nodePid.toString());

                            tooltipsCtrl.setCurrentTooltip("已选进入点,请选择退出线!");
                        }
                    } else if (data.index === 1){ //进入点
                        //清除鼠标十字
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];

                        map.currentTool.snapHandler.addGuideLayer(rdLink); //增加吸附图层

                        $scope.rdVoiceguide.nodePid = parseInt(data.id);
                        highLightFeatures.push({
                            id: $scope.rdVoiceguide.nodePid.toString(),
                            layerid: 'rdLink',
                            type: 'node',
                            style: {
                                color: 'yellow'
                            }
                        });
                        highRenderCtrl.drawHighlight();
                        map.currentTool.selectedFeatures.push($scope.rdVoiceguide.nodePid.toString());
                    } else if (data.index >= 2){ //退出线
                        if($scope.rdVoiceguide.outLinkPids.indexOf(parseInt(data.id)) <= 0){
                            $scope.rdVoiceguide.outLinkPids.push(parseInt(data.id));
                            highLightFeatures.push({
                                id: data.id,
                                layerid: 'rdLink',
                                type: 'line',
                                style: {}
                            });
                            highRenderCtrl.drawHighlight();

                            featCodeCtrl.setFeatCode($scope.rdVoiceguide);
                            tooltipsCtrl.setCurrentTooltip("继续选择退出线,或者点击空格键保存!");
                        }
                    }
                });
            } else if(type === 'VARIABLESPEED'){
                tooltipsCtrl.setEditEventType('variableSpeed');
                tooltipsCtrl.setCurrentTooltip('正要新建可变限速,先选择线！');
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.VARIABLESPEED);
                map.currentTool = new fastmap.uikit.SelectNodeAndPath({
                    map: map,
                    shapeEditor: shapeCtrl,
                    selectLayers: [rdnode],
                    snapLayers: [rdnode]//将rdnode放前面，优先捕捉
                });
                map.currentTool.enable();
                this.eventController.eventTypes.GETFEATURE

                //$scope.limitRelation.vias = [];
                ////可变限速
                //$scope.resetOperator("addRelation", type);
                ////保存所有需要高亮的图层数组;
                //var highLightFeatures = [], linkDirect = 0;
                //shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.VARIABLESPEED);
                ////地图编辑相关设置;
                //tooltipsCtrl.setEditEventType('rdBranch');
                //tooltipsCtrl.setCurrentTooltip('正要新建可变限速,先选择线！');
                //map.currentTool = new fastmap.uikit.SelectForRestriction({
                //    map: map,
                //    createBranchFlag: true,
                //    currentEditLayer: rdLink,
                //    shapeEditor: shapeCtrl,
                //    operationList:['line','point','line','line']
                //});
                //map.currentTool.enable();
                ////添加自动吸附的图层
                //map.currentTool.snapHandler.addGuideLayer(rdLink);
                ////获取退出线并高亮;
                //$scope.getOutLink = function(dataId) {
                //    var param = {};
                //    param["dbId"] = App.Temp.dbId;
                //    param["type"] = "RDLINK";
                //    param["data"] = {
                //        "nodePid": $scope.limitRelation.nodePid
                //    };
                //    //查进入点的关联link，如果所选的退出线不在里面，则提示错误;
                //    dsEdit.getByCondition(param).then(function(linkData) {
                //        if (linkData.errcode === -1) {return;}
                //        var outlinks = [];
                //        for(var i=0;i<linkData.data.length;i++){
                //            outlinks.push(linkData.data[i].pid)
                //        }
                //        //如果不衔接;
                //        if(outlinks.indexOf(parseInt(dataId))==-1){return;}
                //        //如果衔接;
                //        else{
                //            //高亮显示退出线;
                //            $scope.limitRelation.outLinkPid = parseInt(dataId);
                //            if (highLightFeatures.length === 3) {highLightFeatures.pop();}
                //            highRenderCtrl._cleanHighLight();
                //            highLightFeatures.push({
                //                id: $scope.limitRelation.outLinkPid.toString(),
                //                layerid: 'rdLink',
                //                type: 'line',
                //                style: {}
                //            });
                //            highRenderCtrl.drawHighlight();
                //            tooltipsCtrl.setCurrentTooltip("已选退出线,点击空格键保存或继续选择接续线!");
                //        }
                //    })
                //}
                ////接续线;
                //$scope.getjointLink = function(dataId) {
                //    dsEdit.getByPid($scope.limitRelation.outLinkPid, "RDLINK").then(function(data) {
                //        var linknodePid = '';
                //        if(data){
                //            if(data.sNodePid==$scope.limitRelation.nodePid){
                //                linknodePid = data.eNodePid;
                //            }else{
                //                linknodePid = data.sNodePid;
                //            }
                //        }
                //        var param = {};
                //        param["dbId"] = App.Temp.dbId;
                //        param["type"] = "RDLINK";
                //        param["data"] = {
                //            "nodePid": linknodePid
                //        };
                //        dsEdit.getByCondition(param).then(function(linkData) {
                //            if (linkData.errcode === -1) {return;}
                //            var jointLinks = [];
                //            for(var i=0;i<linkData.data.length;i++){
                //                jointLinks.push(linkData.data[i].pid)
                //            }
                //            //如果不衔接;
                //            if(jointLinks.indexOf(parseInt(dataId))==-1){
                //                return;
                //            } else{
                //                $scope.limitRelation.vias.push(parseInt(dataId));
                //                //高亮显示接续线;
                //                highLightFeatures.push({
                //                    id: parseInt(dataId).toString(),
                //                    layerid: 'rdLink',
                //                    type: 'line',
                //                    style: {color:'blue'}
                //                });
                //                highRenderCtrl.drawHighlight();
                //                tooltipsCtrl.setCurrentTooltip("已选则出线,点击空格键保存或继续选择接续线!");
                //            }
                //        })
                //    })
                //}
                ////选择分歧监听事件;
                //eventController.off(eventController.eventTypes.GETLINKID);
                //eventController.on(eventController.eventTypes.GETLINKID, function(data) {
                //    if (data.index === 0) {//第一次选择进入线的逻辑
                //        //清除吸附的十字
                //        map.currentTool.snapHandler.snaped = false;
                //        map.currentTool.clearCross();
                //        map.currentTool.snapHandler._guides = [];
                //        map.currentTool.snapHandler.addGuideLayer(rdnode);
                //        //高亮进入线;
                //        $scope.limitRelation.inLinkPid = parseInt(data.id);
                //        highLightFeatures.push({
                //            id: $scope.limitRelation.inLinkPid.toString(),
                //            layerid: 'rdLink',
                //            type: 'line',
                //            style: {color: '#21ed25'}
                //        });
                //        highRenderCtrl.highLightFeatures = highLightFeatures;
                //        highRenderCtrl.drawHighlight();
                //        tooltipsCtrl.setCurrentTooltip('已经选择进入线,选择进入点!');
                //        //进入线的方向属性;
                //        linkDirect = data["properties"]["direct"];
                //        //如果进入线是单方向道路，自动选择进入点;
                //        if (linkDirect == 2 || linkDirect == 3) {
                //            $scope.limitRelation.nodePid = parseInt(linkDirect == 2 ? data["properties"]['enode'] : data["properties"]['snode']);
                //            highLightFeatures.push({
                //                id: $scope.limitRelation.nodePid.toString(),
                //                layerid: 'rdLink',
                //                type: 'rdnode',
                //                style: {
                //                    color: 'yellow'
                //                }
                //            });
                //            highRenderCtrl.drawHighlight();
                //            map.currentTool.selectedFeatures.push($scope.limitRelation.nodePid.toString());
                //            tooltipsCtrl.setCurrentTooltip("已经选择进入点,选择退出线!");
                //
                //        }
                //    }
                //    //第二次选择（进入点/退出线）逻辑
                //    else if (data.index === 1) {
                //        if (linkDirect == 2 || linkDirect == 3) {
                //            //如果进入线是单方向的，根据用户选择计算退出线;
                //            $scope.getOutLink(data.id);
                //        }
                //        else {
                //            //如果进入线是双方向的，则根据用户的选择高亮进入点;
                //            $scope.limitRelation.nodePid = parseInt(data.id);
                //            highLightFeatures.push({
                //                id: $scope.limitRelation.nodePid.toString(),
                //                layerid: 'rdLink',
                //                type: 'rdnode',
                //                style: {color: 'yellow'}
                //            });
                //            highRenderCtrl.drawHighlight();
                //            tooltipsCtrl.setCurrentTooltip("已经选择进入点!");
                //            setTimeout(function(){
                //                tooltipsCtrl.setCurrentTooltip("请选择退出线!");
                //            },2000)
                //            //清除吸附的十字
                //            map.currentTool.snapHandler.snaped = false;
                //            map.currentTool.clearCross();
                //            map.currentTool.snapHandler._guides = [];
                //            map.currentTool.snapHandler.addGuideLayer(rdLink);
                //        }
                //    }
                //    else if (data.index > 1 && data.index<=2) {
                //        $scope.getOutLink(data.id);
                //        $scope.limitRelation.outLinkPid = parseInt(data.id);
                //    }else{
                //        $scope.getjointLink(data.id);
                //    }
                //    featCodeCtrl.setFeatCode($scope.limitRelation);
                //})
            }
        }
    }
]);

/**
 * Created by liuyang on 2016/8/5.
 */
angular.module('app').controller('addRdRelationCtrl', ['$scope', '$ocLazyLoad', 'dsEdit', 'appPath', '$timeout', '$q',
    function ($scope, $ocLazyLoad, dsEdit, appPath, $timeout, $q) {
        var layerCtrl = fastmap.uikit.LayerController();
        var featCodeCtrl = fastmap.uikit.FeatCodeController();
        var editLayer = layerCtrl.getLayerById('edit');
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var selectCtrl = fastmap.uikit.SelectController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var rdLink = layerCtrl.getLayerById('rdLink');
        var rwLink = layerCtrl.getLayerById('rwLink');
        var lcLink = layerCtrl.getLayerById('lcLink');
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
            var angle,
                dValue = pointA.x - pointB.x,
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
         * 数据中是否有rdLink
         * @param data
         * @returns {boolean}
         */
        $scope.containsRdLink = function (data) {
            return data.filter(function (item) {
                return item.type === 'RDLINK';
            }).length !== 0;
        };
        /**
         * 数据中是否有rwLink
         * @param data
         * @returns {boolean}
         */
        $scope.containsRwLink = function (data) {
            return data.filter(function (item) {
                return item.type === 'RWLINK';
            }).length !== 0;
        };
        /**
         * 数据中是否有lcLink
         * @param data
         * @returns {boolean}
         */
        $scope.containsLcLink = function (data) {
            return data.filter(function (item) {
                return item.type === 'LCLINK';
            }).length !== 0;
        };
        /**
         * 计算角度
         * @param pointA,pointB
         * @returns {angle}
         */
        $scope.angleOfLink = function (pointA, pointB) {
            var PI = Math.PI,
                angle;
            if ((pointA.x - pointB.x) === 0) {
                angle = PI / 2;
            } else {
                angle = Math.atan((pointA.y - pointB.y) / (pointA.x - pointB.x));
            }
            return angle;
        };
        /**
         * 将线分离
         * @param Points
         * @returns {links}
         */
        $scope.seprateLink = function (shapePoints) {
            var linksObj = {},
                pointsObj = [];
            if (shapePoints.length < 3) { // 表示只有两个点
                linksObj.pointsObj = [[shapePoints[0], shapePoints[1]]];
                return linksObj;
            }
            var point1,
                point2,
                point3,
                angle1,
                angle2;
            for (var j = 0; j < shapePoints.length - 1;) {
                point1 = map.latLngToContainerPoint([shapePoints[j].y, shapePoints[j].x]);
                if ((j + 2) < shapePoints.length) {
                    point2 = map.latLngToContainerPoint([shapePoints[j + 1].y, shapePoints[j + 1].x]);
                    point3 = map.latLngToContainerPoint([shapePoints[j + 2].y, shapePoints[j + 2].x]);
                    angle1 = $scope.angleOfLink(point1, point2);
                    angle2 = $scope.angleOfLink(point2, point3);
                    if (Math.abs(angle1 - angle2) > 0.06) {
                        var points = [];
                        points.push(shapePoints[j]);
                        points.push(shapePoints[j + 1]);
                        pointsObj.push(points);
                        j++;
                    } else {
                        shapePoints.splice(j + 1, 1);
                        // tempPoint = shapePoints[j + 1];
                    }
                } else {
                    var points = [];
                    if (pointsObj.length == 0) {
                        points.push(shapePoints[0]); // 第一个
                        points.push(shapePoints[j + 1]);// 最后一个
                        pointsObj.push(points);
                    } else {
                        var temp = pointsObj[pointsObj.length - 1];
                        points.push(temp[1]);
                        points.push(shapePoints[j + 1]); // 最后一个
                        pointsObj.push(points);
                    }
                    j++;
                }
            }
            linksObj.pointsObj = pointsObj;
            return linksObj;
        };
        /**
         * 运算两条线的交点坐标
         * @param a
         * @param b
         * @returns {*}
         */
        $scope.segmentsIntr = function (a, b) { // ([{x:_,y:_},{x:_,y:_}],[{x:_,y:_},{x:_,y:_}]) a,b为两条直线
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
            // 计算交点坐标
            var t = area_cda / (area_abd - area_abc);
            var dx = t * (a[1].x - a[0].x),
                dy = t * (a[1].y - a[0].y);
            return {
                x: (a[0].x + dx).toFixed(5),
                y: (a[0].y + dy).toFixed(5),
                linkIdA: a[2],
                featTypeA: a[3],
                linkIdB: b[2],
                featTypeB: b[3]
            }; // 保留小数点后5位
        };
        /**
         * 去除重复的坐标点，保留一个
         * @param arr
         * @returns {*}
         * @constructor
         */
        $scope.ArrUnique = function (arr) {
            for (var i = 0; i < arr.length; i++) {
                for (var j = 0; j < arr.length; j++) {
                    if (i != j) {
                        if (arr[i].x == arr[j].x && arr[i].y == arr[j].y) {
                            arr.splice(j, 1);
                        }
                    }
                }
            }
            /* 清除空数组*/
            arr.filter(function (v) {
                if (v.length > 0) {
                    return v;
                }
            });
            return arr;
        };
        $scope.changeIndexCallback = function (data) {
            $scope.jsonData.linkObjs.sort(function (a, b) {
                if (a.zlevel < b.zlevel) {
                    return 1;
                } else if (a.zlevel > b.zlevel) {
                    return -1;
                } else {
                    return 0;
                }
            });
            /* 把当前link的zlevel升高一级*/
            for (var zLevelNum = 0, zLevelLen = $scope.jsonData.linkObjs.length; zLevelNum < zLevelLen; zLevelNum++) {
                if ($scope.jsonData.linkObjs[zLevelNum].pid == data.id) {
                    if (($scope.jsonData.linkObjs[zLevelNum].zlevel) <= zLevelLen - 1 && zLevelNum !== 0) {
                        $scope.jsonData.linkObjs[zLevelNum - 1].zlevel -= 1;
                        $scope.jsonData.linkObjs[zLevelNum].zlevel += 1;
                        break;
                    }
                }
            }
            $scope.jsonData.linkObjs.sort(function (a, b) {
                return a.zlevel - b.zlevel;
            });
            /* 重绘link颜f色*/
            for (var i = 0; i < $scope.jsonData.linkObjs.length; i++) {
                var tempObj = {
                    RDLINK: 'rdLink',
                    RWLINK: 'rwLink',
                    LCLINK: 'lcLink'
                };
                var COLORTABLE = ['#14B7FC', '#4FFFB6', 'F8B19C', '#FCD6A4'];
                highRenderCtrl.highLightFeatures.push({
                    id: $scope.jsonData.linkObjs[i].pid.toString(),
                    // layerid: $scope.jsonData.linkObjs[i]["type"] === "RDLINK" ? 'rdLink' : 'rwLink',
                    layerid: tempObj[$scope.jsonData.linkObjs[i].type],
                    type: 'line',
                    index: $scope.jsonData.linkObjs[i].zlevel,
                    style: {
                        strokeWidth: 5,
                        strokeColor: COLORTABLE[$scope.jsonData.linkObjs[i].zlevel]
                    }
                });
                highRenderCtrl.drawHighlight();
            }
        };
        $scope.changeGSCIndex = function (data) {
            if (data.drawGeometry.geos.length == 2) {
                data.drawGeometry.geos.reverse();
            } else {
                var geos = data.drawGeometry.geos[data.index];
                data.drawGeometry.geos.splice(data.index, 1);
                if (data.index == data.drawGeometry.geos.length - 1) {
                    data.drawGeometry.geos.unshift(geos);
                } else {
                    data.drawGeometry.geos.push(geos);
                }
            }
            editLayer._redraw();
        };
        /**
         * 调整link层级高低
         */
        $scope.changeLevel = function () {
            editLayer.drawGeometry = null;
            map.currentTool.options.repeatMode = false;
            shapeCtrl.stopEditing();
            editLayer.bringToBack();
            $(editLayer.options._div).unbind();
            // $scope.changeBtnClass("");
            shapeCtrl.shapeEditorResult.setFinalGeometry(null);
            shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
            editLayer.clear();
            $scope.$emit('SWITCHCONTAINERSTATE', {
                attrContainerTpl: false
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
            if ($scope.containsLcLink($scope.jsonData.linkObjs)) {
                map.currentTool.lcEvent = new fastmap.uikit.SelectPath({
                    map: map,
                    currentEditLayer: lcLink,
                    linksFlag: true,
                    shapeEditor: shapeCtrl
                });
                map.currentTool.lcEvent.enable();
            }
            rdLink.options.selectType = 'link';
            rdLink.options.editable = true;
            eventController.off(eventController.eventTypes.GETLINKID, $scope.changeIndexCallback);
            eventController.on(eventController.eventTypes.GETLINKID, $scope.changeIndexCallback);
        };
        /**
         *  路口创建中的方法 根据node删除对象中的重复
         * @param nodesArr
         * @param linksArr
         * @param nodes
         * @returns {{link: Array, node: Array}}
         */
        $scope.minusArrByNode = function (nodesArr, linksArr, nodes) {
            var nodesObj = {},
                linksObj = {};
            for (var i = 0, lenI = nodesArr.length; i < lenI; i++) {
                nodesObj[nodesArr[i]] = true;
            }
            for (var j = 0, lenJ = linksArr.length; j < lenJ; j++) {
                linksObj[linksArr[j]] = true;
            }
            for (var m = 0, lenM = nodes.length; m < lenM; m++) {
                if (nodesObj[nodes[m].node]) {
                    delete nodesObj[nodes[m].node];
                }
                if (linksObj[nodes[m].link]) {
                    delete linksObj[nodes[m].link];
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
        $scope.minusArrByLink = function (linksArr, nodesArr, links) {
            var nodesObj = {},
                linksObj = {};
            for (var j = 0, lenJ = linksArr.length; j < lenJ; j++) {
                linksObj[linksArr[j]] = true;
            }
            for (var i = 0, lenI = nodesArr.length; i < lenI; i++) {
                nodesObj[nodesArr[i]] = true;
            }
            for (var m = 0, lenM = links.length; m < lenM; m++) {
                if (links[m].nodes) {
                    if (nodesObj[links[m].nodes[0]]) {
                        delete nodesObj[links[m].nodes[0]];
                    } else if (nodesObj[links[m].nodes[1]]) {
                        delete nodesObj[links[m].nodes[1]];
                    }
                } else if (links[m].links) {
                    delete linksObj[links[m].link];
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
        $scope.addArrByNode = function (nodesArr, linksArr, nodes, node) {
            for (var i = 0, lenI = nodes.length; i < lenI; i++) {
                for (var j = 0, lenJ = node.length; j < lenJ; j++) {
                    if (nodes[i].link === node[j].link) {
                        linksArr.push(node[j].link);
                        nodesArr.push(node[j].node);
                    } else {
                        nodesArr.push(node[j].node);
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
                linksArr.push(link[i].link);
                nodesArr = nodesArr.concat(link[i].node);
                links.push(link[i].link);
                nodes = nodesArr.concat(link[i].node);
            }
        };
        /**
         *  路口创建中的方法 是否包含某个link
         * @param linksArr
         * @param links
         */
        $scope.containLink = function (linksArr, links) {
            var flag = false,
                linksObj = {};
            for (var i = 0, len = linksArr.length; i < len; i++) {
                linksObj[linksArr[i]] = true;
            }
            for (var j = 0, lenJ = links.length; j < lenJ; j++) {
                if (linksObj[j].links) {
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
            var obj = {},
                flag = false;
            for (var i = 0, len = arr.length; i < len; i++) {
                obj[arr[i]] = true;
            }
            for (var j = 0, lenJ = node.length; j < lenJ; j++) {
                if (obj[node[j].node]) {
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
                var properties = borderData[item].data.properties,
                    coordinates = borderData[item].line.points;
                var startPoint = coordinates[0],
                    endPoint = coordinates[coordinates.length - 1];
                if (polygon.containsPoint(startPoint)) {
                    if (polygon.containsPoint(endPoint)) {
                        linkArr.push({
                            node: [parseInt(properties.snode), parseInt(properties.enode)],
                            link: parseInt(properties.id)
                        });
                    } else {
                        var sObj = {
                            node: parseInt(properties.snode),
                            link: parseInt(properties.id)
                        };
                        nodeArr.push(sObj);
                    }
                } else if (polygon.containsPoint(endPoint)) {
                    if (polygon.containsPoint(startPoint)) {
                        linkArr.push({
                            node: [parseInt(properties.snode), parseInt(properties.enode)],
                            link: parseInt(properties.id)
                        });
                    } else {
                        var eObj = {
                            node: parseInt(properties.enode),
                            link: parseInt(properties.id)
                        };
                        nodeArr.push(eObj);
                    }
                }
            }
            return {
                links: linkArr,
                nodes: nodeArr
            };
        };
        /**
         * 添加geometry
         * @param type
         * @param num
         * @param event
         */
        $scope.addShape = function (type) {
            // 大于17级才可以选择地图上各种geometry
            if (map.getZoom() < 17) {
                swal('提示', '地图缩放等级必须大于16级才可操作', 'info');
                return;
            }
            // 重置选择工具
            $scope.resetToolAndMap();
            $scope.$emit('SWITCHCONTAINERSTATE', {
                attrContainerTpl: false,
                subAttrContainerTpl: false
            });
            $('#popoverTips').hide();
            if (type === 'RDRESTRICTION') {
                $scope.resetOperator('addRelation', type);
                $scope.$emit('SWITCHCONTAINERSTATE', {
                    attrContainerTpl: false
                });
                var restrictionObj = {};
                restrictionObj.showTransitData = [];
                restrictionObj.showAdditionalData = [];
                restrictionObj.showNormalData = [];
                restrictionObj.inLaneInfoArr = [];
                objCtrl.setOriginalData(restrictionObj);
                // var addRestrictionObj = {
                //     "loadType": "attrTplContainer",
                //     "propertyCtrl": appPath.road + 'ctrls/toolBar_cru_ctrl/addRestrictionCtrl/addRdrestrictionCtrl',
                //     "propertyHtml": appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/addRestrictionTepl/addRdrestrictionTpl.html',
                //     "callback":function (){
                //
                //     }
                // };
                var addRestrictionObj = { // 这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载speedOfConditionCtrl。
                    loadType: 'attrTplContainer',
                    propertyCtrl: appPath.road + 'ctrls/blank_ctrl/blankCtrl',
                    propertyHtml: appPath.root + appPath.road + 'tpls/blank_tpl/blankTpl.html',
                    callback: function () {
                        var obj = {
                            loadType: 'attrTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/toolBar_cru_ctrl/addRestrictionCtrl/addRdrestrictionCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/addRestrictionTepl/addRdrestrictionTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', obj);
                    }
                };
                $scope.$emit('transitCtrlAndTpl', addRestrictionObj);
            } else if (type === 'RDSPEEDLIMIT') {
                $scope.resetOperator('addRelation', type);
                var minLen = 100000,
                    pointsOfDis,
                    pointForAngle,
                    angle;
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
                eventController.off(eventController.eventTypes.RESETCOMPLETE);
                eventController.on(eventController.eventTypes.RESETCOMPLETE, function (e) {
                    var pro = e.property;
                    dsEdit.getByPid(pro.id, 'RDLINK').then(function (data) {
                        if (e.latlng.distanceTo(new L.latLng(data.geometry.coordinates[0][1], data.geometry.coordinates[0][0])) < 1 || e.latlng.distanceTo(new L.latLng(data.geometry.coordinates[data.geometry.coordinates.length - 1][1], data.geometry.coordinates[data.geometry.coordinates.length - 1][0])) < 1) {
                            selectCtrl.selectedFeatures = null;
                            editLayer.drawGeometry = null;
                            shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                            shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
                            editLayer.clear();
                            tooltipsCtrl.notify('距离端点太近啦，请重新选择位置！', 'error');
                            return;
                        }
                        if (data) {
                            selectCtrl.onSelected({
                                geometry: data.geometry.coordinates,
                                id: data.pid,
                                direct: pro.direct,
                                point: $.extend(true, {}, shapeCtrl.shapeEditorResult.getFinalGeometry())
                            });
                            if (pro.direct == 1) {
                                tooltipsCtrl.setEditEventType(fastmap.dataApi.GeoLiveModelType.RDSPEEDLIMIT);
                                var point = shapeCtrl.shapeEditorResult.getFinalGeometry();
                                var linkCoords = data.geometry.coordinates;
                                // 计算鼠标点位置与线的节点的关系，判断与鼠标点最近的节点
                                // 并用斜率判断默认值
                                var tp = map.latLngToContainerPoint([point.y, point.x]),
                                    dist,
                                    sVertex,
                                    eVertex,
                                    d1,
                                    d2,
                                    d3;
                                for (var i = 0, len = linkCoords.length - 1; i < len; i++) {
                                    sVertex = map.latLngToContainerPoint(L.latLng(linkCoords[i][1], linkCoords[i][0]));
                                    eVertex = map.latLngToContainerPoint(L.latLng(linkCoords[i + 1][1], linkCoords[i + 1][0]));
                                    dist = L.LineUtil.pointToSegmentDistance(tp, sVertex, eVertex);
                                    if (dist < 5) {
                                        d1 = (tp.x - sVertex.x) * (tp.x - sVertex.x) + (tp.y - sVertex.y) * (tp.y - sVertex.y);
                                        d2 = (tp.x - eVertex.x) * (tp.x - eVertex.x) + (tp.y - eVertex.y) * (tp.y - eVertex.y);
                                        d3 = (sVertex.x - eVertex.x) * (sVertex.x - eVertex.x) + (sVertex.y - eVertex.y) * (sVertex.y - eVertex.y);
                                        if (d1 <= d3 && d2 <= d3) {
                                            break;
                                        }
                                    }
                                }
                                angle = $scope.angleOfLink(sVertex, eVertex);
                                if (sVertex.x > eVertex.x || (sVertex.x == eVertex.x && sVertex.y > eVertex.y)) {
                                    angle = angle + Math.PI;
                                }
                                var marker = {
                                    flag: false,
                                    point: point,
                                    type: 'marker',
                                    angle: angle,
                                    orientation: '2', // 默认都是顺方向
                                    pointForDirect: point
                                };
                                layerCtrl.pushLayerFront('edit');
                                var sObj = shapeCtrl.shapeEditorResult;
                                editLayer.drawGeometry = marker;
                                editLayer.draw(marker, editLayer);
                                sObj.setOriginalGeometry(marker);
                                sObj.setFinalGeometry(marker);
                                shapeCtrl.setEditingType('speedLimit');
                                shapeCtrl.startEditing();
                                tooltipsCtrl.setCurrentTooltip('选择方向!');
                                eventController.off(eventController.eventTypes.DIRECTEVENT);
                                eventController.on(eventController.eventTypes.DIRECTEVENT, function (event) {
                                    selectCtrl.selectedFeatures.direct = parseInt(event.geometry.orientation);
                                    tooltipsCtrl.setChangeInnerHtml('点击空格保存,或者按ESC键取消!');
                                });
                            } else {
                                // shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                                tooltipsCtrl.setEditEventType('speedLimit');
                                tooltipsCtrl.setCurrentTooltip('请点击空格,创建限速!');
                                shapeCtrl.setEditingType('speedLimit');
                            }
                        }
                    });
                });
            }else if(type === "RDMILEAGEPILE"){//里程桩
                $scope.resetOperator('addRelation', type);
                shapeCtrl.setEditFeatType(null);
                shapeCtrl.setEditingType("addMileagePile");
                shapeCtrl.startEditing();
                map.currentTool = shapeCtrl.getCurrentTool();
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                map.currentTool.enable();
                tooltipsCtrl.setEditEventType('addMileagePile');
                tooltipsCtrl.setCurrentTooltip('在link上点击增加里程桩!！','info');

                eventController.off(eventController.eventTypes.RESETCOMPLETE);
                eventController.on(eventController.eventTypes.RESETCOMPLETE, function (e) {
                    shapeCtrl.setEditFeatType(null);
                    var pro = e.property;
                    /*
                    * 对里程桩的合法性做判断;
                    * (1)不能为道路的端点;
                    * (2)关联link种别不能为0、5、6、7、8、9、10、11、13、15，否则，给提示“里程桩关联link不能是8级及以下道路”，不允许创建里程桩;
                    * (3)里程桩的点位必须在其关联link上
                    * (4)里程桩的关联link不可以是图廓线;
                    * */
                    if (['1', '2', '3', '4'].indexOf(pro.kind) == -1) {
                        editLayer.drawGeometry = null;
                        shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                        shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
                        editLayer.clear();
                        tooltipsCtrl.notify('里程桩关联link不能是1,2,3,4级以外的道路！', 'error');
                        return;
                    }

                    shapeCtrl.setEditFeatType('mileagePile');
                    dsEdit.getByPid(pro.id, "RDLINK").then(function(data) {
                        if(data){
                            if(e.latlng.distanceTo(new L.latLng(data.geometry.coordinates[0][1],data.geometry.coordinates[0][0])) < 1 || e.latlng.distanceTo(new L.latLng(data.geometry.coordinates[data.geometry.coordinates.length -1][1],data.geometry.coordinates[data.geometry.coordinates.length -1][0])) < 1){
                                selectCtrl.selectedFeatures = null;
                                editLayer.drawGeometry = null;
                                shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                                shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
                                editLayer.clear();
                                tooltipsCtrl.notify('道路的端点不能作为里程桩，请重新选择位置！','error');
                                return;
                            }
                            //selectCtrl.selectedFeatures = {
                            //    linkPid:pro.id,
                            //    point:e.latlng
                            //};
                            shapeCtrl.shapeEditorResult.setProperties({linkPid:pro.id})
                            shapeCtrl.setEditFeatType('mileagePile');
                            tooltipsCtrl.setCurrentTooltip('请点击空格,创建里程桩!','succ');
                        }
                    })
                })
            }else if (type === "RDCROSS") {
                $scope.resetOperator("addRelation", type);
                var linksArr = [],
                    nodesArr = [],
                    nodes = [],
                    links = [],
                    options = {};
                tooltipsCtrl.setCurrentTooltip('请框选路口组成Node！');
                shapeCtrl.toolsSeparateOfEditor('addRdCross', {
                    map: map,
                    layer: [rdLink],
                    type: 'rectangle'
                });
                map.currentTool = shapeCtrl.getCurrentTool();
                eventController.off(eventController.eventTypes.GETBOXDATA);
                eventController.on(eventController.eventTypes.GETBOXDATA, function (event) {
                    tooltipsCtrl.setCurrentTooltip('已选择路口，按空格保存或者esc取消！');
                    var data = $scope.getDataFromRectangleForCross(event),
                        highlightFeatures = [];
                    if (nodesArr.length === 0) {
                        for (var nodeNum = 0, nodeLen = data.nodes.length; nodeNum < nodeLen; nodeNum++) {
                            nodesArr.push(data.nodes[nodeNum].node);
                        }
                        for (var linkNum = 0, linkLen = data.links.length; linkNum < linkLen; linkNum++) {
                            nodesArr = nodesArr.concat(data.links[linkNum].node);
                            linksArr.push(data.links[linkNum].link);
                        }
                        nodes = nodes.concat(data.nodes);
                        links = links.concat(data.links);
                    } else if (data.nodes) {
                        if ($scope.containsNode(nodesArr, data.nodes)) {
                            var minusObj = $scope.minusArrByNode(nodesArr, linksArr, data.nodes);
                            linksArr = minusObj.link;
                            nodesArr = minusObj.node;
                        } else {
                            $scope.addArrByNode(nodesArr, linksArr, nodes, data.nodes);
                        }
                    } else if (data.links) {
                        if ($scope.containLink(linksArr, data.links)) {
                            var minusLink = $scope.minusArrByLink(linksArr, nodesArr, data.links);
                            linksArr = minusLink.link;
                            nodesArr = minusLink.node;
                        } else {
                            $scope.addArrByLink(linksArr, nodesArr, links, nodes, data.links);
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
                        });
                    }
                    for (var j = 0, lenJ = nodesArr.length; j < lenJ; j++) {
                        highlightFeatures.push({
                            id: nodesArr[j].toString(),
                            layerid: 'rdLink',
                            type: 'node',
                            style: {}
                        });
                    }
                    highRenderCtrl.highLightFeatures = highlightFeatures;
                    highRenderCtrl.drawHighlight();
                    options = {
                        nodePids: nodesArr,
                        linkPids: linksArr
                    };
                    selectCtrl.onSelected(options);
                });
            } else if (type === 'RDLANECONNEXITY') {
                $scope.resetOperator('addRelation', type);
                $scope.$emit('SWITCHCONTAINERSTATE', {
                    attrContainerTpl: true
                });
                var rdConty = {
                    inLinkPid: 0,
                    nodePid: 0,
                    lanes: [],
                    outLinkPids: []
                };
                objCtrl.setOriginalData(rdConty);
                var addLaneObj = { // 这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
                    loadType: 'attrTplContainer',
                    propertyCtrl: 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
                    propertyHtml: '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
                    callback: function () {
                        var laneObj = {
                            loadType: 'attrTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/toolBar_cru_ctrl/addConnexityCtrl/addLaneconnexityCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/addConnexityTepl/addLaneconnexityTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', laneObj);
                    }
                };
                $scope.$emit('transitCtrlAndTpl', addLaneObj);
            } else if (type === 'RDGSC') {
                $scope.selfInter = false; // 是否是自相交
                $scope.selfInterData = {};
                $scope.selfInterData.crossGeos = [];
                $scope.resetOperator('addRelation', type);
                tooltipsCtrl.setEditEventType('rdgsc');
                tooltipsCtrl.setCurrentTooltip('正要新建立交,请框选立交点位！');
                shapeCtrl.toolsSeparateOfEditor('addRdGsc', {
                    map: map,
                    layer: [rdLink, rwLink, lcLink],
                    type: 'rectangle'
                });
                map.currentTool = shapeCtrl.getCurrentTool();
                var COLORTABLE = ['#14B7FC', '#4FFFB6', 'F8B19C', '#FCD6A4'];
                var LINKTYPES = {
                    RDLINK: 'rdLink',
                    RWLINK: 'rwLink',
                    LCLINK: 'lcLink'
                };
                eventController.off(eventController.eventTypes.GETBOXDATA);
                eventController.on(eventController.eventTypes.GETBOXDATA, function (event) {
                    $scope.jsonData = null;
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures.length = 0;
                    var data = event.data,
                        highlightFeatures = [],
                        containObj = {},
                        dealData = [],
                        rectangleData = { // 矩形框信息geoJson
                            type: 'Polygon',
                            coordinates: [
                                []
                            ]
                        },
                        latArr = event.border._latlngs;
                    /* 过滤框选后的数组，去重*/
                    for (var num = 0, numLen = data.length; num < numLen; num++) {
                        if (!containObj[data[num].data.properties.id]) {
                            dealData.push(data[num]);
                            containObj[data[num].data.properties.id] = true;
                        }
                    }
                    // 获取矩形框的外包矩形
                    for (var rec = 0; rec < latArr.length; rec++) {
                        var tempArr = [];
                        tempArr.push(latArr[rec].lng);
                        tempArr.push(latArr[rec].lat);
                        rectangleData.coordinates[0].push(tempArr);
                        if (rec == latArr.length - 1) {
                            rectangleData.coordinates[0].push(rectangleData.coordinates[0][0]);
                        }
                    }

                    /* 高亮link*/
                    for (var i = 0, lenI = dealData.length; i < lenI; i++) {
                        highlightFeatures.push({
                            id: dealData[i].data.properties.id.toString(),
                            layerid: LINKTYPES[dealData[i].data.properties.featType],
                            type: 'line',
                            index: i,
                            style: {
                                strokeWidth: 5,
                                strokeColor: COLORTABLE[i]
                            }
                        });
                    }
                    highRenderCtrl.highLightFeatures = highlightFeatures;
                    highRenderCtrl.drawHighlight();
                    /* 当坐标数组拆分组合完成后*/
                    var crossGeos = [],
                        loopTime = (dealData.length * dealData.length - 1) / 2; // 循环次数C(n,2)
                    $scope.jsonData = {
                        geometry: rectangleData,
                        linkObjs: []
                    };
                    if (dealData.length > 1) { // 有bug，一条线和另一条线有多个交点时不适用
                        // for (var i = 0; i < loopTime - 1; i++) {
                        //     for (var j = i + 1; j < dealData.length; j++) {
                        //         if (i != j) {
                        //             var lineGeoArr = function(mark) {
                        //                 return [dealData[mark].line.points[0], dealData[mark].line.points[dealData[mark].line.points.length - 1], dealData[mark].data.properties.id, dealData[mark].data.properties.featType];
                        //             };
                        //             var temp = $scope.segmentsIntr(lineGeoArr(i), lineGeoArr(j))
                        //             if (temp) {
                        //                 crossGeos.push(temp);
                        //             }
                        //          }
                        //     }
                        // }
                        var sepLinks = [];// $scope.seprateLink(shapePoints); //将线分成多条线
                        for (var i = 0; i < dealData.length; i++) {
                            var links = $scope.seprateLink(dealData[i].line.points).pointsObj; // 将线分成多条线
                            var linkData = [];
                            for (var t in links) {
                                var linkObj = {
                                    line: links[t],
                                    data: dealData[i].data
                                };
                                linkData.push(linkObj);
                            }
                            sepLinks = sepLinks.concat(linkData);
                        }
                        for (var i = 0; i < sepLinks.length; i++) {
                            for (var j = i + 1; j < sepLinks.length; j++) {
                                var lineGeoArr = function (mark) {
                                    return [sepLinks[mark].line[0], sepLinks[mark].line[sepLinks[mark].line.length - 1], sepLinks[mark].data.properties.id, sepLinks[mark].data.properties.featType];
                                };
                                var temp = $scope.segmentsIntr(lineGeoArr(i), lineGeoArr(j));
                                if (temp) {
                                    crossGeos.push(temp);
                                }
                            }
                        }
                        crossGeos = $scope.ArrUnique(crossGeos);
                    } else if (dealData.length == 1) {
                        if (dealData[0].line.points.length > 3) {
                            var shapePoints = dealData[0].line.points; // 形状点
                            var sepLinks = $scope.seprateLink(shapePoints); // 将线分成多条线
                            $scope.selfInterData.links = sepLinks;
                            for (var i = 0; i < sepLinks.pointsObj.length - 1; i++) {
                                for (var j = i + 1; j < sepLinks.pointsObj.length; j++) {
                                    var lineGeoArr = function (index) {
                                        return [sepLinks.pointsObj[index][0], sepLinks.pointsObj[index][sepLinks.pointsObj[index].length - 1]];
                                    };
                                    var temp = $scope.segmentsIntr(lineGeoArr(i), lineGeoArr(j));// 获取线的交点
                                    if (temp) {
                                        crossGeos.push(temp);
                                        $scope.selfInter = true;
                                        temp.index = i + '-' + j;
                                        $scope.selfInterData.crossGeos.push(temp);
                                    }
                                }
                            }
                            if (crossGeos.length > 0) {
                                $scope.selfInterData.crosses = crossGeos;
                            }
                        } else {
                            swal('错误信息', '所选Link无自相交点，请重新选择立交点位！', 'error');
                            highRenderCtrl._cleanHighLight();
                        }
                    }
                    // 判断相交点数
                    if (crossGeos.length == 0) {
                        swal('错误信息', '所选区域无相交点，如果是自相交只能选择一条link，请重新选择立交点位！', 'error');
                        highRenderCtrl._cleanHighLight();
                        // tooltipsCtrl.setCurrentTooltip('所选区域无相交点，请重新选择立交点位！');
                    } else if (crossGeos.length > 1) {
                        map.currentTool.disable(); // 取消鼠标事件
                        var markerArr = [];
                        for (var i = 0; i < crossGeos.length; i++) {
                            var point = new L.LatLng(parseFloat(crossGeos[i].y), parseFloat(crossGeos[i].x));
                            var poiFeature = L.marker(point, {
                                draggable: false,
                                opacity: 0.8,
                                riseOnHover: true,
                                riseOffset: 300,
                                rotate: false,
                                angle: 20,
                                title: '点击制作立交',
                                icon: L.icon({
                                    iconUrl: '../../../images/road/img/cross.svg',
                                    iconSize: [16, 16],
                                    popupAnchor: [0, -32]
                                })
                            }).on('click', function (e) {
                                selectOneGSC(e, crossGeos);
                            });
                            markerArr.push(poiFeature);
                        }
                        var layers = L.layerGroup(markerArr);
                        map.markerLayer = layers;
                        map.addLayer(layers);
                        highRenderCtrl._cleanHighLight();
                        // swal("错误信息", "不能有多个相交点，请重新选择立交点位！", "error");
                    } else if ($scope.selfInter) { // 自相交，不能用highRenderCtrl的方式高亮
                        map.currentTool.disable(); // 取消鼠标事件
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        var mark = $scope.selfInterData.crossGeos[0].index.split('-');
                        var points = $scope.selfInterData.links.pointsObj;
                        var pointLine1 = points[parseInt(mark[0])];
                        var pointLine2 = points[parseInt(mark[1])];
                        var feature = {},
                            colors = ['#14B7FC', '#4FFFB6', '#F8B19C', '#FCD6A4'],
                            lines = [];
                        lines.push(pointLine1);
                        lines.push(pointLine2);
                        feature.type = 'GSC';
                        feature.geos = lines;
                        feature.style = colors;
                        layerCtrl.pushLayerFront('edit'); // 使编辑图层置顶
                        editLayer.drawGeometry = feature;
                        editLayer.draw(feature, editLayer, colors); // 在编辑图层中画出需要编辑的几何体
                        var tempObj = {
                            pid: dealData[0].data.properties.id,
                            type: dealData[0].data.properties.featType,
                            zlevel: 0
                        };
                        var tempObjs = {
                            pid: dealData[0].data.properties.id,
                            type: dealData[0].data.properties.featType,
                            zlevel: 1
                        };
                        $scope.jsonData.linkObjs.push(tempObj);
                        $scope.jsonData.linkObjs.push(tempObjs);
                        tooltipsCtrl.setCurrentTooltip('点击link调整层级,空格保存,或者按ESC键取消!');
                        shapeCtrl.shapeEditorResult.setFinalGeometry($scope.jsonData);
                        map._container.style.cursor = '';
                        map.currentTool = new fastmap.uikit.SelectGSC({
                            map: map,
                            currentEditLayer: editLayer
                        });
                        map.currentTool.enable();
                        eventController.off(eventController.eventTypes.GETEDITDATA, $scope.changeGSCIndex);
                        eventController.on(eventController.eventTypes.GETEDITDATA, $scope.changeGSCIndex);
                    } else {
                            // map.currentTool.disable();//禁止当前的参考线图层的事件捕获
                            /* 重组linkData格式*/
                        for (var linkMark = 0; linkMark < dealData.length; linkMark++) {
                            var tempObj = {
                                pid: dealData[linkMark].data.properties.id,
                                type: dealData[linkMark].data.properties.featType,
                                zlevel: linkMark
                            };
                            $scope.jsonData.linkObjs.push(tempObj);
                        }
                        tooltipsCtrl.setCurrentTooltip('点击link调整层级,空格保存,或者按ESC键取消!');
                        $scope.changeLevel();
                        shapeCtrl.shapeEditorResult.setFinalGeometry($scope.jsonData);
                    }
                });

                var selectOneGSC = function (e, crossGeos) { // 立交点击事件
                    map.removeLayer(map.markerLayer); // 取消掉mark图层

                    var currentPoint = L.latLng(e.latlng.lng, e.latlng.lat);
                    var minDis = Number.MAX_VALUE;
                    var index = 0;
                    for (var c = 0; c < crossGeos.length; c++) { // //获取交点到当前点击点最近的那个交点
                        var tempPoint = L.latLng(Number(crossGeos[c].x), Number(crossGeos[c].y));
                        var dis = currentPoint.distanceTo(tempPoint);
                        if (dis < minDis) {
                            minDis = dis;
                            index = c;
                        }
                    }
                    var tempObjA = {
                        pid: crossGeos[index].linkIdA,
                        type: crossGeos[index].featTypeA, // 必须定义成type
                        zlevel: 0
                    };
                    var tempObjB = {
                        pid: crossGeos[index].linkIdB,
                        type: crossGeos[index].featTypeB,
                        zlevel: 1
                    };
                    var tempOjbs = [];
                    tempOjbs.push(tempObjA);
                    tempOjbs.push(tempObjB);
                    $scope.jsonData.linkObjs = tempOjbs;
                    $scope.jsonData.gscPoint = {
                        latitude: crossGeos[index].y,
                        longitude: crossGeos[index].x
                    };
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures.length = 0;
                    var highlightFeatures = [];
                    for (var i = 0, lenI = tempOjbs.length; i < lenI; i++) {
                        highlightFeatures.push({
                            id: tempOjbs[i].pid.toString(),
                            layerid: LINKTYPES[tempOjbs[i].type],
                            type: 'line',
                            index: i,
                            style: {
                                strokeWidth: 5,
                                strokeColor: COLORTABLE[i]
                            }
                        });
                    }
                    highRenderCtrl.highLightFeatures = highlightFeatures;
                    highRenderCtrl.drawHighlight();
                    tooltipsCtrl.setCurrentTooltip('点击link调整层级、空格保存或者按ESC键取消!');
                    $scope.changeLevel();
                    shapeCtrl.shapeEditorResult.setFinalGeometry($scope.jsonData);
                };
            } else if (type === 'TRAFFIC_SIGNAL') { // 信号灯
                $scope.resetOperator('addRelation', type);
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.TRAFFICSIGNAL);
                tooltipsCtrl.setCurrentTooltip('请选择制作信号灯的路口！');
                layerCtrl.pushLayerFront('edit'); // 置顶editLayer
                // 初始化选择点工具
                map.currentTool = new fastmap.uikit.SelectNode({
                    map: map,
                    nodesFlag: true,
                    shapeEditor: shapeCtrl
                });
                map.currentTool.enable();
                // 需要捕捉的图层
                eventController.off(eventController.eventTypes.GETNODEID, selectObjCallback);
                eventController.on(eventController.eventTypes.GETNODEID, selectObjCallback);

                function selectObjCallback(data) {
                    $scope.$emit('SWITCHCONTAINERSTATE', {
                        subAttrContainerTpl: false
                    });
                    // 地图小于17级时不能选择
                    if (map.getZoom < 17) {
                        return;
                    }
                    map.closePopup(); // 如果有popup的话清除它
                    if (map.floatMenu) {
                        map.removeLayer(map.floatMenu);
                        map.floatMenu = null;
                    }
                    // 清除上一个选择的高亮
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
            } else if (type === 'RD_GATE') { // 大门
                $scope.resetOperator('addRelation', type);
                // 保存所有需要高亮的图层数组;线方向
                var highLightFeatures = [],
                    linkDirect = 0;
                // 设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.GATE);
                // 地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdGate');
                tooltipsCtrl.setCurrentTooltip('请选择进入线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList: ['line', 'point']
                });
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                $scope.gate = {};
                featCodeCtrl.setFeatCode($scope.gate);
                var automaticCommand = function () { // 自动计算退出线
                    var param = {};
                    param.dbId = App.Temp.dbId;
                    param.type = 'RDLINK';
                    param.data = {
                        nodePid: $scope.gate.nodePid
                    };
                    dsEdit.getByCondition(param).then(function (continueLinks) {
                        if (continueLinks.errcode === -1) {
                            return;
                        }
                        if (continueLinks.data) {
                            if (continueLinks.data.length > 2) {
                                // featCodeCtrl.setFeatCode({});
                                swal('错误信息', '退出线有多条，不允许创建大门', 'error');
                                tooltipsCtrl.setCurrentTooltip('退出线有多条，不允许创建大门!');
                                return;
                            }
                            for (var i = 0, len = continueLinks.data.length; i < len; i++) {
                                if (continueLinks.data[i].pid != $scope.gate.inLinkPid) {
                                    $scope.gate.outLinkPid = continueLinks.data[i].pid;
                                    highLightFeatures.push({
                                        id: $scope.gate.outLinkPid.toString(),
                                        layerid: 'rdLink',
                                        type: 'line',
                                        style: {}
                                    });
                                    highRenderCtrl.drawHighlight();
                                    map.currentTool.selectedFeatures.push($scope.gate.outLinkPid.toString());
                                    // featCodeCtrl.setFeatCode($scope.gate);
                                    tooltipsCtrl.setCurrentTooltip('已选退出线,点击空格键保存!');
                                    break;
                                }
                            }
                            if (!$scope.gate.outLinkPid) {
                                tooltipsCtrl.setCurrentTooltip('当前所选线没有退出线，不能创建!');
                            }
                        }
                    });
                };
                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    if (data.index === 0) { // 进入线;
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
                        linkDirect = data.properties.direct;
                        if (linkDirect == 2 || linkDirect == 3) { // 单方向
                            map.currentTool.snapHandler.snaped = false;
                            map.currentTool.clearCross();
                            map.currentTool.snapHandler._guides = [];
                            $scope.gate.nodePid = parseInt(linkDirect == 2 ? data.properties.enode : data.properties.snode);
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
                        } else {
                            tooltipsCtrl.setCurrentTooltip('已经选择进入线,请选择进入点!');
                        }
                    } else if (data.index === 1) { // 进入点
                        // 清除鼠标十字
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];
                        // map.currentTool.snapHandler.addGuideLayer(rdLink); //增加吸附图层
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
                    } else if (data.index >= 2) { // 退出线
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
                        tooltipsCtrl.setCurrentTooltip('已选退出线,点击空格键保存!');
                    }
                });
            } else if (type === 'RD_WARNINGINFO') { // 警示信息
                featCodeCtrl.setFeatCode({});
                $scope.resetOperator('addRelation', type);
                // 保存所有需要高亮的图层数组;线方向
                var highLightFeatures = [],
                    linkDirect = 0;
                // 设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.WARNINGINFO);
                // 地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdWarningInfo');
                tooltipsCtrl.setCurrentTooltip('请选择进入线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList: ['line', 'point']
                });
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                $scope.warningInfo = {};
                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    if (data.index === 0) { // 进入线;
                        if (data.properties.kind == 9 && data.properties.form.indexOf('34') > -1 || data.properties.kind == 10 || data.properties.kind == 11 || data.properties.form.indexOf('20') > -1) {
//                    		swal("提示","警示信息不能制作在九级辅路上","warning");
//                    		return;
                            tooltipsCtrl.notify('九级辅路、10级路、步行街、人渡不能作为警示信息的进入线!', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
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
                        tooltipsCtrl.setCurrentTooltip('已经选择进入线,选择进入点!');
                        linkDirect = data.properties.direct;
                        if (linkDirect == 2 || linkDirect == 3) { // 单方向
                            map.currentTool.snapHandler.snaped = false;
                            map.currentTool.clearCross();
                            map.currentTool.snapHandler._guides = [];
                            $scope.warningInfo.nodePid = parseInt(linkDirect == 2 ? data.properties.enode : data.properties.snode);
                            highLightFeatures.push({
                                id: $scope.warningInfo.nodePid.toString(),
                                layerid: 'rdLink',
                                type: 'node',
                                style: {
                                    color: 'yellow'
                                }
                            });
                            highRenderCtrl.drawHighlight();
                            map.currentTool.selectedFeatures.push($scope.warningInfo.nodePid.toString());
                            featCodeCtrl.setFeatCode($scope.warningInfo);
                            tooltipsCtrl.setCurrentTooltip('已选进入点,点击空格键保存!');
                        }
                    } else if (data.index === 1) { // 进入点
                        $scope.warningInfo.nodePid = parseInt(data.id);
                        dsEdit.getByPid($scope.warningInfo.nodePid, 'RDNODE').then(function (data) {
                            if (data) {
                                if (data.meshes.length > 1) {
                                    tooltipsCtrl.setCurrentTooltip('警示信息中的点形态不能是图廓点!');
                                    map.currentTool.selectedFeatures.pop();
                                } else {
                                    highLightFeatures.push({
                                        id: $scope.warningInfo.nodePid.toString(),
                                        layerid: 'rdLink',
                                        type: 'node',
                                        style: {
                                            color: '#21ed25'
                                        }
                                    });
                                    highRenderCtrl.drawHighlight();
                                    map.currentTool.selectedFeatures.push($scope.warningInfo.nodePid.toString());
                                    featCodeCtrl.setFeatCode($scope.warningInfo);
                                    tooltipsCtrl.setCurrentTooltip('已选进入点,点击空格键保存!');
                                }
                            } else {
                                tooltipsCtrl.setCurrentTooltip('请重新选择进入点!');
                            }
                        });
                    }
                });
            } else if (type === 'ELECTRONIC_EYE') { // 电子眼
                $scope.resetOperator('addRelation', type);
                var minLen = 100000,
                    pointsOfDis,
                    pointForAngle,
                    angle;
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
                eventController.off(eventController.eventTypes.RESETCOMPLETE);
                eventController.on(eventController.eventTypes.RESETCOMPLETE, function (e) {
                    var pro = e.property;
                    highLightFeatures = [];
                    highRenderCtrl._cleanHighLight();
                    highLightFeatures.push({
                        id: e.property.id.toString(),
                        layerid: 'rdLink',
                        type: 'line',
                        style: '#00F5FF'
                    });
                    highRenderCtrl.highLightFeatures = highLightFeatures;
                    highRenderCtrl.drawHighlight();
                    dsEdit.getByPid(pro.id, 'RDLINK').then(function (data) {
                        if (data) {
                            selectCtrl.onSelected({
                                geometry: data.geometry.coordinates,
                                id: data.pid,
                                direct: pro.direct,
                                point: $.extend(true, {}, shapeCtrl.shapeEditorResult.getFinalGeometry())
                            });
                            if (pro.direct == 1) {
                                tooltipsCtrl.setEditEventType(fastmap.dataApi.GeoLiveModelType.RDSPEEDLIMIT);
                                var point = shapeCtrl.shapeEditorResult.getFinalGeometry();
                                var linkCoords = data.geometry.coordinates;
                                // 计算鼠标点位置与线的节点的关系，判断与鼠标点最近的节点
                                // 并用斜率判断默认值
                                var index = 0,
                                    tp = map.latLngToContainerPoint([point.y, point.x]),
                                    dist,
                                    sVertex,
                                    eVertex,
                                    d1,
                                    d2,
                                    d3;
                                for (var i = 0, len = linkCoords.length - 1; i < len; i++) {
                                    sVertex = map.latLngToContainerPoint(L.latLng(linkCoords[i][1], linkCoords[i][0]));
                                    eVertex = map.latLngToContainerPoint(L.latLng(linkCoords[i + 1][1], linkCoords[i + 1][0]));
                                    dist = L.LineUtil.pointToSegmentDistance(tp, sVertex, eVertex);
                                    if (dist < 5) {
                                        d1 = (tp.x - sVertex.x) * (tp.x - sVertex.x) + (tp.y - sVertex.y) * (tp.y - sVertex.y);
                                        d2 = (tp.x - eVertex.x) * (tp.x - eVertex.x) + (tp.y - eVertex.y) * (tp.y - eVertex.y);
                                        d3 = (sVertex.x - eVertex.x) * (sVertex.x - eVertex.x) + (sVertex.y - eVertex.y) * (sVertex.y - eVertex.y);
                                        if (d1 <= d3 && d2 <= d3) {
                                            index = i;
                                            break;
                                        }
                                    }
                                }
                                angle = $scope.angleOfLink(sVertex, eVertex);
                                if (sVertex.x > eVertex.x || (sVertex.x == eVertex.x && sVertex.y > eVertex.y)) { // 从右往左划线或者从下网上划线
                                    angle = Math.PI + angle;
                                }
                                tooltipsCtrl.setEditEventType(fastmap.dataApi.GeoLiveModelType.RDELECTRONICEYE);
                                var marker = {
                                    flag: false,
                                    point: point,
                                    type: 'marker',
                                    angle: angle,
                                    orientation: '2',
                                    pointForDirect: point
                                };
                                layerCtrl.pushLayerFront('edit');
                                var sObj = shapeCtrl.shapeEditorResult;
                                editLayer.drawGeometry = marker;
                                editLayer.draw(marker, editLayer);
                                // marker.orientation =2;
                                sObj.setOriginalGeometry(marker);
                                sObj.setFinalGeometry(marker);
                                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.ELECTRONICEYE);
                                shapeCtrl.startEditing();
                                tooltipsCtrl.setCurrentTooltip('点击方向图标开始修改方向！');
                                eventController.off(eventController.eventTypes.DIRECTEVENT);
                                eventController.on(eventController.eventTypes.DIRECTEVENT, function (event) {
                                    selectCtrl.selectedFeatures.direct = parseInt(event.geometry.orientation);
                                    tooltipsCtrl.setChangeInnerHtml('点击空格保存,或者按ESC键取消!');
                                });
                            } else {
                                shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                                // tooltipsCtrl.setEditEventType(fastmap.dataApi.GeoLiveModelType.RDELECTRONICEYE);
                                tooltipsCtrl.setCurrentTooltip('请点击空格,创建电子眼!');
                                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.ELECTRONICEYE);
                            }
                        } else {
                            tooltipsCtrl.setCurrentTooltip('请重新选择位置创建电子眼!');
                        }
                    });
                });
            } else if (type === 'RDSLOPE') { // 坡度
                $scope.resetOperator('addRelation', type);
                var highLightFeatures = [];
                var linkPids = []; // 推荐的退出线
                var continueLinkPid = null; // 退出线
                var continueNodePid = null; // 连续link的另一个端点
                var linkLength = 0; // 长度
                var slopeData = {
                    nodePid: null,
                    linkPid: null
                };
                var exLinkPids = []; // 所有的连续link
                highRenderCtrl.highLightFeatures.length = 0;
                highRenderCtrl._cleanHighLight();
                // 设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDSLOPE);
                // 地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdSlope');
                tooltipsCtrl.setCurrentTooltip('请选择坡度起始点！！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList: ['point', 'line']
                });
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdnode);
                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    if (data.index === 0) { // 进入点
                        continueNodePid = parseInt(data.id);
                        slopeData.nodePid = continueNodePid;
                        highLightFeatures.push({
                            id: data.id.toString(),
                            layerid: 'rdLink',
                            type: 'node',
                            style: {
                                color: '#21ed25'
                            }
                        });
                        var param = {};
                        param.dbId = App.Temp.dbId;
                        param.type = 'RDLINK';
                        param.data = {
                            nodePid: data.id
                        };
                        dsEdit.getByCondition(param).then(function (linkData) {
                            if (linkData.errcode === -1) {
                                return;
                            }
                            // 排除10级道路（人行道）,提供推荐退出线
                            if (linkData.data) {
                                if (linkData.data.length == 1 && linkData.kind != 10) { // 直接作为退出线并高亮
                                    dsEdit.getByPid(linkData.data[0].pid, 'RDLINK').then(function (exLink) { // 查询退出线的长度
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
                                        if (linkLength && linkLength < 100) {
                                            tooltipsCtrl.setCurrentTooltip('Link长度为：' + linkLength + '米，请选择坡度接续link!');
                                        } else if (linkLength && linkLength > 150) {
                                            tooltipsCtrl.setCurrentTooltip('Link长度为：' + linkLength + '米，点击空格保存坡度信息,或者按ESC键取消!');
                                            eventController.off(eventController.eventTypes.GETLINKID); // 不再寻找连续link
                                            map.currentTool.disable();
                                        }
                                        // 判断此退出线是否有多个挂接link
                                        var param1 = {};
                                        param1.dbId = App.Temp.dbId;
                                        param1.type = 'RDLINK';
                                        if (linkData.data[0].sNodePid == continueNodePid) {
                                            continueNodePid = linkData.data[0].eNodePid;
                                        } else {
                                            continueNodePid = linkData.data[0].sNodePid;
                                        }
                                        param1.data = {
                                            nodePid: continueNodePid
                                        };
                                        dsEdit.getByCondition(param1).then(function (continueLinks) {
                                            if (continueLinks.errcode === -1) {
                                                return;
                                            }
                                            if (continueLinks.data) {
                                                if (continueLinks.data.length > 2 || continueLinks.data.length == 1) {
                                                    eventController.off(eventController.eventTypes.GETLINKID); // 不再寻找连续link
                                                } else if (continueLinks.data.length == 2) {
                                                    if (continueLinks.data[0].pid == slopeData.linkPid) {
                                                        continueLinkPid = continueLinks.data[1].pid;
                                                    } else {
                                                        continueLinkPid = continueLinks.data[0].pid;
                                                    }
                                                }
                                            }
                                        });
                                    });
                                } else if (linkData.data.length > 1) {
                                    // 推荐退出线
                                    for (var index in linkData.data) {
                                        if (linkData.data[index].kind != 10) {
                                            linkPids.push(linkData.data[index].pid);
                                            highLightFeatures.push({
                                                id: linkData.data[index].pid.toString(),
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
                                    tooltipsCtrl.setCurrentTooltip('请选择坡度退出线!');
                                }
                            }
                        });
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];
                        map.currentTool.snapHandler.addGuideLayer(rdLink);
                    } else { // 选择一条推荐的线作为退出线!;
                        if (slopeData.linkPid) { // 已有退出线，不再进行逻辑判断
                            // 连续link的处理如下
                            if (data.id == continueLinkPid) { // 所选的link是推荐link
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
                                dsEdit.getByPid(parseInt(data.id), 'RDLINK').then(function (conLinkDetail) { // 查询连续link的长度
                                    if (conLinkDetail) {
                                        linkLength += conLinkDetail.length;
                                        if (linkLength && linkLength < 100) {
                                            tooltipsCtrl.setCurrentTooltip('Link长度为：' + linkLength + '米，请选择坡度接续link!');
                                        } else if (linkLength && linkLength > 150) {
                                            tooltipsCtrl.setCurrentTooltip('Link长度为：' + linkLength + '米，点击空格保存坡度信息,或者按ESC键取消!');
                                            eventController.off(eventController.eventTypes.GETLINKID); // 不再寻找连续link
                                            map.currentTool.disable();
                                        }
                                        // 判断此退出线是否有多个挂接link
                                        var param1 = {};
                                        param1.dbId = App.Temp.dbId;
                                        param1.type = 'RDLINK';
                                        if (conLinkDetail.sNodePid == continueNodePid) {
                                            continueNodePid = conLinkDetail.eNodePid;
                                        } else {
                                            continueNodePid = conLinkDetail.sNodePid;
                                        }
                                        param1.data = {
                                            nodePid: continueNodePid
                                        };
                                        dsEdit.getByCondition(param1).then(function (continueLinks) {
                                            if (continueLinks.errcode === -1) {
                                                return;
                                            }
                                            if (continueLinks.data) {
                                                if (continueLinks.data.length > 2) {
                                                    map.currentTool.disable();
                                                    eventController.off(eventController.eventTypes.GETLINKID); // 不再寻找连续link
                                                } else if (continueLinks.data.length == 2) {
                                                    if (continueLinks.data[0].pid == continueLinkPid) {
                                                        continueLinkPid = continueLinks.data[1].pid;
                                                    } else {
                                                        continueLinkPid = continueLinks.data[0].pid;
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
                        } else if (linkPids.indexOf(parseInt(data.id)) > -1) { // 所选的link在推荐link中
                            continueLinkPid = parseInt(data.id);
                            slopeData.linkPid = continueLinkPid;
                            highLightFeatures.length = 0;
                            highRenderCtrl.highLightFeatures.length = 0;
                            highRenderCtrl._cleanHighLight();
                            highLightFeatures.push({
                                id: slopeData.nodePid.toString(),
                                layerid: 'rdLink',
                                type: 'node',
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
                            dsEdit.getByPid(slopeData.linkPid, 'RDLINK').then(function (exLinkDetail) { // 查询退出线的长度
                                if (exLinkDetail) {
                                    linkLength += exLinkDetail.length;
                                    if (linkLength && linkLength < 100) {
                                        tooltipsCtrl.setCurrentTooltip('Link长度为：' + linkLength + '米，请选择坡度接续link!');
                                    } else if (linkLength && linkLength > 150) {
                                        tooltipsCtrl.setCurrentTooltip('Link长度为：' + linkLength + '米，点击空格保存坡度信息,或者按ESC键取消!');
                                        eventController.off(eventController.eventTypes.GETLINKID); // 不再寻找连续link
                                        map.currentTool.disable();
                                    }
                                    // 判断此退出线是否有多个挂接link
                                    var param1 = {};
                                    param1.dbId = App.Temp.dbId;
                                    param1.type = 'RDLINK';
                                    if (exLinkDetail.sNodePid == continueNodePid) {
                                        continueNodePid = exLinkDetail.eNodePid;
                                    } else {
                                        continueNodePid = exLinkDetail.sNodePid;
                                    }
                                    param1.data = {
                                        nodePid: continueNodePid
                                    };
                                    dsEdit.getByCondition(param1).then(function (continueLinks) {
                                        if (continueLinks.errcode === -1) {
                                            return;
                                        }
                                        if (continueLinks.data) {
                                            if (continueLinks.data.length > 2) {
                                                map.currentTool.disable();
                                                eventController.off(eventController.eventTypes.GETLINKID); // 不再寻找连续link
                                            } else if (continueLinks.data.length == 2) {
                                                if (continueLinks.data[0].pid == continueLinkPid) {
                                                    continueLinkPid = continueLinks.data[1].pid;
                                                } else {
                                                    continueLinkPid = continueLinks.data[0].pid;
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
                    // tooltipsCtrl.setEditEventType('slopeData');
                    // tooltipsCtrl.setCurrentTooltip("Link长度为：" + linkLength + "米，点击空格保存坡度信息,或者按ESC键取消!");
                    shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDSLOPE);
                });
            } else if (type === 'RDDIRECTROUTE') { // 顺行
                $scope.resetOperator('addRelation', type);
                // 保存所有需要高亮的图层数组;
                var highLightFeatures = [],
                    linkDirect = 0;
                // 设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType('rdDirectRoute');
                // 地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdDirectRoute');
                tooltipsCtrl.setCurrentTooltip('正要新建顺行,先选择线！');
                $scope.directRoute = {};
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList: ['line', 'point', 'line']
                });
                map.currentTool.enable();
                // map.currentTool.snapHandler.addGuideLayer(rdnode);
                map.currentTool.snapHandler.addGuideLayer(rdLink); // 添加自动吸附的图层
                // 获取退出线并高亮;
                $scope.getOutLink = function (dataId) {
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
                    tooltipsCtrl.setCurrentTooltip('已选退出线,点击空格键保存!');
                };
                // 选择分歧监听事件;
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    if (data.index === 0) {
                        // 清除吸附的十字
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];
                        map.currentTool.snapHandler.addGuideLayer(rdnode);
                        // 进入线;
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
                        linkDirect = data.properties.direct;
                        if (linkDirect == 2 || linkDirect == 3) {
                            $scope.directRoute.nodePid = parseInt(linkDirect == 2 ? data.properties.enode : data.properties.snode);
                            highLightFeatures.push({
                                id: $scope.directRoute.nodePid.toString(),
                                layerid: 'rdLink',
                                type: 'node',
                                style: {
                                    color: 'yellow'
                                }
                            });
                            highRenderCtrl.drawHighlight();
                            map.currentTool.selectedFeatures.push($scope.directRoute.nodePid.toString());
                            tooltipsCtrl.setCurrentTooltip('已经选择进入点,选择退出线!');
                            // 清除吸附的十字
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
                                type: 'node',
                                style: {
                                    color: 'yellow'
                                }
                            });
                            highRenderCtrl.drawHighlight();
                            tooltipsCtrl.setCurrentTooltip('已经选择进入点,选择退出线!');
                            // 清除吸附的十字
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
                });
            } else if (type === 'RDSPEEDBUMP') { // 减速带
                $scope.resetOperator('addRelation', type);
                // 保存所有需要高亮的图层数组;线方向
                var highLightFeatures = [],
                    linkDirect = 0;
                // 设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDSPEEDBUMP);
                // 地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdSpeedBump');
                tooltipsCtrl.setCurrentTooltip('请选择进入线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList: ['line', 'point']
                });
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                $scope.speedBumpInfo = {};
                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    if (data.index === 0) { // 进入线;
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
                        tooltipsCtrl.setCurrentTooltip('已经选择进入线,选择进入点!');
                        linkDirect = data.properties.direct;
                        if (linkDirect == 2 || linkDirect == 3) { // 单方向
                            map.currentTool.snapHandler.snaped = false;
                            map.currentTool.clearCross();
                            map.currentTool.snapHandler._guides = [];
                            $scope.speedBumpInfo.nodePid = parseInt(linkDirect == 2 ? data.properties.enode : data.properties.snode);
                            highLightFeatures.push({
                                id: $scope.speedBumpInfo.nodePid.toString(),
                                layerid: 'rdLink',
                                type: 'node',
                                style: {
                                    color: 'yellow'
                                }
                            });
                            highRenderCtrl.drawHighlight();
                            map.currentTool.selectedFeatures.push($scope.speedBumpInfo.nodePid.toString());
                            featCodeCtrl.setFeatCode($scope.speedBumpInfo);
                            tooltipsCtrl.setCurrentTooltip('已选进入点,点击空格键保存!');
                        }
                    } else if (data.index === 1) { // 进入点
                        $scope.speedBumpInfo.nodePid = parseInt(data.id);
                        highLightFeatures.push({
                            id: $scope.speedBumpInfo.nodePid.toString(),
                            layerid: 'rdLink',
                            type: 'node',
                            style: {
                                color: '#21ed25'
                            }
                        });
                        highRenderCtrl.drawHighlight();
                        map.currentTool.selectedFeatures.push($scope.speedBumpInfo.nodePid.toString());
                        featCodeCtrl.setFeatCode($scope.speedBumpInfo);
                        tooltipsCtrl.setCurrentTooltip('已选进入点,点击空格键保存!');
                    }
                });
            } else if (type === 'RDSE') { // 分叉口提示
                $scope.resetOperator('addRelation', type);
                // 保存所有需要高亮的图层数组;线方向
                var highLightFeatures = [],
                    linkDirect = 0;
                // 设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDSE);
                // 地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdSe');
                tooltipsCtrl.setCurrentTooltip('请选择进入线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList: ['line', 'point', 'line']
                });
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                $scope.rdSe = {};
                var automaticCommand = function () { // 自动计算退出线
                    var param = {};
                    param.dbId = App.Temp.dbId;
                    param.type = 'RDLINK';
                    param.data = {
                        nodePid: $scope.rdSe.nodePid
                    };
                    dsEdit.getByCondition(param).then(function (continueLinks) {
                        if (continueLinks.errcode === -1) {
                            return;
                        }
                        if (continueLinks.data) {
                            if (continueLinks.data.length > 2) {
                                featCodeCtrl.setFeatCode({});
                                swal('错误信息', '退出线有多条，不允许创建分叉口提示', 'error');
                                tooltipsCtrl.setCurrentTooltip('退出线有多条，不允许创建分叉口提示!');
                                return;
                            }
                            for (var i = 0, len = continueLinks.data.length; i < len; i++) {
                                if (continueLinks.data[i].pid != $scope.rdSe.inLinkPid) {
                                    $scope.rdSe.outLinkPid = continueLinks.data[i].pid;
                                    highRenderCtrl.highLightFeatures.push({
                                        id: $scope.rdSe.outLinkPid.toString(),
                                        layerid: 'rdLink',
                                        type: 'line',
                                        style: {}
                                    });
                                    highRenderCtrl.drawHighlight();
                                    map.currentTool.selectedFeatures.push($scope.rdSe.outLinkPid.toString());
                                    featCodeCtrl.setFeatCode($scope.rdSe);
                                    tooltipsCtrl.setCurrentTooltip('已选退出线,点击空格键保存!');
                                    break;
                                }
                            }
                        }
                    });
                };
                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    if (data.index === 0) { // 进入线;
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
                        tooltipsCtrl.setCurrentTooltip('已经选择进入线,选择进入点!');
                        linkDirect = data.properties.direct;
                        if (linkDirect == 2 || linkDirect == 3) { // 单方向
                            map.currentTool.snapHandler.snaped = false;
                            map.currentTool.clearCross();
                            map.currentTool.snapHandler._guides = [];
                            $scope.rdSe.nodePid = parseInt(linkDirect == 2 ? data.properties.enode : data.properties.snode);
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
                    } else if (data.index === 1) { // 进入点
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];
                        map.currentTool.snapHandler.addGuideLayer(rdLink);
                        $scope.rdSe.nodePid = parseInt(data.id);
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
                        featCodeCtrl.setFeatCode($scope.rdSe);
                        tooltipsCtrl.setCurrentTooltip('已选进入点,请选择退出线!');
                    } else if (data.index >= 2) { // 退出线
                        $scope.rdSe.outLinkPid = parseInt(data.id);
                        if (highLightFeatures.length === 3) {
                            highLightFeatures.pop();
                            highRenderCtrl._cleanHighLight();
                        }
                        highLightFeatures.push({
                            id: $scope.rdSe.outLinkPid.toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {
                                color: '#21ed25'
                            }
                        });
                        highRenderCtrl.drawHighlight();
                        map.currentTool.selectedFeatures.push($scope.rdSe.outLinkPid.toString());
                        featCodeCtrl.setFeatCode($scope.rdSe);
                        tooltipsCtrl.setCurrentTooltip('已选退出线,点击空格键保存!');
                    }
                });
            } else if (type === 'RDTOLLGATE') { // 收费站
                featCodeCtrl.setFeatCode({});
                $scope.resetOperator('addRelation', type);
                // 保存所有需要高亮的图层数组;线方向
                var highLightFeatures = [],
                    linkDirect = 0;
                // 设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDTOLLGATE);
                // 地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdTollgate');
                tooltipsCtrl.setCurrentTooltip('请选择进入线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList: ['line', 'point']
                });
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                $scope.rdTollgateData = {};
                var automaticCommand = function () { // 自动计算退出线
                    var param = {};
                    param.dbId = App.Temp.dbId;
                    param.type = 'RDLINK';
                    param.data = {
                        nodePid: $scope.rdTollgateData.nodePid
                    };
                    dsEdit.getByCondition(param).then(function (continueLinks) {
                        if (continueLinks.errcode === -1) {
                            return;
                        }
                        if (continueLinks.data) {
                            if (continueLinks.data.length > 2) {
                                featCodeCtrl.setFeatCode({});
                                swal('错误信息', '退出线有多条，不允许创建收费站', 'error');
                                tooltipsCtrl.setCurrentTooltip('退出线有多条，不允许创建收费站!');
                                return;
                            }
                            for (var i = 0, len = continueLinks.data.length; i < len; i++) {
                                if (continueLinks.data[i].pid != $scope.rdTollgateData.inLinkPid) {
                                    $scope.rdTollgateData.outLinkPid = continueLinks.data[i].pid;
                                    highLightFeatures.push({
                                        id: $scope.rdTollgateData.outLinkPid.toString(),
                                        layerid: 'rdLink',
                                        type: 'line',
                                        style: {}
                                    });
                                    highRenderCtrl.drawHighlight();
                                    map.currentTool.selectedFeatures.push($scope.rdTollgateData.outLinkPid.toString());
                                    featCodeCtrl.setFeatCode($scope.rdTollgateData);
                                    tooltipsCtrl.setCurrentTooltip('已选退出线,点击空格键保存!');
                                    break;
                                }
                            }
                        }
                    });
                };
                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    if (data.index === 0) { // 进入线;
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];
                        map.currentTool.snapHandler.addGuideLayer(rdnode);
                        $scope.rdTollgateData.inLinkPid = parseInt(data.id);
                        if (data.properties.kind == 10 || data.properties.kind == 11 || data.properties.form.indexOf('20') > -1) {
                            tooltipsCtrl.notify('10级路、步行街、人渡不能作为收费站的进入线!', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
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
                        tooltipsCtrl.setCurrentTooltip('已经选择进入线,选择进入点!');
                        linkDirect = data.properties.direct;
                        if (linkDirect == 2 || linkDirect == 3) { // 单方向
                            map.currentTool.snapHandler.snaped = false;
                            map.currentTool.clearCross();
                            map.currentTool.snapHandler._guides = [];
                            $scope.rdTollgateData.nodePid = parseInt(linkDirect == 2 ? data.properties.enode : data.properties.snode);
                            dsEdit.getByPid($scope.rdTollgateData.nodePid, 'RDNODE').then(function (data) {
                                if (data) {
                                    if (data.kind == 2 || data.kind == 3) {
                                        tooltipsCtrl.notify('属性变化点和路上点不能作为收费站的进入点!', 'error');
                                        map.currentTool.selectedFeatures.pop();
                                        tooltipsCtrl.setCurrentTooltip('请重新选择进入线');
                                    } else {
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
                                    }
                                } else {
                                    tooltipsCtrl.setCurrentTooltip('请重新选择进入点!');
                                }
                            });
                            // featCodeCtrl.setFeatCode($scope.rdTollgateData);
                            // tooltipsCtrl.setCurrentTooltip("已选进入点,请选择退出线!");
                        }
                    } else if (data.index === 1) { // 进入点
                        // 清除鼠标十字
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];
                        // map.currentTool.snapHandler.addGuideLayer(rdLink); //增加吸附图层
                        $scope.rdTollgateData.nodePid = parseInt(data.id);
                        dsEdit.getByPid($scope.rdTollgateData.nodePid, 'RDNODE').then(function (data) {
                            if (data) {
                                if (data.kind == 2 || data.kind == 3) {
                                    tooltipsCtrl.notify('属性变化点和路上点不能作为收费站的进入点!', 'error');
                                    map.currentTool.selectedFeatures.pop();
                                } else {
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
                                }
                            } else {
                                tooltipsCtrl.setCurrentTooltip('请重新选择进入点!');
                            }
                        });
                    } else if (data.index >= 2) { // 退出线
                        $scope.rdTollgateData.outLinkPid = parseInt(data.id);
                        if (data.properties.kind == 10 || data.properties.kind == 11 || data.properties.form.indexOf('20') > -1) {
                            tooltipsCtrl.notify('10级路、步行街、人渡不能作为收费站的退出线!', 'error');
                            map.currentTool.selectedFeatures.pop();
                            return;
                        }
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
                        tooltipsCtrl.setCurrentTooltip('已选退出线,点击空格键保存!');
                    }
                });
            } else if (type === 'RDVOICEGUIDE') { // 语音引导
                $scope.resetOperator('addRelation', type);
                // 保存所有需要高亮的图层数组;线方向
                var highLightFeatures = [],
                    linkDirect = 0;
                // 设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDVOICEGUIDE);
                // 地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdVoiceguide');
                tooltipsCtrl.setCurrentTooltip('请选择进入线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList: ['line', 'point', 'line']
                });
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                $scope.rdVoiceguide = {};
                $scope.rdVoiceguide.outLinkPids = [];
                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    if (data.index === 0) { // 进入线;
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
                        tooltipsCtrl.setCurrentTooltip('已经选择进入线,选择进入点!');
                        linkDirect = data.properties.direct;
                        if (linkDirect == 2 || linkDirect == 3) { // 单方向
                            map.currentTool.snapHandler.snaped = false;
                            map.currentTool.clearCross();
                            map.currentTool.snapHandler._guides = [];
                            $scope.rdVoiceguide.nodePid = parseInt(linkDirect == 2 ? data.properties.enode : data.properties.snode);
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
                            tooltipsCtrl.setCurrentTooltip('已选进入点,请选择退出线!');
                        }
                    } else if (data.index === 1) { // 进入点
                        // 清除鼠标十字
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];
                        map.currentTool.snapHandler.addGuideLayer(rdLink); // 增加吸附图层
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
                    } else if (data.index >= 2) { // 退出线
                        if ($scope.rdVoiceguide.outLinkPids.indexOf(parseInt(data.id)) <= 0) {
                            $scope.rdVoiceguide.outLinkPids.push(parseInt(data.id));
                            highLightFeatures.push({
                                id: data.id,
                                layerid: 'rdLink',
                                type: 'line',
                                style: {}
                            });
                            highRenderCtrl.drawHighlight();
                            featCodeCtrl.setFeatCode($scope.rdVoiceguide);
                            tooltipsCtrl.setCurrentTooltip('继续选择退出线,或者点击空格键保存!');
                        }
                    }
                });
            } else if (type === 'VARIABLESPEED') {
                $scope.jointNode = $scope.jointLink = '';
                $scope.limitRelation.vias = [];
                highRenderCtrl.highLightFeatures = [];
                $scope.linkNodes = [], $scope.links = [];
                var linkDirect = 0;
                // 可变限速
                $scope.resetOperator('addRelation', type);
                // 保存所有需要高亮的图层数组;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.VARIABLESPEED);
                // 地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdBranch');
                tooltipsCtrl.setCurrentTooltip('正要新建可变限速,先选择线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList: ['line', 'point', 'line']
                });
                map.currentTool.enable();
                // 添加自动吸附的图层
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                // 获取选中线的详细信息;
                function getLinkInfos(param) {
                    var defer = $q.defer();
                    dsEdit.getByPid(param, 'RDLINK').then(function (data) {
                        if (data) {
                            defer.resolve(data);
                        }
                    });
                    return defer.promise;
                }
                // 高亮退出线方法;
                function hightlightOutLink() {
                    highRenderCtrl.highLightFeatures.splice(2);
                    highRenderCtrl.highLightFeatures.push({
                        id: parseInt($scope.limitRelation.outLinkPid).toString(),
                        layerid: 'rdLink',
                        type: 'line',
                        style: {}
                    });
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.drawHighlight();
                    tooltipsCtrl.setCurrentTooltipText('请选择接续线!');
                }
                // 高亮接续线方法;
                function hightlightViasLink() {
                    highRenderCtrl.highLightFeatures.splice(3);
                    for (var i = 0; i < $scope.limitRelation.vias.length; i++) {
                        highRenderCtrl.highLightFeatures.push({
                            id: parseInt($scope.limitRelation.vias[i]).toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {
                                color: 'blue'
                            }
                        });
                    }
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.drawHighlight();
                    tooltipsCtrl.setCurrentTooltipText('已选接续线!');
                }
                // 选择接续线（支持修改退出线和接续线）;
                function selectOutOrSeriesLinks(dataresult) {
                    // 判断选的线的合法性;
                    if (dataresult.id == $scope.limitRelation.inLinkPid) {
                        tooltipsCtrl.setCurrentTooltipText('所选线不能与进入线重复!');
                        return;
                    }
                    // 如果是修改的是退出线（支持修改）;
                    if (dataresult.properties.enode == $scope.linkNodes[0] && dataresult.properties.direct == 3) {
                        $scope.limitRelation.outLinkPid = dataresult.id;
                        $scope.limitRelation.vias = [];
                        // 对于node和link数组的维护;
                        $scope.links.splice(0);
                        $scope.links.push(parseInt(dataresult.id));
                        $scope.linkNodes.splice(1);
                        $scope.linkNodes.push(parseInt(dataresult.properties.snode));
                        hightlightOutLink();
                        return;
                    } else if (dataresult.properties.snode == $scope.linkNodes[0] && dataresult.properties.direct == 2) {
                        $scope.limitRelation.outLinkPid = dataresult.id;
                        $scope.limitRelation.vias = [];
                        // 对于node和link数组的维护;
                        $scope.links.splice(0);
                        $scope.links.push(parseInt(dataresult.id));
                        $scope.linkNodes.splice(1);
                        $scope.linkNodes.push(parseInt(dataresult.properties.enode));
                        hightlightOutLink();
                        return;
                    } else if ((dataresult.properties.enode == $scope.linkNodes[0] || dataresult.properties.snode == $scope.linkNodes[0]) && dataresult.properties.direct == 1) {
                        $scope.limitRelation.outLinkPid = dataresult.id;
                        $scope.limitRelation.vias = [];
                        // 对于node和link数组的维护;
                        $scope.links.splice(0);
                        $scope.links.push(parseInt(dataresult.id));
                        $scope.linkNodes.splice(1);
                        (dataresult.properties.enode == $scope.linkNodes[0]) ? $scope.linkNodes.push(parseInt(dataresult.properties.snode)) : $scope.linkNodes.push(parseInt(dataresult.properties.enode));
                        hightlightOutLink();
                        return;
                    } else {
                        tooltipsCtrl.setCurrentTooltipText('退出线与进入点不连续或方向错误!');
                    }
                    /* -----------------------------------如果增加的是接续线（支持修改）;-----------------------------------*/
                    /* 判断接续线是否能与进入线重合，原则上不能重合*/
                    if (dataresult.id == $scope.limitRelation.inLinkPid) {
                        tooltipsCtrl.setCurrentTooltipText('接续线不能与进入线重合!');
                        return;
                    }
                    /* 判断接续线是否能与退出线线重合，原则上不能重合*/
                    if (dataresult.id == $scope.limitRelation.outLinkPid) {
                        tooltipsCtrl.setCurrentTooltipText('接续线不能与退出线重合!');
                        return;
                    }
                    /* 如果没有接续线接续线直接跟退出线挂接;*/
                    if ($scope.limitRelation.vias.indexOf(parseInt(dataresult.id)) == -1) {
                        if (dataresult.properties.enode == $scope.linkNodes[$scope.linkNodes.length - 1] && dataresult.properties.direct == 3) {
                            $scope.limitRelation.vias.push(parseInt(dataresult.id));
                            // 对于node和link数组的维护;
                            $scope.links.push(parseInt(dataresult.id));
                            $scope.linkNodes.push(parseInt(dataresult.properties.snode));
                            hightlightViasLink();
                        } else if (dataresult.properties.snode == $scope.linkNodes[$scope.linkNodes.length - 1] && dataresult.properties.direct == 2) {
                            $scope.limitRelation.vias.push(parseInt(dataresult.id));
                            // 对于node和link数组的维护;
                            $scope.links.push(parseInt(dataresult.id));
                            $scope.linkNodes.push(parseInt(dataresult.properties.enode));
                            hightlightViasLink();
                        } else if ((dataresult.properties.enode == $scope.linkNodes[$scope.linkNodes.length - 1] || dataresult.properties.snode == $scope.linkNodes[$scope.linkNodes.length - 1]) && dataresult.properties.direct == 1) {
                            // 对于node和link数组的维护;
                            $scope.links.push(parseInt(dataresult.id));
                            $scope.limitRelation.vias.push(parseInt(dataresult.id));
                            (dataresult.properties.enode == $scope.linkNodes[$scope.linkNodes.length - 1]) ? $scope.linkNodes.push(parseInt(dataresult.properties.snode)) : $scope.linkNodes.push(parseInt(dataresult.properties.enode));
                            hightlightViasLink();
                        } else {
                            tooltipsCtrl.setCurrentTooltipText('您选择的接续线与上一条不连续或方向错误!');
                        }
                    } else {
                        var selectIndex = $scope.limitRelation.vias.indexOf(parseInt(dataresult.id));
                        $scope.links.splice(selectIndex);
                        $scope.linkNodes.splice(selectIndex + 2);
                        $scope.limitRelation.vias.splice(selectIndex);
                        hightlightViasLink();
                    }
                }
                // 选择分歧监听事件;
                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    if (data.index === 0) { // 第一次选择进入线的逻辑
                        // 初始化新增数据;
                        $scope.limitRelation.vias = [];
                        $scope.limitRelation.inLinkPid = '';
                        $scope.limitRelation.nodePid = '';
                        $scope.limitRelation.outLinkPid = '';
                        // 清除吸附的十字
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];
                        map.currentTool.snapHandler.addGuideLayer(rdnode);
                        // 高亮进入线;
                        $scope.limitRelation.inLinkPid = parseInt(data.id);
                        highRenderCtrl.highLightFeatures.push({
                            id: $scope.limitRelation.inLinkPid.toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {
                                color: '#21ed25'
                            }
                        });
                        highRenderCtrl.drawHighlight();
                        tooltipsCtrl.setCurrentTooltip('已经选择进入线,选择进入点!');
                        // 进入线的方向属性;
                        linkDirect = data.properties.direct;
                        // 如果进入线是单方向道路，自动选择进入点;
                        if (linkDirect == 2 || linkDirect == 3) {
                            $scope.limitRelation.nodePid = parseInt(linkDirect == 2 ? data.properties.enode : data.properties.snode);
                            $scope.linkNodes.push($scope.limitRelation.nodePid);
                            highRenderCtrl.highLightFeatures.push({
                                id: $scope.limitRelation.nodePid.toString(),
                                layerid: 'rdLink',
                                type: 'node',
                                style: {
                                    color: 'yellow'
                                }
                            });
                            highRenderCtrl.drawHighlight();
                            map.currentTool.selectedFeatures.push($scope.limitRelation.nodePid.toString());
                            tooltipsCtrl.setCurrentTooltip('已经选择进入点,选择退出线!');
                            map.currentTool.snapHandler.addGuideLayer(rdLink);
                        }
                    } else if (data.index === 1) {
                        // 如果进入线是双方向的，则根据用户的选择高亮进入点;
                        $scope.limitRelation.nodePid = parseInt(data.id);
                        $scope.linkNodes.push($scope.limitRelation.nodePid);
                        highRenderCtrl.highLightFeatures.push({
                            id: $scope.limitRelation.nodePid.toString(),
                            layerid: 'rdLink',
                            type: 'node',
                            style: {
                                color: 'yellow'
                            }
                        });
                        highRenderCtrl.drawHighlight();
                        tooltipsCtrl.setCurrentTooltip('已经选择进入点!');
                        setTimeout(function () {
                            tooltipsCtrl.setCurrentTooltip('请选择退出线!');
                        }, 30);
                        map.currentTool.snapHandler.addGuideLayer(rdLink);
                    } else if (data.index == 2) {
                        getLinkInfos(parseInt(data.id)).then(function (outLinkData) {
                            /* 判断退出线的合法与否*/
                            if (outLinkData.eNodePid != $scope.limitRelation.nodePid && outLinkData.sNodePid != $scope.limitRelation.nodePid) {
                                tooltipsCtrl.setCurrentTooltip('退出线必须与进入点衔接!');
                                map.currentTool.selectedFeatures.splice(map.currentTool.selectedFeatures.length - 1);
                                return;
                            }
                            if (data.id == $scope.limitRelation.inLinkPid) {
                                tooltipsCtrl.setCurrentTooltipText('退出线不能与进入线重合!');
                                map.currentTool.selectedFeatures.splice(map.currentTool.selectedFeatures.length - 1);
                                return;
                            }
                            /* 判断退出线的方向的正确与否*/
                            if (outLinkData.direct == 1) {
                                $scope.jointNode = outLinkData.eNodePid == $scope.limitRelation.nodePid ? outLinkData.sNodePid : outLinkData.eNodePid;
                            } else if (outLinkData.direct == 2 || outLinkData.direct == 3) {
                                if (outLinkData.sNodePid == $scope.limitRelation.nodePid && outLinkData.direct == 2 || outLinkData.eNodePid == $scope.limitRelation.nodePid && outLinkData.direct == 3) {
                                    if (outLinkData.sNodePid == $scope.limitRelation.nodePid && outLinkData.direct == 2) {
                                        $scope.jointNode = outLinkData.eNodePid;
                                    } else {
                                        $scope.jointNode = outLinkData.sNodePid;
                                    }
                                } else {
                                    tooltipsCtrl.setCurrentTooltipText('退出线方向错误!');
                                    return;
                                }
                            } else {
                                tooltipsCtrl.setCurrentTooltipText('该道路方向不确定!');
                                map.currentTool.selectedFeatures.splice(map.currentTool.selectedFeatures.length - 1);
                                return;
                            }
                            $scope.limitRelation.outLinkPid = parseInt(data.id);
                            $scope.links.push(parseInt(data.id));
                            $scope.linkNodes.push($scope.jointNode);
                            highRenderCtrl.highLightFeatures.push({
                                id: parseInt(data.id).toString(),
                                layerid: 'rdLink',
                                type: 'line',
                                style: {}
                            });
                            highRenderCtrl.drawHighlight();
                            tooltipsCtrl.setCurrentTooltip('请选择接续线!');
                            // console.log($scope.links)
                            // console.log($scope.linkNodes)
                        });
                    } else if (data.index > 2) {
                        selectOutOrSeriesLinks(data);
                    }
                    /* 组装数据对象*/
                    featCodeCtrl.setFeatCode($scope.limitRelation);
                });
            } else if (type === 'RDLANE') { // 详细车道
                if (map.getZoom() < 8) {
                    swal('提示', '地图缩放等级必须大于16级才可操作', 'info');
                    return;
                }
                $scope.resetOperator('addRelation', type);
                // 保存所有需要高亮的图层数组;线方向
                var highLightFeatures = [],
                    linkDirect = 0;
                // 设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDLANE);
                // 地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdLane');
                tooltipsCtrl.setCurrentTooltip('请选择道路线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList: ['line', 'point', 'line']
                });
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                $scope.laneInfo = {
                    links: []
                };
                $scope.linkArray = [];
                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    map.currentTool.snapHandler.snaped = false;
                    map.currentTool.snapHandler._guides = [];
                    map.currentTool.snapHandler.addGuideLayer(rdnode);
                    // 过滤
                    $scope.unique = function (arr) {
                        var result = [],
                            hash = {};
                        for (var i = 0, elem;
                             (elem = arr[i]) != null; i++) {
                            if (!hash[elem]) {
                                result.push(elem);
                                hash[elem] = true;
                            }
                        }
                        return result;
                    };
                    // 追踪高亮
                    $scope.getTrackLinks = function (laneInfo) {
                        var param = {
                            command: 'CREATE',
                            dbId: 42,
                            type: 'RDLINK',
                            data: {
                                linkPid: laneInfo.inLinkPid,
                                nodePidDir: laneInfo.nodePid
                            }
                        };
                        dsEdit.getByCondition(param).then(function (data) {
                            $scope.linkArray = data.data;
                            $scope.laneInfo.links = data.data;
                            for (var i = 0, len = data.data.length; i < len; i++) {
                                // $scope.linkArray.push(data.data[i].pid);
                                if (i === 0) {
                                    highLightFeatures.push({
                                        id: data.data[i].pid.toString(),
                                        layerid: 'rdLink',
                                        type: 'line',
                                        style: {
                                            color: 'rgb(255, 0, 0)'
                                        }
                                    });
                                } else {
                                    highLightFeatures.push({
                                        id: data.data[i].pid.toString(),
                                        layerid: 'rdLink',
                                        type: 'line',
                                        style: {
                                            color: 'rgb(0, 245, 255)'
                                        }
                                    });
                                }
                            }
                            highRenderCtrl.drawHighlight();
                        });
                    };
                    // link高亮
                    $scope.linkHighLight = function () {
                        for (var i = 0, len = $scope.linkArray.length; i < len; i++) {
                            highLightFeatures.push({
                                id: $scope.laneInfo.nodePid.toString(),
                                layerid: 'rdLink',
                                type: 'node',
                                style: {
                                    color: 'yellow'
                                }
                            });
                            if (i == 0) {
                                highLightFeatures.push({
                                    id: $scope.linkArray[i].pid.toString(),
                                    layerid: 'rdLink',
                                    type: 'line',
                                    style: {
                                        color: 'rgb(255, 0, 0)'
                                    }
                                });
                            } else {
                                highLightFeatures.push({
                                    id: $scope.linkArray[i].pid.toString(),
                                    layerid: 'rdLink',
                                    type: 'line',
                                    style: {
                                        color: 'rgb(0, 245, 255)'
                                    }
                                });
                            }
                        }
                        highRenderCtrl.highLightFeatures = highLightFeatures;
                        highRenderCtrl.drawHighlight();
                        for (var i = 0, len = $scope.linkArray.length; i < len; i++) {
                            $scope.laneInfo.links.push($scope.linkArray[i].pid);
                        }
                        $scope.laneInfo.links = $scope.unique($scope.laneInfo.links);
                    };
                    // 反选link
                    $scope.chargeTrackLink = function (linkObj) {
                        highRenderCtrl._cleanHighLight();
                        highLightFeatures = [];
                        for (var j = 0, le = $scope.linkArray.length; j < le; j++) {
                            if ($scope.linkArray[j].pid == parseInt(linkObj.pid)) {
                                $scope.linkArray.splice(j, $scope.linkArray.length - j + 1);
                                $scope.linkHighLight();
                                return;
                            } else if (j == $scope.linkArray.length - 1) {
                                if (
                                        (parseInt(linkObj.direct) == 2 && ($scope.linkArray[$scope.linkArray.length - 1].eNodePid == parseInt(linkObj.sNodePid))) || (parseInt(linkObj.direct) == 3 && ($scope.linkArray[$scope.linkArray.length - 1].sNodePid == parseInt(linkObj.eNodePid))) || (parseInt(linkObj.direct) == 1 && ($scope.linkArray[$scope.linkArray.length - 1].eNodePid == parseInt(linkObj.sNodePid) ||
                                            // $scope.linkArray[$scope.linkArray.length-1].sNodePid == parseInt(linkObj.eNodePid) ||
                                            // $scope.linkArray[$scope.linkArray.length-1].sNodePid == parseInt(linkObj.sNodePid) ||
                                        $scope.linkArray[$scope.linkArray.length - 1].eNodePid == parseInt(linkObj.eNodePid)))) {
                                    $scope.linkArray.push(linkObj);
                                }
                            }
                        }
                        $scope.linkHighLight();
                    };
                    // 格式化link
                    $scope.formatLink = function (link) {
                        var newLink = link;
                        for (var k in newLink) {
                            if (k == 'id') {
                                newLink.pid = newLink.id;
                            } else if (k == 'snode') {
                                newLink.sNodePid = newLink.snode;
                            } else if (k == 'enode') {
                                newLink.eNodePid = newLink.enode;
                            }
                        }
                        return newLink;
                    };
                    if (data.index === 0) { // 进入线;
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];
                        map.currentTool.snapHandler.addGuideLayer(rdnode);
                        $scope.laneInfo.inLinkPid = parseInt(data.id);
                        if (!$scope.isLinkTrack) {
                            $scope.linkArray.push($scope.formatLink(data.properties));
                            $scope.laneInfo.links.push($scope.formatLink(data.properties).pid);
                        }
                        highLightFeatures.push({
                            id: $scope.laneInfo.inLinkPid.toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {
                                color: '#21ed25'
                            }
                        });
                        highRenderCtrl.highLightFeatures = highLightFeatures;
                        highRenderCtrl.drawHighlight();
                        tooltipsCtrl.setCurrentTooltip('已经选择进入线,选择进入点!');
                        linkDirect = data.properties.direct;
                        if (linkDirect == 2 || linkDirect == 3) { // 单方向
                            map.currentTool.snapHandler.snaped = false;
                            map.currentTool.clearCross();
                            map.currentTool.snapHandler._guides = [];
                            $scope.laneInfo.nodePid = parseInt(linkDirect == 2 ? data.properties.enode : data.properties.snode);
                            $scope.laneInfo.laneDir = 0;
                            highLightFeatures.push({
                                id: $scope.laneInfo.nodePid.toString(),
                                layerid: 'rdLink',
                                type: 'node',
                                style: {
                                    color: 'yellow'
                                }
                            });
                            highRenderCtrl.drawHighlight();
                            map.currentTool.selectedFeatures.push($scope.laneInfo.nodePid.toString());
                            if ($scope.isLinkTrack) { // 自动捕捉
                                $scope.getTrackLinks($scope.laneInfo);
                            }
                            tooltipsCtrl.setCurrentTooltip('已选进入点,请选择道路线!');
                        }
                    } else if (data.index === 1) { // 进入点
                        if (linkDirect == 2 || linkDirect == 3) {
                            $scope.chargeTrackLink($scope.formatLink(data.properties));
                        } else {
                            $scope.laneInfo.nodePid = parseInt(data.id);
                            if ($scope.linkArray.length > 0 && parseInt($scope.linkArray[0].snode) == $scope.laneInfo.nodePid) {
                                $scope.laneInfo.laneDir = 1;
                            } else {
                                $scope.laneInfo.laneDir = 2;
                            }
                            highLightFeatures.push({
                                id: $scope.laneInfo.nodePid.toString(),
                                layerid: 'rdLink',
                                type: 'node',
                                style: {
                                    color: 'yellow'
                                }
                            });
                            highRenderCtrl.drawHighlight();
                            map.currentTool.selectedFeatures.push($scope.laneInfo.nodePid.toString());
                            if ($scope.isLinkTrack) {
                                $scope.getTrackLinks($scope.laneInfo);
                            }
                            tooltipsCtrl.setCurrentTooltip('已选进入点,请选择道路线!');
                        }
                    } else if (data.index > 1) {
                        $scope.chargeTrackLink($scope.formatLink(data.properties));
                        if ($scope.linkArray.length > 0 && parseInt($scope.linkArray[0].snode) == $scope.laneInfo.nodePid) {
                            $scope.laneInfo.laneDir = 1;
                        } else {
                            $scope.laneInfo.laneDir = 2;
                        }
                    }
                    featCodeCtrl.setFeatCode($scope.laneInfo);
                });
            } else if (type === 'RDHGWGLIMIT') { // 限高限重
                $scope.resetOperator('addRelation', type);
                var angle,
                    hgwgLimitObj = {};
                if (shapeCtrl.shapeEditorResult) {
                    // shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point(0, 0)]));
                    // selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                    layerCtrl.pushLayerFront('edit');
                }
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.POINTVERTEXADD); // 可以共用一个api
                shapeCtrl.startEditing();
                map.currentTool = shapeCtrl.getCurrentTool();
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                tooltipsCtrl.setEditEventType('pointVertexAdd');
                tooltipsCtrl.setCurrentTooltip('请选择限高限重位置点！');
                eventController.off(eventController.eventTypes.RESETCOMPLETE);
                eventController.on(eventController.eventTypes.RESETCOMPLETE, function (e) {
                    var pro = e.property;
                    hgwgLimitObj.linkPid = pro.id;
                    hgwgLimitObj.latitude = e.latlng.lat;
                    hgwgLimitObj.longitude = e.latlng.lng;
                    highLightFeatures = [];
                    highRenderCtrl.cleanHighLight();
                    highLightFeatures.push({
                        id: pro.id.toString(),
                        layerid: 'rdLink',
                        type: 'line',
                        style: '#00F5FF'
                    });
                    highRenderCtrl.highLightFeatures = highLightFeatures;
                    highRenderCtrl.drawHighlight();
                    dsEdit.getByPid(pro.id, 'RDLINK').then(function (data) {
                        if (data) {
                            // 当前点位和线的断点距离小于0.5米就认为是同一点
                            if (e.latlng.distanceTo(new L.latLng(data.geometry.coordinates[0][1], data.geometry.coordinates[0][0])) < 0.5 || e.latlng.distanceTo(new L.latLng(data.geometry.coordinates[data.geometry.coordinates.length - 1][1], data.geometry.coordinates[data.geometry.coordinates.length - 1][0])) < 0.5) {
                                selectCtrl.selectedFeatures = null;
                                editLayer.drawGeometry = null;
                                shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                                shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
                                editLayer.clear();
                                tooltipsCtrl.notify('卡车地图不能制作到关联link端点！', 'error');
                                return;
                            }

                            selectCtrl.onSelected({
                                linkPid: pro.id,
                                latitude: e.latlng.lat,
                                longitude: e.latlng.lng,
                                direct: pro.direct
                            });
                            if (pro.direct == 1) {
                                tooltipsCtrl.setEditEventType(fastmap.dataApi.GeoLiveModelType.RDHGWGLIMIT);
                                var point = shapeCtrl.shapeEditorResult.getFinalGeometry();
                                var linkCoords = data.geometry.coordinates;
                                // 计算鼠标点位置与线的节点的关系，判断与鼠标点最近的节点
                                // 并用斜率判断默认值
                                var index = 0,
                                    tp = map.latLngToContainerPoint([point.y, point.x]),
                                    dist,
                                    sVertex,
                                    eVertex,
                                    d1,
                                    d2,
                                    d3;
                                for (var i = 0, len = linkCoords.length - 1; i < len; i++) {
                                    sVertex = map.latLngToContainerPoint(L.latLng(linkCoords[i][1], linkCoords[i][0]));
                                    eVertex = map.latLngToContainerPoint(L.latLng(linkCoords[i + 1][1], linkCoords[i + 1][0]));
                                    dist = L.LineUtil.pointToSegmentDistance(tp, sVertex, eVertex);
                                    if (dist < 5) {
                                        d1 = (tp.x - sVertex.x) * (tp.x - sVertex.x) + (tp.y - sVertex.y) * (tp.y - sVertex.y);
                                        d2 = (tp.x - eVertex.x) * (tp.x - eVertex.x) + (tp.y - eVertex.y) * (tp.y - eVertex.y);
                                        d3 = (sVertex.x - eVertex.x) * (sVertex.x - eVertex.x) + (sVertex.y - eVertex.y) * (sVertex.y - eVertex.y);
                                        if (d1 <= d3 && d2 <= d3) {
                                            index = i;
                                            break;
                                        }
                                    }
                                }
                                angle = $scope.angleOfLink(sVertex, eVertex);
                                if (sVertex.x > eVertex.x || (sVertex.x == eVertex.x && sVertex.y > eVertex.y)) { // 从右往左划线或者从下网上划线
                                    angle = Math.PI + angle;
                                }
                                tooltipsCtrl.setEditEventType(fastmap.dataApi.GeoLiveModelType.RDHGWGLIMIT);
                                var marker = {
                                    flag: false,
                                    point: point,
                                    type: 'marker',
                                    angle: angle,
                                    orientation: '2',
                                    pointForDirect: point
                                };
                                layerCtrl.pushLayerFront('edit');
                                var sObj = shapeCtrl.shapeEditorResult;
                                editLayer.drawGeometry = marker;
                                editLayer.draw(marker, editLayer);
                                sObj.setOriginalGeometry(marker);
                                sObj.setFinalGeometry(marker);
                                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDHGWGLIMIT);
                                shapeCtrl.startEditing();
                                tooltipsCtrl.setCurrentTooltip('点击方向图标开始修改方向！');

                                selectCtrl.selectedFeatures.direct = 2; // 默认顺方向
                                eventController.off(eventController.eventTypes.DIRECTEVENT);
                                eventController.on(eventController.eventTypes.DIRECTEVENT, function (event) {
                                    selectCtrl.selectedFeatures.direct = parseInt(event.geometry.orientation);
                                    tooltipsCtrl.setChangeInnerHtml('点击空格保存,或者按ESC键取消!');
                                });
                            } else {
                                shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                                tooltipsCtrl.setCurrentTooltip('请点击空格,创建限高限重!');
                                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDHGWGLIMIT);
                            }
                        } else {
                            tooltipsCtrl.setCurrentTooltip('请重新选择位置创建限高限重!');
                        }
                    });
                });
            } else if (type === 'RDLANETOPO') { // 车道连通
                $scope.resetOperator('addRelation', type);
                var laneTopoData = {
                    linkPids: [],
                    nodePid: '',
                    laneDir: 1
                };
                var rdlinkData = [];
                var nodePids = [];
                highRenderCtrl.highLightFeatures = [];
                highRenderCtrl._cleanHighLight();
                // 设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDLANETOPODETAIL);
                // 地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdLaneTopoDetail');
                tooltipsCtrl.setCurrentTooltip('请选择进入线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList: ['line', 'point', 'line']
                });
                map.currentTool.enable();
                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    if (data.index === 0) {
                        if (parseInt(data.properties.direct) == 1) {
                            laneTopoData.linkPids.push(parseInt(data.id));
                            highRenderCtrl.highLightFeatures.push({
                                id: laneTopoData.linkPids[0].toString(),
                                layerid: 'rdLink',
                                type: 'line',
                                style: {
                                    color: 'red'
                                }
                            });
                            highRenderCtrl.drawHighlight();
                            tooltipsCtrl.setCurrentTooltip('已经选择进入线, 请选择进入点!');
                        } else if (parseInt(data.properties.direct) == 2 || parseInt(data.properties.direct) == 3) {
                            laneTopoData.linkPids.push(parseInt(data.id));
                            highRenderCtrl.highLightFeatures.push({
                                id: laneTopoData.linkPids[0].toString(),
                                layerid: 'rdLink',
                                type: 'line',
                                style: {
                                    color: 'red'
                                }
                            });
                            if (parseInt(data.properties.direct) == 2) {
                                laneTopoData.nodePid = parseInt(data.properties.enode);
                            } else if (parseInt(data.properties.direct) == 3) {
                                laneTopoData.nodePid = parseInt(data.properties.snode);
                            }
                            highRenderCtrl.highLightFeatures.push({
                                id: laneTopoData.nodePid.toString(),
                                layerid: 'rdLink',
                                type: 'node',
                                style: {}
                            });
                            highRenderCtrl.drawHighlight();
                            var param = {
                                type: 'RDLANE',
                                dbId: App.Temp.dbId,
                                data: {
                                    linkPid: laneTopoData.linkPids[0],
                                    nodePid: laneTopoData.nodePid
                                }
                            };
                            dsEdit.getByCondition(param).then(function (outData) {
                                if (outData != null) {
                                    if (outData.data && outData.data.length > 0) {
                                        for (var i = 0; i < outData.data.length; i++) {
                                            highRenderCtrl.highLightFeatures.push({
                                                id: outData.data[i].toString(),
                                                layerid: 'rdLink',
                                                type: 'line',
                                                style: {
                                                    color: 'black'
                                                }
                                            });
                                        }
                                        highRenderCtrl.drawHighlight();
                                    }
                                }
                            });
                            tooltipsCtrl.setCurrentTooltip('已经选择进入点, 请选择退出线!');
                            map.currentTool.selectedFeatures.push(laneTopoData.nodePid);
                        }
                    } else if (data.index === 1) {
                        laneTopoData.nodePid = parseInt(data.id);
                        highRenderCtrl.highLightFeatures.push({
                            id: laneTopoData.nodePid.toString(),
                            layerid: 'rdLink',
                            type: 'node',
                            style: {}
                        });
                        highRenderCtrl.drawHighlight();
                        var param = {
                            type: 'RDLANE',
                            dbId: App.Temp.dbId,
                            data: {
                                linkPid: laneTopoData.linkPids[0],
                                nodePid: laneTopoData.nodePid
                            }
                        };
                        dsEdit.getByCondition(param).then(function (outData) {
                            if (outData != null) {
                                if (outData.data && outData.data.length > 0) {
                                    for (var i = 0; i < outData.data.length; i++) {
                                        highRenderCtrl.highLightFeatures.push({
                                            id: outData.data[i].toString(),
                                            layerid: 'rdLink',
                                            type: 'line',
                                            style: {
                                                color: 'black'
                                            }
                                        });
                                    }
                                    highRenderCtrl.drawHighlight();
                                }
                            }
                        });
                        tooltipsCtrl.setCurrentTooltip('已经选择进入点, 请选择退出线!');
                        map.currentTool.selectedFeatures.push(laneTopoData.nodePid);
                    } else if (data.index > 1 && laneTopoData.linkPids.indexOf(parseInt(data.id)) < 0) {
                        laneTopoData.linkPids.push(parseInt(data.id));
                        highRenderCtrl.highLightFeatures.push({
                            id: laneTopoData.linkPids[laneTopoData.linkPids.length - 1].toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {}
                        });
                        highRenderCtrl.drawHighlight();
                        tooltipsCtrl.setCurrentTooltip('继续选退出线, 或者点击空格创建,或者按ESC键取消!');
                    }
                    shapeCtrl.shapeEditorResult.setFinalGeometry(laneTopoData);
                    // tooltipsCtrl.setCurrentTooltip("点击空格保存车道连通信息,或者按ESC键取消!");
                });

                // map.currentTool = new fastmap.uikit.SelectRelation({
                //     map: map,
                //     relationFlag: true
                // });
                // map.currentTool.enable();
                // editLayer.bringToBack();
                // eventController.off(eventController.eventTypes.GETRELATIONID);
                // eventController.on(eventController.eventTypes.GETRELATIONID, function(data) {
                //     if (data.optype != "RDLANE") {
                //         return;
                //     }
                //     var rdlinks = rdLink.tiles[data.tileId].data;
                //
                //     for (var i = 0; i < rdlinks.length; i++) {
                //         if (rdlinks[i].properties.id == data.id && laneTopoData.linkPids.indexOf(parseInt(data.id)) < 0) {
                //             laneTopoData.linkPids.push(parseInt(data.id));
                //             rdlinkData.push(rdlinks[i]);
                //             nodePids.push(rdlinks[i].properties.snode);
                //             nodePids.push(rdlinks[i].properties.enode);
                //             break;
                //         }
                //     }
                //     if (laneTopoData.linkPids.length == 0) {
                //         swal("提示", "找不到详细车道对应的link，请重试！", "info");
                //         return;
                //     } else if (laneTopoData.linkPids.length == 1) { //进入线
                //         tooltipsCtrl.setCurrentTooltip('请选择详细车道作为进入线！');
                //         highRenderCtrl.highLightFeatures.push({
                //             id: laneTopoData.linkPids[0].toString(),
                //             layerid: 'rdLink',
                //             type: 'line',
                //             style: {
                //                 color: 'red'
                //             }
                //         });
                //         highRenderCtrl.drawHighlight();
                //         if (rdlinks[0].properties.direct == 2) { //单方向，=2时enode作为进入点，=3是snode作为进入点
                //             laneTopoData.nodePid = parseInt(nodePids[1]);
                //             highRenderCtrl.highLightFeatures.push({
                //                 id: nodePids[1].toString(),
                //                 layerid: 'rdLink',
                //                 type: 'node',
                //                 style: {}
                //             });
                //             highRenderCtrl.drawHighlight();
                //         } else if (rdlinks[0].properties.direct == 3) {
                //             laneTopoData.nodePid = parseInt(nodePids[0]);
                //             highRenderCtrl.highLightFeatures.push({
                //                 id: nodePids[0].toString(),
                //                 layerid: 'rdLink',
                //                 type: 'node',
                //                 style: {}
                //             });
                //             highRenderCtrl.drawHighlight();
                //         }
                //         tooltipsCtrl.setCurrentTooltip('请选择经过线或者退出线！');
                //     } else if (laneTopoData.linkPids.length == 2 && laneTopoData.nodePid == "") { //进入线方向为1时候的经过线、退出线
                //         if (nodePids.indexOf(nodePids[2]) > -1 && nodePids.indexOf(nodePids[2]) < 2 || nodePids.indexOf(nodePids[3]) > -1 && nodePids.indexOf(nodePids[3]) < 2) {
                //             highRenderCtrl.highLightFeatures.push({
                //                 id: laneTopoData.linkPids[1].toString(),
                //                 layerid: 'rdLink',
                //                 type: 'line',
                //                 style: {}
                //             });
                //             if (nodePids.indexOf(nodePids[2]) > -1 && nodePids.indexOf(nodePids[2]) < 2) {
                //                 laneTopoData.nodePid = parseInt(nodePids[2]);
                //                 highRenderCtrl.highLightFeatures.push({
                //                     id: nodePids[2].toString(),
                //                     layerid: 'rdLink',
                //                     type: 'node',
                //                     style: {}
                //                 });
                //             }
                //             if (nodePids.indexOf(nodePids[3]) > -1 && nodePids.indexOf(nodePids[3]) < 2) {
                //                 laneTopoData.nodePid = parseInt(nodePids[3]);
                //                 highRenderCtrl.highLightFeatures.push({
                //                     id: nodePids[3].toString(),
                //                     layerid: 'rdLink',
                //                     type: 'node',
                //                     style: {}
                //                 });
                //             }
                //             highRenderCtrl.drawHighlight();
                //         } else {
                //             nodePids.length = 2;
                //             laneTopoData.linkPids.pop();
                //         }
                //     } else {
                //         highRenderCtrl.highLightFeatures.push({
                //             id: laneTopoData.linkPids[laneTopoData.linkPids.length - 1].toString(),
                //             layerid: 'rdLink',
                //             type: 'line',
                //             style: {}
                //         });
                //         highRenderCtrl.drawHighlight();
                //     }
                //     shapeCtrl.shapeEditorResult.setFinalGeometry(laneTopoData);
                //     // tooltipsCtrl.setCurrentTooltip("点击空格保存车道连通信息,或者按ESC键取消!");
                // });
            }
        };
    }
]);

/**
 * Created by liwanchong on 2015/10/28.
 */
angular.module('app').controller("addShapeCtrl", ['$scope', '$ocLazyLoad', 'dsEdit', 'appPath','$timeout',
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
        var luNode = layerCtrl.getLayerById('luNode');
        var luLink = layerCtrl.getLayerById('luLink');
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
         * 创建上下线分离
         * @param event
         */
        $scope.upAndDown = function(event) {
            var type = event.currentTarget.type;
            if (type === 'chooseOver') {
                dsEdit.getByCondition($scope.param).then(function(data) {
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
                                layerid: 'rdLink',
                                type: 'line',
                                style: {
                                    color: 'red'
                                }
                            });
                        } else if (i == $scope.links.length - 1) {
                            highLightFeatures.push({
                                id: $scope.links[i].pid.toString(),
                                layerid: 'rdLink',
                                type: 'line',
                                style: {
                                    color: 'green'
                                }
                            });
                        } else {
                            highLightFeatures.push({
                                id: $scope.links[i].pid.toString(),
                                layerid: 'rdLink',
                                type: 'line',
                                style: {}
                            });
                        }
                    }
                    highRenderCtrl.highLightFeatures = highLightFeatures;
                    highRenderCtrl.drawHighlight();
                })
            } else if (type === "RETRYLINK") {
                var links = $scope.linkMulity;
                var highLightFeatures1 = [];
                map.currentTool = new fastmap.uikit.SelectPath({
                    map: map,
                    currentEditLayer: rdLink,
                    linksFlag: true,
                    shapeEditor: shapeCtrl
                });
                tooltipsCtrl.setCurrentTooltip('选择需要删除或新增的线！');
                eventController.on(eventController.eventTypes.GETLINKID, function(data) {
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
                                layerid: 'rdLink',
                                type: 'line',
                                style: {
                                    color: 'red'
                                }
                            });
                        } else if (i == links.length - 1) {
                            highLightFeatures1.push({
                                id: links[i].toString(),
                                layerid: 'rdLink',
                                type: 'line',
                                style: {
                                    color: 'green'
                                }
                            });
                        } else {
                            highLightFeatures1.push({
                                id: links[i].toString(),
                                layerid: 'rdLink',
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
                dsEdit.getByCondition($scope.param1).then(function(data) {
                    var linkArr = data.data,
                        points = [];
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
        //重新设置选择工具
        $scope.resetToolAndMap = function() {
            eventController.off(eventController.eventTypes.GETLINKID); //清除是select**ShapeCtrl.js中的事件,防止菜单之间事件错乱
            eventController.off(eventController.eventTypes.GETADADMINNODEID);
            eventController.off(eventController.eventTypes.GETNODEID);
            eventController.off(eventController.eventTypes.GETRELATIONID);
            eventController.off(eventController.eventTypes.GETTIPSID);
            if (map.floatMenu) {
                map.removeLayer(map.floatMenu);
                map.floatMenu = null;
            }
            if (event) {
                event.stopPropagation();
            }
            highRenderCtrl._cleanHighLight();
            highRenderCtrl.highLightFeatures.length = 0;
            $scope.$emit("SWITCHCONTAINERSTATE", {
                "attrContainerTpl": false,
                "subAttrContainerTpl": false
            });
            $("#popoverTips").hide();
            editLayer.drawGeometry = null;
            editLayer.clear();
            editLayer.bringToBack();
            shapeCtrl.shapeEditorResult.setFinalGeometry(null);
            shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
            shapeCtrl.stopEditing();
            rdLink.clearAllEventListeners();
            if (tooltipsCtrl.getCurrentTooltip()) {
                tooltipsCtrl.onRemoveTooltip();
            }
            if (map.currentTool) {
                map.currentTool.disable(); //禁止当前的参考线图层的事件捕获
            }

            if (selectCtrl.rowKey) {
                selectCtrl.rowKey = null;
            }

            $(editLayer.options._div).unbind();

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
            // $scope.changeBtnClass(num);
            // //连续点击两次按钮
            // if (num !== 7) {
            //     if (!$scope.classArr[num]) {
            //         map.currentTool.disable();
            //         map._container.style.cursor = '';
            //         return;
            //     }
            // }
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
            } else if (type === "RDLINK") {
                $scope.resetOperator("addLink", type);
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
                //shapeCtrl.editFeatType = "rdLink";
                shapeCtrl.editFeatType = "RDLINK";
                //把点和线图层放到捕捉工具中(此处注意必须是先点后线，为了解决当起始点和终点为自动捕捉时，获取nodeId失败)
                map.currentTool.snapHandler.addGuideLayer(rdnode);
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                tooltipsCtrl.setEditEventType(fastmap.mapApi.ShapeOptionType.DRAWPATH);
                tooltipsCtrl.setCurrentTooltip('开始画线！');
                tooltipsCtrl.setStyleTooltip("color:black;");
                tooltipsCtrl.setChangeInnerHtml("双击最后一个点结束画线!");
                tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存画线,或者按ESC键取消!");
            } else if (type === "RDSPEEDLIMIT") {
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
            } else if (type === "RDNODE") {
                $scope.resetOperator("addNode", type);
                if (shapeCtrl.shapeEditorResult) {
                    shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point(0, 0)]));
                    selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                    layerCtrl.pushLayerFront('edit');
                }
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.POINTVERTEXADD);
                shapeCtrl.startEditing();
                map.currentTool = shapeCtrl.getCurrentTool();
                //shapeCtrl.editFeatType = "rdNode";
                shapeCtrl.editFeatType = "RDNODE";
                map.currentTool.snapHandler.addGuideLayer(rdLink);
                tooltipsCtrl.setEditEventType('pointVertexAdd');
                tooltipsCtrl.setCurrentTooltip('开始增加节点！');
                tooltipsCtrl.setStyleTooltip("color:black;");
                tooltipsCtrl.setChangeInnerHtml("点击增加节点!");
                tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存,或者按ESC键取消!");
            }  else if (type === "LUNODE") {
                $scope.resetOperator("addNode", type);
                if (shapeCtrl.shapeEditorResult) {
                    shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point(0, 0)]));
                    selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                    layerCtrl.pushLayerFront('edit');
                }
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.POINTVERTEXADD);
                shapeCtrl.startEditing();
                map.currentTool = shapeCtrl.getCurrentTool();
                //shapeCtrl.editFeatType = "rdNode";
                shapeCtrl.editFeatType = "LUNODE";
                map.currentTool.snapHandler.addGuideLayer(luLink);
                tooltipsCtrl.setEditEventType('pointVertexAdd');
                tooltipsCtrl.setCurrentTooltip('开始增加节点！');
                tooltipsCtrl.setStyleTooltip("color:black;");
                tooltipsCtrl.setChangeInnerHtml("点击增加节点!");
                tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存,或者按ESC键取消!");
            } else if(type === "LULINK") {
                $scope.resetOperator("addLink", type);
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
                shapeCtrl.editFeatType = "LULINK";
                //把点和线图层放到捕捉工具中(此处注意必须是先点后线，为了解决当起始点和终点为自动捕捉时，获取nodeId失败)
                map.currentTool.snapHandler.addGuideLayer(luNode);
                map.currentTool.snapHandler.addGuideLayer(luLink);
                tooltipsCtrl.setEditEventType(fastmap.mapApi.ShapeOptionType.DRAWPATH);
                tooltipsCtrl.setCurrentTooltip('开始画线！');
                tooltipsCtrl.setStyleTooltip("color:black;");
                tooltipsCtrl.setChangeInnerHtml("双击最后一个点结束画线!");
                tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存画线,或者按ESC键取消!");
            } else if (type === 'LUFACE') {
            	$scope.resetOperator("addFace", type);
                if (shapeCtrl.shapeEditorResult) {
                    shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.polygon([fastmap.mapApi.point(0, 0)]));
                    selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                    layerCtrl.pushLayerFront('edit');
                }
                //设置添加类型
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.DRAWPOLYGON);
                shapeCtrl.startEditing();

                //把工具添加到map中
                map.currentTool = shapeCtrl.getCurrentTool();
                map.currentTool.enable();
                shapeCtrl.editFeatType = "LUFACE";
                //提示信息
                tooltipsCtrl.setEditEventType(fastmap.mapApi.ShapeOptionType.DRAWPOLYGON);
                tooltipsCtrl.setCurrentTooltip('开始画面！');
                tooltipsCtrl.setStyleTooltip("color:black;");
                tooltipsCtrl.setChangeInnerHtml("点击最后一个点结束!");
                tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存画线,或者按ESC键取消!");
            } else if (type === 'RDGSC') {
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
            } else if (type === 'RDMULTIDIGITIZED') {
                $scope.resetOperator("specItem", type);
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
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList:['line','point']
                });
                map.currentTool.enable();
                eventController.on(eventController.eventTypes.GETLINKID, function(data) {
                    if (data.index === 0) {
                        $scope.limitRelation.inLinkPid = parseInt(data.id);
                        highLightFeatures.push({
                            id: $scope.limitRelation.inLinkPid.toString(),
                            layerid: 'rdLink',
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
                        tooltipsCtrl.setCurrentTooltip("已经选择进入线,选择点!");
                    } else if (data.index === 1) {
                        $scope.limitRelation.nodePid = parseInt(data.id);
                        if (linkDirect != 1) {
                            if ($scope.limitRelation.nodePid == realNodeId) {} else {
                                swal("操作失败", "点方向与道路方向不符，请重新选择！", "error");
                                return;
                            }
                        }
                        highLightFeatures.push({
                            id: $scope.limitRelation.nodePid.toString(),
                            layerid: 'rdLink',
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
                                    'text': "<a class='glyphicon glyphicon-saved'></a>",
                                    'title': "选择完成",
                                    'type': 'chooseOver',
                                    'class': "feaf",
                                    callback: $scope.upAndDown
                                }, {
                                    'text': "<a class='glyphicon glyphicon-import'></a>",
                                    'title': "重新选择线",
                                    'type': 'RETRYLINK',
                                    'class': "feaf",
                                    callback: $scope.upAndDown
                                }, {
                                    'text': "<a class='glyphicon glyphicon-resize-full'></a>",
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
            else if (type.split('_')[0] == 'BRANCH') {


                $scope.resetOperator("addRelation", type);
                var typeArr = type.split('_');
                var currentActiveBranch = '';
                //保存所有需要高亮的图层数组;
                var highLightFeatures = [],
                    linkDirect = 0;
                //设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(typeArr[0]);
                //根据不同的分歧种类构建limitRelation的参数;
                switch (typeArr[1]) {
                    case 'REALIMAGE':
                        currentActiveBranch = '实景图';
                        $scope.limitRelation.branchType = 5;
                        break;
                    case 'SIGNBOARDNAME':
                        currentActiveBranch = '方向看板';
                        $scope.limitRelation.branchType = 9;
                        break;
                    case 'SIGNASREAL':
                        currentActiveBranch = '实景看板';
                        $scope.limitRelation.branchType = 6;
                        break;
                    case 'SERIESBRANCH':
                        currentActiveBranch = '连续分歧';
                        $scope.limitRelation.branchType = 7;
                        break;
                    case 'BIGCROSSSCHEMATIC':
                        currentActiveBranch = '大路口交叉点模式';
                        $scope.limitRelation.branchType = 8;
                        break;
                    case 'NORMALROAD':
                        currentActiveBranch = '普通道路方面';
                        $scope.limitRelation.branchType = 1;
                        break;
                    case 'HIGHWAY':
                        currentActiveBranch = '高速分歧';
                        $scope.limitRelation.branchType = 0;
                        break;
                    case '3D':
                        currentActiveBranch = '3D分歧';
                        $scope.limitRelation.branchType = 3;
                        break;
                }
                //地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdBranch');
                tooltipsCtrl.setCurrentTooltip('正要新建' + currentActiveBranch + '分歧,先选择线！');
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
                    $scope.limitRelation.outLinkPid = parseInt(dataId);
                    if (highLightFeatures.length === 3) {
                        highLightFeatures.pop();
                    }
                    highRenderCtrl._cleanHighLight();
                    highLightFeatures.push({
                        id: $scope.limitRelation.outLinkPid.toString(),
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
                        $scope.limitRelation.inLinkPid = parseInt(data.id);
                        highLightFeatures.push({
                            id: $scope.limitRelation.inLinkPid.toString(),
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
                            $scope.limitRelation.nodePid = parseInt(linkDirect == 2 ? data["properties"]['enode'] : data["properties"]['snode']);
                            highLightFeatures.push({
                                id: $scope.limitRelation.nodePid.toString(),
                                layerid: 'rdLink',
                                type: 'rdnode',
                                style: {
                                    color: 'yellow'
                                }
                            });
                            highRenderCtrl.drawHighlight();
                            map.currentTool.selectedFeatures.push($scope.limitRelation.nodePid.toString());
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
                            $scope.limitRelation.nodePid = parseInt(data.id);
                            highLightFeatures.push({
                                id: $scope.limitRelation.nodePid.toString(),
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
                        $scope.limitRelation.outLinkPid = parseInt(data.id);
                    }
                    featCodeCtrl.setFeatCode($scope.limitRelation);
                })
            } else if (type === 'TRAFFIC_SIGNAL') {     //信号灯
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
                        console.info(continueLinks);
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
                                color: '#21ed25'
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
                                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.ELECTRONICEYE);
                                shapeCtrl.startEditing();
                                tooltipsCtrl.setCurrentTooltip("选择方向!");
                                tooltipsCtrl.setChangeInnerHtml("点击空格保存,或者按ESC键取消!");
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
            } else if (type === 'RDTEST') { //框选测试
                $scope.resetOperator("addRelation", type);
                tooltipsCtrl.setCurrentTooltip('请框选数据！');
                map.currentTool = new fastmap.uikit.SelectForRectang({
                    map: map,
                    shapeEditor: shapeCtrl,
                    LayersList: [rdLink, rdnode,rwLink]
                });
                map.currentTool.enable();
                eventController.off(eventController.eventTypes.GETRECTDATA);
                eventController.on(eventController.eventTypes.GETRECTDATA, function (data) {
                    console.log(data.data);
                })
            }
        }
    }
]);
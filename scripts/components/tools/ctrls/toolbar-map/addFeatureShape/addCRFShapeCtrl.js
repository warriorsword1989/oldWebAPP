/**
 * Created by liuyang on 2016/8/5.
 */
angular.module('app').controller('addCRFShapeCtrl', ['$scope', '$ocLazyLoad', 'dsEdit', 'appPath', '$timeout',
    function ($scope, $ocLazyLoad, dsEdit, appPath, $timeout) {
        var layerCtrl = fastmap.uikit.LayerController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var rdLink = layerCtrl.getLayerById('rdLink');
        var rdnode = layerCtrl.getLayerById('rdNode');
        var crfData = layerCtrl.getLayerById('crfData');
        var highRenderCtrl = fastmap.uikit.HighRenderController();
        var eventController = fastmap.uikit.EventController();

        function arrToArrobj(arr) {
            var newArr = [];
            for (var i = 0; i < arr.length; i++) {
                var str = arr[i].x + '-' + arr[i].y;
                newArr.push(str);
            }
            return newArr;
        }

        function arrobjToArr(arrobj) {
            var newArr = [];
            for (var i = 0; i < arrobj.length; i++) {
                var point = new L.point(parseFloat(arrobj[i].split('-')[0]), parseFloat(arrobj[i].split('-')[1]));
                newArr.push(point);
            }
            return newArr;
        }
        function pointsUnique(pointsArr) {
            var repeatIndex = [];
            var newPointArr = arrToArrobj(pointsArr);
            for (var i = 0; i < newPointArr.length; i++) {
                if (repeatIndex.indexOf(newPointArr[i]) < 0) {
                    repeatIndex.push(newPointArr[i]);
                }
            }
            return arrobjToArr(repeatIndex);
        }
        function caculatePolygon(pointsArr) {
            var newArr = [];
            var latMax = [];
            var lngMax = [];
            var latMin = [];
            var lngMin = [];
            latMax.push(pointsArr[0]);
            latMin.push(pointsArr[0]);
            lngMax.push(pointsArr[0]);
            lngMin.push(pointsArr[0]);
            for (var i = 1; i < pointsArr.length; i++) {
                if (latMax[0].x < pointsArr[i].x) {
                    latMax = [];
                    latMax.push(pointsArr[i]);
                } else if (latMax[0].x === pointsArr[i].x) {
                    latMax.push(pointsArr[i]);
                }
                if (latMin[0].x > pointsArr[i].x) {
                    latMin = [];
                    latMin.push(pointsArr[i]);
                } else if (latMin[0].x === pointsArr[i].x) {
                    latMin.push(pointsArr[i]);
                }
                if (lngMax[0].y < pointsArr[i].y) {
                    lngMax = [];
                    lngMax.push(pointsArr[i]);
                } else if (lngMax[0].y === pointsArr[i].y) {
                    lngMax.push(pointsArr[i]);
                }
                if (lngMin[0].y > pointsArr[i].y) {
                    lngMin = [];
                    lngMin.push(pointsArr[i]);
                } else if (lngMin[0].y === pointsArr[i].y) {
                    lngMin.push(pointsArr[i]);
                }
            }
            // latMax = pointsUnique(latMax);
            // lngMin = pointsUnique(lngMin);
            // latMin = pointsUnique(latMin);
            // lngMax = pointsUnique(lngMax);
            newArr = newArr.concat(latMax);
            newArr = newArr.concat(lngMin);
            newArr = newArr.concat(latMin);
            newArr = newArr.concat(lngMax);
            newArr = pointsUnique(newArr);
            newArr.push(latMax[0]);
            return newArr;
        }
        /**
         * 去除重复的数据，保留一个
         * @param arr
         * @returns {*}
         * @constructor
         */
        $scope.ArrUnique = function (data) {
            /* 过滤框选后的数组，去重*/
            var newData = []; // 去重后的数据
            var repeatIdArr = [];
            for (var i = 0, len = data.length; i < len; i++) {
                if (repeatIdArr.indexOf(data[i]) < 0) {
                    repeatIdArr.push(data[i]);
                    newData.push(data[i]);
                }
            }
            return newData;
        };

        /**
         * 添加geometry
         * @param type
         * @param num
         * @param event
         */
        $scope.addCRFShape = function (type) {
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
            if (type === 'CRFINTER') { // CRF交叉点
                $scope.resetOperator('addRelation', type);
                var highLightFeatures = [];
                var interData = { links: [], nodes: [] };// 推荐的退出线.
                var pointList = [];
                var crfPids = [];
                highRenderCtrl.highLightFeatures = [];
                highRenderCtrl._cleanHighLight();
                // 设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.CRFINTER);
                // 地图编辑相关设置;
                tooltipsCtrl.setEditEventType('crfInter');
                tooltipsCtrl.setCurrentTooltip('请框选制作CRF交叉点的道路点！');
                map.currentTool = new fastmap.uikit.SelectForRectang({
                    map: map,
                    shapeEditor: shapeCtrl,
                    LayersList: [rdLink, rdnode, crfData]
                });
                map.currentTool.enable();

                eventController.off(eventController.eventTypes.GETRECTDATA);
                eventController.on(eventController.eventTypes.GETRECTDATA, function (data) {
                    if (data && data.data && data.data.length == 0) {
                        tooltipsCtrl.setCurrentTooltip('请重新框选制作CRF交叉点的道路点！');
                        return;
                    }
                    // crf中的node和link与常规的node、link的pid是一样的，要排除掉常规中的这些数据
                    for (var i = 0; i < data.data.length; i++) {
                        // 为排除某端点不在框选范围内的线做数据准备，将所有的点放进去
                        if (data.data[i].data && data.data[i].data.properties.featType != 'RDINTER' && data.data[i].data.geometry.type == 'Point') {
                            pointList.push(data.data[i].data.properties.id);
                        }
                        if (data.data[i].data && data.data[i].data.properties.featType == 'RDINTER') {
                            if (data.data[i].data.properties.nodeId != undefined) {
                                crfPids.push(data.data[i].data.properties.nodeId);
                            } else {
                                crfPids.push(data.data[i].data.properties.linkId);
                            }
                            data.data.splice(i, 1);
                            i--;
                        }
                    }
                    for (var i = 0; i < data.data.length; i++) {
                        if (data.data[i].data && data.data[i].data.geometry.type == 'LineString' && crfPids.indexOf(data.data[i].data.properties.id) < 0) {
                            if (interData.links.indexOf(parseInt(data.data[i].data.properties.id)) < 0) {
                                if (pointList.indexOf(data.data[i].data.properties.snode) > -1 && pointList.indexOf(data.data[i].data.properties.enode) > -1) {
                                    interData.links.push(parseInt(data.data[i].data.properties.id));
                                    highLightFeatures.push({
                                        id: data.data[i].data.properties.id.toString(),
                                        layerid: 'rdLink',
                                        type: 'line',
                                        style: {
                                            color: '#D9B300'
                                        }
                                    });
                                }
                            }
                        } else if (data.data[i].data && data.data[i].data.geometry.type == 'Point' && crfPids.indexOf(data.data[i].data.properties.id) < 0) {
                            if (interData.nodes.indexOf(parseInt(data.data[i].data.properties.id)) < 0) {
                                interData.nodes.push(parseInt(data.data[i].data.properties.id));
                                highLightFeatures.push({
                                    id: data.data[i].data.properties.id.toString(),
                                    layerid: 'rdLink',
                                    type: 'node',
                                    style: {
                                        color: '#02F78E'
                                    }
                                });
                            }
                        }
                    }
                    interData.links = $scope.ArrUnique(interData.links);// link去重
                    highRenderCtrl.highLightFeatures = highLightFeatures;
                    highRenderCtrl.drawHighlight();
                    map.currentTool.disable();
                    map.currentTool = {};
                    map.currentTool = new fastmap.uikit.SelectNodeAndPath({
                        map: map,
                        shapeEditor: shapeCtrl,
                        selectLayers: [crfData, rdnode],
                        snapLayers: [rdnode]// 将rdnode放前面，优先捕捉
                    });
                    map.currentTool.enable();
                    eventController.off(eventController.eventTypes.GETFEATURE);
                    eventController.on(eventController.eventTypes.GETFEATURE, function (data) {
                        highRenderCtrl._cleanHighLight();
                        if (data.optype == 'RDNODE') {
                            if (interData.nodes.indexOf(parseInt(data.id)) < 0) {
                                var param1 = {};
                                param1.dbId = App.Temp.dbId;
                                param1.type = 'RDLINK';
                                param1.data = {
                                    nodePid: parseInt(data.id)
                                };
                                interData.nodes.push(parseInt(data.id));
                                highRenderCtrl.highLightFeatures.push({
                                    id: data.id.toString(),
                                    layerid: 'rdLink',
                                    type: 'node',
                                    style: {
                                        color: '#02F78E'
                                    }
                                });
                                dsEdit.getByCondition(param1).then(function (exLinks) {
                                    if (exLinks.errcode === -1) {
                                        return;
                                    }
                                    if (exLinks.data) {
                                        for (var i = 0; i < exLinks.data.length; i++) {
                                            if (interData.links.indexOf(exLinks.data[i].pid) > -1) { // 某一条挂接link在crf里
                                                interData.nodes.push(parseInt(data.id));
                                                highRenderCtrl.highLightFeatures.push({
                                                    id: data.id.toString(),
                                                    layerid: 'rdLink',
                                                    type: 'node',
                                                    style: {
                                                        color: '#02F78E'
                                                    }
                                                });
                                                highRenderCtrl.drawHighlight();
                                            } else {
                                                dsEdit.getByPid(exLinks.data[i].pid, 'RDLINK').then(function (linkData) {
                                                    if ((interData.nodes.indexOf(linkData.eNodePid) > -1 && linkData.eNodePid != parseInt(data.id)) || (interData.nodes.indexOf(linkData.sNodePid) > -1 && linkData.sNodePid != parseInt(data.id))) { // 线正好是中间部分,把线也加入

                                                        interData.links.push(linkData.pid);
                                                        highRenderCtrl.highLightFeatures.push({
                                                            id: linkData.pid.toString(),
                                                            layerid: 'rdLink',
                                                            type: 'line',
                                                            style: {
                                                                color: '#D9B300'
                                                            }
                                                        });
                                                    }
                                                    highRenderCtrl.drawHighlight();
                                                });
                                            }
                                        }
                                    }
                                });
                            } else {
                                interData.nodes.splice(interData.nodes.indexOf(parseInt(data.id)), 1);
                                for (var i = 0; i < highLightFeatures.length; i++) {
                                    if (highLightFeatures[i].id == data.id) {
                                        highLightFeatures.splice(i, 1);
                                        i--;
                                    }
                                }
                                var param = {};
                                param.dbId = App.Temp.dbId;
                                param.type = 'RDLINK';
                                param.data = {
                                    nodePid: parseInt(data.id)
                                };
                                dsEdit.getByCondition(param).then(function (conLinks) { // 找出所有的挂接线，删除存在于框选范围内的
                                    highRenderCtrl._cleanHighLight();
                                    if (conLinks.errcode === -1) {
                                        return;
                                    }
                                    if (conLinks.data) {
                                        for (var i = 0; i < conLinks.data.length; i++) {
                                            if (interData.links.indexOf(conLinks.data[i].pid) > -1) {
                                                interData.links.splice(interData.links.indexOf(conLinks.data[i].pid), 1);
                                                for (var j = 0; j < highRenderCtrl.highLightFeatures.length; j++) {
                                                    if (highRenderCtrl.highLightFeatures[j].id == conLinks.data[i].pid) {
                                                        highRenderCtrl.highLightFeatures.splice(j, 1);
                                                        j--;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    highRenderCtrl.drawHighlight();
                                });
                            }
                        }
                        highRenderCtrl.highLightFeatures = highLightFeatures;
                        highRenderCtrl.drawHighlight();
                    });
                    tooltipsCtrl.setCurrentTooltip('请追加或取消道路点,或者点击空格保存,或者按ESC键取消!');
                    shapeCtrl.shapeEditorResult.setFinalGeometry(interData);
                });
            } else if (type === 'CRFROAD') { // CRF道路
                $scope.resetOperator('addRelation', type);
                var highLightFeatures = [];
                var interData = { linkPids: [] };// 推荐的退出线.
                var lineList = [];
                var crfPids = [];
                highRenderCtrl.highLightFeatures = [];
                highRenderCtrl._cleanHighLight();
                // 设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.CRFROAD);
                // 地图编辑相关设置;
                tooltipsCtrl.setEditEventType('crfRoad');
                tooltipsCtrl.setCurrentTooltip('请框选制作CRF道路的道路线！');
                map.currentTool = new fastmap.uikit.SelectForRectang({
                    map: map,
                    shapeEditor: shapeCtrl,
                    LayersList: [rdLink, crfData]
                });
                map.currentTool.enable();

                eventController.off(eventController.eventTypes.GETRECTDATA);
                eventController.on(eventController.eventTypes.GETRECTDATA, function (data) {
                    if (data && data.data && data.data.length == 0) {
                        tooltipsCtrl.setCurrentTooltip('请重新框选制作CRF交叉点的道路线！');
                        return;
                    }
                    // crf中的node和link与常规的node、link的pid是一样的，要排除掉常规中的这些数据
                    for (var i = 0; i < data.data.length; i++) {
                        // 将所有的link放进去
                        if (data.data[i].data && data.data[i].data.properties.featType != 'RDINTER' && data.data[i].data.properties.featType != 'RDROAD' && data.data[i].data.geometry.type == 'LineString') {
                            lineList.push(data.data[i].data.properties.id);
                        }
                        if (data.data[i].data && data.data[i].data.properties.featType == 'RDINTER' || data.data[i].data.properties.featType == 'RDROAD') {
                            if (data.data[i].data.properties.linkId != undefined) {
                                crfPids.push(data.data[i].data.properties.linkId);
                            }
                            data.data.splice(i, 1);
                            i--;
                        }
                    }
                    for (var i = 0; i < data.data.length; i++) {
                        if (data.data[i].data && data.data[i].data.geometry.type == 'LineString' && crfPids.indexOf(data.data[i].data.properties.id) < 0) {
                            if (interData.linkPids.indexOf(parseInt(data.data[i].data.properties.id)) < 0 && crfPids.indexOf(parseInt(data.data[i].data.properties.id)) < 0) {
                                interData.linkPids.push(parseInt(data.data[i].data.properties.id));
                                highLightFeatures.push({
                                    id: data.data[i].data.properties.id.toString(),
                                    layerid: 'rdLink',
                                    type: 'line',
                                    style: {
                                        color: '#D9B300'
                                    }
                                });
                            }
                        }
                    }
                    highRenderCtrl.highLightFeatures = highLightFeatures;
                    highRenderCtrl.drawHighlight();
                    map.currentTool.disable();
                    map.currentTool = {};
                    map.currentTool = new fastmap.uikit.SelectNodeAndPath({
                        map: map,
                        shapeEditor: shapeCtrl,
                        selectLayers: [crfData, rdLink],
                        snapLayers: [rdLink]
                    });
                    map.currentTool.enable();
                    eventController.off(eventController.eventTypes.GETFEATURE);
                    eventController.on(eventController.eventTypes.GETFEATURE, function (data) {
                        highRenderCtrl._cleanHighLight();
                        if (data.optype == 'RDLINK') {
                            if (interData.linkPids.indexOf(parseInt(data.id)) < 0) {
                                interData.linkPids.push(parseInt(data.id));
                                highLightFeatures.push({
                                    id: data.id.toString(),
                                    layerid: 'rdLink',
                                    type: 'line',
                                    style: {
                                        color: '#D9B300'
                                    }
                                });
                            } else {
                                interData.linkPids.splice(interData.linkPids.indexOf(parseInt(data.id)), 1);
                                for (var i = 0; i < highLightFeatures.length; i++) {
                                    if (highLightFeatures[i].id == data.id) {
                                        highLightFeatures.splice(i, 1);
                                        i--;
                                    }
                                }
                            }
                        }
                        highRenderCtrl.highLightFeatures = highLightFeatures;
                        highRenderCtrl.drawHighlight();
                    });
                    shapeCtrl.shapeEditorResult.setFinalGeometry(interData);
                    tooltipsCtrl.setCurrentTooltip('请追加、取消道路线或者点击空格保存CRF道路,按ESC键取消!');
                });
            } else if (type === 'CRFOBJECT') { // CRF道路
                $scope.resetOperator('addRelation', type);
                var objData = { links: [], inters: [], roads: [], longitude: null, latitude: null };// 要创建的对象.
                var crfPids = [];
                var crfLinkPids = [];
                var allLinks = [];
                var selectCRFData = [];
                highRenderCtrl.highLightFeatures = [];
                highRenderCtrl._cleanHighLight();
                // 设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.CRFOBJECT);
                // 地图编辑相关设置;
                tooltipsCtrl.setEditEventType('crfObject');
                tooltipsCtrl.setCurrentTooltip('请框选制作CRF对象的要素！');
                map.currentTool = new fastmap.uikit.SelectForRectang({
                    map: map,
                    shapeEditor: shapeCtrl,
                    LayersList: [rdLink, crfData]
                });
                map.currentTool.enable();

                eventController.off(eventController.eventTypes.GETRECTDATA);
                eventController.on(eventController.eventTypes.GETRECTDATA, function (data) {
                    var pointsArr = [];
                    if (data && data.data && data.data.length == 0) {
                        tooltipsCtrl.setCurrentTooltip('请重新框选制作CRF对象的要素！');
                        return;
                    }
                    // 框选的中心点作为landMark
                    var retange = data.border._latlngs;
                    if (retange && retange.length > 0) {
                        objData.longitude = retange[0].lng + (retange[3].lng - retange[0].lng) / 2;
                        objData.latitude = retange[0].lat + (retange[1].lat - retange[0].lat) / 2;
                    }
                    // crf中的node和link与常规的node、link的pid是一样的，要排除掉常规中的这些数据
                    for (var i = 0; i < data.data.length; i++) {
                        if (data.data[i].line) {
                            for (var j = 0; j < data.data[i].line.components.length; j++) {
                                pointsArr.push(L.point(parseFloat(data.data[i].line.components[j].y.toFixed(6)), parseFloat(data.data[i].line.components[j].x.toFixed(6))));
                            }
                        } else {
                            pointsArr.push(L.point(parseFloat(data.data[i].data.point.y.toFixed(6)), parseFloat(data.data[i].data.point.x.toFixed(6))));
                        }

                        // 将所有的单独的link放进去
                        if (data.data[i].data && data.data[i].data.properties.featType != 'RDINTER' && data.data[i].data.properties.featType != 'RDROAD' && data.data[i].data.properties.featType != 'RDOBJECT' && data.data[i].data.geometry.type == 'LineString') {
                            allLinks.push(data.data[i].data.properties.id);
                        }
                        // 将crf的pid放进去
                        if (data.data[i].data && data.data[i].data.properties.featType == 'RDINTER' || data.data[i].data.properties.featType == 'RDROAD' || data.data[i].data.properties.featType == 'RDOBJECT') {
                            if (data.data[i].data.properties.linkId != undefined) {
                                crfLinkPids.push(data.data[i].data.properties.linkId);
                            }
                            if (crfPids.indexOf(data.data[i].data.properties.id) < 0) {
                                crfPids.push(data.data[i].data.properties.id);
                                if (data.data[i].data.properties.featType == 'RDINTER' && objData.inters.indexOf(data.data[i].data.properties.id) < 0) {
                                    objData.inters.push(parseInt(data.data[i].data.properties.id));
                                    dsEdit.getByPid(parseInt(data.data[i].data.properties.id), 'RDINTER').then(function (interData) {
                                        var tempData = {
                                            pid: interData.pid,
                                            highLightId: []
                                        };
                                        var linkArr = interData.links,
                                            points = interData.nodes;
                                        for (var i = 0, len = linkArr.length; i < len; i++) {
                                            tempData.highLightId.push(linkArr[i].linkPid);
                                            highRenderCtrl.highLightFeatures.push({
                                                id: linkArr[i].linkPid.toString(),
                                                layerid: 'rdLink',
                                                type: 'line',
                                                style: { color: '#00FFFF' }
                                            });
                                        }
                                        for (var i = 0, len = points.length; i < len; i++) {
                                            tempData.highLightId.push(points[i].nodePid);
                                            highRenderCtrl.highLightFeatures.push({
                                                id: points[i].nodePid.toString(),
                                                layerid: 'rdLink',
                                                type: 'node',
                                                style: {
                                                    color: '#4A4AFF'
                                                }
                                            });
                                        }
                                        highRenderCtrl.drawHighlight();
                                        selectCRFData.push(tempData);
                                    });
                                }
                                if (data.data[i].data.properties.featType == 'RDROAD' && objData.roads.indexOf(data.data[i].data.properties.id) < 0) {
                                    objData.roads.push(parseInt(data.data[i].data.properties.id));
                                    dsEdit.getByPid(parseInt(data.data[i].data.properties.id), 'RDROAD').then(function (roadData) {
                                        var tempData = {
                                            pid: roadData.pid,
                                            highLightId: []
                                        };
                                        var linkArr = roadData.links;
                                        for (var i = 0, len = linkArr.length; i < len; i++) {
                                            tempData.highLightId.push(linkArr[i].linkPid);
                                            highRenderCtrl.highLightFeatures.push({
                                                id: linkArr[i].linkPid.toString(),
                                                layerid: 'rdLink',
                                                type: 'line',
                                                style: { color: '#DAB1D5' }
                                            });
                                        }
                                        highRenderCtrl.drawHighlight();
                                        selectCRFData.push(tempData);
                                    });
                                }
                            }
                        }
                    }
                    var sideList = [];
                    var sidePoints = caculatePolygon(pointsArr);
                    var sidePointObj = arrToArrobj(sidePoints);
                    var lineString = new fastmap.mapApi.LinearRing(sidePoints);
                    var polygon = new fastmap.mapApi.Polygon([lineString]);
                    for (var pa = 0; pa < pointsArr.length; pa++) {
                        if (!polygon.containsPoint(pointsArr[pa]) && sidePointObj.indexOf(pointsArr[pa].x + '-' + pointsArr[pa].y) < 0) {
                            sideList.push(pointsArr[pa]);
                        }
                    }
                    for (var sl = 0; sl < sideList.length; sl++) {
                        for (var sp = 0; sp < sidePoints.length - 1; sp++) {
                            var minX;
                            var minY;
                            var maxX;
                            var maxY;
                            if (sidePoints[sp].x >= sidePoints[sp + 1].x) {
                                minX = sidePoints[sp + 1].x;
                                maxX = sidePoints[sp].x;
                            } else {
                                minX = sidePoints[sp].x;
                                maxX = sidePoints[sp + 1].x;
                            }
                            if (sidePoints[sp].y >= sidePoints[sp + 1].y) {
                                minY = sidePoints[sp + 1].y;
                                maxY = sidePoints[sp].y;
                            } else {
                                minY = sidePoints[sp].y;
                                maxY = sidePoints[sp + 1].y;
                            }
                            if ((sideList[sl].x >= minX) && (sideList[sl].x <= maxX) &&
                                (sideList[sl].y <= maxY) && (sideList[sl].y >= minY)) {
                                sidePoints.splice(sp + 1, 0, sideList[sl]);
                                break;
                            }
                        }
                    }
                    var latLngs = [];
                    var latSum = 0;
                    var lngSum = 0;
                    for (var i = 0; i < sidePoints.length; i++) {
                        latSum += sidePoints[i].x;
                        lngSum += sidePoints[i].y;
                        var latlng1 = L.latLng(sidePoints[i].x, sidePoints[i].y);
                        latLngs.push(latlng1);
                    }
                    L.marker([latSum/sidePoints.length,lngSum/sidePoints.length],{
                        draggable: true
                    }).addTo(map);
                    var polyGonLayer = L.polygon(latLngs, {
                        color: 'red',
                        weight: 5
                    });
                    map.addLayer(polyGonLayer);
                    for (var i = 0; i < allLinks.length; i++) {
                        if (crfLinkPids.indexOf(allLinks[i]) < 0) {
                            objData.links.push(parseInt(allLinks[i]));
                            highRenderCtrl.highLightFeatures.push({
                                id: data.data[i].data.properties.id.toString(),
                                layerid: 'rdLink',
                                type: 'line',
                                style: {
                                    color: '#D9B300'
                                }
                            });
                        }
                    }
                    highRenderCtrl.drawHighlight();
                    eventController.off(eventController.eventTypes.GETRECTDATA);
                    map.currentTool.disable();
                    map.currentTool = {};
                    map.currentTool = new fastmap.uikit.SelectNodeAndPath({
                        map: map,
                        shapeEditor: shapeCtrl,
                        selectLayers: [crfData, rdLink],
                        snapLayers: [rdLink]
                    });
                    map.currentTool.enable();
                    eventController.off(eventController.eventTypes.GETFEATURE);
                    eventController.on(eventController.eventTypes.GETFEATURE, function (data) {
                        highRenderCtrl._cleanHighLight();
                        if (data.optype == 'RDLINK') {
                            if (objData.links.indexOf(parseInt(data.id)) < 0) {
                                objData.links.push(parseInt(data.id));
                                highRenderCtrl.highLightFeatures.push({
                                    id: data.id.toString(),
                                    layerid: 'rdLink',
                                    type: 'line',
                                    style: {
                                        color: '#D9B300'
                                    }
                                });
                            } else {
                                objData.links.splice(objData.links.indexOf(parseInt(data.id)), 1);
                                for (var i = 0; i < highRenderCtrl.highLightFeatures.length; i++) {
                                    if (highRenderCtrl.highLightFeatures[i].id == data.id) {
                                        highRenderCtrl.highLightFeatures.splice(i, 1);
                                        i--;
                                    }
                                }
                            }
                        } else if (data.optype == 'RDINTER') {
                            if (crfPids.indexOf(data.id) > -1) { // 存在于现有数据中,删除之
                                for (var i = 0; i < selectCRFData.length; i++) {
                                    if (selectCRFData[i].pid == parseInt(data.id)) {
                                        for (var j = 0; j < selectCRFData[i].highLightId.length; j++) {
                                            for (var k = 0; k < highRenderCtrl.highLightFeatures.length; k++) {
                                                if (parseInt(highRenderCtrl.highLightFeatures[k].id) == selectCRFData[i].highLightId[j]) {
                                                    highRenderCtrl.highLightFeatures.splice(k, 1);
                                                    k--;
                                                }
                                            }
                                        }
                                        selectCRFData.splice(i, 1);
                                        i--;
                                        crfPids.splice(crfPids.indexOf(data.id), 1);
                                    }
                                }
                            } else { // 不在，查之
                                objData.inters.push(parseInt(data.id));
                                dsEdit.getByPid(parseInt(data.id), 'RDINTER').then(function (interData) {
                                    crfPids.push(interData.pid.toString());
                                    var tempData = {
                                        pid: interData.pid,
                                        highLightId: []
                                    };
                                    var linkArr = interData.links,
                                        points = interData.nodes;
                                    for (var i = 0, len = linkArr.length; i < len; i++) {
                                        tempData.highLightId.push(linkArr[i].linkPid);
                                        highRenderCtrl.highLightFeatures.push({
                                            id: linkArr[i].linkPid.toString(),
                                            layerid: 'rdLink',
                                            type: 'line',
                                            style: { color: '#00FFFF' }
                                        });
                                    }
                                    for (var i = 0, len = points.length; i < len; i++) {
                                        tempData.highLightId.push(points[i].nodePid);
                                        highRenderCtrl.highLightFeatures.push({
                                            id: points[i].nodePid.toString(),
                                            layerid: 'rdLink',
                                            type: 'node',
                                            style: {
                                                color: '#4A4AFF'
                                            }
                                        });
                                    }
                                    highRenderCtrl.drawHighlight();
                                    selectCRFData.push(tempData);
                                });
                            }
                        } else if (data.optype == 'RDROAD') {
                            if (crfPids.indexOf(data.id) > -1) { // 存在于现有数据中,删除之
                                for (var i = 0; i < selectCRFData.length; i++) {
                                    if (selectCRFData[i].pid == parseInt(data.id)) {
                                        for (var j = 0; j < selectCRFData[i].highLightId.length; j++) {
                                            for (var k = 0; k < highRenderCtrl.highLightFeatures.length; k++) {
                                                if (parseInt(highRenderCtrl.highLightFeatures[k].id) == selectCRFData[i].highLightId[j]) {
                                                    highRenderCtrl.highLightFeatures.splice(k, 1);
                                                    k--;
                                                }
                                            }
                                        }
                                        selectCRFData.splice(i, 1);
                                        i--;
                                        crfPids.splice(crfPids.indexOf(data.id), 1);
                                    }
                                }
                            } else { // 不在，查之
                                objData.roads.push(parseInt(data.id));
                                dsEdit.getByPid(parseInt(data.id), 'RDROAD').then(function (roadData) {
                                    crfPids.push(roadData.pid.toString());
                                    var tempData = {
                                        pid: roadData.pid,
                                        highLightId: []
                                    };
                                    var linkArr = roadData.links;
                                    for (var i = 0, len = linkArr.length; i < len; i++) {
                                        tempData.highLightId.push(linkArr[i].linkPid);
                                        highRenderCtrl.highLightFeatures.push({
                                            id: linkArr[i].linkPid.toString(),
                                            layerid: 'rdLink',
                                            type: 'line',
                                            style: { color: '#DAB1D5' }
                                        });
                                    }
                                    highRenderCtrl.drawHighlight();
                                    selectCRFData.push(tempData);
                                });
                            }
                        }
                        highRenderCtrl.drawHighlight();
                    });

                    shapeCtrl.shapeEditorResult.setFinalGeometry(objData);
                    console.log(objData);
                    tooltipsCtrl.setCurrentTooltip('请追加、取消对象或者点击空格保存CRF对象,按ESC键取消!');
                });
            }
        };
    }
]);

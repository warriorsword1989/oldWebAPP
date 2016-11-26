/**
 * Created by liwanchong on 2015/10/29.
 */
var realtimeTrafficApp = angular.module('app');
realtimeTrafficApp.controller('realtimeTrafficController', function ($scope, dsMeta, dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = new fastmap.uikit.SelectController();
    var layerCtrl = fastmap.uikit.LayerController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var eventController = fastmap.uikit.EventController();
    var featCodeCtrl = fastmap.uikit.FeatCodeController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var rdLink = layerCtrl.getLayerById('rdLink');
    var rdNode = layerCtrl.getLayerById('rdNode');
    var rdCross = layerCtrl.getLayerById('relationData');
    var workPoint = layerCtrl.getLayerById('workPoint');
    var editLayer = layerCtrl.getLayerById('edit');
    var tmcLayer = layerCtrl.getLayerById('tmcData');
    $scope.rticData = objCtrl.data;
    $scope.tmcTreeData = [];
    $scope.expandedNodes = [];

    $scope.resetToolAndMap = function () {
        // if (typeof map.currentTool.cleanHeight === "function") {
        //     map.currentTool.cleanHeight();
        // }
        // if (tooltipsCtrl.getCurrentTooltip()) {
        //     tooltipsCtrl.onRemoveTooltip();
        // }
        editLayer.drawGeometry = null;
        shapeCtrl.stopEditing();
        editLayer.bringToBack();
        $(editLayer.options._div).unbind();
        // $scope.changeBtnClass("");
        shapeCtrl.shapeEditorResult.setFinalGeometry(null);
        shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
        editLayer.clear();
    };
    $scope.rticDroption = [
        { id: 0, label: '无' },
        { id: 1, label: '顺方向' },
        { id: 2, label: '逆方向' }
    ];
    $scope.rankoption = [
        { id: 0, label: '无' },
        { id: 1, label: '高速' },
        { id: 2, label: '城市高速' },
        { id: 3, label: '干线道路' },
        { id: 4, label: '其他道路' }
    ];

    $scope.minusIntRtic = function (id) {
        $scope.rticData.intRtics.splice(id, 1);
        if ($scope.rticData.intRtics.length === 0) {

        }
    };
    $scope.addIntRtic = function () {
        var newIntRtic = fastmap.dataApi.rdLinkIntRtic({ linkPid: $scope.rticData.pid });
        $scope.rticData.intRtics.unshift(newIntRtic);
    };
    $scope.addCarRtic = function () {
        var newRtic = fastmap.dataApi.rdLinkRtic({ linkPid: $scope.rticData.pid });
        $scope.rticData.rtics.unshift(newRtic);
    };
    // 选择TMCPoint方法
    $scope.selectTmcCallback = function (data) {
        $scope.selectedFeature = data;
        // 地图小于17级时不能选择
        if (map.getZoom < 17) {
            return;
        }
        console.log(data);
    };
    // 新增TMC匹配信息
    $scope.addTmcLocation = function () {
        highRenderCtrl.highLightFeatures.push({
            id: $scope.rticData.pid.toString(),
            layerid: 'rdLink',
            type: 'line',
            style: {}
        });
        highRenderCtrl.drawHighlight();
        tooltipsCtrl.setCurrentTooltip('开始TMC匹配信息起点！');

        map.currentTool.disable();
        // 初始化选择关系的工具
        map.currentTool = new fastmap.uikit.SelectRelation({
            map: map,
            relationFlag: true
        });
        map.currentTool.enable();
        editLayer.bringToBack();
        $scope.toolTipText = '请选择关系！';
        eventController.off(eventController.eventTypes.GETRELATIONID);
        eventController.on(eventController.eventTypes.GETRELATIONID, $scope.selectTmcCallback);
        if (shapeCtrl.shapeEditorResult) {
            shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.point(0, 0));
            selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
            layerCtrl.pushLayerFront('edit');
        }
        // shapeCtrl.setEditingType('addTmcLocation');
        // shapeCtrl.startEditing();
        // map.currentTool = shapeCtrl.getCurrentTool();
        tooltipsCtrl.setEditEventType('addTmcLocation');
        tooltipsCtrl.setChangeInnerHtml('点击空格保存,或者按ESC键取消!');
    };
    /* 递归查询select节点 */
    $scope.getSelectObject = function (array) {
        $scope.expandedNodes = [];
        for (var i = 0; i < array.length; i++) {
            if (array[i].type === 'TMCPOINT') {
                $scope.expandedNodes = [array[i]];
                return;
            } else if (i === array.length - 1) {
                if (array[i].children) {
                    $scope.getSelectObject(array[i].children);
                }
            }
        }
    };
    /* 查询TMC树形结构 */
    $scope.getTmcTree = function (tmcPoints) {
        var param = {
            tmcIds: tmcPoints
        };
        dsMeta.queryTmcTree(param).then(function (data) {
            $scope.tmcTreeData = [data.data];
            // $scope.expandedNodes = [$scope.tmcTreeData[0]];
            // $scope.getSelectObject($scope.tmcTreeData);
            // console.log($scope.expandedNodes)
        });
    };
    /* 加载二级面板 */
    $scope.loadChildPanel = function (res, ctrl, html) {
        var showNameInfoObj = { // 这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
            loadType: 'subAttrTplContainer',
            propertyCtrl: 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
            propertyHtml: '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
            callback: function () {
                var showNameObj = {
                    loadType: 'subAttrTplContainer',
                    propertyCtrl: ctrl,
                    propertyHtml: html
                };
                $scope.$emit('transitCtrlAndTpl', showNameObj);
            }
        };
        objCtrl.tmcInfos = res;
        $scope.$emit('transitCtrlAndTpl', showNameInfoObj);
    };
    // 选择树子节点查询
    $scope.showTreeSelected = function (sel) {
        console.log(sel);
        var zoom = map.getZoom() < 17 ? 17 : map.getZoom();
        var param = {
            tmcId: sel.tmcId,
            type: sel.type
        };
        if (sel.type === 'TMCPOINT') {
            dsMeta.queryTmcData(param).then(function (data) {
                map.setView([data.data.geometry[1], data.data.geometry[0]], zoom);
                highRenderCtrl.highLightFeatures.push({
                    id: data.data.tmcId.toString(),
                    layerid: 'tmcData',
                    type: 'TMCPOINT',
                    style: {}
                });
                highRenderCtrl.drawHighlight();
                $scope.loadChildPanel(fastmap.dataApi.tmcPoint(data.data), 'scripts/components/road/ctrls/attr_link_ctrl/tmcPointCtrl', '../../../scripts/components/road/tpls/attr_link_tpl/tmcPointTpl.html');
            });
        } else if (sel.type === 'TMCLINE') {
            dsMeta.queryTmcData(param).then(function (data) {
                $scope.loadChildPanel(fastmap.dataApi.tmcLine(data.data), 'scripts/components/road/ctrls/attr_link_ctrl/tmcLineCtrl', '../../../scripts/components/road/tpls/attr_link_tpl/tmcLineTpl.html');
            });
        } else {
            $scope.$emit('SWITCHCONTAINERSTATE', {
                subAttrContainerTpl: false,
                attrContainerTpl: true
            });
        }
    };
    // 框选TMCPoint
    $scope.selectTmcPoint = function () {
        map.currentTool = new fastmap.uikit.SelectForRectang({
            map: map,
            shapeEditor: shapeCtrl,
            LayersList: [tmcLayer]
        });
        map.currentTool.enable();
        eventController.off(eventController.eventTypes.GETNODEID);
        eventController.off(eventController.eventTypes.GETFEATURE);
        eventController.off(eventController.eventTypes.GETRECTDATA);
        eventController.on(eventController.eventTypes.GETRECTDATA, function (data) {
            var tmcPointArray = [];
            highRenderCtrl._cleanHighLight();
            highRenderCtrl.highLightFeatures = [];
            if (data && data.data && data.data.length == 0) {
                tooltipsCtrl.setCurrentTooltip('请重新框选TMCPoint！');
                return;
            }
            // 筛选排除非TMCPoint要素
            for (var i = 0; i < data.data.length; i++) {
                if (data.data[i].data && data.data[i].data.properties.featType == 'TMCPOINT') {
                    if (data.data[i].data.properties.id !== undefined) {
                        tmcPointArray.push(data.data[i].data.properties.id);
                        highRenderCtrl.highLightFeatures.push({
                            id: data.data[i].data.properties.id.toString(),
                            layerid: 'tmcData',
                            type: 'TMCPOINT',
                            style: {}
                        });
                    }
                }
            }
            tmcPointArray = Utils.distinctArr(tmcPointArray);
            highRenderCtrl.drawHighlight();
            // tooltipsCtrl.setCurrentTooltip('空格查询TMC！');
            // console.info(Utils.distinctArr(tmcPointArray));
            $scope.getTmcTree(tmcPointArray);
            map.currentTool.disable();
        });
    };
    /* 删除TMC信息 */
    $scope.removeTmcLoc = function (item) {
        swal({
            title: '确认删除TMC？',
            type: 'warning',
            animation: 'slide-from-top',
            showCancelButton: true,
            confirmButtonText: '是的，我要删除',
            confirmButtonColor: '#ec6c62'
        }, function (f) {
            if (f) {
                var param = {
                    command: 'DELETE',
                    type: 'RDTMCLOCATION',
                    dbId: App.Temp.dbId,
                    objId: item.pid
                };
                dsEdit.save(param).then(function (data) {
                    if (data) {
                        tmcLayer.redraw();
                        $scope.refreshLinkData();
                        $scope.$emit('SWITCHCONTAINERSTATE', {
                            subAttrContainerTpl: false,
                            attrContainerTpl: true
                        });
                    }
                });
            }
        });
    };
    /* 刷新rdlink数据 */
    $scope.refreshLinkData = function () {
        dsEdit.getByPid(parseInt($scope.rticData.pid), 'RDLINK').then(function (data) {
            if (data) {
                objCtrl.setCurrentObject('RDLINK', data);
                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
            }
        });
    };
    /* 选择link作用方向 */
    $scope.changeLinkDirect = function () {
        map.currentTool.disable();
        selectCtrl.onSelected({
            geometry: $scope.rticData.geometry.coordinates,
            id: $scope.rticData.pid,
            direct: $scope.rticData.direct,
            point: $.extend(true, {}, shapeCtrl.shapeEditorResult.getFinalGeometry())
        });
        // if ($scope.rticData.direct === 1) {
            var point = fastmap.mapApi.point($scope.rticData.geometry.coordinates[0][0], $scope.rticData.geometry.coordinates[0][1]);
            var linkCoords = $scope.rticData.geometry.coordinates;
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
            shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.TMCTRANSFORMDIRECT);
            shapeCtrl.startEditing();
            tooltipsCtrl.setCurrentTooltip('点击方向图标开始修改方向！');
            eventController.off(eventController.eventTypes.DIRECTEVENT);
            eventController.on(eventController.eventTypes.DIRECTEVENT, function (event) {
                selectCtrl.selectedFeatures.direct = parseInt(event.geometry.orientation);
                $scope.tmcRelation.direct = parseInt(event.geometry.orientation) == 2 ? 1 : 2;
                tooltipsCtrl.setChangeInnerHtml('点击空格保存,或者按ESC键取消!');
                /* 组装数据对象*/
                featCodeCtrl.setFeatCode($scope.tmcRelation);
            });
            tooltipsCtrl.setCurrentTooltip('请点击空格创建TMCLocation！');
        /*} else {
            shapeCtrl.shapeEditorResult.setFinalGeometry(null);
            tooltipsCtrl.setCurrentTooltip('请点击空格创建TMCLocation!');
            shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.TMCTRANSFORMDIRECT);
            /!* 组装数据对象*!/
            featCodeCtrl.setFeatCode($scope.tmcRelation);
        }*/
    };
    function setLastNode(index){
        if(index==undefined){
            if($scope.tmcRelation.linkPids.length==1){
                $scope.tmcRelation.lastNode = $scope.tmcRelation.linkPids[0].eNodePid==$scope.tmcRelation.nodePid?$scope.tmcRelation.linkPids[0].sNodePid:$scope.tmcRelation.linkPids[0].eNodePid;
            }else if($scope.tmcRelation.linkPids.length>1){
                if(($scope.tmcRelation.linkPids[$scope.tmcRelation.linkPids.length-1].eNodePid==$scope.tmcRelation.linkPids[$scope.tmcRelation.linkPids.length-2].eNodePid)){
                    $scope.tmcRelation.lastNode = $scope.tmcRelation.linkPids[$scope.tmcRelation.linkPids.length-1].sNodePid
                }
                if(($scope.tmcRelation.linkPids[$scope.tmcRelation.linkPids.length-1].eNodePid==$scope.tmcRelation.linkPids[$scope.tmcRelation.linkPids.length-2].sNodePid)){
                    $scope.tmcRelation.lastNode = $scope.tmcRelation.linkPids[$scope.tmcRelation.linkPids.length-1].sNodePid
                }
                if(($scope.tmcRelation.linkPids[$scope.tmcRelation.linkPids.length-1].sNodePid==$scope.tmcRelation.linkPids[$scope.tmcRelation.linkPids.length-2].eNodePid)){
                    $scope.tmcRelation.lastNode = $scope.tmcRelation.linkPids[$scope.tmcRelation.linkPids.length-1].eNodePid
                }
                if(($scope.tmcRelation.linkPids[$scope.tmcRelation.linkPids.length-1].sNodePid==$scope.tmcRelation.linkPids[$scope.tmcRelation.linkPids.length-2].sNodePid)){
                    $scope.tmcRelation.lastNode = $scope.tmcRelation.linkPids[$scope.tmcRelation.linkPids.length-1].eNodePid
                }
            }
        }else{
            if(index==0){
                $scope.tmcRelation.lastNode = $scope.tmcRelation.nodePid;
            }else if(index==1){
                $scope.tmcRelation.lastNode = $scope.tmcRelation.linkPids[0].eNodePid==$scope.tmcRelation.nodePid?$scope.tmcRelation.linkPids[0].eNodePid:$scope.tmcRelation.linkPids[0].sNodePid;
            }else if(index>1){
                if(($scope.tmcRelation.linkPids[index].eNodePid==$scope.tmcRelation.linkPids[index-1].eNodePid)){
                    $scope.tmcRelation.lastNode = $scope.tmcRelation.linkPids[index-1].eNodePid;
                }
                if(($scope.tmcRelation.linkPids[index].eNodePid==$scope.tmcRelation.linkPids[index-1].sNodePid)){
                    $scope.tmcRelation.lastNode = $scope.tmcRelation.linkPids[index-1].sNodePid;
                }
                if(($scope.tmcRelation.linkPids[index].sNodePid==$scope.tmcRelation.linkPids[index-1].eNodePid)){
                    $scope.tmcRelation.lastNode = $scope.tmcRelation.linkPids[index-1].eNodePid;
                }
                if(($scope.tmcRelation.linkPids[index].sNodePid==$scope.tmcRelation.linkPids[index-1].sNodePid)){
                    $scope.tmcRelation.lastNode = $scope.tmcRelation.linkPids[index-1].sNodePid;
                }
            }
        }
    }
    // 格式化link对象
    function formatLinkObject (link) {
        var newObj = {};
        newObj.direct = link.properties.direct;
        newObj.eNodePid = parseInt(link.properties.enode);
        newObj.geometry = link.properties.symbol.geometry;
        newObj.kind = link.properties.kind;
        newObj.length = link.properties.length;
        newObj.pid = parseInt(link.properties.id);
        newObj.sNodePid = parseInt(link.properties.snode);
        return newObj;
    };
    // 选择接续线（支持修改退出线和接续线）;
    function selectOutOrSeriesLinks(dataresult) {
        // $scope.linkNodes = Utils.distinctArr($scope.linkNodes);
        // 判断选的线的合法性;
        if (dataresult.id == $scope.tmcRelation.inLinkPid) {
            tooltipsCtrl.setCurrentTooltipText('所选线不能与进入线重复!');
            return;
        }
        /* -----------------------------------如果增加的是接续线（支持修改）;-----------------------------------*/
        /* 判断接续线是否能与进入线重合，原则上不能重合*/
        if (dataresult.id == $scope.tmcRelation.inLinkPid) {
            tooltipsCtrl.setCurrentTooltipText('接续线不能与进入线重合!');
            return;
        }
        var linkInJoinLinksIndex = -1;
        for (var i = 0; i < $scope.tmcRelation.linkPids.length; i++) {
            if (parseInt(dataresult.id) === $scope.tmcRelation.linkPids[i].pid) {
                linkInJoinLinksIndex = i;
            }
        }
        /* 如果没有接续线接续线直接跟退出线挂接;*/
        if (linkInJoinLinksIndex === -1) {
            setLastNode();
            $scope.hightlightViasLink();
            if (dataresult.properties.enode == $scope.tmcRelation.lastNode && dataresult.properties.direct == 3) {
                $scope.tmcRelation.linkPids.push(formatLinkObject(dataresult));
                // 对于node和link数组的维护;
                // $scope.linkNodes.push(parseInt(dataresult.properties.snode));
                $scope.hightlightViasLink();
            } else if (dataresult.properties.snode == $scope.tmcRelation.lastNode && dataresult.properties.direct == 2) {
                $scope.tmcRelation.linkPids.push(formatLinkObject(dataresult));
                // 对于node和link数组的维护;
                // $scope.linkNodes.push(parseInt(dataresult.properties.enode));
                $scope.hightlightViasLink();
            } else if ((dataresult.properties.enode == $scope.tmcRelation.lastNode || dataresult.properties.snode == $scope.tmcRelation.lastNode) && dataresult.properties.direct == 1) {
                // 对于node和link数组的维护;
                $scope.tmcRelation.linkPids.push(formatLinkObject(dataresult));
                // (dataresult.properties.enode == $scope.linkNodes[$scope.linkNodes.length - 1]) ? $scope.linkNodes.push(parseInt(dataresult.properties.snode)): $scope.linkNodes.push(parseInt(dataresult.properties.enode));
                $scope.hightlightViasLink();
            } else {
                tooltipsCtrl.setCurrentTooltipText('您选择的接续线与上一条不连续或方向错误!');
            }
        } else {
            // var selectIndex = $scope.tmcRelation.linkPids.indexOf(parseInt(dataresult.id));
            setLastNode(linkInJoinLinksIndex);
            // $scope.linkNodes.splice(selectIndex);
            $scope.tmcRelation.linkPids.splice(linkInJoinLinksIndex);
            $scope.hightlightViasLink();
        }
    }
    /* 修改追踪线或选择tmcPoint */
    $scope.afterTruckFunc = function () {
        // 初始化选择关系的工具
        map.currentTool = new fastmap.uikit.SelectNodeAndPath({
            map: map,
            shapeEditor: shapeCtrl,
            selectLayers: [tmcLayer, rdLink],
            snapLayers: [rdLink]
        });
        map.currentTool.enable();
        eventController.off(eventController.eventTypes.GETFEATURE);
        eventController.on(eventController.eventTypes.GETFEATURE, function (tData) {
            if (tData.optype !== 'TMCPOINT' && tData.optype !== 'RDLINK') {
                tooltipsCtrl.notify('修改追踪link或者选择两个TMCPoint！', 'error');
                return;
            }
            // 如果选择的是link，则修改追踪线
            if (tData.optype === 'RDLINK') {
                selectOutOrSeriesLinks(tData);
            } else if (tData.optype === 'TMCPOINT') { // 如果选择tmcPoint，则计算locDirect
                $scope.tmcRelation.pointPids.push(tData);
                // 防止多次点击去重
                // $scope.tmcRelation.pointPids = Utils.distinctArr($scope.tmcRelation.pointPids);
                if ($scope.tmcRelation.pointPids.length > 1 && $scope.tmcRelation.pointPids[0].locoffPos !== 0) {
                    // 如果选择的第二个位置点是第一个位置点的正向偏移量则，则位置方向赋值为“+”
                    if ($scope.tmcRelation.pointPids[0].locoffPos === parseInt($scope.tmcRelation.pointPids[$scope.tmcRelation.pointPids.length - 1].id)) {
                        $scope.tmcRelation.locDirect = 1;
                    } else if ($scope.tmcRelation.pointPids[0].locoffNeg === parseInt($scope.tmcRelation.pointPids[$scope.tmcRelation.pointPids.length - 1].id)) {
                        // 如果选择的第二个位置点是第一个位置点的负向偏移量则，则位置方向赋值为“-”
                        $scope.tmcRelation.locDirect = 2;
                    } else {
                        tooltipsCtrl.notify('选择的两个TMCPoint无法匹配，请重新选择！', 'error');
                        return;
                    }
                    // 赋值位置表标识
                    $scope.tmcRelation.loctableId = $scope.tmcRelation.pointPids[$scope.tmcRelation.pointPids.length - 1].loctableId;
                    // 最后一个tmcId
                    $scope.tmcRelation.tmcId = $scope.tmcRelation.pointPids[$scope.tmcRelation.pointPids.length - 1].id;
                    // 选择link作用方向
                    tooltipsCtrl.setCurrentTooltip('已选择TMCPoint，点击地图开始修改方向！');
                    $scope.changeLinkDirect();
                }
            }
            // 高亮第一个tmcPoint和最后一个tmcPoint
            $scope.refreshHighLight();
        });
    };
    /* 追踪link方法 */
    $scope.getTruckLinks = function () {
        if ($scope.tmcRelation.nodePid) {
            var param = {
                command: 'CREATE',
                dbId: App.Temp.dbId,
                type: 'RDLINK',
                data: {
                    linkPid: $scope.rticData.pid,
                    nodePidDir: $scope.tmcRelation.nodePid,
                    maxNum: 30
                }
            };
            dsEdit.getByCondition(param).then(function (data) {
                if (data.data) {
                    // 遍历取出linkPid数组
                    /*for (var i = 0; i < data.data.length; i++) {
                        $scope.tmcRelation.linkPids.push(data.data[i].pid);
                        $scope.linkNodes.push(data.data[i].eNodePid);
                    }*/
                    $scope.tmcRelation.linkPids = data.data;
                    $scope.refreshHighLight();
                }
            });
        }
    };
    // 刷新高亮方法
    $scope.refreshHighLight = function () {
        highRenderCtrl._cleanHighLight();
        highRenderCtrl.highLightFeatures = [];
        highRenderCtrl.highLightFeatures.push({
            id: parseInt($scope.rticData.pid).toString(),
            layerid: 'rdLink',
            type: 'line',
            style: {}
        });
        if ($scope.tmcRelation.linkPids && $scope.tmcRelation.linkPids.length) {
            for (var i = 0; i < $scope.tmcRelation.linkPids.length; i++) {
                highRenderCtrl.highLightFeatures.push({
                    id: parseInt($scope.tmcRelation.linkPids[i].pid).toString(),
                    layerid: 'rdLink',
                    type: 'line',
                    style: {
                        color: 'blue'
                    }
                });
            }
        }
        if ($scope.tmcRelation.nodePid) {
            highRenderCtrl.highLightFeatures.push({
                id: $scope.tmcRelation.nodePid.toString(),
                layerid: 'rdLink',
                type: 'node',
                style: {
                    color: 'yellow'
                }
            });
        }
        // 高亮第一个tmcPoint和最后一个tmcPoint
        if ($scope.tmcRelation.pointPids && $scope.tmcRelation.pointPids.length) {
            for (var i = 0; i < $scope.tmcRelation.pointPids.length; i++) {
                if (i === 0 || i === $scope.tmcRelation.pointPids.length - 1) {
                    highRenderCtrl.highLightFeatures.push({
                        id: $scope.tmcRelation.pointPids[i].id.toString(),
                        layerid: 'tmcData',
                        type: 'TMCPOINT',
                        style: {}
                    });
                }
            }
        }
        highRenderCtrl.drawHighlight();
    };
    // 高亮接续线方法;
    $scope.hightlightViasLink = function () {
        highRenderCtrl.highLightFeatures.splice(3);
        if ($scope.tmcRelation.linkPids && $scope.tmcRelation.linkPids.length) {
            for (var i = 0; i < $scope.tmcRelation.linkPids.length; i++) {
                highRenderCtrl.highLightFeatures.push({
                    id: parseInt($scope.tmcRelation.linkPids.pid).toString(),
                    layerid: 'rdLink',
                    type: 'line',
                    style: {
                        color: 'blue'
                    }
                });
            }
        }
        highRenderCtrl._cleanHighLight();
        highRenderCtrl.drawHighlight();
    };
    /* 追踪link操作 */
    $scope.linkOfTruck = function () {
        $scope.autoTrack = !$scope.autoTrack;
        // 初始化新增数据;
        $scope.tmcRelation = {
            tmcId: '',
            locDirect: '',
            loctableId: '',
            direct: '',
            inLinkPid: $scope.rticData.pid,
            nodePid: '',
            linkPids: [],
            lastNode: '',
            pointPids: []
        };
        $scope.linkNodes = [];
        $scope.refreshHighLight();
        map.currentTool.disable();
        eventController.off(eventController.eventTypes.GETNODEID);
        eventController.off(eventController.eventTypes.GETFEATURE);
        eventController.off(eventController.eventTypes.GETRECTDATA);
        if ($scope.autoTrack) {
            // 如果进入线是单方向道路，自动选择进入点;
            $scope.linkNodes = [];
            // 清除地图上工具按钮
            if (map.floatMenu) {
                map.removeLayer(map.floatMenu);
                map.floatMenu = null;
            }
            shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.TMCTRANSFORMDIRECT);
            if ($scope.rticData.direct === 2 || $scope.rticData.direct === 3) {
                $scope.tmcRelation.nodePid = parseInt($scope.rticData.direct === 2 ? $scope.rticData.eNodePid : $scope.rticData.sNodePid);
                $scope.linkNodes.push($scope.tmcRelation.nodePid);
                highRenderCtrl.highLightFeatures.push({
                    id: $scope.tmcRelation.nodePid.toString(),
                    layerid: 'rdLink',
                    type: 'node',
                    style: {
                        color: 'yellow'
                    }
                });
                highRenderCtrl.drawHighlight();
                $scope.getTruckLinks();
                /* 自动追踪后需要手动修改，或选择TMCPoint */
                $scope.afterTruckFunc();
            } else {
                // 如果双方向则先选择方向
                // 地图编辑相关设置;
                tooltipsCtrl.setCurrentTooltip('选择进入点！');
                // 初始化选择点工具
                map.currentTool.disable();
                map.currentTool = new fastmap.uikit.SelectNode({
                    map: map,
                    nodesFlag: true,
                    shapeEditor: shapeCtrl
                });
                map.currentTool.enable();
                // 需要捕捉的图层
                eventController.off(eventController.eventTypes.GETNODEID);
                eventController.on(eventController.eventTypes.GETNODEID, function (data) {
                    if (parseInt(data.id) !== $scope.rticData.sNodePid && parseInt(data.id) !== $scope.rticData.eNodePid) {
                        tooltipsCtrl.notify('必须选择link的端点！', 'error');
                        return;
                    }
                    // 判断重复监听
                    if ($scope.tmcRelation.nodePid === parseInt(data.id)) {
                        return;
                    }
                    // 如果进入线是双方向的，则根据用户的选择高亮进入点;
                    $scope.tmcRelation.nodePid = parseInt(data.id);
                    $scope.linkNodes.push($scope.tmcRelation.nodePid);
                    highRenderCtrl.highLightFeatures.push({
                        id: $scope.tmcRelation.nodePid.toString(),
                        layerid: 'rdLink',
                        type: 'node',
                        style: {
                            color: 'yellow'
                        }
                    });
                    highRenderCtrl.drawHighlight();
                    tooltipsCtrl.setCurrentTooltip('已经选择进入点!请选择TMCPoint');
                    map.currentTool.snapHandler.addGuideLayer(rdLink);
                    $scope.getTruckLinks();
                    // eventController.off(eventController.eventTypes.GETNODEID);
                    // map.currentTool.disable();
                    /* 自动追踪后需要手动修改，或选择TMCPoint */
                    $scope.afterTruckFunc();
                });
            }
        } else {
            map.currentTool.disable();
            /* shapeCtrl.shapeEditorResult.setFinalGeometry(null);
            shapeCtrl.shapeEditorResult.setOriginalGeometry(null);*/
            editLayer.drawGeometry = null;
            editLayer.bringToBack();
            editLayer.clear();
            $scope.tmcRelation.linkPids = [];
            $scope.refreshHighLight();
        }
    };
    $scope.minusCarRtic = function (id) {
        $scope.rticData.rtics.splice(id, 1);
        if ($scope.rticData.rtics.length === 0) {

        }
    };
    $scope.showScene = function (id) {
        for (var layer in layerCtrl.layers) {
            if (id === 1) {
                if (layerCtrl.layers[layer].options.requestType === 'RDLINKINTRTIC') {
                    layerCtrl.layers[layer].options.isUpDirect = false;
                    layerCtrl.layers[layer].options.visible = true;
                    eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
                        layerArr: layerCtrl.layers
                    });
                } else if (layerCtrl.layers[layer].options.requestType === 'RDLINKRTIC') {
                    layerCtrl.layers[layer].options.isUpDirect = true;
                    layerCtrl.layers[layer].options.visible = false;
                    eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
                        layerArr: layerCtrl.layers
                    });
                }
            } else if (id === 2) {
                if (layerCtrl.layers[layer].options.requestType === 'RDLINKRTIC') {
                    layerCtrl.layers[layer].options.isUpDirect = false;
                    layerCtrl.layers[layer].options.visible = true;
                    eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
                        layerArr: layerCtrl.layers
                    });
                } else if (layerCtrl.layers[layer].options.requestType === 'RDLINKINTRTIC') {
                    layerCtrl.layers[layer].options.isUpDirect = true;
                    layerCtrl.layers[layer].options.visible = false;
                    eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
                        layerArr: layerCtrl.layers
                    });
                }
            } else if (id === 3) {
                if (layerCtrl.layers[layer].options.id === 'tmcData') {
                    layerCtrl.layers[layer].options.visible = true;
                    eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
                        layerArr: layerCtrl.layers
                    });
                }
                if (layerCtrl.layers[layer].options.requestType === 'RDLINKRTIC') {
                    layerCtrl.layers[layer].options.isUpDirect = false;
                    layerCtrl.layers[layer].options.visible = false;
                    eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
                        layerArr: layerCtrl.layers
                    });
                } else if (layerCtrl.layers[layer].options.requestType === 'RDLINKINTRTIC') {
                    layerCtrl.layers[layer].options.isUpDirect = false;
                    layerCtrl.layers[layer].options.visible = false;
                    eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
                        layerArr: layerCtrl.layers
                    });
                }
            }
        }
    };

    $scope.showRticsInfo = function (item) {
        $scope.linkData.oridiRowId = item.rowId;

        var showRticsInfoObj = { // 这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
            loadType: 'subAttrTplContainer',
            propertyCtrl: 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
            propertyHtml: '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
            callback: function () {
                var rticObj = {
                    loadType: 'subAttrTplContainer',
                    propertyCtrl: 'scripts/components/road/ctrls/attr_link_ctrl/rticOfIntCtrl',
                    propertyHtml: '../../../scripts/components/road/tpls/attr_link_tpl/rticOfIntTpl.html'
                };
                $scope.$emit('transitCtrlAndTpl', rticObj);
            }
        };
        $scope.$emit('transitCtrlAndTpl', showRticsInfoObj);
    };

    $scope.showCarInfo = function (cItem) {
        $scope.linkData.oridiRowId = cItem.rowId;

        var showCarInfoObj = { // 这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
            loadType: 'subAttrTplContainer',
            propertyCtrl: 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
            propertyHtml: '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
            callback: function () {
                var rticObj = {
                    loadType: 'subAttrTplContainer',
                    propertyCtrl: 'scripts/components/road/ctrls/attr_link_ctrl/rticOfCar',
                    propertyHtml: '../../../scripts/components/road/tpls/attr_link_tpl/rticOfCarTpl.html'
                };
                $scope.$emit('transitCtrlAndTpl', rticObj);
            }
        };
        $scope.$emit('transitCtrlAndTpl', showCarInfoObj);
    };

    /* 查看TMC信息详情 */
    $scope.showTmcInfo = function (item) {
        $scope.loadChildPanel(item, 'scripts/components/road/ctrls/attr_link_ctrl/tmcLocationCtrl', '../../../scripts/components/road/tpls/attr_link_tpl/tmcLocationTpl.html');
    };
    $scope.changeColor = function (ind, ord) {
        if (ord === 1) {
            $('#rticSpan' + ind).css('color', '#FFF');
        } else if (ord === 2) {
            $('#carSpan' + ind).css('color', '#FFF');
        } else {
            $('#tmcSpan' + ind).css('color', '#FFF');
        }
    };
    $scope.backColor = function (ind, ord) {
        if (ord === 1) {
            $('#rticSpan' + ind).css('color', 'darkgray');
        } else if (ord === 2) {
            $('#carSpan' + ind).css('color', 'darkgray');
        } else {
            $('#tmcSpan' + ind).css('color', 'darkgray');
        }
    };


    $scope.intitRticData = function () {
        if ($scope.rticData.intRtics.length > 0) {
        } else {
            var newIntRtic = fastmap.dataApi.rdLinkIntRtic({ linkPid: $scope.rticData.pid, rowId: '0' });
            $scope.rticData.intRtics.unshift(newIntRtic);
        }
        objCtrl.data.oridiRowId = $scope.rticData.intRtics[0].rowId;
        // 默认不追踪link
        $scope.autoTrack = false;
        /* var showRticsInfoObj = {
            loadType: 'subAttrTplContainer',
            propertyCtrl: 'scripts/components/road/ctrls/attr_link_ctrl/rticOfIntCtrl',
            propertyHtml: '../../../scripts/components/road/tpls/attr_link_tpl/rticOfIntTpl.html'
        };
        $scope.$emit('transitCtrlAndTpl', showRticsInfoObj);*/
        $scope.resetToolAndMap();
        // 初始化鼠标提示
        // $scope.toolTipText = '';
        // tooltipsCtrl.setCurrentTooltip($scope.toolTipText);
        map.currentTool.disable();
    };

    if (objCtrl.data) {
        $scope.intitRticData();
    }
    objCtrl.updateObject = function () {
        $scope.intitRticData();
    };
});

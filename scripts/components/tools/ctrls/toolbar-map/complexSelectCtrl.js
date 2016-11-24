/**
 * Created by wuzhen on 2016/11/22.
 */
angular.module('app').controller('complexSelectCtrl', ['$scope', '$ocLazyLoad', 'dsEdit', 'appPath', '$timeout', '$q',
    function ($scope, $ocLazyLoad, dsEdit, appPath, $timeout, $q) {
        var layerCtrl = fastmap.uikit.LayerController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var rdLink = layerCtrl.getLayerById('rdLink');
        var rdNode = layerCtrl.getLayerById('rdNode');
        var workPoint = layerCtrl.getLayerById('workPoint');
        var eventController = fastmap.uikit.EventController();
        var highRenderCtrl = fastmap.uikit.HighRenderController();

        $scope.selectShape = function (type) {
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
            var finalLinkPids = [];
            if (type === 'RDLINK') {
                $scope.resetOperator('addRelation', type);
                tooltipsCtrl.setCurrentTooltip('请框选rdLInk！');
                map.currentTool = new fastmap.uikit.SelectForRectang({
                    map: map,
                    shapeEditor: shapeCtrl,
                    LayersList: [rdLink]
                });
                map.currentTool.enable();
                eventController.off(eventController.eventTypes.GETRECTDATA);
                eventController.on(eventController.eventTypes.GETRECTDATA, function (event) {
                    var data = event.data;
                    var linkPids = [];
                    for (var i = 0, len = data.length; i < len; i++) {
                        linkPids.push(data[i].data.properties.id);
                    }
                    linkPids = Utils.distinctArr(linkPids);
                    finalLinkPids = $scope.diffData(finalLinkPids, linkPids);
                    $scope.highLightObj(finalLinkPids, 'line');
                    if (finalLinkPids.length === 0) {
                        tooltipsCtrl.setCurrentTooltip('没有框选到符合条件的数据！', 'warn');
                        return;
                    }
                    tooltipsCtrl.setCurrentTooltip('框选到' + finalLinkPids.length + '条符合条件的数据！', 'succ');

                    dsEdit.getByPids(finalLinkPids, 'RDLINK').then(function (res) {
                        console.info(res);
                    });
                });
            } else if (type === 'RDNODE') {
                $scope.resetOperator('addRelation', type);
                tooltipsCtrl.setCurrentTooltip('请框选rdNode！');
                map.currentTool = new fastmap.uikit.SelectForRectang({
                    map: map,
                    shapeEditor: shapeCtrl,
                    LayersList: [rdNode]
                });
                map.currentTool.enable();
                eventController.off(eventController.eventTypes.GETRECTDATA);
                eventController.on(eventController.eventTypes.GETRECTDATA, function (event) {
                    var data = event.data;
                    var linkPids = [];
                    for (var i = 0, len = data.length; i < len; i++) {
                        linkPids.push(data[i].data.properties.id);
                    }
                    linkPids = Utils.distinctArr(linkPids);
                    finalLinkPids = $scope.diffData(finalLinkPids, linkPids);
                    $scope.highLightObj(finalLinkPids, 'node');
                    if (finalLinkPids.length === 0) {
                        tooltipsCtrl.setCurrentTooltip('没有框选到符合条件的数据！', '');
                        return;
                    }
                    tooltipsCtrl.setCurrentTooltip('框选到' + finalLinkPids.length + '条符合条件的数据！', 'succ');

                    dsEdit.getByPids(finalLinkPids, 'RDNODE').then(function (res) {
                        console.info(res);
                    });
                });
            } else if (type === 'TRACK_RDLINK') { // 追踪选rdlink
                tooltipsCtrl.setCurrentTooltip('请先选择进入线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList: ['line', 'point']
                });
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink); // 添加自动吸附的图层
                var linkId,
                    nodeId,
                    highLightObjs = [];
                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    var direct;
                    // 清除吸附的十字
                    map.currentTool.snapHandler.snaped = false;
                    map.currentTool.clearCross();
                    map.currentTool.snapHandler._guides = [];
                    if (data.index === 0) {
                        direct = data.properties.direct;
                        linkId = data.id;
                        highLightObjs.push(linkId);
                        $scope.highLightObj(highLightObjs, 'line');
                        if (direct === '3') { //  3逆方向
                            nodeId = data.properties.snode;
                            map.currentTool.selectedFeatures.push(nodeId);
                        } else if (direct === '2') { // 2顺方向
                            nodeId = data.properties.enode;
                            map.currentTool.selectedFeatures.push(nodeId);
                        } else {
                            tooltipsCtrl.setCurrentTooltip('请选择进入点！');
                            map.currentTool.snapHandler.addGuideLayer(rdNode);
                            return;
                        }
                    } else if (data.index === 1) {
                        nodeId = data.id;
                        map.currentTool.selectedFeatures.push(nodeId);
                    }
                    if (linkId && nodeId && data.index <= 1) {
                        var param = {
                            command: 'CREATE',
                            dbId: App.Temp.dbId,
                            type: 'RDLINK',
                            data: {
                                linkPid: linkId,
                                nodePidDir: nodeId
                            }
                        };
                        dsEdit.getByCondition(param).then(function (res) {
                            if (res.errcode === 0) {
                                for (var i = 1; i < res.data.length; i++) {
                                    highLightObjs.push(res.data[i].pid);
                                }
                                $scope.highLightObj(highLightObjs, 'line');
                            }
                        });
                    }
                });
            }
        };
        /**
         * 高亮要素
         * type 暂时可以是 line、node，需要其他在扩展
         */
        $scope.highLightObj = function (arr, type, style) {
            highRenderCtrl.cleanHighLight();
            var highlightFeatures = [];
            if (!style) {
                style = {};
            }
            for (var i = 0, lenI = arr.length; i < lenI; i++) {
                highlightFeatures.push({
                    id: arr[i].toString(),
                    layerid: 'rdLink',
                    type: type,
                    style: style
                });
            }
            highRenderCtrl.highLightFeatures = highlightFeatures;
            highRenderCtrl.drawHighlight();
        };
        $scope.diffData = function (src, desc) {
            if (src.length === 0) {
                return desc;
            } else if (desc.length === 0) {
                return src;
            }
            var srcObj = $scope.arrToObject(src);
            var descObj = $scope.arrToObject(desc);
            for (var item in descObj) {
                if (srcObj[item]) {
                    delete srcObj[item];
                } else {
                    srcObj[item] = true;
                }
            }
            return Object.keys(srcObj);
        };
        /**
         * 将数组去重后转为对象
         * @param arr
         * @returns {{}}
         */
        $scope.arrToObject = function (arr) {
            var obj = {};
            for (var i = 0, len = arr.length; i < len; i++) {
                obj[arr[i]] = true;
            }
            return obj;
        };
    }
]);

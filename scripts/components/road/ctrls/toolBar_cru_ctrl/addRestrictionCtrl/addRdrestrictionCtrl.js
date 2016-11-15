/**
 * Created by zhaohang on 2016/5/6.
 */
var rdRestrictionApp = angular.module('app');
rdRestrictionApp.controller('addRdRestrictionController', ['$scope', '$ocLazyLoad', 'appPath', 'dsEdit', function ($scope, $ocLazyLoad, appPath, dsEdit) {
    var layerCtrl = fastmap.uikit.LayerController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var rdLink = layerCtrl.getLayerById('rdLink');
    var rdnode = layerCtrl.getLayerById('rdNode');
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    $scope.inLaneInfoArr = [];
    $scope.directData = objCtrl.originalData;
    $scope.limitRelation = {};
    $scope.clickFlag = true;
    $scope.excitLineArr = [];
    $scope.highFeatures = [];
    $scope.viasLineArr = [];
    var changedDirectObj = { // 这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载speedOfConditionCtrl。
        loadType: 'subAttrTplContainer',
        propertyCtrl: appPath.road + 'ctrls/blank_ctrl/blankCtrl',
        propertyHtml: appPath.root + appPath.road + 'tpls/blank_tpl/blankTpl.html',
        callback: function () {
            var obj = {
                loadType: 'subAttrTplContainer',
                propertyCtrl: appPath.road + 'ctrls/toolBar_cru_ctrl/addRestrictionCtrl/directOfRestrictionCtrl',
                propertyHtml: appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/addRestrictionTepl/directOfRestrictionTpl.html'
            };
            $scope.$emit('transitCtrlAndTpl', obj);
        }
    };
    $scope.$emit('transitCtrlAndTpl', changedDirectObj);

    // 删除普通车道或附加车道方向有公交车道的时候 一并删除
    $scope.minusNormalData = function (item, index, event) {
        if ($scope.directData.showNormalData.length > 0) {
            $scope.directData.showNormalData.splice(index, 1);
            $scope.directData.showTransitData.splice(index, 1);
            $scope.directData.inLaneInfoArr.splice(index, 1);
        }
    };
    if (map.currentTool && typeof map.currentTool.cleanHeight === 'function') {
        map.currentTool.cleanHeight();
        map.currentTool.disable();// 禁止当前的参考线图层的事件捕获
    }

    /* -----------------------------------------------地图点线选择操作部分-------------------------------------------------*/
    shapeCtrl.setEditingType('addRestriction');
    tooltipsCtrl.setEditEventType(fastmap.dataApi.GeoLiveModelType.RDRESTRICTION);
    tooltipsCtrl.setCurrentTooltip('正要新建交限,先选择线！');

    map.currentTool = new fastmap.uikit.SelectForRestriction({
        map: map,
        createRestrictFlag: true,
        currentEditLayer: rdLink,
        shapeEditor: shapeCtrl,
        operationList: ['line', 'point', 'line']
    });
    // 开启link和node的捕捉功能;
    map.currentTool.snapHandler.addGuideLayer(rdnode);
    map.currentTool.snapHandler.addGuideLayer(rdLink);
    map.currentTool.enable();

    $scope.excitLineArr = [];
    eventController.on(eventController.eventTypes.GETLINKID, function (data) {
        if (data.index === 0) {
            $scope.limitRelation.inLinkPid = parseInt(data.id);
            $scope.highFeatures.push({
                id: $scope.limitRelation.inLinkPid.toString(),
                layerid: 'rdLink',
                type: 'line',
                style: { color: '#3A5FCD' }
            });
            highRenderCtrl.highLightFeatures = $scope.highFeatures;
            highRenderCtrl.drawHighlight();
            tooltipsCtrl.setCurrentTooltip('已经选择进入线,请选择进入点!');
            // 单方向自动选择进入点;
            if (data.properties.direct == 2 || data.properties.direct == 3) {
                $scope.limitRelation.nodePid = parseInt(data.properties.direct == 2 ? data.properties.enode : data.properties.snode);
                $scope.highFeatures.push({
                    id: $scope.limitRelation.nodePid.toString(),
                    layerid: 'rdLink',
                    type: 'node',
                    style: { color: '#ffff00', strokeWidth: 4 }
                });
                highRenderCtrl.drawHighlight();
                map.currentTool.selectedFeatures.push($scope.limitRelation.nodePid.toString());
                tooltipsCtrl.setCurrentTooltip('已经选择进入点,请选择退出线!');
            }
        } else if (data.index === 1) {
            $scope.limitRelation.nodePid = parseInt(data.id);
            $scope.highFeatures.push({
                id: $scope.limitRelation.nodePid.toString(),
                layerid: 'rdLink',
                type: 'node',
                style: { color: '#ffff00', strokeWidth: 4 }
            });
            _highLightCompoments();
            tooltipsCtrl.setCurrentTooltip('已经选择进入点,选择退出线!');
        } else if (data.index > 1) {
            // 退出线的合法判断;
            if (data.id == $scope.limitRelation.inLinkPid) {
                tooltipsCtrl.setCurrentTooltip('退出线和进入线不能为同一条线'); return;
            }
            param = {};
            param.dbId = App.Temp.dbId;
            param.type = 'RDLANEVIA';
            param.data = {
                inLinkPid: $scope.limitRelation.inLinkPid,
                nodePid: $scope.limitRelation.nodePid,
                outLinkPid: parseInt(data.id),
                type: 'RDRESTRICTION' // 交限专用;
            };
            dsEdit.getByCondition(param).then(function (result) { // 找出经过线
                if (result !== -1) {
                    var tempVias = result.data[0].links;
                    // 查询经过线的接口返回的是经过线组，车信、交限只查一组经过线，因此取第一个即可
                    var dex1 = $scope.excitLineArr.indexOf(parseInt(data.id));
                    var dex2 = -1;
                    if (dex1 > -1) { // 如果退出线存在，反选
                        $scope.excitLineArr.splice(dex1, 1);
                        for (var i = 0; i < $scope.highFeatures.length; i++) {
                            if ($scope.highFeatures[i].id == data.id) {
                                dex2 = i;
                                $scope.highFeatures.splice(dex2, 1);
                            }
                        }
                        for (var i = 0; i < tempVias.length; i++) {
                            for (var j = 0; j < $scope.highFeatures.length; j++) {
                                if ($scope.highFeatures[j].id == tempVias[i]) {
                                    $scope.highFeatures.splice(j, 1);
                                    break;
                                }
                            }
                        }
                    } else { // 如果退出线不曾重复;
                        // 经过线;
                        $scope.excitLineArr.push(parseInt(data.id));
                        for (var i = 0; i < tempVias.length; i++) {
                            $scope.highFeatures.push({
                                id: tempVias[i].toString(),
                                layerid: 'rdLink',
                                type: 'line',
                                style: { color: 'blue' }
                            });
                        }
                        // 退出线;
                        $scope.highFeatures.push({
                            id: data.id.toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: { color: '#CD0000' }
                        });
                    }
                }
                _highLightCompoments();
            });
            $scope.limitRelation.outLinkPids = $scope.excitLineArr;
            tooltipsCtrl.setCurrentTooltip('已选退出线,点击空格键保存!');
        }
        $scope.directData.limitRelation = $scope.limitRelation;
    });

    function _highLightCompoments() {
        highRenderCtrl._cleanHighLight();
        highRenderCtrl.drawHighlight();
    }
}]);

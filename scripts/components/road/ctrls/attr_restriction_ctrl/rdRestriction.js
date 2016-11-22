/**
 * Created by liwanchong on 2015/10/24.
 */
angular.module('app').controller('normalController', ['$rootScope', '$scope', '$timeout', '$ocLazyLoad', 'dsFcc', 'dsEdit', '$q', function ($rootScope, $scope, $timeout, $ocLazyLoad, dsFcc, dsEdit, $q) {
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    var layerCtrl = fastmap.uikit.LayerController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var eventController = fastmap.uikit.EventController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var rdRestriction = layerCtrl.getLayerById('relationData');
    var rdLink = layerCtrl.getLayerById('rdLink');
    var rdNode = layerCtrl.getLayerById('rdNode');
    var limitPicArr = [];
    $scope.currentHandleType = '';
    $scope.restrictionType = 0; // 0--普通交限 1--卡车交限

    // 判断当前交限是卡车交限还是普通交限
    var setRestrictionType = function () {
        $scope.restrictionType = 0; // 普通交限
        var details = $scope.rdRestrictCurrentData.details;
        for (var i = 0; i < details.length; i++) {
            if (details[i].conditions && details[i].conditions[0]) {
                var bin = Utils.dec2bin(details[i].conditions[0].vehicle);
                var reverseBin = bin.split('').reverse();
                var a = reverseBin[1];
                var b = reverseBin[2];
                if (a === '1' || b === '1') {
                    $scope.restrictionType = 1;
                    break;
                }
            }
        }
    };

    // 初始化数据
    $scope.initializeData = function () {
        objectEditCtrl.setOriginalData(objectEditCtrl.data.getIntegrate());
        // 控制器初始化数据模型;
        $scope.editStatus = true;
        $scope.flag = 0;
        $rootScope.flag = 0;
        $scope.rdRestrictCurrentData = objectEditCtrl.data;
        $scope.rdRestrictOriginalData = objectEditCtrl.originalData;
        $scope.rdRestrictionCurrentDetail = objectEditCtrl.data.details[0];
        setRestrictionType();
        // 初始高亮整个关系关联要素;
        highLightRestrictAll();
        /* 如果默认限制类型为时间段禁止，显示时间段控件*/
        if ($scope.rdRestrictionCurrentDetail.type == 2) {
            $scope.changeLimitType(2);
        }
        // 回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if ($scope.restricOrdinaryForm) {
            $scope.restricOrdinaryForm.$setPristine();
        }
    };

    // 点击限制方向时,显示其有的属性信息
    $scope.showData = function (item, e, index) {
        highRenderCtrl.highLightFeatures.length = 0;
        limitPicArr[$('.show-tips.active').attr('data-index')] = $scope.codeOutput;
        $scope.flag = index;
        $rootScope.flag = index;
        // 清除所有高亮样式并高亮当前数据;
        removeTipsActive();
        $(e.target).addClass('active');
        $scope.rdRestrictionCurrentDetail = item;
        $scope.changeLimitType($scope.rdRestrictionCurrentDetail.type);
        // 如果是修改推出线，则收回增加箭头方向面板;
        // if($scope.suspendPanelOpened)$scope.suspendPanelOpened = false;
        // 高亮点击选中的要素;
        highLightRestrictAll();
        // 修改退出线;
        if (e.button == 0) {
            modifyOutLink();
            $scope.subAttrTplContainerSwitch(false);
        } else if (e.button == 2) {
            e.target.addEventListener('contextmenu', function (event) { event.preventDefault(); }, false);
            clearMapTool();
            $scope.showAddOrEditDirectTpl('edit');
        }
    };

    $scope.deleteDirect = function (item, event, index) {
        var len = $scope.rdRestrictCurrentData.details.length;
        if (len === 1) {
            swal('无法操作', '请点击删除按钮删除该交限！', 'info');
        } else {
            $scope.rdRestrictCurrentData.details.splice(index, 1);
            var arr = $scope.rdRestrictCurrentData.restricInfo.split(',');
            arr.splice(index, 1);
            $scope.rdRestrictCurrentData.restricInfo = arr.join(',');
            $timeout(function () {
                $('.show-tips:first').trigger('click');
            });
        }
    };

    // 修改交限方向的理论或实际
    $scope.changeType = function (item) {
        var restrictInfoArr = $scope.rdRestrictCurrentData.restricInfo.split(',');
        item.flag = parseInt(item.flag);
        if (item.flag === 1) {
            if (restrictInfoArr[$scope.flag].indexOf('[') !== -1) {
                restrictInfoArr[$scope.flag] = restrictInfoArr[$scope.flag].split('')[1];
            }
        } else {
            if (restrictInfoArr[$scope.flag].indexOf('[') !== -1) {
                restrictInfoArr[$scope.flag] = restrictInfoArr[$scope.flag].split('')[1];
            }
            restrictInfoArr[$scope.flag] = '[' + restrictInfoArr[$scope.flag] + ']';
        }
        $scope.rdRestrictCurrentData.restricInfo.length = 0;
        $scope.rdRestrictCurrentData.restricInfo = restrictInfoArr.join(',');
    };
    // 修改经过线;
    $scope.modifyThroughLink = function () {
        $scope.viasLinkFlag = false;
        $scope.currentHandleType = 'editVias';
        // 最后一根经过线;
        for (var i = 0; i < $scope.rdRestrictOriginalData.details[$scope.flag].vias.length; i++) {
            if ($scope.rdRestrictOriginalData.details[$scope.flag].vias[i].seqNum == $scope.rdRestrictOriginalData.details[$scope.flag].vias.length) {
                $scope.lastLinkLine = $scope.rdRestrictOriginalData.details[$scope.flag].vias[i].linkPid;
            }
        }
        // //获取退出线的进入点以供修改经过线使用;
        $q.all([getLinkInfos($scope.rdRestrictOriginalData.details[$scope.flag].outLinkPid), getLinkInfos($scope.lastLinkLine)]).then(function (data) {
            var tempArr1 = [];
            var tempArr2 = [];
            tempArr1.push(data[0].eNodePid);
            tempArr1.push(data[0].sNodePid);
            tempArr2.push(data[1].eNodePid);
            tempArr2.push(data[1].sNodePid);
            for (var i = 0; i < tempArr1.length; i++) {
                if (tempArr2.indexOf(tempArr1[i]) != -1) {
                    $scope.outLinkInNode = tempArr1[i];
                }
            }
        });
        // 开始修改经过线前清除对修改某一方向箭头的事件监听;
        clearMapTool();
        $scope.rdRestrictionCurrentDetail.vias = [];
        highLightRestrictAll();
        // 修改退出线;
        map.currentTool = new fastmap.uikit.SelectPath({
            map: map,
            currentEditLayer: rdLink,
            linksFlag: true,
            shapeEditor: shapeCtrl
        });
        // 开启link的捕捉功能;
        map.currentTool.snapHandler.addGuideLayer(rdLink);
        map.currentTool.enable();
        tooltipsCtrl.setCurrentTooltip('开始修改经过线！', 'info');
        var nodeArr = [$scope.rdRestrictCurrentData.nodePid];
        var linkArr = [];
        var reDrawFlag = true;
        eventController.off(eventController.eventTypes.GETLINKID);
        eventController.on(eventController.eventTypes.GETLINKID, function (dataresult) {
            /*
             * 对经过线的合法性前判断;
             * （1）经过线不能为退出线;
             * （2）经过线不能为进入线;
             * （3）经过线必须相互连续;
             * */
            if (dataresult.id == $scope.rdRestrictionCurrentDetail.inLinkPid) {
                tooltipsCtrl.onRemoveTooltip();
                tooltipsCtrl.setCurrentTooltip('退出线和进入线不能为同一条线！', 'error');
                return;
            }
            if (dataresult.id == $scope.rdRestrictOriginalData.details[$scope.flag].outLinkPid) {
                tooltipsCtrl.onRemoveTooltip();
                tooltipsCtrl.setCurrentTooltip('经过线和退出线不能为同一条线！', 'error');
                return;
            }
            var selectLink = parseInt(dataresult.id);
            var repeatNum = linkArr.indexOf(dataresult.id);
            if (linkArr.length && repeatNum != -1) {
                nodeArr.splice(repeatNum + 1);
                linkArr.splice(repeatNum);
                tooltipsCtrl.onRemoveTooltip();
                tooltipsCtrl.setCurrentTooltip('请继续选择经过线！', 'info');
            } else if (dataresult.properties.direct == 1) {
                if (dataresult.properties.enode == nodeArr[nodeArr.length - 1] || dataresult.properties.snode == nodeArr[nodeArr.length - 1]) {
                    var temp = (dataresult.properties.enode == nodeArr[nodeArr.length - 1]) ? dataresult.properties.snode : dataresult.properties.enode;
                    nodeArr.push(parseInt(temp));
                    linkArr.push(dataresult.id);
                    tooltipsCtrl.onRemoveTooltip();
                    tooltipsCtrl.setCurrentTooltip('已选择一条经过线！', 'info');
                } else {
                    tooltipsCtrl.onRemoveTooltip();
                    tooltipsCtrl.setCurrentTooltip('经过线选择错误！', 'error');
                    return;
                }
            } else if (dataresult.properties.enode == nodeArr[nodeArr.length - 1] && dataresult.properties.direct == 3) {
                nodeArr.push(dataresult.properties.snode);
                linkArr.push(dataresult.id);
                tooltipsCtrl.onRemoveTooltip();
                tooltipsCtrl.setCurrentTooltip('已选择一条经过线！', 'info');
            } else if (dataresult.properties.snode == nodeArr[nodeArr.length - 1] && dataresult.properties.direct == 2) {
                nodeArr.push(parseInt(dataresult.properties.enode));
                linkArr.push(dataresult.id);
                tooltipsCtrl.onRemoveTooltip();
                tooltipsCtrl.setCurrentTooltip('已选择一条经过线！', 'info');
            } else {
                tooltipsCtrl.onRemoveTooltip();
                tooltipsCtrl.setCurrentTooltip('经过线选择错误！', 'error');
                return;
            }
            if (nodeArr[nodeArr.length - 1] == $scope.outLinkInNode) {
                tooltipsCtrl.onRemoveTooltip();
                tooltipsCtrl.setCurrentTooltip('经过线与退出线已连续，请点击保存！', 'info');
                $scope.viasLinkFlag = true;
            }

            // 重新绘制;
            $scope.rdRestrictionCurrentDetail.vias = [];
            for (var i = 0; i < linkArr.length; i++) {
                $scope.rdRestrictionCurrentDetail.vias.push(fastmap.dataApi.rdRestrictionVias({
                    rowId: '',
                    linkPid: linkArr[i].toString(),
                    seqNum: i + 1
                }));
            }
            highLightRestrictAll();
        });
    };

    $scope.showAddOrEditDirectTpl = function (type) {
        // 开始增加箭头方向前清除对修改某一方向箭头的事件监听;
        clearMapTool();
        var tpl,
            ctrl;
        if (type == 'add') {
            // 当为增加方向箭头时清楚选中的某一个方向箭头;
            removeTipsActive();
            tpl = '../../../scripts/components/road/tpls/attr_restrict_tpl/addDitrectTpl.html';
            ctrl = 'scripts/components/road/ctrls/attr_restriction_ctrl/addDirectCtrl';
        } else if (type == 'edit') {
            tpl = '../../../scripts/components/road/tpls/attr_restrict_tpl/editDitrectTpl.html';
            ctrl = 'scripts/components/road/ctrls/attr_restriction_ctrl/editDirectCtrl';
        }
        var addObj = { // 这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
            loadType: 'subAttrTplContainer',
            propertyCtrl: 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
            propertyHtml: '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
            callback: function () {
                var showInfoObj = {
                    loadType: 'subAttrTplContainer',
                    propertyCtrl: ctrl,
                    propertyHtml: tpl
                };
                $scope.$emit('transitCtrlAndTpl', showInfoObj);
            }
        };
        $scope.$emit('transitCtrlAndTpl', addObj);
    };

    /* --------------------------------------------------------------------------保存操作--------------------------------------------------------------------------*/
    $scope.save = function () {
        if ($scope.currentHandleType == 'editVias' && !$scope.viasLinkFlag) {
            swal('操作失败', '经过线不连续！', 'error');
            return;
        }
        var details = $scope.rdRestrictCurrentData.details;
        for (var i = 0; i < details.length; i++) {
            if (details[i].type != 2) {
                if (details[i].conditions && details[i].conditions.length != 0) {
                    details[i].conditions[0].timeDomain = '';
                }
            }
        }
        objectEditCtrl.save();
        var param = {
            command: 'UPDATE',
            type: 'RDRESTRICTION',
            dbId: App.Temp.dbId,
            data: objectEditCtrl.changedProperty
        };


        if (!objectEditCtrl.changedProperty) {
            swal('操作成功', '属性值没有变化！', 'success');
            return;
        }

        dsEdit.save(param).then(function (data) {
            if (data) {
                rdRestriction.redraw();
                highRenderCtrl._cleanHighLight();
                highRenderCtrl.highLightFeatures = [];
                $scope.refreshData();
                map.currentTool.disable();
                tooltipsCtrl.onRemoveTooltip();
                $scope.$emit('SWITCHCONTAINERSTATE', {
                    subAttrContainerTpl: false
                });
            }
        });

        if (selectCtrl.rowkey && selectCtrl.rowkey.rowkey) {
            var stageParam = {
                rowkey: selectCtrl.rowkey.rowkey,
                stage: 3,
                handler: 0
            };
            dsFcc.changeDataTipsState(JSON.stringify(stageParam)).then(function (data) {
                selectCtrl.rowkey.rowkey = undefined;
            });
        }
    };
    // 根据pid重新请求数据
    $scope.refreshData = function () {
        dsEdit.getByPid($scope.rdRestrictCurrentData.pid, 'RDRESTRICTION').then(function (data) {
            if (data) {
                objectEditCtrl.setCurrentObject('RDRESTRICTION', data);
                objectEditCtrl.setOriginalData(objectEditCtrl.data.getIntegrate());
            }
        });
    };

    /* --------------------------------------------------------------------------删除交限--------------------------------------------------------------------------*/

    $scope.delete = function () {
        var pid = parseInt($scope.rdRestrictCurrentData.pid);
        var param = {
            command: 'DELETE',
            type: 'RDRESTRICTION',
            dbId: App.Temp.dbId,
            objId: pid
        };
        // 结束编辑状态
        dsEdit.save(param).then(function (data) {
            // var restrict = layerCtrl.getLayerById("relationData");
            rdRestriction.redraw();
            highRenderCtrl.highLightFeatures.length = 0;
            highRenderCtrl._cleanHighLight();
            map.currentTool.disable();
            $scope.$emit('SWITCHCONTAINERSTATE', { attrContainerTpl: false, subAttrContainerTpl: false });
        });
        if (selectCtrl.rowkey) {
            var stageParam = {
                rowkey: selectCtrl.rowkey.rowkey,
                stage: 3,
                handler: 0

            };
            dsFcc.changeDataTipsState(JSON.stringify(stageParam)).then(function (data) {
                var workPoint = layerCtrl.getLayerById('workPoint');
                workPoint.redraw();
                selectCtrl.rowkey.rowkey = undefined;
            });
        }
    };
    /* --------------------------------------------------------------------------删除交限--------------------------------------------------------------------------*/


    $scope.cancel = function () {};


    /* --------------------------------------------------------------------------时间控件--------------------------------------------------------------------------*/
    $scope.fmdateTimer = function (str) {
        $scope.$broadcast('set-code', str);
    };
    $scope.$on('get-date', function (event, date) {
        if ($scope.rdRestrictionCurrentDetail.conditions.length < 1) {
            $scope.rdRestrictionCurrentDetail.conditions[0] = fastmap.dataApi.rdRestrictionCondition({});
        }
        $scope.rdRestrictionCurrentDetail.conditions[0].timeDomain = date;
    });
    /* 改变限制类型判断时间控件*/
    $scope.changeLimitType = function (type) {
        if (type == 2) {
            $ocLazyLoad.load('scripts/components/tools/fmTimeComponent/fmdateTimer').then(function () {
                $scope.dateURL = '../../../scripts/components/tools/fmTimeComponent/fmdateTimer.html';
                $timeout(function () {
                    /* 查询数据库取出时间字符串*/
                    if ($scope.rdRestrictionCurrentDetail.conditions && $scope.rdRestrictionCurrentDetail.conditions[0] && $scope.rdRestrictionCurrentDetail.conditions[0].timeDomain) {
                        $scope.fmdateTimer($scope.rdRestrictionCurrentDetail.conditions[0].timeDomain);
                    } else {
                        $scope.fmdateTimer('');
                    }
                }, 100);
            });
        } else {
            $scope.fmdateTimer('');
        }
    };

    // 清除地图要素选择要素监听事件;
    function clearMapTool() {
        if (eventController.eventTypesMap[eventController.eventTypes.GETLINKID]) {
            for (var ii = 0, lenII = eventController.eventTypesMap[eventController.eventTypes.GETLINKID].length; ii < lenII; ii++) {
                eventController.off(eventController.eventTypes.GETLINKID, eventController.eventTypesMap[eventController.eventTypes.GETLINKID][ii]);
            }
        }
        if (map.currentTool) {
            map.currentTool.disable(); // 禁止当前的参考线图层的事件捕获
        }
    }

    // 获取一条link对象;
    function getLinkInfos(param) {
        var defer = $q.defer();
        dsEdit.getByPid(param, 'RDLINK').then(function (data) {
            if (data) {
                defer.resolve(data);
            }
        });
        return defer.promise;
    }


    function modifyOutLink() {
        $scope.currentHandleType = 'editOutLink';
        clearMapTool();
        // 修改退出线;
        map.currentTool = new fastmap.uikit.SelectPath({
            map: map,
            currentEditLayer: rdLink,
            linksFlag: true,
            shapeEditor: shapeCtrl
        });
        // 开启link和node的捕捉功能;
        map.currentTool.snapHandler.addGuideLayer(rdNode);
        map.currentTool.snapHandler.addGuideLayer(rdLink);
        map.currentTool.enable();
        eventController.off(eventController.eventTypes.GETLINKID);
        eventController.on(eventController.eventTypes.GETLINKID, function (dataresult) {
            $scope.editStatus = false;
            // 退出线的合法判断;
            if (dataresult.id == $scope.rdRestrictionCurrentDetail.inLinkPid) {
                // tooltipsCtrl.setCurrentTooltip("退出线和进入线不能为同一条线");
                tooltipsCtrl.onRemoveTooltip();
                tooltipsCtrl.setCurrentTooltip('退出线和进入线不能为同一条线！', 'error');
                return;
            }
            // 退出线与之前一样则不请求;
            if (dataresult.id == $scope.rdRestrictOriginalData.details[$scope.flag].outLinkPid) {
                // tooltipsCtrl.setCurrentTooltip("退出线和之前一样，请重新选择");
                tooltipsCtrl.onRemoveTooltip();
                tooltipsCtrl.setCurrentTooltip('退出线和之前一样，请重新选择！', 'error');
                return;
            }
            param = {};
            param.dbId = App.Temp.dbId;
            param.type = 'RDLANEVIA';
            param.data = {
                inLinkPid: objectEditCtrl.data.inLinkPid.toString(),
                nodePid: objectEditCtrl.data.nodePid.toString(),
                outLinkPid: dataresult.id,
                type: 'RDRESTRICTION' // 交限专用;
            };
            $scope.$emit('showFullLoadingOrNot', true);
            dsEdit.getByCondition(param).then(function (result) {
                if (result !== -1) {
                    var highLightFeatures = [];
                    $scope.rdRestrictionCurrentDetail.vias = [];
                    $scope.rdRestrictionCurrentDetail.outLinkPid = parseInt(dataresult.id);
                    $scope.rdRestrictionCurrentDetail.relationshipType = parseInt(result.data[0].relationshipType);
                    var temp = result.data[0],
                        via = [];
                    for (i = 0; i < temp.links.length; i++) {
                        via.push(fastmap.dataApi.rdRestrictionVias({
                            rowId: '',
                            linkPid: temp.links[i],
                            seqNum: i + 1
                        }));
                        $scope.rdRestrictionCurrentDetail.vias = via;
                    }
                    highLightFeatures.push({
                        id: objectEditCtrl.data.inLinkPid.toString(),
                        layerid: 'rdLink',
                        type: 'line',
                        style: { color: '#3A5FCD' }
                    });
                    for (var i = 0; i < $scope.rdRestrictionCurrentDetail.vias.length; i++) {
                        highLightFeatures.push({
                            id: $scope.rdRestrictionCurrentDetail.vias[i].linkPid.toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: { color: 'blue' }
                        });
                    }
                    highLightFeatures.push({
                        id: $scope.rdRestrictionCurrentDetail.outLinkPid.toString(),
                        layerid: 'rdLink',
                        type: 'line',
                        style: { color: '#CD0000' }
                    });
                    highRenderCtrl.highLightFeatures = highLightFeatures;
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.drawHighlight();
                } else {
                    tooltipsCtrl.onRemoveTooltip();
                    tooltipsCtrl.setCurrentTooltip('程序计算失败，请重新选择！');
                }
                $scope.$emit('showFullLoadingOrNot', false);
            });
        });
    }

    /**
     *高亮所有关连要素;
     */
    function highLightRestrictAll() {
        highRenderCtrl.highLightFeatures = [];
        rdRestrictionHighLightArrayAdd($scope.rdRestrictCurrentData.inLinkPid, 'inLine');
        rdRestrictionHighLightArrayAdd($scope.rdRestrictCurrentData.nodePid, 'inNode');
        rdRestrictionHighLightArrayAdd($scope.rdRestrictionCurrentDetail.outLinkPid, 'outLine');
        rdRestrictionHighLightArrayAdd($scope.rdRestrictCurrentData.pid, 'icon');
        for (var i = 0; i < $scope.rdRestrictionCurrentDetail.vias.length; i++) {
            rdRestrictionHighLightArrayAdd($scope.rdRestrictionCurrentDetail.vias[i].linkPid, 'linkLine');
        }
        highRenderCtrl._cleanHighLight();
        highRenderCtrl.drawHighlight();
    }

    /**
     *
     * @param Pid
     * @param type 经过线 进入点 关系图标 退出线 经过线
     */
    function rdRestrictionHighLightArrayAdd(Pid, type) {
        if (!isNaN(Pid)) { Pid = Pid.toString(); }
        if (type == 'inLine') {
            highRenderCtrl.highLightFeatures.push({
                id: Pid,
                layerid: 'rdLink',
                type: 'line',
                style: { color: 'green' }
            });
        } else if (type == 'inNode') {
            highRenderCtrl.highLightFeatures.push({
                id: Pid,
                layerid: 'rdLink',
                type: 'node',
                style: { color: 'yellow' }
            });
        } else if (type == 'outLine') {
            highRenderCtrl.highLightFeatures.push({
                id: Pid,
                layerid: 'rdLink',
                type: 'line',
                style: { color: 'red' }
            });
        } else if (type == 'linkLine') {
            highRenderCtrl.highLightFeatures.push({
                id: Pid,
                layerid: 'rdLink',
                type: 'line',
                style: { color: 'blue' }
            });
        } else if (type == 'icon') {
            highRenderCtrl.highLightFeatures.push({
                id: Pid,
                layerid: 'relationData',
                type: 'relationData',
                style: {}
            });
        } else {
            alert('传参错误');
        }
    }

    function removeTipsActive() {
        $.each($('.show-tips'), function (i, v) {
            $(v).removeClass('active');
        });
    }


    /* --------------------------------------------------------------------------时间控件--------------------------------------------------------------------------*/

    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT, $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
    // objectController初始化 数据初始化
    if (objectEditCtrl.data === null) {
        $scope.rdRestrictionCurrentDetail = {};
    } else {
        $scope.initializeData();
    }
}]);

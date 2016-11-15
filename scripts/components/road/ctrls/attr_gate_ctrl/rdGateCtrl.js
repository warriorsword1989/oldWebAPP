/**
 * Created by mali on 2016/7/20.
 */
angular.module('app').controller('rdGateController', ['$scope', 'appPath', 'dsEdit', '$timeout', '$ocLazyLoad', function ($scope, appPath, dsEdit, $timeout, $ocLazyLoad) {
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var relationData = layerCtrl.getLayerById('relationData');
    var eventController = fastmap.uikit.EventController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var toolTipsCtrl = fastmap.uikit.ToolTipsController();
    var editLayer = layerCtrl.getLayerById('edit');
    $scope.gateTypeOptions = {
        0: 'EG',
        1: 'KG',
        2: 'PG'
    };

    $scope.gateDirOptions = {
        0: '未调查',
        1: '单向',
        2: '双向'

    };

    $scope.gateFeeOptions = {
        0: '免费',
        1: '收费'
    };
    $scope.gateValidObj = {
		 0: '机动车辆',
        1: '行人'
    };

    $scope.addLimitTruck = function () {
        $scope.rdGateData.condition.unshift(fastmap.dataApi.rdGateCondition({ pid: $scope.rdGateData.pid }));
    };
    $scope.showGateInfo = function (index) {
        var showBlackObj = { // 这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
            loadType: 'subAttrTplContainer',
            propertyCtrl: appPath.road + 'ctrls/blank_ctrl/blankCtrl',
            propertyHtml: appPath.root + appPath.road + 'tpls/blank_tpl/blankTpl.html',
            callback: function () {
                var showNamesObj = {
                    loadType: 'subAttrTplContainer',
                    propertyCtrl: appPath.road + 'ctrls/attr_gate_ctrl/limitOfGateCtrl',
                    propertyHtml: appPath.root + appPath.road + 'tpls/attr_gate_tpl/limitOfGateTpl.html',
                    data: index + '' // 必须将数字转成字符串
                };
                $scope.$emit('transitCtrlAndTpl', showNamesObj);
            }
        };
        $scope.$emit('transitCtrlAndTpl', showBlackObj);


        // var showGateInfo = {
        //     "loadType": "subAttrTplContainer",
        //     "propertyCtrl": 'scripts/components/road/ctrls/attr_gate_ctrl/limitOfGateCtrl',
        //     "propertyHtml": '../../../scripts/components/road/tpls/attr_gate_tpl/limitOfGateTpl.html',
        //     data: item
        // };
        // $scope.$emit("transitCtrlAndTpl", showGateInfo);
    };
    $scope.initializeData = function () {
        if ($scope.rdGateForm) {
            $scope.rdGateForm.$setPristine();
        }

        $scope.rdGateData = {};
        var highLightFeatures = [];
        $scope.rdGateData = objectEditCtrl.data;
        objectEditCtrl.setOriginalData(objectEditCtrl.data.getIntegrate());
        highRenderCtrl._cleanHighLight();
        highRenderCtrl.highLightFeatures = [];
        highLightFeatures.push({
            id: $scope.rdGateData.inLinkPid.toString(),
            layerid: 'rdLink',
            type: 'line',
            style: {
                strokeWidth: 3,
                color: '#008000'
            }
        });
        highLightFeatures.push({
            id: $scope.rdGateData.outLinkPid.toString(),
            layerid: 'rdLink',
            type: 'line',
            style: {}
        });
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
    };

    if (objectEditCtrl.data) {
        $scope.initializeData();
    }
    objectEditCtrl.nodeObjRefresh = function (flag) {
        $scope.initialForms();
    };
    $scope.loadJsAndCtrl = function (obj) {
        $scope.$emit('transitCtrlAndTpl', obj);
    };
    $scope.minusLimit = function (id, index) {
        $scope.rdGateData.condition.splice(id, 1);
    };
    $scope.save = function () {
        objectEditCtrl.save();
        if (!objectEditCtrl.changedProperty) {
            swal('操作成功', '属性值没有变化！', 'success');
            return;
        }
        if (objectEditCtrl.changedProperty && objectEditCtrl.changedProperty.forms && objectEditCtrl.changedProperty.forms.length > 0) {
            $.each(objectEditCtrl.changedProperty.forms, function (i, v) {
                if (v.linkPid || v.pid) {
                    delete v.linkPid;
                    delete v.pid;
                }
            });
            objectEditCtrl.changedProperty.forms.filter(function (v) {
                return v;
            });
        }
        dsEdit.update($scope.rdGateData.pid, 'RDGATE', objectEditCtrl.changedProperty).then(function (data) {
            if (data) {
                relationData.redraw();
                dsEdit.getByPid($scope.rdGateData.pid, 'RDGATE').then(function (ret) {
                    if (ret) {
                        objectEditCtrl.setCurrentObject('RDGATE', ret);
                        objectEditCtrl.setOriginalData(objectEditCtrl.data.getIntegrate());
                    }
                });
                $scope.$emit('SWITCHCONTAINERSTATE', { subAttrContainerTpl: false });
                if (shapeCtrl.shapeEditorResult.getFinalGeometry() !== null) {
                    if (typeof map.currentTool.cleanHeight === 'function') {
                        map.currentTool.cleanHeight();
                    }
                    if (toolTipsCtrl.getCurrentTooltip()) {
                        toolTipsCtrl.onRemoveTooltip();
                    }
                    editLayer.drawGeometry = null;
                    editLayer.clear();
                    shapeCtrl.stopEditing();
                    editLayer.bringToBack();
                    $(editLayer.options._div).unbind();
                }
            }
        });
    };

    $scope.delete = function () {
        dsEdit.delete($scope.rdGateData.pid, 'RDGATE').then(function (data) {
            if (data) {
            	relationData.redraw();
                $scope.rdGateData = null;
                // var editorLayer = layerCtrl.getLayerById("edit");
                // editorLayer.clear();
                highRenderCtrl._cleanHighLight(); // 清空高亮
                highRenderCtrl.highLightFeatures.length = 0;
            }
            $scope.$emit('SWITCHCONTAINERSTATE', { attrContainerTpl: false, subAttrContainerTpl: false });
        });
    };
    $scope.cancel = function () {

    };
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT, $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
}]);

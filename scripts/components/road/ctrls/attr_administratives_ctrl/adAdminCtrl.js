/**
 * Created by zhaohang on 2016/4/5.
 */
var adAdminZone = angular.module('app');
adAdminZone.controller('adAdminController', ['$scope', 'appPath', 'dsEdit', function ($scope, appPath, dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var outputCtrl = fastmap.uikit.OutPutController({});
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var editLayer = layerCtrl.getLayerById('edit');
    var adAdmin = layerCtrl.getLayerById('adAdmin');
    var selectCtrl = fastmap.uikit.SelectController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var toolTipsCtrl = fastmap.uikit.ToolTipsController();
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    $scope.isbase = true;

    // 行政类型
    $scope.adminType = [
        { id: 0, label: '国家地区级' },
        { id: 1, label: '省/直辖市/自治区' },
        { id: 2, label: '地级市/自治州/省直辖县' },
        { id: 2.5, label: 'DUMMY 地级市' },
        { id: 3, label: '地级市市区(GCZone)' },
        { id: 3.5, label: '地级市市区(未作区界)' },
        { id: 4, label: '区县/自治县' },
        { id: 4.5, label: 'DUMMY 区县' },
        { id: 4.8, label: 'DUMMY 区县(地级市下无区县)' },
        { id: 5, label: '区中心部' },
        { id: 6, label: '城镇/街道' },
        { id: 7, label: '飞地' },
        { id: 8, label: 'KDZone' },
        { id: 9, label: 'AOI' }
    ];
    // 代表点标识
    $scope.capital = [
        { id: 0, label: '未定义' },
        { id: 1, label: '首都' },
        { id: 2, label: '省会/直辖市' },
        { id: 3, label: '地级市' }
    ];

    /**
     * 初始化数据
     */
    $scope.initializeData = function () {
        $scope.adAdminData = objCtrl.data;// 获取数据
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());// 记录原始数据值
        var linkArr = $scope.adAdminData.geometry.coordinates;
        var points = fastmap.mapApi.point(linkArr[0], linkArr[1]);
        selectCtrl.onSelected({// 记录选中点信息
            geometry: points,
            id: $scope.adAdminData.pid
        });

        // 高亮行政区划代表点
        var highLightFeatures = [];
        highLightFeatures.push({
            id: $scope.adAdminData.pid.toString(),
            layerid: 'adAdmin',
            type: 'adadmin',
            style: { src: '../../images/road/img/heightStar.svg' }
        });
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
        // 回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if ($scope.adAdminForm) {
            $scope.adAdminForm.$setPristine();
        }
    };
    if (objCtrl.data) {
        $scope.initializeData();
    }

    $scope.cancel = function () {

    };


    /**
     * 名称属性页面
     */
    $scope.otherAdminName = function () {
        var showOtherObj = {
            loadType: 'subAttrTplContainer',
            propertyCtrl: appPath.road + 'ctrls/attr_administratives_ctrl/adAdminNameCtrl',
            propertyHtml: appPath.root + appPath.road + 'tpls/attr_adminstratives_tpl/adAdminNameTpl.html'
        };
        $scope.$emit('transitCtrlAndTpl', showOtherObj);
    };

    /**
     * 层级属性页面
     * @param boolValue
     */
    $scope.clickBasic = function (boolValue) {
        $scope.isbase = boolValue;
        if (!$scope.isbase) {
            var showOrdinaryObj = {
                loadType: 'subAttrTplContainer',
                propertyCtrl: appPath.road + 'ctrls/attr_administratives_ctrl/adAdminOfLevelCtrl',
                propertyHtml: appPath.root + appPath.road + 'tpls/attr_adminstratives_tpl/adAdminOfLevelTpl.html'
            };
            $scope.$emit('transitCtrlAndTpl', showOrdinaryObj);
        }
    };

    // 保存
    $scope.save = function () {
        objCtrl.save();
        if (!objCtrl.changedProperty) {
            swal('操作成功', '属性值没有变化！', 'success');
            return;
        }
        dsEdit.update($scope.adAdminData.pid, 'ADADMIN', objectEditCtrl.changedProperty).then(function (data) {
            if (data) {
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
                objectEditCtrl.setOriginalData(objectEditCtrl.data.getIntegrate());
            }
        });
    };

    // 删除
    $scope.delete = function () {
        dsEdit.delete($scope.adAdminData.pid, 'ADADMIN').then(function (data) {
            if (data) {
                adAdmin.redraw();
                $scope.adAdminData = null;
                highRenderCtrl._cleanHighLight(); // 清空高亮
            }
            $scope.$emit('SWITCHCONTAINERSTATE', { attrContainerTpl: false, subAttrContainerTpl: false });
        });
    };
    // 监听保存 删除 取消 初始化
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT, $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
}]);

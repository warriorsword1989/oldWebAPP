/**
 * Created by linglong on 2016/8/15.
 */
var rdElectronicEyeApp = angular.module('app');
rdElectronicEyeApp.controller('mileagepileController', ['$scope', 'dsEdit', '$ocLazyLoad', '$timeout', function ($scope, dsEdit, $ocLazyLoad, $timeout) {
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var relationData = layerCtrl.getLayerById('relationData');
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.direct = [
        { id: 0, label: '双向', isSelect: false },
        { id: 1, label: '上行', isSelect: false },
        { id: 2, label: '下行', isSelect: false }
    ];
    $scope.roadType = [
        { id: 1, label: '高速' },
        { id: 2, label: '国道' },
        { id: 3, label: '省道' }
    ];
    $scope.source = [
        {id: 1, label: '外业采集'},
        {id: 2, label: '内插制作'},
        {id: 3, label: '外业采集'}
    ]

    // 初始化函数;
    $scope.initializeData = function () {
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        $scope.mileagepile = objCtrl.data;
        var geo = {};
        geo.points = [];
        geo.points.push(fastmap.mapApi.point($scope.mileagepile.geometry.coordinates[0], $scope.mileagepile.geometry.coordinates[1]));
        geo.components = geo.points;
        geo.type = 'Mileagepile';
        selectCtrl.onSelected({
            geometry: geo,
            id: $scope.mileagepile.pid,
            linkPid: $scope.mileagepile.linkPid,
            type: 'Marker',
            direct: $scope.mileagepile.direct,
            point: $scope.mileagepile.geometry.coordinates
        });
        //高亮关系;
        highRenderCtrl.highLightFeatures.length = 0;
        highRenderCtrl.highLightFeatures.push({
            id: $scope.mileagepile.linkPid.toString(),
            layerid: 'rdLink',
            type: 'line',
            style: { size: 5 }
        });
        highRenderCtrl.highLightFeatures.push({
            id: $scope.mileagepile.pid.toString(),
            layerid: 'relationData',
            type: 'relationData',
            style: {}
        });
        highRenderCtrl.drawHighlight();
        if ($scope.variableSpeedForm) {
            $scope.variableSpeedForm.$setPristine();
        }
    };


    $scope.save = function () {
        $scope.mileagepile.mileageNum = parseFloat($scope.mileagepile.mileageNum);
        objCtrl.save();
        if (!objCtrl.changedProperty) {
            swal('提示', '属性值没有变化！', 'warning');
            return;
        }
        var param = {
            command: 'UPDATE',
            type: 'RDMILEAGEPILE',
            dbId: App.Temp.dbId,
            data: objCtrl.changedProperty
        };
        dsEdit.save(param).then(function (data) {
            if (data) {
                relationData.redraw();
                $scope.initializeData();
                if ($scope.variableSpeedForm) {
                    $scope.variableSpeedForm.$setPristine();
                }
            }
        });
    };

    /**
     * 删除里程桩
     */
    $scope.delete = function () {
        var param = {
            command: 'DELETE',
            type: 'RDMILEAGEPILE',
            dbId: App.Temp.dbId,
            objId: parseInt($scope.mileagepile.pid)
        };
        dsEdit.save(param).then(function (data) {
            if (data) {
                $scope.variableSpeed = null;
                relationData.redraw();
                highRenderCtrl.highLightFeatures = null;
                highRenderCtrl._cleanHighLight();
                $scope.$emit('SWITCHCONTAINERSTATE', {
                    subAttrContainerTpl: false,
                    attrContainerTpl: false
                });
            }
        });
        if (map.floatMenu) {
            map.removeLayer(map.floatMenu);
            map.floatMenu = null;
        }
    };

    $scope.cancel = function () {};

    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT, $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);// SELECTEDFEATURETYPECHANGE
    if (objCtrl.data) {
        $scope.initializeData();
    }
}]);

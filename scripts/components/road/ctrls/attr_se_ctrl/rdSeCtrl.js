/**
 * Created by wangmingdong on 2016/8/8.
 */

var rdTrafficSignalApp = angular.module('app');
rdTrafficSignalApp.controller('SeCtl', ['$scope', 'dsEdit', function ($scope, dsEdit) {
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var relationData = layerCtrl.getLayerById('relationData');
    var selectCtrl = fastmap.uikit.SelectController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    $scope.initializeData = function () {
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        $scope.seData = objCtrl.data;
        var highLightFeatures = [];
        highLightFeatures.push({
            id: $scope.seData.inLinkPid.toString(),
            layerid: 'rdLink',
            type: 'line',
            style: {
                color: '#21ed25'
            }
        });
        highLightFeatures.push({
            id: $scope.seData.nodePid.toString(),
            layerid: 'rdLink',
            type: 'node',
            style: {
                color: 'yellow'
            }
        });
        highLightFeatures.push({
            id: $scope.seData.outLinkPid.toString(),
            layerid: 'rdLink',
            type: 'line',
            style: {
                size: 5
            }
        });
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
    };
    $scope.initializeData();
    $scope.refreshData = function () {
        dsEdit.getByPid(parseInt($scope.seData.pid), 'RDSE').then(function (data) {
        	if (data) {
            objCtrl.setCurrentObject('RDSE', data);
            $scope.initializeData();
        }
        });
    };

    $scope.save = function () {
        objCtrl.save();
        if (!objCtrl.changedProperty) {
            swal('操作成功', '属性值没有变化！', 'success');
            return;
        }
        var param = {
            command: 'UPDATE',
            type: 'RDSE',
            dbId: App.Temp.dbId,
            data: objCtrl.changedProperty
        };
        dsEdit.save(param).then(function (data) {
            if (data) {
                if (selectCtrl.rowkey) {
                    var stageParam = {
                        rowkey: selectCtrl.rowkey.rowkey,
                        stage: 3,
                        handler: 0
                    };
                    dsFcc.changeDataTipsState(JSON.stringify(stageParam)).then(function (data) {
                        selectCtrl.rowkey.rowkey = undefined;
                    });
                }
                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                relationData.redraw();
            }
            $scope.refreshData();
        });
    };

    $scope.delete = function () {
        var objId = parseInt($scope.seData.pid);
        var param = {
            command: 'DELETE',
            type: 'RDSE',
            dbId: App.Temp.dbId,
            objId: objId
        };
        dsEdit.save(param).then(function (data) {
            var info = null;
            if (data) {
                $scope.seData = null;
                relationData.redraw();
                highRenderCtrl._cleanHighLight();
            }
        });
    };
    $scope.cancel = function () {
    };
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT, $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
}]);

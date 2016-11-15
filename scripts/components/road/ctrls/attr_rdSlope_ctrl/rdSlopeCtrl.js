/**
 * Created by liuyang on 2016/7/26.
 */

var rdSlopeApp = angular.module('app');
rdSlopeApp.controller('rdSlopeCtl', ['$scope', 'dsEdit', function ($scope, dsEdit) {
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var relationData = layerCtrl.getLayerById('relationData');
    var selectCtrl = fastmap.uikit.SelectController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var editLayer = layerCtrl.getLayerById('edit');
    $scope.initializeData = function () {
        $scope.slopeData = objCtrl.data;
        $scope.slopeData.slopeVias.sort(function (a, b) {
            return a.seqNum < b.seqNum ? -1 : 1;
        });
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        var highLightFeatures = [];
        selectCtrl.onSelected({
            id: $scope.slopeData.pid
        });
        highLightFeatures.push({
            id: $scope.slopeData.linkPid.toString(),
            layerid: 'rdLink',
            type: 'line',
            style: { color: 'red' }
        });
        highLightFeatures.push({
            id: $scope.slopeData.nodePid.toString(),
            layerid: 'rdLink',
            type: 'rdnode',
            style: {}
        });
        var linkArr = $scope.slopeData.slopeVias,
            points = [];
        for (var i = 0, len = linkArr.length; i < len; i++) {
            highLightFeatures.push({
                id: linkArr[i].linkPid.toString(),
                layerid: 'rdLink',
                type: 'line',
                style: {}
            });
        }
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
    };
    if (objCtrl.data) {
        $scope.initializeData();
    }

    $scope.save = function () {
        objCtrl.save();
        if (!objCtrl.changedProperty) {
            swal('操作成功', '属性值没有变化！', 'success');
            return;
        }
        var param = {
            command: 'UPDATE',
            type: 'RDSLOPE',
            dbId: App.Temp.dbId,
            data: objCtrl.changedProperty
        };
        dsEdit.save(param).then(function (data) {
            if (data) {
                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                relationData.redraw();
            }
        });
    };

    $scope.delete = function () {
        var objId = parseInt($scope.slopeData.pid);
        var param = {
            command: 'DELETE',
            type: 'RDSLOPE',
            dbId: App.Temp.dbId,
            objId: objId
        };
        dsEdit.save(param).then(function (data) {
            var info = null;
            if (data) {
                $scope.slopeData = null;
                relationData.redraw();
                if (map.floatMenu) {
                    map.removeLayer(map.floatMenu);
                    map.floatMenu = null;
                }
                highRenderCtrl._cleanHighLight();
                highRenderCtrl.highLightFeatures = [];
                editLayer.clear();
                $scope.$emit('SWITCHCONTAINERSTATE', { attrContainerTpl: false, subAttrContainerTpl: false });
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

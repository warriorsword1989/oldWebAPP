/**
 * Created by liuyang on 2016/8/12.
 */

var crfRoadApp = angular.module('app');
crfRoadApp.controller('crfRoadCtrl', ['$scope', 'dsEdit', function ($scope, dsEdit) {
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var crfData = layerCtrl.getLayerById('crfData');
    var selectCtrl = fastmap.uikit.SelectController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var editLayer = layerCtrl.getLayerById('edit');
    $scope.initializeData = function () {
        $scope.crfRoadData = objCtrl.data;
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        var highLightFeatures = [];
        selectCtrl.onSelected({
            id: $scope.crfRoadData.pid
        });
        var linkArr = $scope.crfRoadData.links;
        for (var i = 0, len = linkArr.length; i < len; i++) {
            highLightFeatures.push({
                id: linkArr[i].linkPid.toString(),
                layerid: 'rdLink',
                type: 'line',
                style: { color: '#00EC00' }
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
        swal('操作成功', '属性值没有变化！', 'success');
        return;
    };

    $scope.delete = function () {
        var objId = parseInt($scope.crfRoadData.pid);
        var param = {
            command: 'DELETE',
            type: 'RDROAD',
            dbId: App.Temp.dbId,
            objId: objId
        };
        dsEdit.save(param).then(function (data) {
            var info = null;
            if (data) {
                $scope.crfRoadData = null;
                crfData.redraw();
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

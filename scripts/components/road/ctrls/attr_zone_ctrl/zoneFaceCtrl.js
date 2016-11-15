/**
 * Created by liuyang on 2016/6/29.
 */
var zoneFaceApp = angular.module('app');
zoneFaceApp.controller('zoneFaceController', ['$scope', 'dsEdit', function ($scope, dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var zoneFace = layerCtrl.getLayerById('zoneFace');
    var outputCtrl = fastmap.uikit.OutPutController({});
    // 初始化
    $scope.initializeData = function () {
        $scope.zoneFaceData = objCtrl.data;// 获取数据
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());// 存储原始数据
        // 回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if ($scope.zoneFaceForm) {
            $scope.zoneFaceForm.$setPristine();
        }

        // 高亮zoneface
        var highLightFeatures = [];
        highLightFeatures.push({
            id: $scope.zoneFaceData.pid.toString(),
            layerid: 'zoneFace',
            type: 'zoneFace',
            style: {}
        });
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
    };
    if (objCtrl.data) {
        $scope.initializeData();
    }
    $scope.save = function () {
        $scope.$emit('SWITCHCONTAINERSTATE', { attrContainerTpl: false, subAttrContainerTpl: false });
    };

    /**
     *
     */
    $scope.setZoneID = function () {
        $scope.$emit('showFullLoadingOrNot', true);
        var param = {};
        param.pid = $scope.zoneFaceData.pid;
        param.ruleId = 'BATCHZONEID';
        dsEdit.PolygonBatchWork(param).then(function (data) {
            if (typeof data === 'string') {
                $scope.$emit('showFullLoadingOrNot', false);
                swal('不存在需要批处理的link数据', data, 'warning');
            } else {
                $scope.$emit('showFullLoadingOrNot', false);
                swal('赋ZoneID批处理成功：', '处理了' + data.log.length + '条数据', 'success');
            }
        });
    };
    /**
     *
     */
    $scope.deleteZoneID = function () {
        $scope.$emit('showFullLoadingOrNot', true);
        var param = {};
        param.pid = $scope.zoneFaceData.pid;
        param.ruleId = 'BATCHDELZONEID';
        dsEdit.PolygonBatchWork(param).then(function (data) {
            if (typeof data === 'string') {
                $scope.$emit('showFullLoadingOrNot', false);
                swal('不存在需要批处理的link数据', data, 'warning');
            } else {
                $scope.$emit('showFullLoadingOrNot', false);
                swal('删除ZoneID批处理成功：', '处理了' + data.log.length + '条数据', 'success');
            }
        });
    };

    // 删除
    $scope.delete = function () {
        dsEdit.delete($scope.zoneFaceData.pid, 'ZONEFACE').then(function (data) {
            if (data) {
                zoneFace.redraw();// 重绘
                $scope.zoneFaceData = null;
                highRenderCtrl._cleanHighLight();
                highRenderCtrl.highLightFeatures.length = 0;
                var editorLayer = layerCtrl.getLayerById('edit');
                editorLayer.clear();
                $scope.$emit('SWITCHCONTAINERSTATE', { attrContainerTpl: false, subAttrContainerTpl: false });
            }
        });
    };
    $scope.cancel = function () {

    };
    // 监听保存，修改,删除，取消，和初始化
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT, $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
}]);

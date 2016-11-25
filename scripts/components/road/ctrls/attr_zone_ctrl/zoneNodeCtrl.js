/**
 * Created by liuyang on 2016/6/29.
 */
var zoneNodeApp = angular.module('app');
zoneNodeApp.controller('zoneNodeController', ['$scope', 'dsEdit', function ($scope, dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var zoneLink = layerCtrl.getLayerById('zoneLink');
    var zoneNode = layerCtrl.getLayerById('zoneNode');
    var selectCtrl = fastmap.uikit.SelectController();
    var outputCtrl = fastmap.uikit.OutPutController({});
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    // 形态
    $scope.form = [
        { id: 0, label: '无' },
        { id: 1, label: '图廓点' },
        { id: 7, label: '角点' }
    ];
    $scope.editFlag = [
        { id: 0, label: '不可编辑' },
        { id: 1, label: '可编辑' }
    ];
    // 种别
    $scope.kind = [
        { id: 1, label: '平面交叉点' },
        { id: 1, label: 'AOIZone 边界点' },
        { id: 1, label: 'KDZone 边界点' }
    ];
    // 初始化
    $scope.initializeData = function () {
        $scope.zoneNodeData = objCtrl.data;
        // 回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if ($scope.zoneNodeForm) {
            $scope.zoneNodeForm.$setPristine();
        }

        objCtrl.setOriginalData(objCtrl.data.getIntegrate());// 记录原始数据
        var highlightFeatures = [];
        /**
         * 根据点去获取多条zonelink，再高亮点线
         */
        dsEdit.getByCondition({
            dbId: App.Temp.dbId,
            type: 'ZONELINK',
            data: { nodePid: $scope.zoneNodeData.pid }
        }).then(function (data) {
            if (data.errcode === -1) {
                return;
            }
            var lines = [];
            $scope.linepids = [];
            // 获取点连接的线
            for (var index in data.data) {
                var linkArr = data.data[index].geometry.coordinates || data[index].geometry.coordinates,
                    points = [];
                for (var i = 0, len = linkArr.length; i < len; i++) {
                    var point = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
                    points.push(point);
                }
                lines.push(fastmap.mapApi.lineString(points));
                $scope.linepids.push(data.data[index].pid);
                highlightFeatures.push({
                    id: data.data[index].pid.toString(),
                    layerid: 'zoneLink',
                    type: 'line',
                    style: {}
                });
            }
            var multiPolyLine = fastmap.mapApi.multiPolyline(lines);
            // 存储选择的数据
            selectCtrl.onSelected({ geometry: multiPolyLine, id: $scope.zoneNodeData.pid });
            // 高亮点和线
            highlightFeatures.push({
                id: $scope.zoneNodeData.pid.toString(),
                layerid: 'zoneLink',
                type: 'node',
                style: {}
            });
            highRenderCtrl.highLightFeatures = highlightFeatures;
            highRenderCtrl.drawHighlight();
        });
    };
    if (objCtrl.data) {
        $scope.initializeData();
    }
    // 保存
    $scope.save = function () {
        objCtrl.save();
        var param = {
            command: 'UPDATE',
            type: 'ZONENODE',
            dbId: App.Temp.dbId,
            data: objCtrl.changedProperty
        };
        if (!objCtrl.changedProperty) {
            swal('操作成功', '属性值没有变化！', 'success');
            return;
        }
        if (objCtrl.changedProperty && objCtrl.changedProperty.forms && objCtrl.changedProperty.forms.length > 0) {
            $.each(objCtrl.changedProperty.forms, function (i, v) {
                if (v.linkPid || v.pid) {
                    delete v.linkPid;
                    delete v.pid;
                }
            });
            objCtrl.changedProperty.forms.filter(function (v) {
                return v;
            });
        }

        dsEdit.save(param).then(function (data) {
            if (data) {
                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                zoneLink.redraw();
                zoneNode.redraw();
            }
        });
    };
    // 删除
    $scope.delete = function () {
        var pid = parseInt($scope.zoneNodeData.pid);
        var param =
            {
                command: 'DELETE',
                type: 'ZONENODE',
                dbId: App.Temp.dbId,
                objId: pid
            };
        // 结束编辑状态
        dsEdit.save(param).then(function (data) {
            if (data) {
                zoneLink.redraw();
                zoneNode.redraw();
            }
        });
    };
    $scope.cancel = function () {

    };

    // 监听 保存 删除 取消 初始化
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT, $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
}]);

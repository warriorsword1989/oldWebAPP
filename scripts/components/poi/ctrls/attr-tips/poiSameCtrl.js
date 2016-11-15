/**
 * Created by liuyang on 2016/8/30.
 */
var samePoiApp = angular.module('app', []);
samePoiApp.controller('SamePoiController', ['$scope', '$ocLazyLoad', 'appPath', 'dsEdit', '$timeout', function ($scope, $ocLazyLoad, appPath, dsEdit, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var featCodeCtrl = fastmap.uikit.FeatCodeController();
    var layerCtrl = fastmap.uikit.LayerController();
    var poiLayer = layerCtrl.getLayerById('poi');
    var transform = new fastmap.mapApi.MecatorTranform();

    $scope.sameRelationshap = null;
    $scope.poiSameMeta = null;
    $scope.same = {};
    $scope.same.sameTplShow = false; // 用于控制同一POI制作面板是否显示

    $scope.$on('showSamePoishap', function (data) {
        $scope.initializeData();
    });

    /**
     * 初始化方法
     */
    $scope.initializeData = function () {
        $scope.same.sameTplShow = true;
        $scope.sameRelationshap = featCodeCtrl.getFeatCode().data;
        $scope.poiSameMeta = featCodeCtrl.getFeatCode().meta;
        $scope.same.sameNameList = [];
        for (var i = 0, len = $scope.sameRelationshap.length; i < len; i++) {
            if ($scope.sameRelationshap[i].properties.kindCode != undefined) {
                $scope.same.sameNameList.push({
                    id: $scope.sameRelationshap[i].properties.id,
                    name: $scope.sameRelationshap[i].properties.name,
                    kindName: $scope.poiSameMeta.kindFormat[$scope.sameRelationshap[i].properties.kindCode].kindName,
                    kindCode: $scope.sameRelationshap[i].properties.kindCode,
                    geo: $scope.sameRelationshap[i].point
                });
            }
        }
    };

    $scope.initializeData();

    $scope.minusSamePoi = function (num) {
        if ($scope.same.sameNameList.length == 1) {
            $scope.same.sameNameList.splice(num, 1);
            $scope.same.sameTplShow = false;
        } else {
            $scope.same.sameNameList.splice(num, 1);
        }
    };

    /**
     * 保存
     */
    $scope.saveSame = function () {
        var ids = [];
        var param = {};
        param.command = 'CREATE';
        param.dbId = App.Temp.dbId;
        param.type = 'IXSAMEPOI';
        $scope.same.sameTplShow = false;

        if ($scope.same.sameNameList.length == 2) {
            if (parseInt($scope.same.sameNameList[0].id) == objCtrl.data.pid || parseInt($scope.same.sameNameList[1].id) == objCtrl.data.pid) {
                var actualDistance = transform.distance($scope.same.sameNameList[0].geo.y, $scope.same.sameNameList[0].geo.x, $scope.same.sameNameList[1].geo.y, $scope.same.sameNameList[1].geo.x);
                if (actualDistance > 5) {
                    swal('操作失败', '组成同一关系的POI距离大于5米', 'info');
                    return;
                } else {
                    for (var i = 0; i < $scope.same.sameNameList.length; i++) {
                        ids.push(parseInt($scope.same.sameNameList[i].id));
                    }
                }
            } else {
                swal('操作失败', '组成同一关系的POI个数不为2', 'info');
                return;
            }
        } else if ($scope.same.sameNameList.length == 1) {
            if (parseInt($scope.same.sameNameList[0].id) != objCtrl.data.pid) {
                var actualDistance = transform.distance($scope.same.sameNameList[0].geo.y, $scope.same.sameNameList[0].geo.x, objCtrl.data.geometry.coordinates[1], objCtrl.data.geometry.coordinates[0]);
                if (actualDistance > 5) {
                    swal('操作失败', '组成同一关系的POI距离大于5米', 'info');
                    return;
                } else {
                    ids.push(parseInt($scope.same.sameNameList[0].id));
                    ids.push(objCtrl.data.pid);
                }
            } else {
                swal('操作失败', '组成同一关系的POI个数不为2', 'info');
                return;
            }
        } else {
            swal('操作失败', '组成同一关系的POI个数不为2', 'info');
            return;
        }

        param.poiPids = ids;
        dsEdit.save(param).then(function (data) {
            if (data != null) {
                poiLayer.redraw();
                map.currentTool.disable();
                swal('操作成功', '创建POI同一关系成功', 'success');
                dsEdit.getByPid(objCtrl.data.pid, 'IXPOI').then(function (rest) {
                    if (rest) {
                        objCtrl.setCurrentObject('IXPOI', rest);
                        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                    }
                });
            }
        });
    };

    /**
     * 取消
     */
    $scope.clearSame = function () {
        $scope.same = {};
        $scope.same.sameTplShow = false;
        // highRenderCtrl.highLightFeatures = [];
        // highRenderCtrl._cleanHighLight();
    };
}]);

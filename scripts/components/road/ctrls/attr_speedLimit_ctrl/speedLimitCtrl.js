/**
 * Created by liuzhaoxia on 2015/12/11.
 */

var selectApp = angular.module("app");
selectApp.controller("speedlimitTeplController", ['$scope', '$timeout', '$ocLazyLoad', 'dsEdit', function ($scope, $timeout, $ocLazyLoad, dsEdit) {
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    var outputCtrl = fastmap.uikit.OutPutController({});
    var layerCtrl = fastmap.uikit.LayerController();
    var selectCtrl = fastmap.uikit.SelectController();
    var speedLimit = layerCtrl.getLayerById('relationData');
    var eventController = fastmap.uikit.EventController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();

    $scope.carSpeedType = false;
    $scope.initializeData = function () {
        $scope.speedLimitData = objectEditCtrl.data;
        objectEditCtrl.setOriginalData(objectEditCtrl.data.getIntegrate());
        $scope.speedLimitGeometryData = objectEditCtrl.data.geometry;
        highRenderCtrl.highLightFeatures.push({
            id: $scope.speedLimitData.linkPid.toString(),
            layerid: 'rdLink',
            type: 'line',
            style: {}
        });
        highRenderCtrl.highLightFeatures.push({
            id: $scope.speedLimitData.pid,
            layerid: 'relationData',
            type: 'relationData',
            style: {}
        });
        highRenderCtrl.drawHighlight();
        var geo = {};
        geo.points = [];
        geo.points.push(fastmap.mapApi.point($scope.speedLimitData.geometry.coordinates[0], $scope.speedLimitData.geometry.coordinates[1]));
        geo.components = geo.points;
        geo.type = "SpeedLimit";
        selectCtrl.onSelected({
            geometry: geo,
            id: $scope.speedLimitData.pid,
            linkPid:$scope.speedLimitData.linkPid,
            type: "Marker",
            direct: $scope.speedLimitData.direct,
            point: $scope.speedLimitData.geometry.coordinates
        });

        //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if ($scope.speedLimitForm) {
            $scope.speedLimitForm.$setPristine();
        }
    };
    if (objectEditCtrl.data) {
        $scope.initializeData();
    }
    $scope.speedTypeOptions = [
        {"id": 0, "label": "普通"},
        {"id": 1, "label": "指示牌"},
        {"id": 3, "label": "特定条件"},
        {"id": 4, "label": "车道限速"}
    ];
    $scope.speedDirectTypeOptions = [
        {"id": 0, "label": "0  未调查"},
        {"id": 2, "label": "2 顺方向"},
        {"id": 3, "label": "3 逆方向"}
    ];
    $scope.speedDependentOption = [
        {"id": 0, "label": "0  无"},
        {"id": 1, "label": "1 雨天(Rain)"},
        {"id": 2, "label": "2 雪天(Snow)"},
        {"id": 3, "label": "3 雾天(Fog)"},
        {"id": 6, "label": "6 学校(School)"},
        {"id": 10, "label": "10 时间限制"},
        {"id": 11, "label": "11 车道限制"},
        {"id": 12, "label": "12 季节时段"},
        {"id": 13, "label": "13 医院"},
        {"id": 14, "label": "14 购物"},
        {"id": 15, "label": "15 居民区"},
        {"id": 16, "label": "16 企事业单位"},
        {"id": 17, "label": "17 景点景区"},
        {"id": 18, "label": "18 交通枢纽"}
    ];
    $scope.limitSrcOption = [
        {"id": 0, "label": "0  无"},
        {"id": 1, "label": "1 现场标牌"},
        {"id": 2, "label": "2 城区标识"},
        {"id": 3, "label": "3 高速标识"},
        {"id": 4, "label": "4 车道限速"},
        {"id": 5, "label": "5 方向限速"},
        {"id": 6, "label": "6 机动车限速"},
        {"id": 7, "label": "7 匝道未调查"},
        {"id": 8, "label": "8 缓速行驶"},
        {"id": 9, "label": "9 未调查"}
    ];
    $scope.speedLimitValue = $scope.speedLimitData.speedValue / 10;
    $timeout(function () {
        $ocLazyLoad.load('scripts/components/tools/fmTimeComponent/fmdateTimer').then(function () {
            $scope.dateURL = '../../../scripts/components/tools/fmTimeComponent/fmdateTimer.html';
            /*查询数据库取出时间字符串*/
            var tmpStr = $scope.speedLimitData.timeDomain;
            //$scope.fmdateTimer(tmpStr);
        });
    });
    /*时间控件*/
    $scope.fmdateTimer = function (str) {
        $scope.$on('get-date', function (event, data) {
            $scope.codeOutput = data;
            $scope.speedLimitData.timeDomain = data;
        });
        $timeout(function () {
            $scope.$broadcast('set-code', str);
            $scope.codeOutput = str;
            $scope.speedLimitData.timeDomain = str;
            $scope.$apply();
        }, 100);
    };

    $scope.save = function () {
        objectEditCtrl.save();
        var param = {
            "command": "UPDATE",
            "type": "RDSPEEDLIMIT",
            "dbId": App.Temp.dbId,
            "data": objectEditCtrl.changedProperty
        };

        if (!objectEditCtrl.changedProperty) {
            swal("操作成功", '属性值没有变化！', "success");
            return;
        }

        dsEdit.save(param).then(function (data) {
            if (data) {
                objectEditCtrl.setOriginalData(objectEditCtrl.data.getIntegrate());
                speedLimit.redraw();
            }
        })
    };
    $scope.delete = function () {
        var objId = parseInt($scope.speedLimitData.pid);
        var param = {
            "command": "DELETE",
            "type": "RDSPEEDLIMIT",
            "dbId": App.Temp.dbId,
            "objId": objId
        };
        dsEdit.save(param).then(function (data) {
            if (data) {
                speedLimit.redraw();
                $scope.speedLimitData = null;
                $scope.speedLimitGeometryData = null;
                if (map.floatMenu) {
                    map.removeLayer(map.floatMenu);
                    map.floatMenu = null;
                }
                if (map.currentTool) {
                    map.currentTool.disable();//禁止当前的参考线图层的事件捕获
                }
                shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
                $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false});
            }
        })
    };
    $scope.cancel = function () {

    };

    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT, $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);

}]);

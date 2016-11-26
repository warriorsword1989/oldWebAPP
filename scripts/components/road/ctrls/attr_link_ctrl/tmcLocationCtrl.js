/**
 * Created by wangmingdong on 2016/11/22.
 */

angular.module('app').controller('TmcLocationCtl', ['$scope', function ($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = new fastmap.uikit.SelectController();
    var layerCtrl = fastmap.uikit.LayerController();
    var editLayer = layerCtrl.getLayerById('edit');
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    $scope.initTmcLoc = function () {
        // editLayer.clear();
        $scope.tmcLocationData = objCtrl.tmcInfos;
        if ($scope.tmcLocationData.tmcId.toString().length === 8) {
            $scope.loctableCode = $scope.tmcLocationData.tmcId.toString().substr(0, 1);
        } else if ($scope.tmcLocationData.tmcId.toString().length === 9) {
            $scope.loctableCode = $scope.tmcLocationData.tmcId.toString().substr(0, 2);
        }
        highRenderCtrl.clear();
        /* 高亮links */
        for (var i = 0; i < $scope.tmcLocationData.links.length; i++) {
            if ($scope.tmcLocationData.links[i].linkPid === objCtrl.data.pid) {
                highRenderCtrl.highLightFeatures.push({
                    id: parseInt($scope.tmcLocationData.links[i].linkPid).toString(),
                    layerid: 'rdLink',
                    type: 'line',
                    style: {}
                });
            } else {
                highRenderCtrl.highLightFeatures.push({
                    id: parseInt($scope.tmcLocationData.links[i].linkPid).toString(),
                    layerid: 'rdLink',
                    type: 'line',
                    style: {
                        color: 'blue'
                    }
                });
            }
        }
        highRenderCtrl.drawHighlight();
        // 根据经纬度坐标高亮link
        /*var lines = [];
        for (var i = 0; i < $scope.tmcLocationData.links.length; i++) {
            var points = [];
            for (var j = 0; j < $scope.tmcLocationData.links[i].geometry.coordinates.length; j++) {
                var point = fastmap.mapApi.point($scope.tmcLocationData.links[i].geometry.coordinates[j][0], $scope.tmcLocationData.links[i].geometry.coordinates[j][1]);
                points.push(point);
            }
            lines.push(fastmap.mapApi.lineString(points));
        }
        var multiPolyLine = fastmap.mapApi.multiPolyline(lines);
        var sObj = shapeCtrl.shapeEditorResult;
        layerCtrl.pushLayerFront('edit');
        selectCtrl.onSelected({ geometry: multiPolyLine });
        editLayer.drawGeometry = multiPolyLine;
        editLayer.draw(multiPolyLine, editLayer);
        sObj.setOriginalGeometry(multiPolyLine);
        sObj.setFinalGeometry(multiPolyLine);*/
    };
    /* 位置方向 */
    $scope.locDirectOptions = [
        { id: 0, label: '初始值' },
        { id: 1, label: '+(位置点外，西东南北和顺时针方向)' },
        { id: 2, label: '-(位置点外，东西北南和逆时针)' },
        { id: 3, label: 'P(位置点内，西东南北)' },
        { id: 4, label: 'N(位置点内，东西北南)' }
    ];
    /* 方向关系 */
    $scope.directOptions = [
        { id: 0, label: '初始值' },
        { id: 1, label: '与Link方向相同' },
        { id: 2, label: '与Link方向相反' }
    ];
    $scope.initTmcLoc();
}]);

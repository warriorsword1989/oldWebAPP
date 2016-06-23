/**
 *
 */
var rwLinkApp = angular.module("app");
rwLinkApp.controller("rwLinkController",["$scope",function($scope) {

    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var adLink = layerCtrl.getLayerById("adLink");
    var adNode=layerCtrl.getLayerById("adnode");
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var editLayer = layerCtrl.getLayerById('edit');
    var toolTipsCtrl = fastmap.uikit.ToolTipsController();
    var outputCtrl = fastmap.uikit.OutPutController({});
    var selectCtrl = fastmap.uikit.SelectController();

    $scope.kind = [
        {"id": 1, "label": "铁路"},
        {"id": 2, "label": "磁悬浮"},
        {"id": 3, "label": "地铁/轻轨"}

    ];
    $scope.form = [
        {"id": 0, "label": "无"},
        {"id": 1, "label": "桥"},
        {"id": 2, "label": "隧道"}

    ];
    $scope.detailFlag = [
        {"id": 0, "label": "不应用"},
        {"id": 1, "label": "只存在于详细区域"},
        {"id": 2, "label": "只存在于广域区域"}
    ];
    $scope.scale = [
        {"id": 0, "label": "2.5w"},
        {"id": 1, "label": "20w"},
        {"id": 2, "label": "100w"}
    ];


    $scope.initializeData = function (){
        $scope.rwLinkData = objCtrl.data;
        //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if($scope.rwLinkForm) {
            $scope.rwLinkForm.$setPristine();
        }

        objCtrl.setOriginalData(objCtrl.data.getIntegrate());//存储原始数据
        var linkArr =$scope.adLinkData.geometry.coordinates, points = [];
        for (var i = 0, len = linkArr.length; i < len; i++) {
            var pointOfLine = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
            points.push(pointOfLine);
        }
        var line = fastmap.mapApi.lineString(points);
        selectCtrl.onSelected({//存储选择数据信息
            geometry: line,
            id: $scope.adLinkData.pid
        });
    }

    /**
     * 初始化方法执行
     */
    if (objCtrl.data) {
        $scope.initializeData();
    }

}]);
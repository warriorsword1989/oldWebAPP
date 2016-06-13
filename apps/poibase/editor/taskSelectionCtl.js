/**
 * Created by mali on 2016/6/7.
 */
angular.module('app', ['oc.lazyLoad', 'ui.layout','localytics.directives', 'dataService', 'angularFileUpload', 'angular-drag', 'ui.bootstrap']).controller('TaskSelectionCtl', ['$scope', '$ocLazyLoad', '$rootScope', 'dsPoi','dsMeta', '$q', function($scope, $ocLazyLoad, $rootScope, poiDS, meta ,$q) {
    var layerCtrl = new fastmap.uikit.LayerController({config: App.taskSelectionLayersConfig});
    var shapeCtrl = new fastmap.uikit.ShapeEditorController();
    var tooltipsCtrl = new fastmap.uikit.ToolTipsController();
    var eventCtrl = new fastmap.uikit.EventController();

    /*加载子任务列表*/
    poiDS.getPoiList({
        dbId: App.Temp.dbId,
        // type: [1,2,3],
        pageNum: 1,
        pageSize: 10
    }).then(function(data) {
        $scope.poiList = data.rows;
    });
    loadMap();
    $scope.dataListType = 1;
    $scope.taskStatus = 6;
    $scope.changeDataList = function(val) {
        $scope.dataListType = val;
        $scope.taskStatus = 6;
    };
    $scope.changeTaskStatus = function(val) {
        $scope.taskStatus = val;
    }
    var promises = [];
    $q.all(promises).then(function(){

    });
    /*弹出/弹入任务信息面板*/
    $scope.hideEditorPanel = true;
    $scope.changePanelShow = function (type) {
        switch (type) {
            case 'bottom':
                $scope.hideConsole = !$scope.hideConsole;
                break;
            case 'left':
                break;
            case 'right':
                $scope.hideEditorPanel = !$scope.hideEditorPanel;
                break;
            default:
                break;
        }
    }

    // var map = null;
    function loadMap() {
        map = L.map('map', {
            attributionControl: false,
            doubleClickZoom: false,
            zoomControl: false
        }).setView([40.012834, 116.476293], 13);
        tooltipsCtrl.setMap(map, 'tooltip');
        shapeCtrl.setMap(map);
        layerCtrl.eventController.on(eventCtrl.eventTypes.LAYERONSHOW, function (event) {
            if (event.flag == true) {
                map.addLayer(event.layer);
            } else {
                map.removeLayer(event.layer);
            }
        })
        for (var layer in layerCtrl.getVisibleLayers()) {
            map.addLayer(layerCtrl.getVisibleLayers()[layer]);
        }
    }
}]);




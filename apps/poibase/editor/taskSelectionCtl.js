/**
 * Created by mali on 2016/6/7.
 */
angular.module('app', ['oc.lazyLoad', 'ui.layout','localytics.directives', 'dataService', 'angularFileUpload', 'angular-drag', 'ui.bootstrap']).controller('TaskSelectionCtl', ['$scope', '$ocLazyLoad', '$rootScope', 'dsPoi','dsMeta', '$q', function($scope, $ocLazyLoad, $rootScope, poiDS, meta ,$q) {
    var layerCtrl = new fastmap.uikit.LayerController({config: App.taskSelectionLayersConfig});
    var shapeCtrl = new fastmap.uikit.ShapeEditorController();
    var tooltipsCtrl = new fastmap.uikit.ToolTipsController();
    var eventCtrl = new fastmap.uikit.EventController();
    var gridLayer = new fastmap.mapApi.GridLayer();
    $scope.currentHighLight = [];

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
    //高亮显示网格;
    $scope.highlightGrid = function (gridId){
        console.log(map)
        if($scope.currentHighLight.length) {
            for(var i=0;i<$scope.currentHighLight.length;i++){
                map.removeLayer($scope.currentHighLight[i])
            }

        }
        var gridid = gridId?gridId:['605603_01','605603_02'];
        var gridarr = [];
        for(var i=0;i<layerCtrl.getVisibleLayers()[1].gridArr.length;i++){
            for(var j=0;j<gridid.length;j++){
                if(layerCtrl.getVisibleLayers()[1].gridArr[i].options.gridId===gridid[j]){
                    gridarr.push(layerCtrl.getVisibleLayers()[1].gridArr[i])
                }
            }
        }
        for(var i=0;i<gridarr.length;i++){
            $scope.currentHighLight.push(L.rectangle(gridarr[i].getBounds(), {fillColor: "rgba(164, 164, 229, 0.9)", weight: 0,fillOpacity:0.4}).addTo(map));
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
        //shapeCtrl.setMap(map);
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
        //var gridlayer = layerCtrl.getVisibleLayers()[1];
        //map.on("click",function(e){
        //    console.log(gridlayer.gridArr)
        //})
    }
}]);




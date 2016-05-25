angular.module('app', ['oc.lazyLoad', 'ui.layout', 'dataService']).controller('PoiEditorCtl', ['$scope', '$ocLazyLoad', '$rootScope', 'dsPoi', function($scope, $ocLazyLoad, $rootScope, poiDS) {
    $scope.selectedTool = 1;
    loadMap();
    $scope.changeEditTool = function (id) {
        if (id === "tipsPanel") {
            $scope.selectedTool = 1;

        } else if (id === "scenePanel") {
            $scope.selectedTool = 2;

        } else if (id === "layerPanel") {
            $scope.selectedTool = 3;

        }else{
            $scope.selectedTool = 4;
        }
    };
}]);

function loadMap() {
    //初始化地图
    pMap = L.map('map', {
        attributionControl: false,
        zoomControl: false
    }).setView([40.012834, 116.476293], 17);
    //加载各个图层
    var layer = new L.TileLayer('http://{s}.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=0', {
        subdomains: ["rt0", "rt1", "rt2", "rt3"],
        tms: true,
        maxZoom: 18,
        id: 'qqLayer',
    });
    pMap.addLayer(layer);
}

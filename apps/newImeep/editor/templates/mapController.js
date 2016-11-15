/**
 * Created by zhongxiaoming on 2016/11/3.
 */
angular.module('webeditor').controller('mapController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    var layerCtrl = new fastmap.uikit.LayerController({
        config: App.layersConfig
    });
    $rootScope.map = L.map('taskmap', {
        attributionControl: false,
        doubleClickZoom: false,
        zoomControl: false
    });

  //
  // $rootScope.map.on('resize', function() {
  //   setTimeout(function() {
  //     map.invalidateSize()
  //   }, 400);
  // });

    $rootScope.map.setView([40.012834, 116.476293], 14);


    for (var layer in layerCtrl.getVisibleLayers()) {
        $rootScope.map.addLayer(layerCtrl.getVisibleLayers()[layer]);
    }
}]);

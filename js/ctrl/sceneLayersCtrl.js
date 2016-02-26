/**
 * Created by liwanchong on 2016/2/24.
 */
var sceneLayersModule = angular.module('lazymodule', []);
sceneLayersModule.controller('sceneLayersController', function ($scope) {
    var layerCtrl = new fastmap.uikit.LayerController();

    $scope.items = layerCtrl.layers;
    var outLayers = [];
    for (var i = 0; i < layerCtrl.layers.length; i++) {
        if (layerCtrl.layers[i].options.groupid == "dataLayers") {
            outLayers.push(layerCtrl.layers[i]);
        }
    }
    $scope.items = outLayers;

    $scope.showLayers = function (item) {
        if (map.hasLayer(layerCtrl.getLayerById("mesh"))) {

        } else {
            map.addLayer(layerCtrl.getLayerById("mesh"));
        }

        for (var layer in layerCtrl.layers) {
            if (item.options['singleselect'] == true) {
                if (layerCtrl.layers[layer].options['singleselect'] === true && item.options.visible != true) {
                    layerCtrl.layers[layer].options.visible = false
                }
            }

        }
        //单击checkbox的处理
        item.options.visible = !item.options.visible;
        layerCtrl.fire('layerSwitch', {layerArr: layerCtrl.layers});

    };
})
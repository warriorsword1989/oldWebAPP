/**
 * Created by liwanchong on 2015/10/10.
 */
var referenceModule = angular.module('mapApp');
referenceModule.controller('referenceLayersController', function ($scope) {
    var layerCtrl = new fastmap.uikit.LayerController();
    var eventController = fastmap.uikit.EventController();
    $scope.items = layerCtrl.layers;
    var outLayers = [];
    for (var i = 0; i < layerCtrl.layers.length; i++) {
        if (layerCtrl.layers[i].options.groupid == 'backgroundLayers') {
            outLayers.push(layerCtrl.layers[i]);
        }
    }
    $scope.items = outLayers;

    $scope.showLayers = function (item) {
        if (map.hasLayer(layerCtrl.getLayerById('mesh'))) {

        } else {
            map.addLayer(layerCtrl.getLayerById('mesh'));
        }
        if (map.hasLayer(layerCtrl.getLayerById('grid'))) {

        } else {
            map.addLayer(layerCtrl.getLayerById('grid'));
        }

        for (var layer in layerCtrl.layers) {
            if (item.options.singleselect == true) {
                if (layerCtrl.layers[layer].options.singleselect === true && item.options.visible != true) {
                    layerCtrl.layers[layer].options.visible = false;
                }
            }
        }
        // 单击checkbox的处理
        item.options.visible = !item.options.visible;
        eventController.fire(eventController.eventTypes.LAYERONSWITCH, { layerArr: layerCtrl.layers });
    };
});

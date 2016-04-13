/**
 * Created by liwanchong on 2016/2/24.
 */
var sceneLayersModule = angular.module('lazymodule', []);
sceneLayersModule.controller('sceneLayersController', function ($scope) {
    var layerCtrl = new fastmap.uikit.LayerController();
    var eventController = fastmap.uikit.EventController();
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
        for (var layer in layerCtrl.layers) {
            if (layerCtrl.layers[layer].options.requestType === "RDLINKINTRTIC"&&layerCtrl.layers[layer].options.requestType.visible) {
                layerCtrl.layers[layer].options.isUpDirect=true;
            }
        }
        //单击checkbox的处理
        item.options.visible = !item.options.visible;
        if (item.options.requestType == 'ADADMIN' && item.options.visible == true) {
            for (var layer in layerCtrl.layers) {
                if (layerCtrl.layers[layer].requestType != 'RDLINK' &&  layerCtrl.layers[layer].requestType != 'ADADMIN') {
                    layerCtrl.layers[layer].options.visible = false;
                    eventController.fire(eventController.eventTypes.LAYERONSWITCH, {layerArr: layerCtrl.layers});
                }else if (layerCtrl.layers[layer].requestType == 'RDLINK') {
                    layerCtrl.layers[layer].options.visible = true;
                    eventController.fire(eventController.eventTypes.LAYERONSWITCH, {layerArr: layerCtrl.layers});
                }
            }
        } else{
            eventController.fire(eventController.eventTypes.LAYERONSWITCH, {layerArr: layerCtrl.layers});
        }
    };
})
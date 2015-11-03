/**
 * Created by liwanchong on 2015/10/10.
 */
var referenceModule = angular.module('lazymodule', []);
referenceModule.controller('referenceLayersController',function($scope) {


    var layerCtrl = new fastmap.uikit.LayerController();

    $scope.items =layerCtrl.layers;

    $scope.showLayers=function(item) {


        for(var layer in layerCtrl.layers){
            //if(!(item instanceof fastmap.mapApi.TileJSON || item instanceof fastmap.mapApi.MeshLayer) &&layerCtrl.layers[layer].options.visible ===true && !(layerCtrl.layers[layer] instanceof fastmap.mapApi.TileJSON ||layerCtrl.layers[layer] instanceof fastmap.mapApi.MeshLayer)){
            //    layerCtrl.layers[layer].options.visible = false;
            //}
            if(item.options['singleselect'] == true){
                if(layerCtrl.layers[layer].options['singleselect'] === true && item.options.visible != true){
                    layerCtrl.layers[layer].options.visible = false
                }
            }
        }
        //单击checkbox的处理
        item.options.visible = !item.options.visible;
        layerCtrl.fire('layerSwitch', {layerArr: layerCtrl.layers});

    };
})
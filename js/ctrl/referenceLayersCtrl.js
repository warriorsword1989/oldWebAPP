/**
 * Created by liwanchong on 2015/10/10.
 */
var referenceModule = angular.module('lazymodule', []);
referenceModule.controller('referenceLayersController',function($scope) {
    var layerCtrl = new fastmap.uikit.LayerController();
    $scope.items = layer;
    console.log($scope.items);
    var layer1 = null,singleLayer=null,layerArr=[];
    $scope.showLayers=function(item) {
        if(layerArr.length!==0) {
            layerArr.length = 0;
        }
        //单击checkbox的处理
        item.show = !item.show;
        //对于单选的图层对于上上一步的处理
        if(singleLayer!==null&&singleLayer.selected==="single") {
            if(item.selected!=="multiple") {
                singleLayer.show = false;
            }
        }
        if(item.selected==="single") {
            singleLayer = item;
        }
        layerArr=layerArr.concat($scope.items.layers);
        console.log(layerArr);
        layerCtrl.fire('layerSwitch', {layerArr: layerArr});
        if(item.show) {
            layer1= new L.TileLayer(item.url, item.options).addTo(map);
        }else{
            map.removeLayer(layer1);
        }
    };
})
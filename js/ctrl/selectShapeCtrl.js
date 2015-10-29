/**
 * Created by liwanchong on 2015/10/28.
 */
var selectApp = angular.module("lazymodule", []);
selectApp.controller("selectShapeController",function($scope) {

    ////获得编辑的图层
    //var editLayer = new  fastmap.mapApi.EditLayer();
    //map.addLayer(editLayer);
    $scope.selectShape=function(type) {
        var selectCtrl = new fastmap.uikit.SelectController();
        var layerCtrl =fastmap.uikit.LayerController();
        if(type==="link") {
            var rdLink;
            for(var layer in layerCtrl.layers){
                if(layerCtrl.layers[layer].options['id'] ==='work'){
                    rdLink = layerCtrl.layers[layer];
                    break;
                }
            }
            var id = 608825;
            Application.functions.getRdLinkById(id,"RDLINK",function(data) {
                selectCtrl.onSelected(data);
            })

        }
    };
})
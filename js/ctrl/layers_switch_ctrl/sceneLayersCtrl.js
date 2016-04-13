/**
 * Created by liwanchong on 2016/2/24.
 */
var sceneLayersModule = angular.module('lazymodule', []);
sceneLayersModule.controller('sceneLayersController', function ($scope) {
    var layerCtrl = new fastmap.uikit.LayerController();
    var eventController = fastmap.uikit.EventController();
    $scope.scenceArr = [
        {"id": 1, "label": "普通限速", "selected": false},
        {"id": 2, "label": "条件限速", "selected": false},
        {"id": 3, "label": "互联网Rtic", "selected": false},
        {"id": 4, "label": "行政区划", "selected": false},
        {"id": 5, "label": "复杂要素", "selected": false}
    ]
    var outLayers = [];
    for (var i = 0; i < layerCtrl.layers.length; i++) {
        if (layerCtrl.layers[i].options.groupid == "dataLayers") {
            outLayers.push(layerCtrl.layers[i]);
        }
    }
    $scope.items = outLayers;
    $scope.resetLayers=function() {
        for (var i = 0; i < layerCtrl.layers.length; i++) {
            if (layerCtrl.layers[i].options.groupid == "dataLayers") {
              if(layerCtrl.layers[i].options.type==="rdrticPoint") {
                  layerCtrl.layers[i].options.visible = false;
              }else{
                  layerCtrl.layers[i].options.visible = true;
              }
            }
        }
    };
    $scope.originLayers = $.extend({},layerCtrl.layers);
    $scope.showLayers = function (item) {
        //单击checkbox的处理
        item.options.visible = !item.options.visible;
        eventController.fire(eventController.eventTypes.LAYERONSWITCH, {layerArr: layerCtrl.layers});

    };
    $scope.ordSpeedScene=function() {

    };
    $scope.conditionSpeedScene=function() {
    };
    $scope.rticSecne=function() {
        for (var i= 0,len=$scope.items.length;i<len;i++) {
            if($scope.items[i].options.id==="rdrtic"||$scope.items[i].options.id==="referenceLine") {
                $scope.items[i].options.visible = true;
            }else{
                $scope.items[i].options.visible = false;
            }
        }
    };
    $scope.showScene = function (item, event) {

        for (var scene in $scope.scenceArr) {
            if (item['selected'] != true) {
                $scope.scenceArr[scene]['selected'] = false
            }
        }
        item['selected']  = !item['selected'] ;
        if(item['selected']) {
            $scope.resetLayers();
            switch (item["id"]) {
                case 1://普通限速
                    $scope.ordSpeedScene();
                    break;
                case 2://条件限速
                    $scope.conditionSpeedScene();
                    break;
                case 3://互联网rtic
                    $scope.rticSecne();
                    break;
                case 4:
                    break;
            }
        }else{
            $scope.resetLayers();
        }
        eventController.fire(eventController.eventTypes.LAYERONSWITCH, {layerArr: layerCtrl.layers});
    };

})
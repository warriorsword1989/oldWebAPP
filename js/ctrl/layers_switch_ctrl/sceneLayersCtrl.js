/**
 * Created by liwanchong on 2016/2/24.
 */
var sceneLayersModule = angular.module('lazymodule', []);
sceneLayersModule.controller('sceneLayersController', function ($scope) {
    var layerCtrl = fastmap.uikit.LayerController();
    var speedLimit = layerCtrl.getLayerById("speedlimit");
    var eventController = fastmap.uikit.EventController();
    $scope.flag = true;
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
              if(layerCtrl.layers[i].options.id==="rdrtic") {
                  layerCtrl.layers[i].options.visible = false;
              }else if(layerCtrl.layers[i].options.id==="speedlimit") {
                  $scope.items[i].options.showType = 1;
                  $scope.items[i].options.visible = true;
              }else{
                  layerCtrl.layers[i].options.visible = true;
              }
            }
        }
    };
    $scope.showLayers = function (item) {
        //单击checkbox的处理
        item.options.visible = !item.options.visible;
        eventController.fire(eventController.eventTypes.LAYERONSWITCH, {layerArr: layerCtrl.layers});

    };
    $scope.ordSpeedScene=function() {
        for (var i= 0,len=$scope.items.length;i<len;i++) {
            if($scope.items[i].options.id==="speedlimit") {
                $scope.items[i].options.showType = 0;
                $scope.items[i].options.visible = true;
                if($scope.flag){
                    speedLimit.redraw();
                }
            }else if($scope.items[i].options.id==="referenceLine"){
                $scope.items[i].options.visible = true;
            }else{
                $scope.items[i].options.visible = false;
            }
        }
        $scope.flag = true;
        $scope.$emit("SWITCHTOOLS",{"type":"rdTools"})
    };
    $scope.conditionSpeedScene=function() {
        for (var i= 0,len=$scope.items.length;i<len;i++) {
            if($scope.items[i].options.id==="speedlimit") {
                $scope.items[i].options.showType = 3;
                $scope.items[i].options.visible = true;
                if($scope.flag){
                    speedLimit.redraw();
                }
            }else if($scope.items[i].options.id==="referenceLine"){
                $scope.items[i].options.visible = true;
            }else{
                $scope.items[i].options.visible = false;
            }
        }
        $scope.flag = true;
        $scope.$emit("SWITCHTOOLS",{"type":"rdTools"})
    };
    $scope.rticSecne=function() {
        for (var i= 0,len=$scope.items.length;i<len;i++) {
            if($scope.items[i].options.id==="rdrtic"||$scope.items[i].options.id==="referenceLine") {
                $scope.items[i].options.visible = true;
            }else{
                $scope.items[i].options.visible = false;
            }
        }
        $scope.flag = false;
        $scope.$emit("SWITCHTOOLS",{"type":"adTools"})

    };
    $scope.showScene = function (item, event) {

        for (var scene in $scope.scenceArr) {
            if (item['selected'] != true) {
                $scope.scenceArr[scene]['selected'] = false
            }
        }
        item['selected']  = !item['selected'] ;
        if(item['selected']) {
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
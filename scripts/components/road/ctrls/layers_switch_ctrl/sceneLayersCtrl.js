/**
 * Created by liwanchong on 2016/2/24.
 */
var sceneLayersModule = angular.module('lazymodule', []);
sceneLayersModule.controller('sceneLayersController', function ($scope) {
    var layerCtrl = fastmap.uikit.LayerController();
    var speedLimit = layerCtrl.getLayerById("speedlimit");
    var eventController = fastmap.uikit.EventController();
    var editLayer = layerCtrl.getLayerById('edit');
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var hLayer = layerCtrl.getLayerById("highlightlayer")
    $scope.flag = true;
    $scope.scenceArr = [
        {"id": 1, "label": "线限速场景", "selected": false},
        {"id": 2, "label": "条件限速", "selected": false},
        {"id": 3, "label": "互联网RTIC场景", "selected": false},
        {"id": 4, "label": "行政区划场景", "selected": false},
        {"id": 5, "label": "复杂要素", "selected": false},
        {"id": 6, "label": "常规场景", "selected": false},
        {"id": 7, "label": "车场RTIC场景", "selected": false},
        {"id": 8, "label": "TMC", "selected": false},
        {"id": 9, "label": "自然语音场景", "selected": false},
        {"id": 10, "label": "13cy-HW场景", "selected": false},
        {"id": 11, "label": "NBT高速出入口场景", "selected": false},
        {"id": 12, "label": "CRF场景", "selected": false},
        {"id": 13, "label": "同一关系场景", "selected": false}
    ]
    var outLayers = [];
    for (var i = 0; i < layerCtrl.layers.length; i++) {
        if (layerCtrl.layers[i].options.groupid == "dataLayers") {
            outLayers.push(layerCtrl.layers[i]);
        }
    }
    $scope.items = outLayers;
    $scope.resetLayers = function () {
        $scope.changeBtnClass("");
        for (var i = 0; i < layerCtrl.layers.length; i++) {
            if (layerCtrl.layers[i].options.groupid == "dataLayers") {
                if (layerCtrl.layers[i].options.id === "rdrtic") {
                    layerCtrl.layers[i].options.visible = false;
                } else if (layerCtrl.layers[i].options.id === "speedlimit") {
                    $scope.items[i].options.showType = 1;
                    $scope.items[i].options.visible = true;
                } else {
                    layerCtrl.layers[i].options.visible = true;
                }
            }
        }
        $scope.$emit("SWITCHTOOLS", {"type": "rdTools"})
    };
    $scope.showLayers = function (item) {
        //单击checkbox的处理
        item.options.visible = !item.options.visible;
        eventController.fire(eventController.eventTypes.LAYERONSWITCH, {layerArr: layerCtrl.layers});

    };
    $scope.ordSpeedScene = function () {
        $scope.changeBtnClass("");
        for (var i = 0, len = $scope.items.length; i < len; i++) {
            if ($scope.items[i].options.id === "speedlimit") {
                $scope.items[i].options.showType = 0;
                $scope.items[i].options.visible = true;
                if ($scope.flag) {
                    speedLimit.redraw();
                }
            } else if ($scope.items[i].options.id === "referenceLine") {
                $scope.items[i].options.visible = true;
            } else {
                $scope.items[i].options.visible = false;
            }
        }
        $scope.flag = true;
        $scope.$emit("SWITCHTOOLS", {"type": "rdTools"})
    };
    $scope.conditionSpeedScene = function () {
        $scope.changeBtnClass("");
        for (var i = 0, len = $scope.items.length; i < len; i++) {
            if ($scope.items[i].options.id === "speedlimit") {
                $scope.items[i].options.showType = 3;
                $scope.items[i].options.visible = true;
                if ($scope.flag) {
                    speedLimit.redraw();
                }
            } else if ($scope.items[i].options.id === "referenceLine") {
                $scope.items[i].options.visible = true;
            } else {
                $scope.items[i].options.visible = false;
            }
        }
        $scope.flag = true;
        $scope.$emit("SWITCHTOOLS", {"type": "rdTools"})
    };
    $scope.rticSecne = function () {
        $scope.changeBtnClass("");
        for (var i = 0, len = $scope.items.length; i < len; i++) {
            if ($scope.items[i].options.id === "rdrtic" || $scope.items[i].options.id === "referenceLine" ||  $scope.items[i].options.id ==="rdcross") {
                $scope.items[i].options.visible = true;
            } else {
                $scope.items[i].options.visible = false;
            }
        }
        $scope.flag = false;
        $scope.$emit("SWITCHTOOLS", {"type": "rdTools"})

    };
    $scope.zoneRegionSecne = function () {
        $scope.changeBtnClass("");
        for (var i = 0, len = $scope.items.length; i < len; i++) {
            if ($scope.items[i].options.id === "adLink" || $scope.items[i].options.id === "adface"
                || $scope.items[i].options.id === "referenceLine" || $scope.items[i].options.id === "adAdmin"||$scope.items[i].options.id === "adnode") {
                $scope.items[i].options.visible = true;
            } else {
                $scope.items[i].options.visible = false;
            }
        }
        $scope.flag = false;
        $scope.$emit("SWITCHTOOLS", {"type": "adTools"})
    };
    $scope.resetSecne = function () {
        $scope.changeBtnClass("");
        for (var i = 0; i < $scope.items.length; i++) {
            if ($scope.items[i].options.id === "rdrtic"
                || $scope.items[i].options.id === "adLink"
                || $scope.items[i].options.id === "adface"
                || $scope.items[i].options.id === "adAdmin") {
                $scope.items[i].options.visible = false;
            } else if (layerCtrl.layers[i].options.id === "speedlimit") {
                $scope.items[i].options.showType = 1;
                $scope.items[i].options.visible = true;
            } else {
                $scope.items[i].options.visible = true;
            }

        }
        $scope.$emit("SWITCHTOOLS", {"type": "rdTools"})
    };

    $scope.resetToolAndMap = function () {
        if (map.currentTool && typeof map.currentTool.cleanHeight === "function") {
            map.currentTool.cleanHeight();
            map.currentTool.disable();//禁止当前的参考线图层的事件捕获
        }
        var highLightLink = new fastmap.uikit.HighLightRender(hLayer);
        highLightLink._cleanHightlight();
        if (tooltipsCtrl.getCurrentTooltip()) {
            tooltipsCtrl.onRemoveTooltip();
        }
        editLayer.drawGeometry = null;
        shapeCtrl.stopEditing();
        editLayer.bringToBack();
        $(editLayer.options._div).unbind();
        //$scope.changeBtnClass("");
        shapeCtrl.shapeEditorResult.setFinalGeometry(null);
        shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
        editLayer.clear();
    };

    $scope.showScene = function (item, event) {
        $scope.resetToolAndMap();
        $scope.$emit("SWITCHCONTAINERSTATE",
            {
                "attrContainerTpl": false,
                "subAttrContainerTpl": false
            })
        if (map.floatMenu) {
            map.removeLayer(map.floatMenu);
            map.floatMenu = null;
        }

        for (var scene in $scope.scenceArr) {
            if (item['selected'] != true) {
                $scope.scenceArr[scene]['selected'] = false
            }
        }
        item['selected'] = !item['selected'];
        if (item['selected']) {
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
                case 4://行政区划
                    $scope.zoneRegionSecne();
                    break;
                case 6://恢复到以前
                    $scope.resetSecne();
                    break;
            }
        } else {
            $scope.resetLayers();
        }
        eventController.fire(eventController.eventTypes.LAYERONSWITCH, {layerArr: layerCtrl.layers});
    };

});
/*
 sceneLayersModule.controller('sceneLayersController', function ($scope) {
 var layerCtrl = fastmap.uikit.LayerController();
 var speedLimit = layerCtrl.getLayerById("speedlimit");
 var eventController = fastmap.uikit.EventController();
 $scope.flag = true;
 $scope.scenceArr = [
 /!*     {"id": 1, "label": "普通限速", "selected": false},
 {"id": 2, "label": "条件限速", "selected": false},*!/
 {"id": 66, "label": "限速", "selected": false,"type":"rdTools","adScenceArr":[{"id": 'referenceLine'},{"id": 'speedlimit',"name":["普通限速","条件限速"]}]},
 {"id": 3, "label": "互联网Rtic", "selected": false},
 {"id": 4, "label": "行政区划", "selected": false,"type":"adTools","adScenceArr":[{"id": 'referenceLine'},{"id": 'adAdmin'},{"id": 'adLink'},{"id": 'adface'}]},
 {"id": 5, "label": "复杂要素", "selected": false}
 ]
 var outLayers = [];
 for (var i = 0; i < layerCtrl.layers.length; i++) {
 if (layerCtrl.layers[i].options.groupid == "dataLayers") {
 outLayers.push(layerCtrl.layers[i]);
 }
 }
 $scope.items = outLayers;
 $scope.testItem = outLayers;
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
 $scope.$emit("SWITCHTOOLS",{"type":"rdTools"})
 };
 $scope.showLayers = function (item) {
 //单击checkbox的处理
 item.options.visible = !item.options.visible;
 eventController.fire(eventController.eventTypes.LAYERONSWITCH, {layerArr: layerCtrl.layers});

 };
 $scope.showLayers1 = function (item,item1) {
 //单击checkbox的处理
 item1[1] = !item1[1];
 item.options.showType = 3;
 item.options.visible = true;
 speedLimit.redraw();
 eventController.fire(eventController.eventTypes.LAYERONSWITCH, {layerArr: layerCtrl.layers});

 };
 $scope.allSpeedScene=function() {
 var test = [];
 for (var i= 0,len=$scope.items.length;i<len;i++) {
 if($scope.items[i].options.id==="speedlimit") {
 $scope.items[i].options.showType = 1;
 $scope.items[i].options.visible = true;
 $scope.items[i].options.layername = '普通限速';
 test.push($scope.items[i]);
 if($scope.flag){
 speedLimit.redraw();
 }
 }else if($scope.items[i].options.id==="referenceLine"){
 $scope.items[i].options.visible = true;
 test.push($scope.items[i]);
 }else{
 $scope.items[i].options.visible = false;
 }

 }
 $scope.flag = true;
 $scope.$emit("SWITCHTOOLS",{"type":"rdTools"})
 $scope.testItem = test;
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
 $scope.$emit("SWITCHTOOLS",{"type":"rdTools"})

 };
 $scope.zoneRegionSecne=function(id) {
 var test = [];
 var test1 = [];
 var flag = false;
 for (var n = 0;n< $scope.scenceArr.length;n++) {
 if ( $scope.scenceArr[n].id === id) {
 test = $scope.scenceArr[n];
 }
 }
 //判断是否在同一图层
 for (var m = 0;m<test.adScenceArr.length;m++) {
 if (test.adScenceArr[m].name) {
 flag = true;
 m = test.adScenceArr.length;
 }else{
 }
 }
 //flag = true 为同一图层，flag = false 为不同图层
 if(flag){
 for (var i= 0,len=$scope.items.length;i<len;i++) {
 for (var j=0;j< test.adScenceArr.length;j++) {
 if($scope.items[i].options.id===test.adScenceArr[j].id) {
 if (test.adScenceArr[j].name) {//同一图层的不同情况
 var copy =  $scope.items[i];
 $scope.items[i].options.visible = true;
 $scope.items[i].options["sonName"] = [];
 var arr = [];
 for (var l = 0;l< test.adScenceArr[j].name.length;l++) {
 arr.push(test.adScenceArr[j].name[l],true);
 $scope.items[i].options["sonName"].push(arr);
 arr = [];
 }
 $scope.items[i].options["flag"] = true;
 test1.push($scope.items[i]);
 }else{
 $scope.items[i].options.visible = true;
 test1.push($scope.items[i]);
 }
 j =  test.adScenceArr.length;
 }else{
 $scope.items[i].options.visible = false;
 }
 }
 }

 }else{
 for (var i= 0,len=$scope.items.length;i<len;i++) {
 for (var j=0;j< test.adScenceArr.length;j++) {
 if($scope.items[i].options.id===test.adScenceArr[j].id) {
 $scope.items[i].options.visible = true;
 test1.push($scope.items[i]);
 j =  test.adScenceArr.length;
 }else{
 $scope.items[i].options.visible = false;
 }
 }
 }
 }
 $scope.flag = false;
 $scope.$emit("SWITCHTOOLS",{"type":test.type});
 $scope.testItem = test1;
 };
 $scope.showScene = function (item, event) {

 for (var scene in $scope.scenceArr) {
 if (item['selected'] != true) {
 $scope.scenceArr[scene]['selected'] = false
 }
 }
 item['selected']  = !item['selected'] ;
 if(item['selected']) {
 $scope.zoneRegionSecne(item['id']);
 /!*   switch (item["id"]) {
 case 66://限速
 $scope.allSpeedScene();
 break;
 case 1://普通限速
 $scope.ordSpeedScene();
 break;
 case 2://条件限速
 $scope.conditionSpeedScene();
 break;
 case 3://互联网rtic
 $scope.rticSecne();
 break;
 case 4://行政区划
 $scope.zoneRegionSecne();
 break;
 }*!/
 }else{
 $scope.resetLayers();
 }
 eventController.fire(eventController.eventTypes.LAYERONSWITCH, {layerArr: layerCtrl.layers});
 };

 })*/

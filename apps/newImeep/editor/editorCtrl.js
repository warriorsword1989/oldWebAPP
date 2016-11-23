/**
 * Created by zhongxiaoming on 2016/10/28.
 * 新的editorCtrl主要用于地图编辑的重构
 */

'use strict';

angular.module('webeditor').controller('editorCtrl', ['$scope', '$rootScope',
    function ($scope, $rootScope) {
    // 根据屏幕计算高度
        $scope.leftPanelFlag = true;
        $scope.rightPanelFlag = true;
        $scope.inspectToolShow = false;
        $scope.normalInspectToolScreen = true;
        var height = document.documentElement.clientHeight;
        var width = document.documentElement.clientWidth;
        $scope.toolTop = (height-400) / 2 +'px';
        console.log(height);
        console.log($scope.toolTop);
        var percent = height / 1019;
        $scope.$on("openInspect",function(event,data) {
            $scope.inspectToolShow = true;
            $scope.normalInspectToolScreen = true;
        });
        $scope.mapBackGround = {
            width: width + 'px',
            height: height + 'px',
            padding: 0,
            margin: 0
        };
        $scope.closeLeftPanel = function () {
            $scope.leftPanelFlag = !$scope.leftPanelFlag;
        };
        $scope.closeRightPanel = function () {
            $scope.rightPanelFlag = !$scope.rightPanelFlag;
        };
        //$scope.showInspectTool = function () {
        //    $scope.inspectToolShow = true;
        //    $scope.normalInspectToolScreen = true;
        //};
        $scope.changeInspectToolScreen = function () {
            $scope.normalInspectToolScreen = !$scope.normalInspectToolScreen;
        };
        $scope.closeInspectToolScreen = function () {
            $scope.inspectToolShow = false;
            $scope.normalInspectToolScreen = true;
        };
    // 顶部工具条模板地址
        $scope.headToolbarTemp = './editor/templates/poiHeaderTemp.html';
    // 左侧弹出栏
        $scope.leftPanelTemp = './editor/templates/poiLeftPanelTemp.html';
    // 右侧弹出栏工具条
        $scope.rightPanelToolbarTemp = './editor/templates/poiToolTemp.html';
    // 右侧弹出属性栏
        $scope.rightPanelTemp = './editor/templates/poiRightPanelTemp.html';
    // 场景弹出栏
        $scope.scenePanelTemp = './editor/templates/scenePanelTemp.html';
    // 场景弹出列表
        $scope.sceneListPanelTemp = './editor/templates/sceneContentPanelTemp.html';
    //右侧工具条-用户
        $scope.rightUserToolTemp = './editor/templates/rightTool/userToolTemp.html';
    //右侧工具条-poi分页
        $scope.rightPoiPageTemp = './editor/templates/rightTool/poiPageTemp.html';
    // 地图片段
    // $scope.mapTemp = $rootScope.mapTemp;
    //
    // var layerCtrl = new fastmap.uikit.LayerController({
    //   config: App.layersConfig
    // });
    // for (var layer in layerCtrl.getVisibleLayers()) {
    //   $rootScope.map.removeLayer(layerCtrl.getVisibleLayers()[layer]);
    // }
    // for (var layer in layerCtrl.getVisibleLayers()) {
    //   $rootScope.map.addLayer(layerCtrl.getVisibleLayers()[layer]);
    // }


        loadMap(null);

    // $rootScope.map


        function loadMap(data) {
            var layerCtrl = new fastmap.uikit.LayerController({
                config: App.layersConfig
            });
            var map = L.map('map', {
                attributionControl: false,
                doubleClickZoom: false,
                zoomControl: false
            });


      // 高亮作业区域
      // var substaskGeomotry = data.geometry;
      // var pointsArray = hightLightWorkArea(substaskGeomotry);
      // var lineLayer = L.multiPolygon(pointsArray, {
      //   fillOpacity: 0
      // });
      // map.addLayer(lineLayer);
      // map.on("zoomend", function(e) {
      //   document.getElementById('zoomLevelBar').innerHTML = "缩放等级:" + map.getZoom();
      // });
            map.on('resize', function () {
                setTimeout(function () {
                    map.invalidateSize();
                }, 400);
            });
      // map.on("moveend", function(e) {
      //   var c = map.getCenter();
      //   $cookies.put('IMEEP_EDITOR_MAP_ZOOM', map.getZoom(), {
      //     path: '/'
      //   });
      //   $cookies.put('IMEEP_EDITOR_MAP_CENTER', JSON.stringify([c.lat, c.lng]), {
      //     path: '/'
      //   });
      // });
      // if ($cookies.get('IMEEP_EDITOR_MAP_ZOOM') && $cookies.get('IMEEP_EDITOR_MAP_CENTER')) {
      //   map.setView(JSON.parse($cookies.get('IMEEP_EDITOR_MAP_CENTER')), $cookies.get('IMEEP_EDITOR_MAP_ZOOM'));
      // } else {
      //   map.fitBounds(lineLayer.getBounds());
      // }
      // L.control.scale({position:'bottomleft',imperial:false}).addTo(map);
            map.setView([40.012834, 116.476293], 14);
      /**
       * 右键点击地图位置居中
       * 由于任务圈使用的是MultiPolygon，contextmenu、click等事件在MultiPolygon中不起作用了
       * 目前使用的方案是使用mousedown事件，并用event.originalEvent.button来判断是左键、中键、右键的点击
       * 另一种经验证可行方案是把任务圈的multipolygon改为polygon，用click事件来监听左键、中键的点击事件，用contextmenu来监听右键事件
       * contextmenu事件在polygon中不起作用了，因此使用mousedown进行补充
       */
      // map.on("contextmenu", function(e) { // 右键
      //   map.setView(e.latlng);
      // });
      // map.on("mousedown", function(e) {
      //   if (e.originalEvent.button == 2) { // 右键
      //     map.setView(e.latlng);
      //   }
      // });

            var circle = L.circle([40.012834, 116.476293], 20, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5
            }).addTo(map);
            circle.on('click', function () {
        // 顶部工具条模板地址
                $scope.headToolbarTemp = './editor/templates/poiHeaderTemp.html';
        // 左侧弹出栏
                $scope.leftPanelTemp = './editor/templates/poiLeftPanelTemp.html';
        // 右侧弹出栏工具条
                $scope.rightPanelToolbarTemp = './editor/templates/poiToolTemp.html';
        // 右侧弹出属性栏
                $scope.rightPanelTemp = './editor/templates/poiRightPanelTemp.html';

                $scope.$digest();
            });

            var latlngs = [

        [40.014934, 116.451393],
        [40.013834, 116.476493]
            ];
            var polyline = L.polyline(latlngs, { color: 'blue' }).addTo(map);
            polyline.on('click', function () {
                $scope.rightPanelTemp = './editor/templates/roadRightPanelTemp.html';
                $scope.leftPanelTemp = './editor/templates/roadLeftPanelTemp.html';
                $scope.headToolbarTemp = './editor/templates/roadHeaderTemp.html';
                $scope.rightPanelToolbarTemp = './editor/templates/roadToolTemp.html';
                $scope.$digest();
            });
      // map.on("click", function(e) {
      //     console.log('click');
      // });
      // map.on("mousedown", function(e) {
      //     console.log(e.originalEvent.button);
      // });
      // 属性编辑ctrl(解析对比各个数据类型)
      // var shapeCtrl = new fastmap.uikit.ShapeEditorController();
      // var tooltipsCtrl = new fastmap.uikit.ToolTipsController();
      // tooltipsCtrl.setMap(map, 'tooltip');
      // shapeCtrl.setMap(map);
      // layerCtrl.eventController.on(eventCtrl.eventTypes.LAYERONSHOW, function(event) {
      //   if (event.flag == true) {
      //     map.addLayer(event.layer);
      //   } else {
      //     map.removeLayer(event.layer);
      //   }
      // })
            for (var layer in layerCtrl.getVisibleLayers()) {
                map.addLayer(layerCtrl.getVisibleLayers()[layer]);
            }
        }

        $scope.switchtool = function () {
            $scope.scenePanelOpened = !$scope.scenePanelOpened;
        };
    }]);

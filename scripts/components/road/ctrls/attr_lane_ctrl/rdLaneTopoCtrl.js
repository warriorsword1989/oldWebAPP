/**
 * Created by liuyang on 2016/9/9.
 */
var rdLineApp = angular.module("app");
rdLineApp.controller("rdLaneTopoCtrl", function () {
    /***********************************地图相关配置以及外部js注入***********************************/

    var layerCtrl = fastmap.uikit.LayerController();
    var eventCtrl = fastmap.uikit.EventController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var mapZoomPoint = [40.012834, 116.476293];
    //初始化地图;
    topoMap = new L.Map('topoMap', {
        attributionControl: false,
        doubleClickZoom: false,
        zoomControl: false
    });
    var osm =  new L.TileLayer('http://{s}.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=0', {
        layername: '腾讯',
        subdomains: ["rt0", "rt1", "rt2", "rt3"],
        tms: true,
        maxZoom: 20,
        selected: false,
        id: 'qqLayer',
        visible: true,
        added: true,
        singleselect: true,
        zIndex: 2
    });
    topoMap.addLayer(osm);
    topoMap.setView(new L.LatLng(39.90, 116.37),15);
    //防止地图视口加载不全;
    // topoMap.on('resize', function () {
    //     setTimeout(function () {
    //         topoMap.invalidateSize()
    //     }, 400);
    // });
    //对要加载的图层事件监听;
    // layerCtrl.eventController.on(eventCtrl.eventTypes.LAYERONSHOW, function (event) {
    //     for (var layer in event.layer) {
    //         topoMap.addLayer(event.layer[layer]);
    //     }
    // });
    //设置要加载显示的图层;
    // layerCtrl.setLayersVisible(['rdLink']);
    //layerCtrl.setLayersVisible(['mesh']);


});
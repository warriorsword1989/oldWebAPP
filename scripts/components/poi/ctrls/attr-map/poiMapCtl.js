angular.module('app').controller('poiMapCtl', function($scope) {
    pMap = L.map('NaviMap_container', {
        attributionControl: false,
        zoomControl:false
    }).setView([40.012834, 116.476293], 17);

    $scope.loadLayers = function (map) {
        var qqLayer = new L.TileLayer('http://{s}.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=0', {
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
        map.addLayer(qqLayer);
        var drawnItems = new L.layerGroup();
        drawnItems.id = "drawnItems";
        map.addLayer(drawnItems);
        var polygonGroup = new L.layerGroup();
        polygonGroup.id = "regionLayer";
        map.addLayer(polygonGroup);
        var navBaseLayer = new L.layerGroup();
        navBaseLayer.id = "navBaseLayer";
        navBaseLayer.name = "道路和测线";
        map.addLayer(navBaseLayer);
        var mainPoiLayer = new L.layerGroup();
        mainPoiLayer.id = "mainPoiLayer";
        map.addLayer(mainPoiLayer);
        var parentPoiGroup = new L.layerGroup();
        parentPoiGroup.id = "parentPoiLayer";
        map.addLayer(parentPoiGroup);
        var childPoiLayer = new L.layerGroup();
        childPoiLayer.id = "childPoiLayer";
        map.addLayer(childPoiLayer);
        var checkResultLayer = new L.layerGroup();
        checkResultLayer.id = "checkResultLayer";
        map.addLayer(checkResultLayer);
        var rectChooseLayer = new L.layerGroup();
        rectChooseLayer.id = "rectChooseLayer";
        map.addLayer(rectChooseLayer);
        var poiEditLayer = new L.layerGroup();
        poiEditLayer.id = "poiEditLayer";
        map.addLayer(poiEditLayer);
        var overLayers = {
            "道路": navBaseLayer,
            "腾讯": qqLayer
        };
        L.control.layers('',overLayers).addTo(map);//右上角的图层
        // map.zommControl.setAttribute({
        //         position:'topleft',
        //         zoomInTitle:'放大',
        //         zoomOutTitle:'缩小'
        // })
        L.control.zoom({
            position:'topleft',
            zoomInTitle:'放大',
            zoomOutTitle:'缩小'
        }).addTo(map);
        var center = new L.LatLng(39.90, 116.37);
        map.setView(center, 14);
            // .on("moveend", $scope.loadNewData);
    };

    $scope.loadLayers(pMap);

    $scope.loadNewData = function () {
        console.log(11111);
        document.getElementById('zoomLevelBar').text("缩放等级:" + pMap.getZoom());
        if(pMap.getZoom()>13){

        }
    }


});
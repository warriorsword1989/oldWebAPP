﻿requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        fastmap: '../fastmap',
        leaflet: 'leaflet-0.7.3/leaflet'
    }
});

require(['leaflet', 'fastmap/fastmap', 'fastmap/mapApi/Map'], function (L, fastmap, Map) {
    var map = new fastmap.mapApi.Map("mapId", { zoomControl: true });


    map.setView([40.01522, 116.46438], 15);

    var cloudmade = new L.TileLayer('http://{s}.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=0', {
        subdomains: ["rt0", "rt1", "rt2", "rt3"],
        tms: true,
        maxZoom: 18
    });
    map.addLayer(cloudmade);
});

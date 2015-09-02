requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        fastmap: 'js/fastmap',
        leaflet: 'leaflet-0.7.3/leaflet'
    }
});

require(['js/lib/leaflet-0.7.3/leaflet', 'js/fastmap/fastmap', 'js/fastmap/mapApi/Map','js/fastmap/mapApi/Layer','js/fastmap/mapApi/WholeLayer','js/fastmap/mapApi/MeshLayer'], function (L, fastmap, Map, Layer, WholeLayer, MeshLayer) {
    var map = new fastmap.mapApi.Map("mapId", { zoomControl: true });


    map.setView([40.01522, 116.46438], 15);

    var cloudmade = new L.TileLayer('http://{s}.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=0', {
        subdomains: ["rt0", "rt1", "rt2", "rt3"],
        tms: true,
        maxZoom: 18
    });
    map.addLayer(cloudmade);


    var mesh = new fastmap.mapApi.MeshLayer({minShowZoom:2,maxShowZoom:17});

    map.addLayer(mesh);

});

requirejs.config({
    baseUrl: '',
    paths: {
        fastmap: 'js/fastmap',
        leaflet: 'js/lib/leaflet-0.7.3/leaflet',
        jquery:'js/lib/jquery/jquery-1.11.1'
    }
});

require(['js/lib/leaflet-0.7.3/leaflet', 'js/fastmap/fastmap', 'js/fastmap/mapApi/Map','js/fastmap/mapApi/Layer','js/fastmap/mapApi/WholeLayer','js/fastmap/mapApi/MeshLayer','jquery','js/fastmap/mapApi/TileJSONLayer','js/fastmap/mapApi/MecatorTransform'], function (L, fastmap, Map, Layer, WholeLayer, MeshLayer, $, TileJSONLayer,MecatorTransform) {
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

    var tileJson = new fastmap.mapApi.TileJSON({
        id:'ee',
        url:'http://192.168.4.130/render/servlet/LinkTile?',
        hitDetection: true,
        debug: false,
        // this value should be equal to 'radius' of your points
        buffer: 10,
        boolPixelCrs: true ,
        parse: parseLineStringData,
        boundsArr: [],
        unloadInvisibleTiles: true,
        reuseTiles: false,
        mecator:new fastmap.mapApi.MecatorTranform(),
        updateWhenIdle: true,

        type: 'LineString',

        restrictZoom:10
    });
    map.addLayer(tileJson);
    function parseLineStringData(data) {
        var geojson = {};
        geojson['features'] = [];
        $.each(data, function (index, item) {
            var obj = {};
            obj['type'] = "Feature";
            obj['geometry'] = {};
            obj['geometry']['type'] = 'LineString';
            obj['geometry']['coordinates'] = [];
            for (var i = 0, len = item.g.length; i < len; i = i + 2) {
                obj['geometry']['coordinates'].push([item.g[i], item.g[i + 1]]);
            }
            obj['properties'] = {
                'id': item.i,
                'color': item.s
            }
            geojson['features'].push(obj);
        });
        return geojson;
    }

    $('#btn_zoonin').click(function(e){
        map.mapControl.zoomIn()
    })

    $('#btn_zoonout').click(function(e){
        map.mapControl.zoomOut()
    })
});

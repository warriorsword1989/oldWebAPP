/**
 * Created by zhongxiaoming on 2015/10/23.
 * Class layerconfig
 */
/**
 * Created by zhongxiaoming on 2015/8/7.
 */
Application.layersConfig =
    [
        {
            groupid: "backgroundLayers",
            groupname: "参考",
            layers: [

                {
                    clazz: L.tileLayer.wms,
                    url: "http://zs.navinfo.com:7090/rest/wms",
                    options: {
                        layername: "资三",
                        layers: 'GCJ02',
                        crs: L.CRS.EPSG4326,
                        version: '1.1.1',
                        selected: false,
                        id: 'zisan',
                        visible: false,
                        maxZoom: 20,
                        editable: false,
                        zIndex:1,
                        singleselect:true
                    }

                }, {

                    clazz: L.tileLayer,
                    url: 'http://{s}.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=0',
                    options: {
                        layername: '腾讯',
                        subdomains: ["rt0", "rt1", "rt2", "rt3"],
                        tms: true,
                        maxZoom: 20,
                        selected: true,
                        id: 'tencent',
                        visible: true,
                        added: true,
                        singleselect:true,
                        zIndex:2
                    }

                }, {
                    url: '',
                    clazz: fastmap.mapApi.tileJSON,
                    options: {
                        layername: '照片',
                        id: 'photo',
                        url: '',

                        visible: false,

                        zIndex:4
                    }

                }, {
                    url: '',
                    clazz: fastmap.mapApi.meshLayer,
                    options: {
                        layername: '图幅',
                        id: 'mesh',
                        url: '',

                        visible: false,

                        zIndex:3
                    }

                }
            ]
        }, {
        groupid: "dataLayers",
        groupname: "作业参考",
        layers: [{
            url:'http://192.168.4.130/FosEngineWeb3/pdh/obj/getByTileWithGap?',
            clazz: fastmap.mapApi.tileJSON,
            options: {
                layername: '参考线数据',
                id: 'referenceLine',
                maxZoom: 20,
                hitDetection: true,
                debug: false,
                // this value should be equal to 'radius' of your points
                buffer: 5,
                boolPixelCrs: true ,
                parse:  function (data) {
                    var geojson = {};
                    geojson['features'] = [];
                    $.each(data, function (index, item) {
                        var obj = {};
                        obj['type'] = "Feature";
                        obj['geometry'] = {};
                        obj['geometry']['type'] = 'LineString';
                        obj['geometry']['coordinates'] = [];
                        for (var i = 0, len = item.g.length; i < len; i = i+1) {
                            obj['geometry']['coordinates'].push([item.g[i]]);
                        }
                        obj['properties'] = {
                            'id': item.i,
                            'color': item.m.a,
                            'name':item.m.b,
                            'kind':item.m.c,
                            'direct':item.m.d,
                            'snode':item.m.e,
                            'enode':item.m.f
                        }
                        geojson['features'].push(obj);
                    });
                    return geojson;
                },
                boundsArr: [],
                unloadInvisibleTiles: true,
                reuseTiles: false,
                mecator:new fastmap.mapApi.MecatorTranform(),
                updateWhenIdle: true,
                tileSize:256,
                type: 'LineString',
                zIndex:17,
                restrictZoom:10,
                editable:false,
                visible: true,
                requestType:'RDLINK',
                showNodeLevel:17
            }

        },{
            url:'http://192.168.4.130/FosEngineWeb3/pdh/obj/getByTileWithGap?',
            clazz: fastmap.mapApi.tileJSON,
            options: {
                layername: '参考点数据',
                id: 'referencePoint',
                maxZoom: 20,
                hitDetection: true,
                debug: false,
                // this value should be equal to 'radius' of your points
                buffer: 10,
                boolPixelCrs: true ,
                parse:  function (data) {
                    var geojson = {};
                    geojson['features'] = [];
                    $.each(data, function (index, item) {
                        var obj = {};
                        obj['type'] = "Feature";
                        obj['geometry'] = {};
                        obj['geometry']['type'] = 'Point';
                        obj['geometry']['coordinates'] = [];
                        for (var i = 0, len = item.g.length; i < len; i = i+1) {
                            obj['geometry']['coordinates'].push([item.g[i]]);
                        }
                        obj['properties'] = {
                            'id': item.i,
                            'restrictioncondition':item.m.a,
                            'restrictioninfo': item.m.b,
                            'rotate':item.m.c

                        }
                        geojson['features'].push(obj);
                    });
                    return geojson;
                },
                boundsArr: [],
                unloadInvisibleTiles: true,
                reuseTiles: false,
                mecator:new fastmap.mapApi.MecatorTranform(),
                updateWhenIdle: true,
                tileSize:256,
                type: 'Marker',
                zIndex:6,
                restrictZoom:10,
                visible: true,
                requestType:'RDRESTRICTION',
                showNodeLevel:17
            }

        },{
            url:'http://192.168.4.130/FosEngineWeb3/pdh/obj/getByTileWithGap?',
            clazz: fastmap.mapApi.tileJSON,
            options: {
                layername: '参考点数据111',
                id: 'highSpeedDivergence',
                maxZoom: 20,
                hitDetection: true,
                debug: false,
                // this value should be equal to 'radius' of your points
                buffer: 10,
                boolPixelCrs: true ,
                parse:  function (data) {
                    var geojson = {};
                    geojson['features'] = [];
                    $.each(data, function (index, item) {
                        var obj = {};
                        obj['type'] = "Feature";
                        obj['geometry'] = {};
                        obj['geometry']['type'] = 'Point';
                        obj['geometry']['coordinates'] = [];
                        for (var i = 0, len = item.g.length; i < len; i = i+1) {
                            obj['geometry']['coordinates'].push([item.g[i]]);
                        }
                        obj['properties'] = {
                            'id': item.i,
                            'restrictioncondition':item.m.a,
                            'restrictioninfo': item.m.b,
                            'rotate':item.m.c

                        }
                        geojson['features'].push(obj);
                    });
                    return geojson;
                },
                boundsArr: [],
                unloadInvisibleTiles: true,
                reuseTiles: false,
                mecator:new fastmap.mapApi.MecatorTranform(),
                updateWhenIdle: true,
                tileSize:256,
                type: 'Diverge',
                zIndex:10,
                restrictZoom:10,
                visible: false,
                requestType:'RDBRANCH',
                showNodeLevel:17
            }

        },{
            url:'http://192.168.4.130/FosEngineWeb3/pdh/obj/getByTileWithGap?',
            clazz: fastmap.mapApi.tileJSON,
            options: {
                layername: '限速',
                id: 'speedlimit',
                maxZoom: 20,
                hitDetection: true,
                debug: false,
                // this value should be equal to 'radius' of your points
                buffer: 10,
                boolPixelCrs: true ,
                parse:  function (data) {
                    var geojson = {};
                    geojson['features'] = [];
                    $.each(data, function (index, item) {
                        var obj = {};
                        obj['type'] = "Feature";
                        obj['geometry'] = {};
                        obj['geometry']['type'] = 'Point';
                        obj['geometry']['coordinates'] = [];
                        for (var i = 0, len = item.g.length; i < len; i = i+1) {
                            obj['geometry']['coordinates'].push([item.g[i]]);
                        }
                        obj['properties'] = {
                            'id': item.i,
                            'restrictioncondition':item.m.a,
                            'restrictioninfo': item.m.b,
                            'rotate':item.m.c

                        }
                        geojson['features'].push(obj);
                    });
                    return geojson;
                },
                boundsArr: [],
                unloadInvisibleTiles: true,
                reuseTiles: false,
                mecator:new fastmap.mapApi.MecatorTranform(),
                updateWhenIdle: true,
                tileSize:256,
                type: 'rdSpeedLimitPoint',
                zIndex:10,
                restrictZoom:10,
                visible: true,
                requestType:'RDSPEEDLIMIT',
                showNodeLevel:17
            }

        },{
            url:'http://192.168.4.130/FosEngineWeb3/pdh/obj/getByTileWithGap?',
            clazz: fastmap.mapApi.tileJSON,
            options: {
                layername: 'rdcross',
                id: 'rdcross',
                maxZoom: 20,
                hitDetection: true,
                debug: false,
                // this value should be equal to 'radius' of your points
                buffer: 10,
                boolPixelCrs: true ,
                parse:  function (data) {
                    var geojson = {};
                    geojson['features'] = [];
                    $.each(data, function (index, item) {
                        var obj = {};
                        obj['type'] = "Feature";
                        obj['geometry'] = {};
                        obj['geometry']['type'] = 'Point';
                        obj['geometry']['coordinates'] = [];
                        for (var i = 0, len = item.g.length; i < len; i = i+1) {
                            obj['geometry']['coordinates'].push([item.g[i]]);
                        }
                        obj['properties'] = {
                            'id': item.i,
                            'restrictioncondition':item.m.a,
                            'restrictioninfo': item.m.b,
                            'rotate':item.m.c

                        }
                        geojson['features'].push(obj);
                    });
                    return geojson;
                },
                boundsArr: [],
                unloadInvisibleTiles: true,
                reuseTiles: false,
                mecator:new fastmap.mapApi.MecatorTranform(),
                updateWhenIdle: true,
                tileSize:256,
                type: 'rdCrossPoint',
                zIndex:13,
                restrictZoom:10,
                visible: true,
                requestType:'RDCROSS',
                showNodeLevel:17
            }

        }]
    },{
        groupid:'worklayer',
        groupname:'编辑图层',
        layers: [{
            url:'http://192.168.4.130/FosEngineWeb3/fcc/tip/getByTileWithGap?',
            clazz: fastmap.mapApi.tileJSON,
            options: {
                layername: '外业线数据',
                id: 'workLine',
                maxZoom: 20,
                hitDetection: true,
                debug: false,
                // this value should be equal to 'radius' of your points
                buffer: 7,
                boolPixelCrs: true ,
                parse:  function (data) {
                    var geojson = {};
                    var data = data.RDLINK;
                    geojson['features'] = [];
                    $.each(data, function (index, item) {
                        var obj = {};
                        obj['type'] = "Feature";
                        obj['geometry'] = {};
                        obj['geometry']['type'] = 'LineString';
                        obj['geometry']['coordinates'] = [];
                        for (var i = 0, len = item.g.length; i < len; i = i+1) {
                            obj['geometry']['coordinates'].push([item.g[i]]);
                        }
                        obj['properties'] = {
                            'id': item.i,
                            'color': item.m.a,
                            'name':item.m.b,
                            'kind':item.m.c,
                            'direct':item.m.d
                        }
                        geojson['features'].push(obj);
                    });
                    return geojson;
                },
                boundsArr: [],
                unloadInvisibleTiles: true,
                reuseTiles: false,
                mecator:new fastmap.mapApi.MecatorTranform(),
                updateWhenIdle: true,
                tileSize:256,
                type: 'LineString',
                zIndex:7,
                restrictZoom:10,
                visible: false,
                requestType:12,
                showNodeLevel:17
            }

        },{
            url:'http://192.168.4.130/FosEngineWeb3/fcc/tip/getByTileWithGap?',
            clazz: fastmap.mapApi.tileJSON,
            options: {
                layername: '外业点数据',
                id: 'workPoint',
                maxZoom: 20,
                hitDetection: true,
                debug: false,
                // this value should be equal to 'radius' of your points
                buffer: 8,
                boolPixelCrs: true ,
                parse:  function (data) {
                    var geojson = {};
                    geojson['features'] = [];
                    $.each(data, function (index, item) {
                        var obj = {};
                        obj['type'] = "Feature";
                        obj['geometry'] = {};
                        obj['geometry']['type'] = 'Point';
                        obj['geometry']['coordinates'] = [];
                        if(item.g ===undefined){
                            return;
                        }
                        for (var i = 0, len = item.g.length; i < len; i = i+1) {

                            obj['geometry']['coordinates'].push([item.g[i]]);
                        }
                        obj['properties'] = {
                            'id': item.i,
                            'type': item.t,
                            'srctype':item.m.a
                        }
                        geojson['features'].push(obj);
                    });
                    return geojson;
                },
                boundsArr: [],
                unloadInvisibleTiles: true,
                reuseTiles: false,
                mecator:new fastmap.mapApi.MecatorTranform(),
                updateWhenIdle: true,
                tileSize:256,
                type: 'Point',
                zIndex:9,
                restrictZoom:10,
                visible: true,
                requestType:7,
                showNodeLevel:17
            }

        }]
    },{
        groupid:'editlayer',
        groupname:'编辑图层',

        layers: [{
            clazz: fastmap.mapApi.editLayer,
            url:'',
            options: {
                layername: '编辑',
                id: 'edit',
                url: '',

                visible: true,

                zIndex:0



            }

        }



        ]
    }
    ]



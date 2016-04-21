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
                        zIndex: 1,
                        singleselect: true
                    }

                }, {

                    clazz: L.tileLayer,
                    url: 'http://{s}.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=0',
                    options: {
                        layername: '腾讯',
                        subdomains: ["rt0", "rt1", "rt2", "rt3"],
                        tms: true,
                        maxZoom: 20,
                        selected: false,
                        id: 'tencent',
                        visible: false,
                        added: true,
                        singleselect: true,
                        zIndex: 2
                    }

                }, {
                    url: '',
                    clazz: fastmap.mapApi.tileJSON,
                    options: {
                        layername: '照片',
                        id: 'photo',
                        url: '',
                        visible: false,
                        zIndex: 4
                    }

                }, {
                    url: '',
                    clazz: fastmap.mapApi.meshLayer,
                    options: {
                        layername: '图幅',
                        id: 'mesh',
                        url: '',
                        visible: false,
                        zIndex: 3
                    }
                }
            ]
        }, {
        groupid: "dataLayers",
        groupname: "作业参考",
        layers: [{
            url: Application.url + '/render/obj/getByTileWithGap?',

            clazz: fastmap.mapApi.tileJSON,
            options: {
                layername: '参考线数据',
                id: 'referenceLine',
                maxZoom: 20,

                debug: false,
                // this value should be equal to 'radius' of your points
                buffer: 5,
                boolPixelCrs: true,
                parse: function (data) {
                    //data["type"] = "RDLINK";
                    //return transformData(data);
                    var geojson = {};
                    geojson['features'] = [];
                    data["type"] = "RDLINK";
                    $.each(data, function (index, item) {
                        var obj = {};
                        obj['type'] = "Feature";
                        obj['geometry'] = {};
                        obj['geometry']['type'] = 'LineString';
                        obj['geometry']['coordinates'] = [];
                        for (var i = 0, len = item.g.length; i < len; i = i + 1) {
                            obj['geometry']['coordinates'].push([item.g[i]]);
                        }
                        obj['properties'] = {
                            'id': item.i,
                            'color': item.m.a,
                            'name': item.m.b,
                            'kind': item.m.c,
                            'direct': item.m.d,
                            'snode': item.m.e,
                            'enode': item.m.f,
                            'pattern': item.m.h
                        }
                        geojson['features'].push(obj);
                    });
                    return geojson;
                },
                boundsArr: [],
                unloadInvisibleTiles: true,
                reuseTiles: false,
                mecator: new fastmap.mapApi.MecatorTranform(),
                updateWhenIdle: true,
                tileSize: 256,
                type: 'LineString',
                zIndex: 17,
                restrictZoom: 10,
                editable: false,
                visible: true,
                requestType: 'RDLINK',
                showNodeLevel: 17
            }

        },
           {

                url: Application.url + '/render/obj/getByTileWithGap?',

                clazz: fastmap.mapApi.tileJSON,
                options: {
                    layername: '交限',
                    id: 'restriction',
                    maxZoom: 20,

                    debug: false,
                    // this value should be equal to 'radius' of your points
                    buffer: 10,
                    boolPixelCrs: true,
                    parse: function (data) {
                        var geojson = {};
                        geojson['features'] = [];
                        $.each(data, function (index, item) {
                            var obj = {};
                            obj['type'] = "Feature";
                            obj['geometry'] = {};
                            obj['geometry']['type'] = 'Point';
                            obj['geometry']['coordinates'] = [];
                            for (var i = 0, len = item.g.length; i < len; i = i + 1) {
                                obj['geometry']['coordinates'].push([item.g[i]]);
                            }
                            obj['properties'] = {
                                'id': item.i,
                                'restrictioncondition': item.m.a,
                                "restrictioninfo": item.m.b,
                                'restrictionrotate': item.m.c

                            }
                            geojson['features'].push(obj);
                        });
                        return geojson;
                    },
                    boundsArr: [],
                    unloadInvisibleTiles: true,
                    reuseTiles: false,
                    mecator: new fastmap.mapApi.MecatorTranform(),
                    updateWhenIdle: true,
                    tileSize: 256,
                    type: 'Marker',
                    zIndex: 6,
                    restrictZoom: 10,
                    visible: true,
                    requestType: 'RDRESTRICTION',
                    showNodeLevel: 17
                }

            }, {
                url: Application.url + '/render/obj/getByTileWithGap?',
                clazz: fastmap.mapApi.tileJSON,
                options: {
                    layername: '高速分歧',
                    id: 'highSpeedDivergence',
                    maxZoom: 20,

                    debug: false,
                    // this value should be equal to 'radius' of your points
                    buffer: 10,
                    boolPixelCrs: true,
                    parse: function (data) {
                        var geojson = {};
                        geojson['features'] = [];
                        $.each(data, function (index, item) {
                            var obj = {};
                            obj['type'] = "Feature";
                            obj['geometry'] = {};
                            obj['geometry']['type'] = 'Point';
                            obj['geometry']['coordinates'] = [];
                            for (var i = 0, len = item.g.length; i < len; i = i + 1) {
                                obj['geometry']['coordinates'].push([item.g[i]]);
                            }
                            var id = '';
                            for (var key in item.m.a) {
                                if (item.m.a[key].type == 0) {
                                    //for(var obj in item.m.a[key].ids){
                                    id = item.m.a[key].ids[0].detailId;
                                    //}
                                }
                            }


                            obj['properties'] = {
                                'id': id,
                                "SpeedDivergencecondition": item.m.a,
                                "SpeedDivergenceinfo": item.m.b,
                                'SpeedDivergencerotate': item.m.c

                            }
                            geojson['features'].push(obj);
                        });
                        return geojson;
                    },
                    boundsArr: [],
                    unloadInvisibleTiles: true,
                    reuseTiles: false,
                    mecator: new fastmap.mapApi.MecatorTranform(),
                    updateWhenIdle: true,
                    tileSize: 256,
                    type: 'Diverge',
                    zIndex: 10,
                    restrictZoom: 10,
                    visible: true,
                    requestType: 'RDBRANCH',
                    showNodeLevel: 17
                }

            }, {
                url: Application.url + '/render/obj/getByTileWithGap?',
                clazz: fastmap.mapApi.tileJSON,
                options: {
                    layername: '限速',
                    id: 'speedlimit',
                    maxZoom: 20,

                    debug: false,
                    // this value should be equal to 'radius' of your points
                    buffer: 10,
                    boolPixelCrs: true,
                    parse: function (data) {
                        var geojson = {};
                        geojson['features'] = [];
                        $.each(data, function (index, item) {
                            var obj = {};
                            obj['type'] = "Feature";
                            obj['geometry'] = {};
                            obj['geometry']['type'] = 'Point';
                            obj['geometry']['coordinates'] = [];
                            for (var i = 0, len = item.g.length; i < len; i = i + 1) {
                                obj['geometry']['coordinates'].push([item.g[i]]);
                            }
                            obj['properties'] = {
                                'id': item.i,
                                'speedlimittype': item.m.a,
                                "speedlimitcondition": item.m.b,
                                'speedlimitrotate': item.m.c

                            }
                            geojson['features'].push(obj);
                        });
                        return geojson;
                    },
                    boundsArr: [],
                    unloadInvisibleTiles: true,
                    reuseTiles: false,
                    mecator: new fastmap.mapApi.MecatorTranform(),
                    updateWhenIdle: true,
                    tileSize: 256,
                    type: 'rdSpeedLimitPoint',
                    zIndex: 10,
                    showType: 1,
                    restrictZoom: 10,
                    visible: true,
                    requestType: 'RDSPEEDLIMIT',
                    showNodeLevel: 17
                }

            }, {
                url: Application.url + '/render/obj/getByTileWithGap?',
                clazz: fastmap.mapApi.tileJSON,
                options: {
                    layername: '路口',
                    id: 'rdcross',
                    maxZoom: 20,

                    debug: false,
                    // this value should be equal to 'radius' of your points
                    buffer: 10,
                    boolPixelCrs: true,
                    parse: function (data) {
                        var geojson = {};
                        geojson['features'] = [];
                        $.each(data, function (index, item) {
                            var obj = {};
                            obj['type'] = "Feature";
                            obj['geometry'] = {};
                            obj['geometry']['type'] = 'Point';
                            obj['geometry']['coordinates'] = [];
                            for (var i = 0, len = item.g.length; i < len; i = i + 1) {
                                obj['geometry']['coordinates'].push([item.g[i]]);
                            }
                            obj['properties'] = {
                                'id': item.i,
                                'rdcrosscondition': item.m.a

                            }
                            geojson['features'].push(obj);
                        });
                        return geojson;
                    },
                    boundsArr: [],
                    unloadInvisibleTiles: true,
                    reuseTiles: false,
                    mecator: new fastmap.mapApi.MecatorTranform(),
                    updateWhenIdle: true,
                    tileSize: 256,
                    type: 'rdCrossPoint',
                    zIndex: 18,
                    restrictZoom: 10,
                    visible: true,
                    requestType: 'RDCROSS',
                    showNodeLevel: 17
                }

            }, {
                url: Application.url + '/render/obj/getByTileWithGap?',
                clazz: fastmap.mapApi.tileJSON,
                options: {
                    layername: '车信',
                    id: 'rdlaneconnexity',
                    maxZoom: 20,

                    debug: false,
                    // this value should be equal to 'radius' of your points
                    buffer: 10,
                    boolPixelCrs: true,
                    parse: function (data) {
                        var geojson = {};
                        geojson['features'] = [];
                        $.each(data, function (index, item) {
                            var obj = {};
                            obj['type'] = "Feature";
                            obj['geometry'] = {};
                            obj['geometry']['type'] = 'Point';
                            obj['geometry']['coordinates'] = [];
                            for (var i = 0, len = item.g.length; i < len; i = i + 1) {
                                obj['geometry']['coordinates'].push([item.g[i]]);
                            }
                            obj['properties'] = {
                                'id': item.i,
                                'laneconnexitycondition': item.m.a,
                                'laneconnexityinfo': item.m.b,
                                'laneconnexityrotate': item.m.c

                            }
                            geojson['features'].push(obj);
                        });
                        return geojson;
                    },
                    boundsArr: [],
                    unloadInvisibleTiles: true,
                    reuseTiles: false,
                    mecator: new fastmap.mapApi.MecatorTranform(),
                    updateWhenIdle: true,
                    tileSize: 256,
                    type: 'rdlaneconnexityPoint',
                    zIndex: 10,
                    restrictZoom: 10,
                    visible: true,
                    requestType: 'RDLANECONNEXITY',
                    showNodeLevel: 17
                }

            }, {
                url: Application.url + '/render/obj/getByTileWithGap?',
                clazz: fastmap.mapApi.tileJSON,
                options: {
                    layername: '互联网RTIC',
                    id: 'rdrtic',
                    maxZoom: 20,

                    debug: false,
                    // this value should be equal to 'radius' of your points
                    buffer: 10,
                    boolPixelCrs: true,
                    parse: function (data) {
                        var geojson = {};
                        geojson['features'] = [];
                        $.each(data, function (index, item) {
                            var obj = {};
                            obj['type'] = "Feature";
                            obj['geometry'] = {};
                            obj['geometry']['type'] = 'Point';
                            obj['geometry']['coordinates'] = [];
                            for (var i = 0, len = item.g.length; i < len; i = i + 1) {
                                obj['geometry']['coordinates'].push([item.g[i]]);
                            }
                            obj['properties'] = {
                                'id': item.i,
                                'forwardInformation': item.m.a,//顺向信息
                                'forwardLevel': item.m.b,//顺向等级
                                'reverseInformation': item.m.c,//逆向信息
                                'reverseLevel': item.m.d//逆向等级
                            }
                            geojson['features'].push(obj);
                        });
                        return geojson;
                    },
                    boundsArr: [],
                    unloadInvisibleTiles: true,
                    reuseTiles: false,
                    mecator: new fastmap.mapApi.MecatorTranform(),
                    updateWhenIdle: true,
                    tileSize: 256,
                    type: 'rdrticPoint',
                    zIndex: 11,
                    restrictZoom: 10,
                    visible: false,
                    requestType: 'RDLINKINTRTIC',
                    showNodeLevel: 17,
                    isUpDirect: true
                }

            },  {
                url: Application.url + '/render/obj/getByTileWithGap?',

                clazz: fastmap.mapApi.tileJSON,
                options: {
                    layername: '行政区划面',
                    id: 'adface',
                    maxZoom: 20,

                    debug: false,
                    // this value should be equal to 'radius' of your points
                    buffer: 5,
                    boolPixelCrs: true,
                    parse: function (data) {
                        var geojson = {};
                        geojson['features'] = [];
                        $.each(data, function (index, item) {
                            var obj = {};
                            obj['type'] = "Feature";
                            obj['geometry'] = {};
                            obj['geometry']['type'] = 'Polygon';
                            obj['geometry']['coordinates'] = [];
                            for (var i = 0, len = item.g.length; i < len; i = i + 1) {
                                obj['geometry']['coordinates'].push([item.g[i]]);
                            }
                            obj['properties'] = {
                                'id': item.i
                            }
                            geojson['features'].push(obj);
                        });
                        return geojson;
                    },
                    boundsArr: [],
                    unloadInvisibleTiles: true,
                    reuseTiles: false,
                    mecator: new fastmap.mapApi.MecatorTranform(),
                    updateWhenIdle: true,
                    tileSize: 256,
                    type: 'Polygon',
                    zIndex: 0,
                    restrictZoom: 10,
                    editable: false,
                    visible: false,
                    requestType: 'ADFACE',
                    showNodeLevel: 17
                }

            },
            {
                url: Application.url + '/render/obj/getByTileWithGap?',
                clazz: fastmap.mapApi.tileJSON,
                options: {
                    layername: '行政区划',
                    id: 'adLink',
                    maxZoom: 20,
                    debug: false,
                    // this value should be equal to 'radius' of your points
                    buffer: 10,
                    boolPixelCrs: true,
                    parse: function (data) {
                        var geojson = {};
                        geojson['features'] = [];
                        $.each(data, function (index, item) {
                            var obj = {};
                            obj['type'] = "Feature";
                            obj['geometry'] = {};
                            obj['geometry']['type'] = 'LineString';
                            obj['geometry']['coordinates'] = [];
                            for (var i = 0, len = item.g.length; i < len; i = i + 1) {
                                obj['geometry']['coordinates'].push([item.g[i]]);
                            }
                            obj['properties'] = {
                                'id': item.i,
                                'startLinkPid': item.m.a,//起点pid
                                'endLinkPid': item.m.b,//终点pid
                                'kind': 'adlink'
                            }
                            geojson['features'].push(obj);
                        });
                        return geojson;
                    },
                    boundsArr: [],
                    unloadInvisibleTiles: true,
                    reuseTiles: false,
                    mecator: new fastmap.mapApi.MecatorTranform(),
                    updateWhenIdle: true,
                    tileSize: 256,
                    type: 'adLink',
                    zIndex: 8,
                    restrictZoom: 10,
                    editable: false,
                    visible: false,
                    requestType: 'ADLINK',
                    showNodeLevel: 17
                }

            }, {
                url: Application.url + '/render/obj/getByTileWithGap?',
                clazz: fastmap.mapApi.tileJSON,
                options: {
                    layername: '行政区划代表点',
                    id: 'adAdmin',
                    maxZoom: 20,

                    debug: false,
                    // this value should be equal to 'radius' of your points
                    buffer: 10,
                    boolPixelCrs: true,
                    parse: function (data) {
                        var geojson = {};
                        geojson['features'] = [];
                        $.each(data, function (index, item) {
                            var obj = {};
                            obj['type'] = "Feature";
                            obj['geometry'] = {};
                            obj['geometry']['type'] = 'Point';
                            obj['geometry']['coordinates'] = [];
                            for (var i = 0, len = item.g.length; i < len; i = i + 1) {
                                obj['geometry']['coordinates'].push([item.g[i]]);
                            }
                            obj['properties'] = {
                                'id': item.i
                            }
                            geojson['features'].push(obj);
                        });
                        return geojson;
                    },
                    boundsArr: [],
                    unloadInvisibleTiles: true,
                    reuseTiles: false,
                    mecator: new fastmap.mapApi.MecatorTranform(),
                    updateWhenIdle: true,
                    tileSize: 256,
                    type: 'adAdminPoint',
                    zIndex: 18,
                    restrictZoom: 10,
                    visible: true,
                    requestType: 'ADADMIN',
                    showNodeLevel: 17
                }

            }]
    }, {
        groupid: 'worklayer',
        groupname: '编辑图层',
        layers: [{
            url: Application.url + '/render/tip/getByTileWithGap?',

            clazz: fastmap.mapApi.tileJSON,
            options: {
                layername: '外业线数据',
                id: 'workLine',
                maxZoom: 20,

                debug: false,
                // this value should be equal to 'radius' of your points
                buffer: 7,
                boolPixelCrs: true,
                parse: function (data) {
                    var geojson = {};
                    var data = data.RDLINK;
                    geojson['features'] = [];
                    $.each(data, function (index, item) {
                        var obj = {};
                        obj['type'] = "Feature";
                        obj['geometry'] = {};
                        obj['geometry']['type'] = 'LineString';
                        obj['geometry']['coordinates'] = [];
                        for (var i = 0, len = item.g.length; i < len; i = i + 1) {
                            obj['geometry']['coordinates'].push([item.g[i]]);
                        }
                        obj['properties'] = {
                            'id': item.i,
                            'color': item.m.a,
                            'name': item.m.b,
                            'kind': item.m.c,
                            'direct': item.m.d
                        }
                        geojson['features'].push(obj);
                    });
                    return geojson;
                },
                boundsArr: [],
                unloadInvisibleTiles: true,
                reuseTiles: false,
                mecator: new fastmap.mapApi.MecatorTranform(),
                updateWhenIdle: true,
                tileSize: 256,
                type: 'LineString',
                zIndex: 7,
                restrictZoom: 10,
                visible: false,
                requestType: 12,
                showNodeLevel: 17
            }

        }, {
            url: Application.url + '/render/tip/getByTileWithGap?',
            clazz: fastmap.mapApi.tileJSON,
            options: {
                layername: '外业点数据',
                id: 'workPoint',
                maxZoom: 20,

                debug: false,
                // this value should be equal to 'radius' of your points
                buffer: 8,
                boolPixelCrs: true,
                parse: function (data) {
                    var geojson = {};
                    geojson['features'] = [];
                    $.each(data, function (index, item) {
                        if (item.t === 2001 || item.t === 1901) {
                            var obj = {};
                            obj['type'] = "Feature";
                            obj['geometry'] = {};
                            obj['geometry']['type'] = 'Point';
                            obj['geometry']['coordinates'] = [];
                            if (item.m.c === undefined) {
                                return;
                            }
                            for (var i = 0, len = item.m.c.length; i < len; i = i + 1) {

                                obj['geometry']['coordinates'].push([item.m.c[i]]);
                            }
                            obj['properties'] = {
                                'id': item.i,
                                'type': item.t,
                                'srctype': item.m.a
                            }
                            geojson['features'].push(obj);
                        } else if (item.t === 1514) {
                            for (var n = 0; n < 2; n++) {
                                var obj = {};
                                obj['type'] = "Feature";
                                obj['geometry'] = {};
                                obj['geometry']['type'] = 'Point';
                                obj['geometry']['coordinates'] = [];
                                if (item.m.c === undefined) {
                                    return;
                                }
                                if (n == 0) {
                                    for (var i = 0, len = item.m.c.length; i < len; i = i + 1) {

                                        obj['geometry']['coordinates'].push([item.m.c[i]]);
                                    }
                                } else {
                                    for (var j = 0, len = item.m.d.length; j < len; j = j + 1) {

                                        obj['geometry']['coordinates'].push([item.m.d[j]]);
                                    }
                                }
                                obj['properties'] = {
                                    'id': item.i,
                                    'type': item.t,
                                    'srctype': item.m.a,
                                    'kind': item.m.c,
                                    'direc': item.m.d
                                }
                                geojson['features'].push(obj);
                            }

                        }
                        else {
                            var obj = {};
                            obj['type'] = "Feature";
                            obj['geometry'] = {};
                            obj['geometry']['type'] = 'Point';
                            obj['geometry']['coordinates'] = [];
                            if (item.g === undefined) {
                                return;
                            }
                            for (var i = 0, len = item.g.length; i < len; i = i + 1) {

                                obj['geometry']['coordinates'].push([item.g[i]]);
                            }
                            obj['properties'] = {
                                'id': item.i,
                                'type': item.t,
                                'srctype': item.m.a,
                                'kind': item.m.c,
                                'direc': item.m.d
                            }
                            geojson['features'].push(obj);
                        }

                    });
                    return geojson;
                },
                boundsArr: [],
                unloadInvisibleTiles: true,
                reuseTiles: false,
                mecator: new fastmap.mapApi.MecatorTranform(),
                updateWhenIdle: true,
                tileSize: 256,
                type: 'Point',
                zIndex: 9,
                restrictZoom: 10,
                visible: true,
                requestType: "",
                showNodeLevel: 17
            }

        }, {
            url: Application.url + '/render/tip/getByTileWithGap?',
            clazz: fastmap.mapApi.tileJSON,
            options: {
                layername: '测线',
                id: 'gpsLine',
                maxZoom: 20,

                debug: false,
                // this value should be equal to 'radius' of your points
                buffer: 8,
                boolPixelCrs: true,
                parse: function (data) {
                    var geojson = {};
                    geojson['features'] = [];
                    $.each(data, function (index, item) {
                        if (item.t === 2001 || item.t === 1901 || item.t === 1510 || item.t === 1803 || item.t === 1514 || item.t === 1801) {
                            if (item.t === 1801) {
                                for (var j = 0; j < item.m.c.length; j++) {
                                    var obj = {};
                                    obj['type'] = "Feature";
                                    obj['geometry'] = {};
                                    obj['geometry']['type'] = 'LineString';
                                    obj['geometry']['coordinates'] = [];
                                    for (var i = 0, len = item.m.c[j].g.length; i < len; i = i + 1) {
                                        obj['geometry']['coordinates'].push([item.m.c[j].g[i]]);
                                    }
                                    obj['properties'] = {
                                        'id': item.i,
                                        'color': 13,
                                        'name': item.m.b,
                                        'kind': item.t,
                                        'style': item.m.c[j].s
                                    }
                                    geojson['features'].push(obj);
                                }

                            } else {
                                var obj = {};
                                obj['type'] = "Feature";
                                obj['geometry'] = {};
                                obj['geometry']['type'] = 'LineString';
                                obj['geometry']['coordinates'] = [];
                                for (var i = 0, len = item.g.length; i < len; i = i + 1) {
                                    obj['geometry']['coordinates'].push([item.g[i]]);
                                }
                                obj['properties'] = {
                                    'id': item.i,
                                    'color': 13,
                                    'name': item.m.b,
                                    'kind': item.t,
                                    'direct': item.m.d
                                }
                                geojson['features'].push(obj);
                            }
                        }

                    });
                    return geojson;
                },
                boundsArr: [],
                unloadInvisibleTiles: true,
                reuseTiles: false,
                mecator: new fastmap.mapApi.MecatorTranform(),
                updateWhenIdle: true,
                tileSize: 256,
                type: 'gpsLine',
                zIndex: 12,
                restrictZoom: 10,
                visible: true,
                requestType: "",
                showNodeLevel: 17
            }

        }, {
            url: '',
            clazz: fastmap.mapApi.tileJSON,
            options: {
                layername: '选中高亮图层',
                id: 'highlightlayer',
                maxZoom: 20,

                debug: false,
                buffer: 8,
                boolPixelCrs: true,
                parse: function (data) {

                },
                mecator: new fastmap.mapApi.MecatorTranform(),
                tileSize: 256,
                type: 'highlight',

                zIndex: 18,
                restrictZoom: 10,
                visible: true
            },
            requestType: "uuuuu"
        }]
    }, {
        groupid: 'editlayer',
        groupname: '编辑图层',

        layers: [{
            clazz: fastmap.mapApi.editLayer,
            url: '',
            options: {
                layername: '编辑',
                id: 'edit',
                url: '',

                visible: true,

                zIndex: 0


            }

        }


        ]
    }
    ]
function transformData(data) {
    var featArr = [];
    $.each(data, function (index, item) {
        var obj = {};
        obj['geometry'] = {};
        obj['geometry']['coordinates'] = [];
        for (var ii = 0, lenI = item.g.length; ii < lenI; ii++) {
            obj['geometry']['coordinates'].push([item.g[ii]]);
        }

        obj['properties']['id'] = item.i;
        featArr.push(obj);
        switch (item.t) {
            case 2://照片
                break;
            case 3://交限
                obj['geometry']['type'] = 'Point';
                obj['properties']["featType"] = "RDRESTRICTION";
                obj['properties']['markerStyle']["icon"] = [];
                obj['properties']['rotate'] = item.m.c;
                var restrictArr = (item.m.b).split(",");
                for (var j = 0, lenJ = restrictArr.length; j < lenJ; j++) {
                    var restrictICon = {};
                    if (restrictArr[i].indexOf("[") !== -1) {
                        restrictICon = getIconStyle('../../images/road/1302/1302_2_' + restrictArr[j][1] + '.svg',
                            j, 0, obj['geometry']['coordinates'][0])
                    } else {
                        restrictICon = getIconStyle('../../images/road/1302/1302_1_' + restrictArr[j] + '.svg',
                            j, 0, obj['geometry']['coordinates'][0])
                    }
                    obj['properties']['markerStyle']["icon"].push(restrictICon);
                }
                break;
            case 4://link
                obj['properties']["featType"] = "RDLINK";
                obj['geometry']['type'] = 'LineString';
                obj['properties'] = {
                    'name': item.m.b,
                    'direct': item.m.d
                };
                obj['properties']['pattern'] = item.m.c;
                obj['properties']['style']['strokeColor'] = RD_LINK_Colors[parseInt(item.m.a)];
                obj['properties']['style'] = {
                    'strokeWidth': 2,
                    'strokeOpacity': 2
                }
                break;
            case 5://车信
                obj['geometry']['type'] = 'Point';
                obj['properties']["featType"] = "RDLANECONNEXITY";
                obj['properties']['markerStyle']["icon"] = [];
                obj['properties']['rotate'] = item.m.c;
                var laneArr = item.item.m.b.split(",");
                for (var lane = 0, laneNum = laneArr.length; lane < laneNum; lane++) {
                    if (laneArr[lane].indexOf("[") > -1) {
                        obj['properties']['markerStyle']["icon"].push(
                            getIconStyle('../../images/road/1301/1301_2_' + laneArr[lane].substr(1, 1) + '.svg', lane, 0, obj['geometry']['coordinates'][0])
                        );
                        if (laneArr[lane].indexOf("<") > -1) {
                            obj['properties']['markerStyle']["icon"].push(
                                getIconStyle('../../images/road/1301/1301_1_' + laneArr[lane].substr(laneArr[lane].indexOf("<") + 1, 1) + '.svg', lane, lane, obj['geometry']['coordinates'][0])
                            );
                        }

                    } else if (laneArr[lane].indexOf("<") > -1) {
                        obj['properties']['markerStyle']["icon"].push(
                            getIconStyle('../../images/road/1301/1301_0_' + laneArr[lane].substr(laneArr[lane].indexOf("<") + 1, 1) + '.svg', lane, lane, obj['geometry']['coordinates'][0])
                        );
                        obj['properties']['markerStyle']["icon"].push(
                            getIconStyle('../../images/road/1301/1301_1_' + laneArr[lane].substr(laneArr[lane].indexOf("<") + 1, 1) + '.svg', lane, lane, obj['geometry']['coordinates'][0])
                        );

                    } else if (laneArr[lane]) {
                        obj['properties']['markerStyle']["icon"].push(
                            getIconStyle('../../images/road/1301/1301_0_' + laneArr[lane] + '.svg', lane, 0, obj['geometry']['coordinates'][0])
                        );
                    }

                }
                break;
            case 6://点限速
                var resArray = item.m.b.split("1");
                var type = item.m.a;
                if(type == 0){
                    var fieldCollection = resArray[0];//采集标志（0,现场采集;1,理论判断）
                    var speedFlag = resArray[1];//限速标志(0,限速开始;1,解除限速)
                    var speedValue = resArray[2];//限速值

                    if (fieldCollection === "1") {//理论判断，限速开始和结束都为蓝色
                        if (speedFlag === "1") {//解除限速
                            obj['properties']['markerStyle']["icon"].push(
                                getIconStyle('../../images/road/1101/1101_1_1_' + speedValue + '.svg', 1, 0, obj['geometry']['coordinates'][0])
                            );

                        } else {
                            obj['properties']['markerStyle']["icon"].push(
                                getIconStyle('../../images/road/1101/1101_1_0_' + speedValue + '.svg', 2, 0, obj['geometry']['coordinates'][0])
                            );

                        }

                    } else {//现场采集，限速开始为红色，结束为黑色
                        if (speedFlag === "1") {//解除限速
                            obj['properties']['markerStyle']["icon"].push(
                                getIconStyle( '../../images/road/1101/1101_0_1_' + speedValue + '.svg', 1, 0, obj['geometry']['coordinates'][0])
                            );


                        } else {
                            obj['properties']['markerStyle']["icon"].push(
                                getIconStyle( '../../images/road/1101/1101_0_0_' + speedValue + '.svg', 2, 0, obj['geometry']['coordinates'][0])
                            );

                        }
                    }


                }else{
                    var limitSpeed = resArray[1];
                    var condition = resArray[2];
                    var limitSpeedFlag = resArray[0];
                    var conditionObj={
                        '1':'雨',
                        '2':'雪',
                        '3':'雾',
                        '6':'学',
                        '10':'时',
                        '11':'车',
                        '12':'季',
                        '13':'医',
                        '14':'购物',
                        '15':'居',
                        '16':'企',
                        '17':'景',
                        '18':'交'
                    }
                    obj['properties']['markerStyle']["icon"].push(
                        {
                            text: conditionObj[condition]+limitSpeed,
                            row:2,
                            column:0,
                            location:obj['geometry']['coordinates'][0]
                        }
                    );
                }
                break;
            case 7://分歧
                obj['geometry']['type'] = 'Point';
                for (var key in item.m.a) {
                    if (item.m.a[key].type == 0) {
                        //for(var obj in item.m.a[key].ids){
                        obj['properties']['id'] = item.m.a[key].ids[0].detailId;
                        //}
                    }
                }
                obj['properties']["featType"] = "RDBRANCH";
                obj['properties']['markerStyle']["icon"] = [];
                obj['properties']['rotate'] = item.m.c;
                obj['properties']['markerStyle']["icon"].push(
                    getIconStyle('../../images/road/1407/' + item.a.type + '.svg', 1, 0, obj['geometry']['coordinates'][0])
                )

                break;
            case 8: //路口
                obj['geometry']['type'] = 'Point';
                obj['properties']["featType"] = "RDCROSS";
                obj['properties']['markerStyle']["icon"] = [];
                for (var crossNum = 0, crossLen = obj['geometry']['coordinates'].length; crossNum < crossLen; crossNum++) {
                    var crossObj = {};
                    if (crossNum === 0) {
                        crossObj = getIconStyle('../../images/road/rdcross/11.png', 0, 0, obj['geometry']['coordinates'][crossNum]);
                    } else {
                        crossObj = getIconStyle('../../images/road/rdcross/111.png', 0, 0, obj['geometry']['coordinates'][crossNum]);
                    }
                    obj['properties']['markerStyle']["icon"].push(restrictICon);
                }
                break;
            case 9 ://线限速
                break;
            case 10 ://rtic
                obj['geometry']['type'] = 'Point';
                obj['properties']["featType"] = "RDLINKINTRTIC";
                obj['properties']['markerStyle']["icon"] = [];
                var pointAndAng = {}, src;
                if (item.m.a) {
                    pointAndAng = getRticAngle(obj['geometry']['coordinates'], item.m.a);
                    src = getSrcByKind(item.m.b);
                    obj['properties']['markerStyle']["icon"].push(
                        getIconStyle(src, 0, 0, pointAndAng["point"])
                    );
                }
                if (item.m.c) {
                    pointAndAng = getRticAngle(obj['geometry']['coordinates'], item.m.c);
                    src = getSrcByKind(item.m.d);
                    obj['properties']['markerStyle']["icon"].push(
                        getIconStyle(src, 0, 0, pointAndAng["point"])
                    );
                }
                break;
            case 11://立交
                break;
            case 12 ://行政区划线
                obj['properties']["featType"] = "ADLINK";
                obj['geometry']['type'] = 'LineString';
                obj['properties'] = {
                    'name': item.m.b,
                    'direct': item.m.d
                };
                obj['properties']['pattern'] = item.m.c;
                obj['properties']['style']['strokeColor'] = RD_LINK_Colors[parseInt(item.m.a)];
                obj['properties']['style'] = {
                    'strokeWidth': 2,
                    'strokeOpacity': 2
                }
                break;
            case 13 ://行政区划面
                obj['properties']["featType"] = "ADFACE";
                obj['geometry']['type'] = 'Polygon';
                obj['properties'] = {
                    'name': item.m.b
                };
                obj['properties']['pattern'] = item.m.c;
                obj['properties']['style']['strokeColor'] = RD_LINK_Colors[parseInt(item.m.a)];
                obj['properties']['style'] = {
                    'fillColor': '#eee',
                    'fillOpacity': 0.8,
                    'strokeColor': '#FFF',
                    'strokeWidth': 0,
                    'backgroundImage': ""
                }
                break;
            case  14 ://铁路
                break;
            case 15://行政区划代表点
                obj['geometry']['type'] = 'Point';
                obj['properties']["featType"] = "ADADMIN";
                obj['properties']['markerStyle']["icon"] = [];
                obj['properties']['rotate'] = item.m.c;
                obj['properties']['markerStyle']["icon"].push(
                    getIconStyle(' ../../images/road/img/star.png', 1, 0, obj['geometry']['coordinates'][0])
                );

                break;
            case 1101://限速
                break;
            case 1301://车信
                break;
            case 1407://高速分歧
                break;
            case 1604://
                break;
            case 1704://交叉路口
                break;
            case 1501://上下线分离
                break;
            case 1302://普通交限
                break;
            case 1201://道路种别
                break;
            case 1901://道路名
                obj['properties']["featType"] = item.t;
                obj['geometry']['type'] = "LineString";
                obj['properties'] = {
                    'name': item.m.b
                };
                obj['properties']['style'] = {
                    'strokeColor': '#7030A0',
                    'strokeWidth': 2,
                    'strokeOpacity': 0.8
                };
                break;
            case 2001://侧线
                obj['properties']["featType"] = item.t;
                obj['geometry']['type'] = "LineString";
                obj['properties'] = {
                    'name': item.m.b
                };
                obj['properties']['style'] = {
                    'strokeColor': '#000000',
                    'strokeWidth': 2,
                    'strokeOpacity': 0.8
                };
                break;
            case 1203://道路方向
                break;
            case 1403://3d分歧

                break;

            case 1510://桥
                obj['properties']["featType"] = item.t;
                obj['geometry']['type'] = "LineString";
                obj['properties'] = {
                    'name': item.m.b
                };
                obj['properties']['style'] = {
                    'strokeColor': '#336C0A',
                    'strokeWidth': 2,
                    'strokeOpacity': 0.8
                };
                break;
            case 1514://施工维修
                obj['properties']["featType"] = item.t;
                obj['geometry']['type'] = "LineString";
                obj['properties'] = {
                    'name': item.m.b
                };
                obj['properties']['style'] = {
                    'strokeColor': '#E36C0A',
                    'strokeWidth': 2,
                    'strokeOpacity': 0.8
                };
                break;
            case 1801://立交
                obj=null;
                for (var num = 0; num < item.m.c.length; num++) {
                    var overPassObj = {};
                    overPassObj['geometry'] = {};
                    overPassObj['geometry']['type'] = 'LineString';
                    overPassObj['geometry']['coordinates'] = [];
                    for (var i = 0, len = item.m.c[num].g.length; i < len; i = i + 1) {
                        overPassObj['geometry']['coordinates'].push([item.m.c[num].g[i]]);
                    }
                    overPassObj['properties'] = {
                        'id': item.i,
                        'name': item.m.b,
                        'featType': item.t
                    }
                    if(item.m.c[num].s===1) {
                        obj['properties']['style'] = {
                            'strokeColor': '#E36C0A',
                            'strokeWidth': 2,
                            'strokeOpacity': 0.8
                        };
                    }else{
                        obj['properties']['style'] = {
                            'strokeColor': 'red',
                            'strokeWidth': 2,
                            'strokeOpacity': 0.8
                        };
                    }

                    featArr.push(overPassObj);
                }
                break;
            case 1803://挂接
                obj['properties']["featType"] = item.t;
                obj['geometry']['type'] = "LineString";
                obj['properties'] = {
                    'name': item.m.b
                };
                obj['properties']['style'] = {
                    'strokeColor': '#336C0A',
                    'strokeWidth': 2,
                    'strokeOpacity': 0.8
                };
                break;


        }
    });


    return featArr;
}
var RD_LINK_Colors = [
    '#646464', '#FFAAFF', '#E5C8FF', '#FF6364', '#FFC000', '#0E7892',
    '#63DC13', '#C89665', '#C8C864', '#000000', '#00C0FF', '#DCBEBE',
    '#000000', '#7364C8', '#000000', '#DCBEBE'
];
function getIconStyle(iconName, row, column, location, status) {
    var icon = {};
    icon["iconName"] = iconName;
    icon["row"] = row;
    icon["column"] = column;
    icon["status"] = status || null;
    icon["location"] = location;
    return icon;
};
function getRticAngle(geom, direct) {
    var coords = geom, proj = [], arrowList = [],
        point1, point2, ang, centerPoint;
    for (var rtic = 0; rtic < coords.length; rtic++) {
        proj.push({x: coords[rtic][0][0], y: coords[rtic][0][1]});

    }
    for (var j = 0; j < proj.length; j++) {

        if (j < proj.length - 1) {
            var oneArrow = [proj[j], proj[j + 1]];
            arrowList.push(oneArrow);
        }
    }

    if (direct === 2) {
        point1 = arrowList[arrowList.length - 1][0];
        point2 = arrowList[arrowList.length - 1][1];
    } else if (direct === 3) {
        point1 = arrowList[0][0];
        point2 = arrowList[0][1];
    }
    if (direct == 2) {
        centerPoint = L.point(point2.x, point2.y);
    } else {
        centerPoint = L.point(point1.x, point1.y);
    }
    if (point1.y - point2.y == 0) {
        if (point1.x - point2.x > 0) {
            ang = Math.PI / -2;
        }
        else {
            ang = Math.PI / 2;
        }
    }
    else {
        ang = (point1.x - point2.x) / (point1.y - point2.y);
        ang = Math.atan(ang);
    }
    if (point2.y - point1.y >= 0) {
        if (direct == 2) {
            ang = -ang;
        } else if (direct == 3) {
            ang = -ang + Math.PI;

        }
    } else {
        if (direct == 2) {
            ang = Math.PI - ang; //加个180度，反过来
        } else if (direct == 3) {
            ang = -ang;
        }
    }
    return {ang: ang, point: centerPoint};
}
function getSrcByKind(kind) {
    var src;
    switch (kind) {
        case 1:
            src = "../../images/road/rdcross/111.png";
            break;
        case 2:
            src = "../../images/road/rdcross/111.png";
            break;
        case 3:
            src = "../../images/road/rdcross/111.png";
            break;
        case 4:
            src = "../../images/road/rdcross/111.png";
            break;

    }
    return src;
}
function transformDataForTips(data) {
    var featArr = [];
    $.each(data, function (index, item) {
        var obj = {};
        obj['geometry'] = {};
        obj['properties']['id'] = item.i;
        obj['geometry']['type'] = 'Point';
        obj['geometry']['coordinates'] = [];
        obj['properties']["featType"] = item.t;
        obj['properties']['status'] = item.m.a;
        featArr.push(obj);
        switch (item.t) {
            case 1101://限速
            case 1301://车信
            case 1407://高速分歧
            case 1604://区域内道路
            case 1704://交叉路口
            case 1803://挂接
            case 1501://上下线分离
            case 1302://普通交限
                for (var i = 0, len = item.g.length; i < len; i = i + 1) {

                    obj['geometry']['coordinates'].push([item.g[i]]);
                }
                obj['properties']['markerStyle']["icon"].push(
                    getIconStyle('../../images/road/tips/normal/pending.png', 1, 0, obj['geometry']['coordinates'][0])
                );
                break;
            case 1201://道路种别
                for (var i = 0, len = item.g.length; i < len; i = i + 1) {

                    obj['geometry']['coordinates'].push([item.g[i]]);
                }
                obj['properties']['markerStyle']["icon"].push(
                    getIconStyle('../../images/road/tips/kind/K' + feature.properties.kind + '.svg', 1, 0, obj['geometry']['coordinates'][0])
                );
                break;
            case 1901://道路名
            case 2001://侧线
                for (var i = 0, len = item.m.c.length; i < len; i = i + 1) {

                    obj['geometry']['coordinates'].push([item.m.c[i]]);
                }
                obj['properties']['markerStyle']["icon"].push(
                    getIconStyle('../../images/road/tips/normal/pending.png', 1, 0, obj['geometry']['coordinates'][0])
                );
                break;
            case 1203://道路方向
                for (var i = 0, len = item.g.length; i < len; i = i + 1) {

                    obj['geometry']['coordinates'].push([item.g[i]]);
                }
                obj['properties']['rotate'] = item.m.c;
                if (item.m.d === 2) {
                    obj['properties']['markerStyle']["icon"].push(
                        getIconStyle('../../images/road/tips/road/2.svg', 1, 0, obj['geometry']['coordinates'][0])
                    );
                } else {
                    obj['properties']['markerStyle']["icon"].push(
                        getIconStyle('../../images/road/tips/road/1.svg', 1, 0, obj['geometry']['coordinates'][0])
                    );
                }
                break;
            case 1403://3d分歧
                for (var i = 0, len = item.g.length; i < len; i = i + 1) {

                    obj['geometry']['coordinates'].push([item.g[i]]);
                }
                obj['properties']['markerStyle']["icon"].push(
                    getIconStyle('../../images/road/tips/3D/3D.svg', 1, 0, obj['geometry']['coordinates'][0])
                );
                break;

            case 1510://桥
                break;
            case 1514://施工维修
                for (var n = 0; n < 2; n++) {
                    if (n == 0) {
                        for (var i = 0, len = item.m.c.length; i < len; i++) {
                            obj['geometry']['coordinates'].push([item.m.c[i]]);
                            obj['properties']['markerStyle']["icon"].push(
                                getIconStyle('../../images/road/tips/normal/pending.png', 1, 0, [item.m.c[i]])
                            );
                        }
                    } else {
                        for (var j = 0, lenJ = item.m.d.length; j < lenJ; j++) {
                            obj['geometry']['coordinates'].push([item.m.d[j]]);
                            obj['properties']['markerStyle']["icon"].push(
                                getIconStyle('../../images/road/tips/normal/pending.png', 1, 0, [item.m.d[j]])
                            );
                        }
                    }
                }

                break;
            case 1801://立交
                for (var i = 0, len = item.g.length; i < len; i = i + 1) {

                    obj['geometry']['coordinates'].push([item.g[i]]);
                }
                obj['properties']['markerStyle']["icon"].push(
                    getIconStyle('../../images/road/tips/overpass/overpass.svg', 1, 0, obj['geometry']['coordinates'][0])
                );
                break;


        }
    })
}
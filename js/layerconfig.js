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
                            'color': item.m.a,
                            'name': item.m.b,
                            'kind': item.m.c,
                            'direct': item.m.d,
                            'snode': item.m.e,
                            'enode': item.m.f,
                            'pattern':item.m.h
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
                    zIndex: 17,
                    restrictZoom: 10,
                    editable: false,
                    visible: true,
                    requestType: 'ADFACE',
                    showNodeLevel: 17
                }

            }, {

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
            url:Application.url + '/render/obj/getByTileWithGap?',
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
                        for(var key in item.m.a){
                            if(item.m.a[key].type ==0){
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
            url:Application.url + '/render/obj/getByTileWithGap?',
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
                            'speedlimittype':item.m.a,
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
                showType:1,
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
            url: Application.url +'/render/obj/getByTileWithGap?',
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
            url: Application.url +'/render/obj/getByTileWithGap?',
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
                isUpDirect:true
            }

        }, {
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
                            'kind':'adlink'
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
                zIndex: 11,
                restrictZoom: 10,
                visible: false,
                requestType: 'ADLINK',
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
                        if (item.t === 2001||item.t===1901) {
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
                        }else if (item.t === 1514) {
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
                            for (var j = 0, len = item.m.d.length; j < len; j = j + 1) {

                                obj['geometry']['coordinates'].push([item.m.d[j]]);
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
                        if (item.t === 2001||item.t===1901||item.t===1510||item.t===1803||item.t===1514||item.t===1801) {
                            if(item.t===1801){
                                for (var j = 0;j<item.m.c.length;j++) {
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
                                        'style':item.m.c[j].s
                                    }
                                    geojson['features'].push(obj);
                                }

                            }else{
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
                                    'direct': item.m.d,
                                    'snode': item.m.e,
                                    'enode': item.m.f
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

        },{
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



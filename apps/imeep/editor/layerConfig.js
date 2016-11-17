/**
 * Created by zhongxiaoming on 2015/08/07.
 * Rebuild by chenxiao on 2016-06-30
 */
App.layersConfig = [{
    // 第三方的背景地图，以及图幅、网格和照片图层
    groupId: 'backgroundLayers',
    groupName: '背景',
    layers: [{
        clazz: L.tileLayer.wms,
        url: 'http://zs.navinfo.com:7090/rest/wms',
        options: {
            id: 'zisan',
            name: '资三',
            layers: 'GCJ02',
            crs: L.CRS.EPSG4326,
            version: '1.1.1',
            selected: false,
            visible: false,
            editable: false,
            singleSelect: true,
            maxZoom: 20,
            zIndex: 1
        }
    }, {
        clazz: L.tileLayer,
        url: 'http://{s}.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=0',
        options: {
            id: 'tencent',
            name: '腾讯',
            subdomains: ['rt0', 'rt1', 'rt2', 'rt3'],
            tms: true,
            selected: false,
            visible: false,
            added: true,
            singleSelect: true,
            maxZoom: 20,
            zIndex: 2
        }
    }, {
        url: '',
        clazz: fastmap.mapApi.meshLayer,
        options: {
            id: 'mesh',
            name: '图幅',
            url: '',
            visible: true,
            zIndex: 3
        }
    }, {
        url: '',
        clazz: fastmap.mapApi.gridLayer,
        options: {
            id: 'grid',
            name: '格网',
            gridInfo: null,
            url: '',
            divideX: 4,
            divideY: 4,
            visible: false,
            zIndex: 3
        }
    }, {
        url: '',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            name: '照片',
            id: 'photo',
            url: '',
            visible: false,
            zIndex: 4
        }
    }]
}, {
    // 主要用于加载17级以下的从hadoop库中取的路网数据
    groupId: 'referenceLayers',
    groupName: '参考',
    layers: []
}, {
    groupId: 'dataLayers',
    groupName: '数据',
    layers: [{
        url: '/render/obj/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'rdNode',
                // id: 'rdNode',
            name: '道路点',
            maxZoom: 20,
            debug: false,
            buffer: 5, // this value should be equal to 'radius' of your points
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
            boundsArr: [],
            unloadInvisibleTiles: true,
            reuseTiles: false,
            mecator: new fastmap.mapApi.MecatorTranform(),
            updateWhenIdle: true,
            tileSize: 256,
            type: 'Point',
            zIndex: 17,
            restrictZoom: 10,
            editable: false,
            visible: true,
            requestType: 'RDNODE',
            gap: 10,
            minZoom: 17
        }
    }, {
        url: '/render/obj/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'rdLink',
            name: '道路线',
                // id: 'rdLink',
            maxZoom: 20,
            debug: false,
                // this value should be equal to 'radius' of your points
            buffer: 5,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
            boundsArr: [],
            unloadInvisibleTiles: true,
            reuseTiles: false,
            mecator: new fastmap.mapApi.MecatorTranform(),
            updateWhenIdle: true,
            tileSize: 256,
            type: 'LineString',
            zIndex: 16,
            restrictZoom: 10,
            editable: false,
            visible: true,
            requestType: 'RDLINK',
            gap: 10,
            minZoom: 5
        }
    }, {
        url: '/render/specia/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'thematicLink',
            name: '专题图',
            // id: 'rdLink',
            maxZoom: 20,
            debug: false,
            // this value should be equal to 'radius' of your points
            buffer: 5,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasTMFeature.TMFeature.transform,
            boundsArr: [],
            unloadInvisibleTiles: true,
            reuseTiles: false,
            mecator: new fastmap.mapApi.MecatorTranform(),
            updateWhenIdle: true,
            tileSize: 256,
            type: 'LineString',
            zIndex: 16,
            restrictZoom: 10,
            editable: false,
            visible: false,
            requestType: 'rdLinkLimit',
            gap: 20,
            minZoom: 10
        }
    }, {
        url: '/render/obj/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'rdIntRtic',
            name: '互联网RTIC',
            maxZoom: 20,
            debug: false,
                // this value should be equal to 'radius' of your points
            buffer: 10,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
            boundsArr: [],
            unloadInvisibleTiles: true,
            reuseTiles: false,
            mecator: new fastmap.mapApi.MecatorTranform(),
            updateWhenIdle: true,
            tileSize: 256,
            type: 'rdrticPoint',
            zIndex: 17,
            restrictZoom: 10,
            visible: false,
            requestType: 'RDLINKINTRTIC',
            isUpDirect: true,
            gap: 80,
            minZoom: 17
        }
    }, {
        url: '/render/obj/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'rdLinkRtic',
            name: '车厂RTIC',
            maxZoom: 20,
            debug: false,
                // this value should be equal to 'radius' of your points
            buffer: 10,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
            boundsArr: [],
            unloadInvisibleTiles: true,
            reuseTiles: false,
            mecator: new fastmap.mapApi.MecatorTranform(),
            updateWhenIdle: true,
            tileSize: 256,
            type: 'rdrticPoint',
            zIndex: 17,
            restrictZoom: 10,
            visible: false,
            requestType: 'RDLINKRTIC',
            isUpDirect: true,
            gap: 80,
            minZoom: 17
        }
    }, {
        url: '/render/obj/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'rdLinkSpeedLimit',
            name: '线限速',
            maxZoom: 20,
            debug: false,
                // this value should be equal to 'radius' of your points
            buffer: 10,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
            boundsArr: [],
            unloadInvisibleTiles: true,
            reuseTiles: false,
            mecator: new fastmap.mapApi.MecatorTranform(),
            updateWhenIdle: true,
            tileSize: 256,
            type: 'Marker',
            zIndex: 17,
            restrictZoom: 10,
            visible: false,
            requestType: 'RDLINKSPEEDLIMIT',
            isUpDirect: true,
            gap: 80,
            minZoom: 17
        }
    }, {
        url: '/render/obj/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'rdCross',
            name: '关系-路口',
            maxZoom: 20,
            debug: false,
                // this value should be equal to 'radius' of your points
            buffer: 10,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
            boundsArr: [],
            unloadInvisibleTiles: true,
            reuseTiles: false,
            mecator: new fastmap.mapApi.MecatorTranform(),
            updateWhenIdle: true,
            tileSize: 256,
            type: 'Marker',
            zIndex: 7,
            restrictZoom: 10,
            visible: true,
            requestType: 'RDCROSS',
            gap: 40,
            minZoom: 17
        }
    }, {
        url: '/render/obj/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'relationData',
            name: '关系',
            maxZoom: 20,
            debug: false,
                // this value should be equal to 'radius' of your points
            buffer: 10,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
            boundsArr: [],
            unloadInvisibleTiles: true,
            reuseTiles: false,
            mecator: new fastmap.mapApi.MecatorTranform(),
            updateWhenIdle: true,
            tileSize: 256,
            type: 'Marker',
            zIndex: 7,
            restrictZoom: 10,
            visible: false,
            requestType: 'RDRESTRICTION,RDSPEEDLIMIT,RDBRANCH,RDLANECONNEXITY,RDGSC,RDWARNINGINFO,RDTRAFFICSIGNAL,RDELECTRONICEYE,RDSLOPE,RDGATE,RDDIRECTROUTE,RDSPEEDBUMP,RDSE,RDTOLLGATE,RDVARIABLESPEED,RDVOICEGUIDE,RDLANE,RDHGWGLIMIT,RDMILEAGEPILE',
            gap: 80,
            minZoom: 17
        }
    }, {
        url: '/render/obj/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'crfData',
            name: '关系',
            maxZoom: 20,
            debug: false,
            // this value should be equal to 'radius' of your points
            buffer: 10,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
            boundsArr: [],
            unloadInvisibleTiles: true,
            reuseTiles: false,
            mecator: new fastmap.mapApi.MecatorTranform(),
            updateWhenIdle: true,
            tileSize: 256,
            type: 'Marker',
            zIndex: 17,
            restrictZoom: 10,
            visible: false,
            requestType: 'RDINTER,RDROAD,RDOBJECT',
            gap: 40,
            minZoom: 17
        }
    }, {
        url: '/render/obj/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'tmcData',
            name: '关系',
            maxZoom: 20,
            debug: false,
            // this value should be equal to 'radius' of your points
            buffer: 10,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
            boundsArr: [],
            unloadInvisibleTiles: true,
            reuseTiles: false,
            mecator: new fastmap.mapApi.MecatorTranform(),
            updateWhenIdle: true,
            tileSize: 256,
            type: 'Marker',
            zIndex: 21,
            restrictZoom: 10,
            visible: false,
            requestType: 'TMCPOINT,RDTMCLOCATION',
            gap: 40,
            minZoom: 17
        }
    }, {
        url: '/render/obj/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'adAdmin',
            name: '行政区划代表点',
            maxZoom: 20,
            debug: false,
                // this value should be equal to 'radius' of your points
            buffer: 10,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
            boundsArr: [],
            unloadInvisibleTiles: true,
            reuseTiles: false,
            mecator: new fastmap.mapApi.MecatorTranform(),
            updateWhenIdle: true,
            tileSize: 256,
            type: 'PointFeature',
            zIndex: 18,
            restrictZoom: 10,
            visible: false,
            requestType: 'ADADMIN',
            gap: 40,
            minZoom: 17
        }
    }, {
        url: '/render/obj/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'adNode',
            name: '行政区划组成点',
            maxZoom: 20,
            debug: false,
                // this value should be equal to 'radius' of your points
            buffer: 5,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
            boundsArr: [],
            unloadInvisibleTiles: true,
            reuseTiles: false,
            mecator: new fastmap.mapApi.MecatorTranform(),
            updateWhenIdle: true,
            tileSize: 256,
            type: 'Point',
            zIndex: 17,
            restrictZoom: 10,
            editable: false,
            visible: false,
            requestType: 'ADNODE',
            gap: 10,
            minZoom: 17
        }
    }, {
        url: '/render/obj/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'adLink',
            name: '行政区划组成线',
            maxZoom: 20,
            debug: false,
                // this value should be equal to 'radius' of your points
            buffer: 10,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
            boundsArr: [],
            unloadInvisibleTiles: true,
            reuseTiles: false,
            mecator: new fastmap.mapApi.MecatorTranform(),
            updateWhenIdle: true,
            tileSize: 256,
            type: 'LineString',
            zIndex: 11,
            restrictZoom: 10,
            visible: false,
            requestType: 'ADLINK',
            gap: 10,
            minZoom: 5
        }
    }, {
        url: '/render/obj/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'adFace',
            name: '行政区划面',
            maxZoom: 20,
            debug: false,
                // this value should be equal to 'radius' of your points
            buffer: 5,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
            boundsArr: [],
            unloadInvisibleTiles: true,
            reuseTiles: false,
            mecator: new fastmap.mapApi.MecatorTranform(),
            updateWhenIdle: true,
            tileSize: 256,
            type: 'Polygon',
            zIndex: 20,
            restrictZoom: 10,
            editable: false,
            visible: false,
            requestType: 'ADFACE',
            gap: 10,
            minZoom: 13
        }
    }, {
        url: '/render/obj/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'rwNode',
            name: '铁路点',
            maxZoom: 20,
            debug: false,
                // this value should be equal to 'radius' of your points
            buffer: 5,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
            boundsArr: [],
            unloadInvisibleTiles: true,
            reuseTiles: false,
            mecator: new fastmap.mapApi.MecatorTranform(),
            updateWhenIdle: true,
            tileSize: 256,
            type: 'Point',
            zIndex: 17,
            restrictZoom: 10,
            editable: false,
            visible: false,
            requestType: 'RWNODE',
            gap: 10,
            minZoom: 17
        }
    }, {
        url: '/render/obj/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'rwLink',
            name: '铁路线',
            maxZoom: 20,
            debug: false,
                // this value should be equal to 'radius' of your points
            buffer: 5,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
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
            requestType: 'RWLINK',
            gap: 10,
            minZoom: 12
        }
    }, {
        url: '/render/obj/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'zoneNode',
            name: 'ZONE组成点',
            maxZoom: 20,
            debug: false,
                // this value should be equal to 'radius' of your points
            buffer: 5,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
            boundsArr: [],
            unloadInvisibleTiles: true,
            reuseTiles: false,
            mecator: new fastmap.mapApi.MecatorTranform(),
            updateWhenIdle: true,
            tileSize: 256,
            type: 'Point',
            zIndex: 17,
            restrictZoom: 10,
            editable: false,
            visible: false,
            requestType: 'ZONENODE',
            gap: 10,
            minZoom: 17
        }
    }, {
        url: '/render/obj/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'zoneLink',
            name: 'ZONE组成线',
            maxZoom: 20,
            debug: false,
                // this value should be equal to 'radius' of your points
            buffer: 5,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
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
            visible: false,
            requestType: 'ZONELINK',
            gap: 10,
            minZoom: 17
        }
    }, {
        url: '/render/obj/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'zoneFace',
            name: 'ZONE面',
            maxZoom: 20,
            debug: false,
                // this value should be equal to 'radius' of your points
            buffer: 5,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
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
            visible: false,
            requestType: 'ZONEFACE',
            gap: 10,
            minZoom: 17
        }
    }, {
        url: '/render/obj/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'luNode',
            name: 'LU点',
            maxZoom: 20,
            debug: false,
                // this value should be equal to 'radius' of your points
            buffer: 5,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
            boundsArr: [],
            unloadInvisibleTiles: true,
            reuseTiles: false,
            mecator: new fastmap.mapApi.MecatorTranform(),
            updateWhenIdle: true,
            tileSize: 256,
            type: 'Point',
            zIndex: 17,
            restrictZoom: 10,
            editable: false,
            visible: false,
            requestType: 'LUNODE',
            gap: 10,
            minZoom: 17
        }
    }, {
        url: '/render/obj/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'luLink',
            name: 'LU线',
            maxZoom: 20,
            debug: false,
                // this value should be equal to 'radius' of your points
            buffer: 5,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
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
            visible: false,
            requestType: 'LULINK',
            gap: 10,
            minZoom: 17
        }
    }, {
        url: '/render/obj/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'luFace',
            name: 'LU面',
            maxZoom: 20,
            debug: false,
                // this value should be equal to 'radius' of your points
            buffer: 5,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
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
            visible: false,
            requestType: 'LUFACE',
            gap: 10,
            minZoom: 17
        }
    }, {
        url: '/render/obj/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'lcNode',
            name: 'LC(土地覆盖)-点',
            maxZoom: 20,
            debug: false,
                // this value should be equal to 'radius' of your points
            buffer: 5,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
            boundsArr: [],
            unloadInvisibleTiles: true,
            reuseTiles: false,
            mecator: new fastmap.mapApi.MecatorTranform(),
            updateWhenIdle: true,
            tileSize: 256,
            type: 'Point',
            zIndex: 18,
            restrictZoom: 10,
            editable: false,
            visible: false,
            requestType: 'LCNODE',
            gap: 10,
            minZoom: 16
        }
    }, {
        url: '/render/obj/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'lcLink',
            name: 'LC(土地覆盖)-线',
            maxZoom: 20,
            debug: false,
                // this value should be equal to 'radius' of your points
            buffer: 5,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
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
            visible: false,
            requestType: 'LCLINK',
            gap: 10,
            minZoom: 15
        }
    }, {
        url: '/render/obj/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'lcFace',
            name: 'LC(土地覆盖)-面',
            maxZoom: 20,
            debug: false,
                // this value should be equal to 'radius' of your points
            buffer: 5,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
            boundsArr: [],
            unloadInvisibleTiles: true,
            reuseTiles: false,
            mecator: new fastmap.mapApi.MecatorTranform(),
            updateWhenIdle: true,
            tileSize: 256,
            type: 'Polygon',
            zIndex: 16,
            restrictZoom: 10,
            editable: false,
            visible: false,
            requestType: 'LCFACE',
            gap: 10,
            minZoom: 14
        }
    },
    {
        url: '/render/obj/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            name: '兴趣点（POI）',
            id: 'poi',
            maxZoom: 20,
            debug: false,
                // this value should be equal to 'radius' of your points
            buffer: 10,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
            boundsArr: [],
            unloadInvisibleTiles: true,
            reuseTiles: false,
            mecator: new fastmap.mapApi.MecatorTranform(),
            updateWhenIdle: true,
            tileSize: 256,
            type: 'PointFeature',
            zIndex: 18,
            restrictZoom: 10,
            visible: true,
            requestType: 'IXPOI',
            gap: 40,
            minZoom: 17
        }
    }, {
        url: '/render/obj/getByTileWithGap?',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'rdSame',
            name: '同一关系',
            maxZoom: 20,
            debug: false,
                // this value should be equal to 'radius' of your points
            buffer: 5,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasFeature.Feature.transform,
            boundsArr: [],
            unloadInvisibleTiles: true,
            reuseTiles: false,
            mecator: new fastmap.mapApi.MecatorTranform(),
            updateWhenIdle: true,
            tileSize: 256,
            type: 'Marker',
            zIndex: 17,
            restrictZoom: 10,
            editable: false,
            visible: false,
            requestType: 'RDSAMENODE,RDSAMELINK',
            gap: 40,
            minZoom: 17
        }
    }]
}, {
    groupId: 'worklayer',
    groupName: '作业图层',
    layers: [
    //     {
    //     url: '/render/tip/getByTileWithGap?', //暂时未用到此图层
    //     clazz: fastmap.mapApi.tileJSON,
    //     options: {
    //         id: 'workLine',
    //         name: '外业线数据',
    //         maxZoom: 20,
    //         debug: false,
    //         // this value should be equal to 'radius' of your points
    //         buffer: 7,
    //         boolPixelCrs: true,
    //         parse: fastmap.uikit.canvasTips.Tips.transformation,
    //         boundsArr: [],
    //         unloadInvisibleTiles: true,
    //         reuseTiles: false,
    //         mecator: new fastmap.mapApi.MecatorTranform(),
    //         updateWhenIdle: true,
    //         tileSize: 256,
    //         type: 'TipLineString',
    //         zIndex: 7,
    //         restrictZoom: 10,
    //         visible: false,
    //         requestType: "12",
    //         showNodeLevel: 17
    //     }
    // },
        {
            url: '/render/tip/getByTileWithGap?',
            clazz: fastmap.mapApi.tileJSON,
            options: {
                id: 'workPoint',
                name: '外业点数据',
                maxZoom: 20,
                debug: false,
                // this value should be equal to 'radius' of your points
                buffer: 8,
                boolPixelCrs: true,
                parse: fastmap.uikit.canvasTips.Tips.transformation,
                boundsArr: [],
                unloadInvisibleTiles: true,
                reuseTiles: false,
                mecator: new fastmap.mapApi.MecatorTranform(),
                updateWhenIdle: true,
                tileSize: 256,
                type: 'TipPoint',
                zIndex: 9,
                restrictZoom: 10,
                visible: false,
                requestType: '',
                showNodeLevel: 17,
                gap: 40
            }
        }]
}, {
    groupId: 'editLayers',
    groupName: '编辑图层',
    layers: [{
        url: '',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'highlightLayer',
            name: '高亮图层',
            maxZoom: 20,
            debug: false,
            buffer: 8,
            boolPixelCrs: true,
            mecator: new fastmap.mapApi.MecatorTranform(),
            tileSize: 256,
            type: 'highlight',
            zIndex: 19,
            restrictZoom: 10,
            visible: true
        },
        requestType: 'uuuuu' // 未用
    }, {
        url: '',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'mousemovelightlayer',
            name: '鼠标滑过高亮图层',
            maxZoom: 20,
            debug: false,
            buffer: 8,
            boolPixelCrs: true,
            mecator: new fastmap.mapApi.MecatorTranform(),
            tileSize: 256,
            type: 'highlight',
            zIndex: 20,
            restrictZoom: 10,
            visible: true
        },
        requestType: 'uuuuu' // 未用
    }, {
        url: '',
        clazz: fastmap.mapApi.guideLineLayer,
        options: {
            id: 'guideLineLayer',
            name: '引导线',
            maxZoom: 20,
            debug: false,
            buffer: 8,
            boolPixelCrs: true,
            mecator: new fastmap.mapApi.MecatorTranform(),
            tileSize: 256,
            type: 'guideLine',
            zIndex: 9,
            restrictZoom: 10,
            visible: true
        },
        requestType: 'uuuuu'
    }, {
        clazz: fastmap.mapApi.editLayer,
        url: '',
        options: {
            id: 'edit',
            name: '编辑',
            visible: true,
            zIndex: 0
        }
    }, ]
}];

/**
 * Created by zhongxiaoming on 2015/08/07.
 * Rebuild by chenxiao on 2016-06-30
 */
App.layersConfig = [{
    // 第三方的背景地图，以及图幅、网格和照片图层
    groupId: "backgroundLayers",
    groupName: "背景",
    layers: [{
        clazz: L.tileLayer.wms,
        url: "http://zs.navinfo.com:7090/rest/wms",
        options: {
            id: 'zisan',
            name: "资三",
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
            subdomains: ["rt0", "rt1", "rt2", "rt3"],
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
    groupId: "referenceLayers",
    groupName: "参考",
    layers: []
}, {
    groupId: "dataLayers",
    groupName: "数据",
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
            visible: false,
            requestType: 'RDNODE',
            showNodeLevel: 17
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
            showNodeLevel: 17
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
            zIndex: 6,
            restrictZoom: 10,
            visible: false,
            requestType: 'RDRESTRICTION,RDSPEEDLIMIT,RDBRANCH,RDCROSS,RDLANECONNEXITY,RDLINKINTRTIC,RDGSC,RDTRAFFICSIGNAL',
            showNodeLevel: 17
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
            showNodeLevel: 17
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
            showNodeLevel: 17
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
            showNodeLevel: 5
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
            showNodeLevel: 13
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
            showNodeLevel: 17
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
            showNodeLevel: 12
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
            showNodeLevel: 17
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
            showNodeLevel: 17
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
            showNodeLevel: 17
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
            showNodeLevel: 17
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
            showNodeLevel: 17
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
            showNodeLevel: 17
        }
    }, {
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
            showNodeLevel: 17
        }
    }]
}, {
    groupId: 'worklayer',
    groupName: '作业图层',
    layers: [{
        url: '/render/tip/getByTileWithGap?', //暂时未用到此图层
        clazz: fastmap.mapApi.tileJSON,
        options: {
            id: 'workLine',
            name: '外业线数据',
            maxZoom: 20,
            debug: false,
            // this value should be equal to 'radius' of your points
            buffer: 7,
            boolPixelCrs: true,
            parse: fastmap.uikit.canvasTips.Tips.transformation,
            boundsArr: [],
            unloadInvisibleTiles: true,
            reuseTiles: false,
            mecator: new fastmap.mapApi.MecatorTranform(),
            updateWhenIdle: true,
            tileSize: 256,
            type: 'TipLineString',
            zIndex: 7,
            restrictZoom: 10,
            visible: false,
            requestType: "12",
            showNodeLevel: 17
        }
    }, {
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
            requestType: "",
            showNodeLevel: 17
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
        requestType: "uuuuu" //未用
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
        requestType: "uuuuu"
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
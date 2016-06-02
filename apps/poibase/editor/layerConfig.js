/**
 * Created by zhongxiaoming on 2015/08/07.
 */
App.layersConfig = [{
    groupid: "backgroundLayers",
    groupname: "参考",
    layers: [{
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
    }, {
        url: '',
        clazz: fastmap.mapApi.gridLayer,
        options: {
            layername: '格网',
            id: 'grid',
            gridInfo: null,
            url: '',
            divideX: 4,
            divideY: 4,
            visible: false,
            zIndex: 3
        }
    }]
}, {
    groupid: "dataLayers",
    groupname: "作业参考",
    layers: [{
        url: App.Util.createTileRequestObject('/render/obj/getByTileWithGap?', 'RDBRANCH,RDGSC'),
        clazz: fastmap.mapApi.tileJSON,
        options: {
            layername: '关系数据',
            id: 'relationdata',
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
            visible: true,
            requestType: 'RDBRANCH,RDGSC',
            showNodeLevel: 17
        }
    }, {
        url: App.Util.createTileRequestObject('/render/obj/getByTileWithGap?', 'RDLINK'),
        clazz: fastmap.mapApi.tileJSON,
        options: {
            layername: 'Link',
            id: 'referenceLine',
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
            requestType: 'RDLINK',
            showNodeLevel: 17
        }
    },
        {
            url: App.Util.createTileRequestObject('/render/obj/getByTileWithGap?', 'ADADMIN'),
            clazz: fastmap.mapApi.tileJSON,
            options: {
                layername: 'POI点数据',
                id: 'poiPoint',
                maxZoom: 22,
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
                type: 'poiPoint',
                zIndex: 18,
                restrictZoom: 10,
                visible: true,
                requestType: 'POI',
                showNodeLevel: 17
            }
        },
    //     {
    //     url: App.Util.createTileRequestObjectForPoi('editsupport/infor/tile/?'),
    //     clazz: fastmap.mapApi.tileJSON,
    //     options: {
    //         layername: 'POI点数据',
    //         id: 'poiPoint',
    //         maxZoom: 22,
    //         debug: false,
    //         // this value should be equal to 'radius' of your points
    //         buffer: 8,
    //         boolPixelCrs: true,
    //         // parse: transformDataForPoi,
    //         boundsArr: [],
    //         unloadInvisibleTiles: true,
    //         reuseTiles: false,
    //         mecator: new fastmap.mapApi.MecatorTranform(),
    //         updateWhenIdle: true,
    //         tileSize: 256,
    //         type: 'Point',
    //         zIndex: 9,
    //         restrictZoom: 10,
    //         visible: false,
    //         requestType: "",
    //         showNodeLevel: 17
    //     }
    // },
        {
        url: '',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            layername: '选中高亮图层',
            id: 'highlightlayer',
            maxZoom: 20,
            debug: false,
            buffer: 8,
            boolPixelCrs: true,
            // parse: function(data) {},
            mecator: new fastmap.mapApi.MecatorTranform(),
            tileSize: 256,
            type: 'highlight',
            zIndex: 18,
            restrictZoom: 10,
            visible: true
        }
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
    }]
}];
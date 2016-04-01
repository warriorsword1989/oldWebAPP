/**
 * Created by liwanchong on 2015/11/21.
 */

fastmap.uikit.HighLightRender = L.Class.extend({
    initialize: function (layer, options) {
        this.options = options || {};
        this._map = this.options.map;
        this.layer = layer;//高亮的图层
        this._container = this._map.container;
        this.type = this.options.type;//类型
        this.tiles = this.layer.tiles;
        this.highLightFeature = this.options.highLightFeature || "";//高亮图层的类型
        this.linksObj = this.options.linksObj;//高亮进入线和退出线的id
        this.dataTipsId = this.options.dataTips;//高亮dataTips的id
        this.linksArr = this.options.linksArr;//高亮的路口的线
        this.nodesArr = this.options.nodesArr;//高亮路口的点
        this.linkPid = this.options.linkPid;//高亮link的id
        this.restrictId = this.options.restrictId;//高亮交限的id
        this.laneId = this.options.laneId;//高亮车信的id
        this.speedLimitId = this.options.speedLimitId;
        this.initFlag = this.options.initFlag || false;//当地图变化时,才能激发this.draw()函数
        this.cleanHighLight = "";
        this.eventController = fastmap.uikit.EventController();
        var that = this;
        this.eventController.on(this.eventController.eventTypes.TILEDRAWEND, function (e) {
            if (that.initFlag) {

                that.draw(e);
            }
        })

    },
    /**
     * 点击列表中的dataTips在地图上高亮
     */
    drawTipsForInit: function () {
        for (var index in this.tiles) {

            var data = this.tiles[index].data.features;
            for (var key in data) {

                var feature = data[key];
                var type = feature.geometry.type;
                var geom = feature.geometry.coordinates;
                if (this.dataTipsId && data[key].properties.id == this.dataTipsId) {
                    var ctx = {
                        canvas: this.layer._tiles,
                        tile: L.point(key.split(',')[0], key.split(',')[1]),
                        zoom: this._map.zoom
                    }
                    var style = null;
                    if (feature.properties.srctype == "1") {//未处理
                        style = {src: './css/tips/selected/pending.png'};
                    } else {//已处理
                        style = {src: './css/tips/selected/processed.png'};
                    }

                    if (feature.properties.kind) {  //种别

                        if (feature.properties.type == '1201') {
                            this.layer._drawImg({
                                ctx: ctx,
                                geo: geom,
                                style: {src: 'css/tips/kind/K' + feature.properties.kind + '.svg'},
                                boolPixelCrs: true,
                                fillStyle: {
                                    lineColor: 'rgb(4, 187, 245)',
                                    fillColor: 'rgba(4, 187, 245, 0.2)',
                                    lineWidth: 1,
                                    width: 30,
                                    height: 15,
                                    dx: 0,
                                    dy: 7.5
                                }

                            });
                        } else if (feature.properties.type == '1203') {

                            this.layer._drawImg({
                                ctx: ctx,
                                geo: geom,
                                style: {src: feature.properties.direc == 2 ? 'css/tips/road/1.svg' : 'css/tips/road/2.svg'},
                                boolPixelCrs: true,
                                rotate: feature.properties.kind * (Math.PI / 180),
                                fillStyle: {
                                    lineColor: 'rgb(4, 187, 245)',
                                    fillColor: 'rgba(4, 187, 245, 0.2)',
                                    lineWidth: 1,
                                    width: 20,
                                    height: 20,
                                    dx: 5,
                                    dy: 5

                                }
                            });
                        }
                    } else {

                        this.layer._drawImg({
                            ctx: ctx,
                            geo: geom,
                            style: style,
                            boolPixelCrs: true,
                            drawx: -30,
                            drawy: -30
                        });
                    }
                }

            }
        }
        this.initFlag = true;
    },
    /**
     * 使高亮的dataTips随着地图的变化依然高亮
     * @param tile
     * @param zoom
     */
    drawTips: function (tile, zoom) {
        var data = tile.data.features;

        for (var key in data) {

            var feature = data[key];
            var type = feature.geometry.type;
            var geom = feature.geometry.coordinates;
            if (this.dataTipsId && data[key].properties.id == this.dataTipsId) {

                var ctx = {
                    canvas: tile.options.context,
                    tile: L.point(key.split(',')[0], key.split(',')[1]),
                    zoom: zoom
                }
                var style = null;
                if (feature.properties.srctype == "1") {//未处理
                    style = {src: './css/tips/selected/pending.png'};
                } else {//已处理
                    style = {src: './css/tips/selected/processed.png'};
                }

                if (feature.properties.kind) {  //种别

                    if (feature.properties.type == '1201') {
                        this.layer._drawImg({
                            ctx: ctx,
                            geo: geom,
                            style: {src: 'css/tips/kind/K' + feature.properties.kind + '.svg'},
                            boolPixelCrs: true,
                            fillStyle: {
                                lineColor: 'rgb(4, 187, 245)',
                                fillColor: 'rgba(4, 187, 245, 0.2)',
                                lineWidth: 1,
                                width: 30,
                                height: 15,
                                dx: 0,
                                dy: 7.5
                            }

                        });
                    } else if (feature.properties.type == '1203') {

                        this.layer._drawImg({
                            ctx: ctx,
                            geo: geom,
                            style: {src: feature.properties.direc == 2 ? 'css/tips/road/1.svg' : 'css/tips/road/2.svg'},
                            boolPixelCrs: true,
                            rotate: feature.properties.kind * (Math.PI / 180),
                            fillStyle: {
                                lineColor: 'rgb(4, 187, 245)',
                                fillColor: 'rgba(4, 187, 245, 0.5)',
                                lineWidth: 1,
                                width: 20,
                                height: 20,
                                dx: 5,
                                dy: 5

                            }
                        });
                    }
                } else {

                    this.layer._drawImg({
                        ctx: ctx,
                        geo: geom,
                        style: style,
                        boolPixelCrs: true,
                        drawx: -30,
                        drawy: -30
                    });
                }
            }
        }

    },
    /**
     *点击dataTips、交限高亮进入线和退出线
     */
    drawOfLinksForInit: function () {
        for (var index in this.tiles) {
            var data = this.tiles[index].data;
            var ctx = {
                canvas: this.tiles[index].options.context,
                tile: this.tiles[index].options.context._tilePoint,
                zoom: this._map.zoom
            }
            if (data.hasOwnProperty("features")) {
                for (var i = 0; i < data.features.length; i++) {
                    var feature = data.features[i];

                    var color = null;
                    if (feature.hasOwnProperty('properties')) {
                        color = feature.properties.c;
                    }

                    var style = this.layer.styleFor(feature, color);

                    var geom = feature.geometry.coordinates;
                    if (this.linksObj !== undefined) {
                        for (var item in this.linksObj) {
                            if (feature.properties.id === this.linksObj[item]) {
                                if (item === "inLink") {
                                    this.layer._drawLineString(ctx, geom, true, {
                                        size: 3,
                                        color: '#1056D9'
                                    }, {
                                        color: '#1056D9',
                                        radius: 3
                                    }, feature.properties);
                                } else if (item.substr(0, 7) === "outLink") {
                                    this.layer._drawLineString(ctx, geom, true, {
                                        size: 3,
                                        color: '#F63428'
                                    }, {
                                        color: '#F63428',
                                        radius: 3
                                    }, feature.properties);
                                }

                            }

                        }
                    } else {
                        if (item === 0) {
                            this.tiles[index].options.context.getContext('2d').clearRect(0, 0, 256, 256);
                        }
                        this.layer._drawLineString(ctx, geom, true, style, {
                            color: '#696969',
                            radius: 3
                        }, feature.properties);
                    }

                }
            }
        }
        this.initFlag = true;
    },
    /**
     * 使高亮dataTips、交限的进入线和退出线随着地图的变化高亮
     * @param tile
     * @param zoom
     */
    drawOfLinks: function (tile, zoom) {
        var data = tile.data;
        var ctx = {
            canvas: tile.options.context,
            tile: tile.options.context._tilePoint,
            zoom: zoom
        };
        if (data.hasOwnProperty("features")) {
            for (var i = 0; i < data.features.length; i++) {
                var feature = data.features[i];

                var color = null;
                if (feature.hasOwnProperty('properties')) {
                    color = feature.properties.c;
                }

                var style = this.layer.styleFor(feature, color);

                var geom = feature.geometry.coordinates;
                if (this.linksObj !== undefined) {
                    for (var item in this.linksObj) {
                        if (feature.properties.id === this.linksObj[item]) {
                            if (item === "inLink") {
                                this.layer._drawLineString(ctx, geom, true, {
                                    size: 3,
                                    color: '#1056D9'
                                }, {
                                    color: '#1056D9',
                                    radius: 3
                                }, feature.properties);
                            } else if (item.substr(0, 7) === "outLink") {
                                this.layer._drawLineString(ctx, geom, true, {
                                    size: 3,
                                    color: '#F63428'
                                }, {
                                    color: '#F63428',
                                    radius: 3
                                }, feature.properties);
                            }
                        }

                    }
                } else {
                    if (item === 0) {
                        tile.options.context.getContext('2d').clearRect(0, 0, 256, 256);
                    }
                    this.layer._drawLineString(ctx, geom, true, style, {
                        color: '#696969',
                        radius: 3
                    }, feature.properties);
                }

            }
        }
    },
    /**
     * 初始化高亮link
     */
    drawOfLinkForInit: function () {
        for (var index in this.tiles) {
            var data = this.tiles[index].data;
            var ctx = {
                canvas: this.tiles[index].options.context,
                tile: this.tiles[index].options.context._tilePoint,
                zoom: this._map.zoom
            }
            if (data.hasOwnProperty("features")) {
                for (var i = 0; i < data.features.length; i++) {
                    var feature = data.features[i];

                    var color = null;
                    if (feature.hasOwnProperty('properties')) {
                        color = feature.properties.c;
                    }

                    var style = this.layer.styleFor(feature, color);

                    var geom = feature.geometry.coordinates;
                    if (this.linkPid !== undefined && feature.properties.id === this.linkPid) {
                        this.layer._drawLineString(ctx, geom, true, {
                            size: 3,
                            color: '#00F5FF'
                        }, {
                            color: '#00F5FF',
                            radius: 3
                        }, feature.properties);
                    } else {
                        this.layer._drawLineString(ctx, geom, true, style, {
                            color: '#696969',
                            radius: 3
                        }, feature.properties);
                    }


                }
            }
        }

    },
    /**
     * 高亮link
     * @param tile
     * @param zoom
     */
    drawOfLink: function (tile, zoom) {
        var data = tile.data;
        tile.options.context.getContext('2d').clearRect(0, 0, 256, 256);
        var ctx = {
            canvas: tile.options.context,
            tile: tile.options.context._tilePoint,
            zoom: zoom
        };
        if (data.hasOwnProperty("features")) {
            for (var i = 0; i < data.features.length; i++) {
                var feature = data.features[i];

                var color = null;
                if (feature.hasOwnProperty('properties')) {
                    color = feature.properties.c;
                }

                var style = this.layer.styleFor(feature, color);

                var geom = feature.geometry.coordinates;
                if (this.linkPid !== undefined && feature.properties.id === this.linkPid) {
                    this.layer._drawLineString(ctx, geom, true, {
                        size: 3,
                        color: '#00F5FF'
                    }, {
                        color: '#00F5FF',
                        radius: 3
                    }, feature.properties);
                } else {
                    this.layer._drawLineString(ctx, geom, true, style, {
                        color: '#696969',
                        radius: 3
                    }, feature.properties);
                }


            }
        }


    },
    /**
     *初始化路口的线高亮
     * @param linksArr
     * @param nodesArr
     * @param nodeArr
     */
    drawLinksOfCrossForInit: function (linksArr, nodesArr, nodeArr) {
        this.linksArr = linksArr,
            this.nodesArr = nodesArr;
        var linkObj = {}, nodeObj = {}, nodeStyle;
        for (var k = 0, lenK = this.linksArr.length; k < lenK; k++) {
            linkObj[this.linksArr[k].toString()] = true;
        }
        for (var j = 0, lenJ = nodesArr.length; j < lenJ; j++) {
            nodeObj[this.nodesArr[j].toString()] = true;
        }
        for (var index in this.tiles) {
            this.tiles[index].options.context.getContext('2d').clearRect(0, 0, 256, 256);
            var data = this.tiles[index].data;
            var ctx = {
                canvas: this.tiles[index].options.context,
                tile: this.tiles[index].options.context._tilePoint,
                zoom: this._map.zoom
            }
            if (data.hasOwnProperty("features")) {
                for (var i = 0; i < data.features.length; i++) {
                    var feature = data.features[i];

                    var color = null;
                    if (feature.hasOwnProperty('properties')) {
                        color = feature.properties.c;
                    }

                    var style = this.layer.styleFor(feature, color);
                    var geom = feature.geometry.coordinates;
                    if (linkObj[feature.properties.id]) {
                        nodeStyle = {
                            color: 'rgba(105,105,105,1)',
                            radius: 3
                        };
                        this.layer._drawLineString(ctx, geom, true, {
                            size: 2,
                            color: '#F63428'
                        }, nodeStyle, feature.properties);
                        if (nodesArr.length > 0) {
                            if (nodeObj[feature.properties.enode]) {
                                this.layer._drawPoint(ctx, geom[geom.length - 1][0], {
                                    color: 'blue',
                                    radius: 4
                                }, true);
                            } else if (nodeObj[feature.properties.snode]) {
                                this.layer._drawPoint(ctx, geom[0][0], {
                                    color: 'blue',
                                    radius: 4
                                }, true);
                            }
                        }
                        if (nodeArr && feature.properties.snode == nodeArr[0]) {
                            this.layer._drawPoint(ctx, geom[0][0], {
                                color: 'blue',
                                radius: 4
                            }, true);
                        } else if (nodeArr && feature.properties.enode == nodeArr[0]) {
                            this.layer._drawPoint(ctx, geom[geom.length - 1][0], {
                                color: 'blue',
                                radius: 4
                            }, true);
                        }

                    } else {
                        this.layer._drawLineString(ctx, geom, true, style, {
                            color: 'rgba(105,105,105,1)',
                            radius: 3
                        }, feature.properties);


                    }

                }
            }
        }


    },
    /**
     * 随地图变化时,线的高亮不退
     * @param tile
     * @param zoom
     */
    drawLinksOfCross: function (tile, zoom) {
        var linkObj = {}, nodeObj = {}, nodeStyle;
        for (var k = 0, lenK = this.linksArr.length; k < lenK; k++) {
            linkObj[this.linksArr[k]] = true;
        }
        for (var j = 0, lenJ = this.nodesArr.length; j < lenJ; j++) {
            nodeObj[this.nodesArr[j]] = true;
        }
        var data = tile.data;
        var ctx = {
            canvas: tile.options.context,
            tile: tile.options.context._tilePoint,
            zoom: zoom
        };
        if (data.hasOwnProperty("features")) {
            for (var i = 0; i < data.features.length; i++) {
                var feature = data.features[i];

                var color = null;
                if (feature.hasOwnProperty('properties')) {
                    color = feature.properties.c;
                }

                var style = this.layer.styleFor(feature, color);

                var geom = feature.geometry.coordinates;
                if (linkObj[feature.properties.id]) {
                    nodeStyle = {
                        color: 'rgba(105,105,105,1)',
                        radius: 3
                    };
                    this.layer._drawLineString(ctx, geom, true, {
                        size: 2,
                        color: '#F63428'
                    }, nodeStyle, feature.properties);
                    if (this.nodesArr.length > 0) {
                        if (nodeObj[feature.properties.enode]) {
                            this.layer._drawPoint(ctx, geom[geom.length - 1][0], {
                                color: 'blue',
                                radius: 4
                            }, true);
                        } else if (nodeObj[feature.properties.snode]) {
                            this.layer._drawPoint(ctx, geom[0][0], {
                                color: 'blue',
                                radius: 4
                            }, true);
                        }
                    }
                } else {
                    this.layer._drawLineString(ctx, geom, true, style, {
                        color: 'rgba(105,105,105,1)',
                        radius: 3
                    }, feature.properties);
                }

            }
        }
    },

    /**
     * 高亮交限
     * @param tile
     * @param zoom
     */
    drawRestrict: function (tile, zoom) {
        var data = tile.data;
        var ctx = {
            canvas: this.layer._tiles[tile.options.context.name.replace("_", ":")],
            tile: tile.options.context._tilePoint,
            zoom: zoom
        }
        if (data.hasOwnProperty("features")) {
            for (var i = 0, len = data.features.length; i < len; i++) {
                var feature = data.features[i];
                var type = feature.geometry.type;
                var geom = feature.geometry.coordinates;
                var route = (feature.properties.restrictionrotate) * (Math.PI / 180);
                var newgeom = [];
                if (feature.properties.id == this.restrictId) {
                    if (type == "Point") {
                        if (feature.properties.restrictioninfo === undefined) {
                            break;
                        }
                        var newGeom = [];
                        var restrictObj = feature.properties.restrictioninfo;
                        if (restrictObj !== undefined) {
                            console.log(this.layer)
                            if (restrictObj.constructor === Array) {
                                for (var theory = 0, theoryLen = restrictObj.length; theory < theoryLen; theory++) {

                                    if (theory > 0) {
                                        newgeom[0] = parseInt(geom[0]) + theory * 16 * Math.cos(route);
                                        newgeom[1] = parseInt(geom[1]) + theory * 16 * Math.sin(route);

                                        this.layer._drawBackground({
                                            ctx: ctx,
                                            geo: newGeom,

                                            boolPixelCrs: true,
                                            rotate: route,
                                            lineColor: 'rgb(4, 187, 245)',
                                            fillColor: 'rgba(4, 187, 245, 0.5)',
                                            lineWidth: 1,
                                            width: 20,
                                            height: 20,
                                            drawx: -10,
                                            drawy: -10

                                        })
                                    } else {

                                        this.layer._drawBackground({
                                            ctx: ctx,
                                            geo: geom,

                                            boolPixelCrs: true,
                                            rotate: route,
                                            lineColor: 'rgb(4, 187, 245)',
                                            fillColor: 'rgba(4, 187, 245, 0.5)',
                                            lineWidth: 1,
                                            width: 20,
                                            height: 20,
                                            drawx: -10,
                                            drawy: -10

                                        })
                                    }

                                }
                            } else {
                                var restrictArr = restrictObj.split(",");
                                for (var fact = 0, factLen = restrictArr.length; fact < factLen; fact++) {
                                    if (fact > 0) {
                                        newgeom[0] = parseInt(geom[0][0]) + fact * 16 * Math.cos(route);
                                        newgeom[1] = parseInt(geom[1][0]) + fact * 16 * Math.sin(route);


                                        this.layer._drawBackground({
                                            ctx: ctx,
                                            geo: newgeom,

                                            boolPixelCrs: true,
                                            rotate: route,
                                            lineColor: 'rgb(4, 187, 245)',
                                            fillColor: 'rgba(4, 187, 245, 0.5)',
                                            lineWidth: 1,
                                            width: 20,
                                            height: 20,
                                            drawx: -10,
                                            drawy: -10

                                        })
                                    } else {


                                        this.layer._drawBackground({
                                            ctx: ctx,
                                            geo: geom,

                                            boolPixelCrs: true,
                                            rotate: route,
                                            lineColor: 'rgb(4, 187, 245)',
                                            fillColor: 'rgba(4, 187, 245, 0.5)',
                                            lineWidth: 1,
                                            width: 20,
                                            height: 20,
                                            drawx: -10,
                                            drawy: -10

                                        })
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    drawLane: function (tile, zoom) {
        var data = tile.data;
        var ctx = {
            canvas: this.layer._tiles[tile.options.context.name.replace("_", ":")],
            tile: tile.options.context._tilePoint,
            zoom: zoom
        }
        for (var i = 0, len = data.features.length; i < len; i++) {
            var feature = data.features[i];
            var geom = feature.geometry.coordinates;
            if (feature.properties.id == this.laneId) {
                var newGeom = [];
                var laneObj = feature.properties.laneconnexityinfo;
                var route = (feature.properties.laneconnexityrotate ) * (Math.PI / 180);
                if (laneObj !== undefined) {
                    console.log(this.layer);
                    var laneObjArr = laneObj.split(",");
                    for (var fact = 0, factLen = laneObjArr.length; fact < factLen; fact++) {
                        if (fact > 0) {
                            newGeom[0] = parseInt(geom[0]) + fact * 10 * Math.cos(route);
                            newGeom[1] = parseInt(geom[1]) + fact * 10 * Math.sin(route);
                            this.layer._drawBackground(
                                {
                                    ctx: ctx,
                                    geo: newGeom,
                                    boolPixelCrs: true,
                                    rotate: route,
                                    lineColor: 'rgb(4, 187, 245)',
                                    fillColor: 'rgba(4, 187, 245, 0)',
                                    lineWidth: 1,
                                    width: 20,
                                    height: 10,
                                    drawx: 0,
                                    drawy: 5,
                                    scalex: 2 / 3,
                                    scaley: 2 / 3
                                })
                        } else {
                            this.layer._drawBackground(
                                {
                                    ctx: ctx,
                                    geo: geom,
                                    boolPixelCrs: true,
                                    rotate: route,
                                    lineColor: 'rgb(4, 187, 245)',
                                    fillColor: 'rgba(4, 187, 245, 0)',
                                    lineWidth: 1,
                                    width: 20,
                                    height: 10,
                                    drawx: 0,
                                    drawy: 5,
                                    scalex: 2 / 3,
                                    scaley: 2 / 3
                                })
                        }
                    }
                }
            }
        }

    },
    drawSpeedLimit: function (tile, zoom) {


        var data = tile.data;

        for (var i = 0, len = data.features.length; i < len; i++) {

            var feature = data.features[i];
            var type = feature.geometry.type;
            var geom = feature.geometry.coordinates;
            if (feature.properties.id == this.speedLimitId) {
                var ctx = {
                    canvas: tile.options.context,
                    tile: tile.options.context._tilePoint,
                    zoom: zoom
                }
                if (type == "Point") {
                    if (feature.properties.speedlimitcondition === undefined) {
                        break;
                    }
                    var newStyle = "", newGeom = [];
                    var restrictObj = feature.properties.speedlimitcondition;
                    if (restrictObj !== undefined) {

                        var speedFlagstyle = null, jttype = null;
                        var route = (feature.properties.rdSpeedLimitrotate - 90) * (Math.PI / 180);
                        var resArray = restrictObj.split("|");
                        var gaptureFlag = resArray[0];//采集标志（0,现场采集;1,理论判断）
                        var speedFlag = resArray[1];//限速标志(0,限速开始;1,解除限速)
                        var speedValue = resArray[2] / 10;//限速值
                        if (gaptureFlag === 1) {//理论判断，限速开始和结束都为蓝色
                            if (speedFlag === 1) {//解除限速
                                speedFlagstyle = {src: './css/1101/1101_1_1_' + speedValue + '.svg'};
                                jttype = {src: './css/1101/1101_1_1_e.svg'};
                            } else {
                                speedFlagstyle = {src: './css/1101/1101_1_0_' + speedValue + '.svg'};
                                jttype = {src: './css/1101/1101_1_0_s.svg'};
                            }

                        } else {//现场采集，限速开始为红色，结束为黑色
                            if (speedFlag === 1) {//解除限速
                                speedFlagstyle = {src: './css/1101/1101_0_1_' + speedValue + '.svg'};
                                jttype = {src: './css/1101/1101_0_1_e.svg'};
                            } else {
                                speedFlagstyle = {src: './css/1101/1101_0_0_' + speedValue + '.svg'};
                                jttype = {src: './css/1101/1101_0_0_s.svg'};
                            }
                        }
                        newGeom[0] = (parseInt(geom[0]));
                        newGeom[1] = (parseInt(geom[1]));

                        this.layer._drawImg({
                            ctx: ctx,
                            geo: newGeom,
                            style: speedFlagstyle,
                            boolPixelCrs: true
                            ,
                            fillStyle: {
                                lineColor: 'rgb(4, 187, 245)',
                                fillColor: 'rgba(4, 187, 245, 0.5)',
                                lineWidth: 1,
                                width: 30,
                                height: 30,
                                dx: 0,
                                dy: 0

                            }
                        })
                        //绘制箭头
                        this.layer._drawImg({
                            ctx: ctx,
                            geo: newGeom,
                            style: jttype,
                            boolPixelCrs: true,
                            rotate: route,
                            drawx: 5
                        })


                    }


                }
            }
        }

    }
    ,
    draw: function (e) {
        this.tiles = e.layer.tiles;
        var tile = this.tiles[e.id];
        var zoom = e.zoom;
        if (this.highLightFeature === "links") {
            this.drawOfLinks(tile, zoom);
        } else if (this.highLightFeature === "dataTips") {
            this.drawTips(tile, zoom);
        }
        else if (this.highLightFeature === "link") {
            this.drawOfLink(tile, zoom);
        } else if (this.highLightFeature === "restrict") {
            this.drawRestrict(tile, zoom);
        } else if (this.highLightFeature === "linksOfCross") {
            this.drawLinksOfCross(tile, zoom);
        } else if (this.highLightFeature === "lane") {
            console.log(tile.url);
            this.drawLane(tile, zoom);
        } else if (this.highLightFeature === "speedlimit") {
            this.drawSpeedLimit(tile, zoom);
        }
    },
    _cleanHighLight: function () {
        this.linksObj = undefined;
        for (var index in this.tiles) {
            var data = this.tiles[index].data;
            this.tiles[index].options.context.getContext('2d').clearRect(0, 0, 256, 256);
            var ctx = {
                canvas: this.tiles[index].options.context,
                tile: this.tiles[index].options.context._tilePoint,
                zoom: this._map.getZoom()
            }
            if (data.hasOwnProperty("features")) {
                for (var i = 0; i < data.features.length; i++) {
                    var feature = data.features[i];

                    var color = null;
                    if (feature.hasOwnProperty('properties')) {
                        color = feature.properties.c;
                    }

                    var style = this.layer.styleFor(feature, color);

                    var geom = feature.geometry.coordinates;

                    if (this.highLightFeature === "links") {
                        this.layer._drawLineString(ctx, geom, true, style, {
                            color: '#696969',
                            radius: 3
                        }, feature.properties.direct);
                    } else if (this.highLightFeature === "dataTips") {
                        var styleForDataTips;
                        if (feature.properties.srctype == "1") {//未处理
                            styleForDataTips = {src: './css/tips/normal/pending.png'};
                        } else {//已处理
                            styleForDataTips = {src: './css/tips/normal/processed.png'};
                        }
                        this.layer._drawImg(ctx, geom, styleForDataTips, true, feature.properties);
                    }

                }
            }

        }
    },
    getFeature: function (e) {
        this.id = e.id;
    },
    _drawLink: function () {

    }
});
/**
 * Created by liwanchong on 2015/11/21.
 */

fastmap.uikit.HighLightRender = L.Class.extend({
    /**
     * 事件管理器
     * @property includes
     */
    includes: L.Mixin.Events,
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
        this.initFlag = this.options.initFlag || false;//当地图变化时,才能激发this.draw()函数
        this.cleanHighLight = "";
        var that = this;
        this.layer.on("getId", this.getFeature, this);
        this.layer.on("tileDrawend", function (e) {
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
                    // console.log("id" + data[key].properties.id);
                    var ctx = {
                        canvas: this.tiles[index].options.context,
                        tile: L.point(key.split(',')[0], key.split(',')[1]),
                        zoom: this._map.zoom
                    }
                    var style = null;
                    if (feature.properties.srctype == "1") {//未处理
                        style = {src: './css/tips/selected/pending.png'};
                    } else {//已处理
                        style = {src: './css/tips/selected/processed.png'};
                    }
                    this.layer._drawImg(ctx, geom, style, true);

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
                this.layer._drawImg(ctx, geom, style, true);
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
                            size:3,
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
                        size:3,
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
     */
    drawLinksOfCrossForInit: function (linksArr, nodesArr,nodeArr) {
        this.linksArr = linksArr,
            this.nodesArr = nodesArr;
        var linkObj = {}, nodeObj = {}, nodeStyle;
        for (var k = 0, lenK = this.linksArr.length; k < lenK; k++) {
            linkObj[this.linksArr[k]] = true;
        }
        for (var j = 0, lenJ = nodesArr.length; j < lenJ; j++) {
            nodeObj[this.nodesArr[j]] = true;
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
                        if (nodeObj[feature.properties.enode] || nodeObj[feature.properties.snode]) {
                            nodeStyle = {
                                color: '#FFFF00',
                                radius: 4
                            }
                        } else {
                            nodeStyle = {
                                color: 'rgba(105,105,105,1)',
                                radius: 3
                            }

                        }
                        this.layer._drawLineString(ctx, geom, true, {
                            size: 2,
                            color: '#F63428'
                        }, nodeStyle, feature.properties);

                        if(nodeArr &&feature.properties.snode == nodeArr[0]){
                            this.layer._drawPoint(ctx,geom[0][0], {
                                color: 'blue',
                                radius: 4
                            }, true);
                        }else if(nodeArr &&feature.properties.enode == nodeArr[0]){
                            this.layer._drawPoint(ctx, geom[geom.length-1][0], {
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
                    if (nodeObj[feature.properties.enode] || nodeObj[feature.properties.snode]) {
                        nodeStyle = {
                            color: '#FFFF00',
                            radius: 4
                        }
                    } else {
                        nodeStyle = {
                            color: 'rgba(105,105,105,1)',
                            radius: 3
                        }

                    }
                    this.layer._drawLineString(ctx, geom, true, {
                        size: 2,
                        color: '#F63428'
                    }, nodeStyle, feature.properties);
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
        tile.options.context.getContext('2d').clearRect(0, 0, 256, 256);
        var ctx = {
            canvas: tile.options.context,
            tile: tile.options.context._tilePoint,
            zoom: zoom
        };
        if (data.hasOwnProperty("features")) {
            for (var i = 0, len = data.features.length; i < len; i++) {
                var feature = data.features[i];
                var geom = feature.geometry.coordinates;
                if (feature.properties.restrictioninfo === undefined) {
                    return;
                }
                var newStyle = "", newGeom = [];
                var restrictObj = feature.properties.restrictioninfo;
                if (this.restrictId !== undefined && feature.properties.id === this.restrictId) {
                    if (restrictObj.constructor === Array) {
                        for (var theory = 0, theoryLen = restrictObj.length; theory < theoryLen; theory++) {
                            newStyle = {src: './css/limit/selected/' + restrictObj[theory] + restrictObj[theory] + '.png'};
                            if (theory > 0) {
                                newGeom[0] = (parseInt(geom[0]) + theory * 16);
                                newGeom[1] = (parseInt(geom[1]));
                                this.layer._drawImg(ctx, newGeom, newStyle, true);
                            } else {
                                this.layer._drawImg(ctx, geom, newStyle, true);
                            }

                        }
                    } else {
                        var restrictArr = restrictObj.split(",");
                        for (var fact = 0, factLen = restrictArr.length; fact < factLen; fact++) {

                            if (restrictArr[fact].constructor === Array) {
                                newStyle = {src: './css/limit/selected/' + restrictArr[fact][0] + restrictArr[fact][0] + '.png'};
                            } else {
                                if (restrictArr[fact].indexOf("[") > -1) {
                                    restrictArr[fact] = restrictArr[fact].replace("[", "");
                                    restrictArr[fact] = restrictArr[fact].replace("]", "");
                                    newStyle = {src: './css/limit/selected/' + restrictArr[fact] + restrictArr[fact] + '.png'};
                                } else {
                                    newStyle = {src: './css/limit/selected/' + restrictArr[fact] + '.png'};
                                }
                            }
                            if (fact > 0) {
                                newGeom[0] = (parseInt(geom[0]) + fact * 16);
                                newGeom[1] = (parseInt(geom[1]));
                                this.layer._drawImg(ctx, newGeom, newStyle, true);
                            } else {
                                this.layer._drawImg(ctx, geom, newStyle, true);
                            }

                        }
                    }

                }
            }
        }


    },
    draw: function (e) {
        this.tiles = e.target.tiles;
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
                        this.layer._drawImg(ctx, geom, styleForDataTips, true);
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
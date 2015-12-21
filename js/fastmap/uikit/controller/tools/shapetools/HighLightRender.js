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
        this.linkPid = this.options.linkPid;//高亮link的id
        this.restrictId = this.options.restrictId;//高亮交限的id
        this.initFlag =this.options.initFlag|| false;//当地图变化时,才能激发this.draw()函数
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
        console.log(this.tiles);
        for (var index in this.tiles) {

            var data = this.tiles[index].data.features;

            for (var key in data) {

                var feature = data[key];
                var type = feature.geometry.type;
                var geom = feature.geometry.coordinates;

                if (this.dataTipsId && data[key].properties.id == this.dataTipsId) {
                    //console.log("id" + data[key].properties.id);
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
                }

                this.layer._drawImg(ctx, geom, style, true);

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
            if (data[key].properties.id == this.id) {

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
            }

            this.layer._drawImg(ctx, geom, style, true);


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
                            //else {
                            //    this.layer._drawLineString(ctx, geom, true, style, {
                            //        color: '#696969',
                            //        radius: 3
                            //    }, feature.properties.direct);
                            //}

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
                                }, feature.properties.direct);
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
                        //else {
                        //    this.layer._drawLineString(ctx, geom, true, style, {
                        //        color: '#696969',
                        //        radius: 3
                        //    }, feature.properties.direct);
                        //}

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
                        size: 2,
                        color: '#F63428'
                    }, {
                        color: '#F63428',
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
     * 高亮交限
     * @param tile
     * @param zoom
     */
    drawRestrict:function(tile, zoom) {
        var data = tile.data;
        tile.options.context.getContext('2d').clearRect(0, 0, 256, 256);
        var ctx = {
            canvas: tile.options.context,
            tile: tile.options.context._tilePoint,
            zoom: zoom
        };
        if(data.hasOwnProperty("properties")){
            for(var i= 0,len=data.features.length;i<len;i++) {
                var feature = data.features[i];
                var geom = feature.geometry.coordinates;
                if (feature.properties.restrictioninfo === undefined) {
                    return;
                }
                var newStyle="", newGeom=[];
                var restrictObj = feature.properties.restrictioninfo;
                if (this.restrictId !== undefined&&feature.properties.id===this.restrictId) {
                    if (restrictObj.constructor === Array) {
                        for (var theory = 0, theoryLen = restrictObj.length; theory < theoryLen; theory++) {
                            newStyle= {src: './css/limit/selected/' + restrictObj[theory] + restrictObj[theory] + '.png'};
                            if (theory > 0) {
                                newGeom[0]=(parseInt(geom[0]) + theory*16);
                                newGeom[1]=(parseInt(geom[1]));
                                this.layer._drawImg(ctx, newGeom, newStyle, true);
                            }else{
                                this.layer._drawImg(ctx, geom, newStyle, true);
                            }

                        }
                    } else {
                        var restrictArr = restrictObj.split(",");
                        for (var fact = 0, factLen = restrictArr.length; fact < factLen; fact++) {

                            if (restrictArr[fact].constructor === Array) {
                                newStyle= {src: './css/limit/selected/' + restrictArr[fact][0] + restrictArr[fact][0] + '.png'};
                            } else {
                                if(restrictArr[fact].indexOf("[")>-1){
                                    restrictArr[fact]=restrictArr[fact].replace("[","");
                                    restrictArr[fact]=restrictArr[fact].replace("]","");
                                    newStyle= {src: './css/limit/selected/' + restrictArr[fact] + restrictArr[fact] + '.png'};
                                }else{
                                    newStyle= {src: './css/limit/selected/' + restrictArr[fact] + '.png'};
                                }
                            }
                            if(fact>0){
                                newGeom[0]=(parseInt(geom[0]) + fact*16);
                                newGeom[1]=(parseInt(geom[1]));
                                this.layer._drawImg(ctx, newGeom, newStyle, true);
                            }else{
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
            if (this.dataTipsId) {
                this.id = this.dataTipsId;
            }
            this.drawTips(tile, zoom);
        }
        else if(this.highLightFeature==="link") {
            this.drawOfLink(tile, zoom);
        }else if(this.highLightFeature==="restrict") {
            this.drawRestrict(tile, zoom);
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
    styleFor: function (feature, value) {

        var pointRadius = 5;
        switch (this.type) {
            case 'Point':
                if (feature.properties.srctype == "1") {//未处理
                    return {src: './css/tips/normal/pending.png'}
                } else {//已处理
                    return {src: './css/tips/normal/processed.png'}
                }
                break;
            case 'MultiPoint':
                if (value != null) {
                    switch (value) {
                        case 1:
                            return {
                                color: 'rgba(255,0,0,1)',
                                radius: pointRadius ? pointRadius : 1
                            }
                            break;
                        case 2:
                            return {
                                color: 'rgba(0,0,255,1)',
                                radius: pointRadius ? pointRadius : 1
                            }
                            break;
                        case 3:
                            return {
                                color: 'rgba(105,105,105,1)',
                                radius: pointRadius ? pointRadius : 1
                            }
                            break;

                    }
                } else {

                    return {
                        radius: 5,
                        color: 'rgba(252,146,114,1)',
                        mouseOverColor: 'rgba(255,0,0,1)',
                        clickColor: 'rgba(252,0,0,1)'
                    }
                }
                break;
            case 'Marker':
                var restrictObj = feature.properties.restrictioninfo;
                var geom = feature.geometry.coordinates;
                if (restrictObj !== undefined) {
                    if (restrictObj.constructor === Array) {
                        for (var theory = 0, theoryLen = restrictObj.length; theory < theoryLen; theory++) {
                            if (theory > 0) {
                                geom[0] = parseInt(geom[0]) + 16;
                            }
                            return {src: './css/selected/normal/' + restrictObj[theory] + restrictObj[theory] + '.png'};
                        }
                    } else {
                        var restrictArr = restrictObj.split(",");
                        for (var fact = 0, factLen = restrictArr.length; fact < factLen; fact++) {
                            if (fact > 0) {
                                geom[0] = parseInt(geom[0]) + 16;
                            }

                            return {src: './css/limit/selected/' + restrictArr[fact] + '.png'};


                        }
                    }
                }
                break;
            case 'LineString':
            case 'MultiLineString':
                var RD_LINK_Colors = [
                    '#646464', '#FFAAFF', '#E5C8FF', '#FF6364', '#FFC000', '#0E7892',
                    '#63DC13', '#C89665', '#C8C864', '#000000', '#00C0FF', '#DCBEBE',
                    '#000000', '#7364C8', '#000000', '#DCBEBE'
                ];
                var c = feature.properties.color;
                var color = RD_LINK_Colors[parseInt(c)];
                return {
                    size: 1,
                    color: color,
                    mouseOverColor: 'rgba(255,0,0,1)',
                    clickColor: 'rgba(252,0,0,1)'
                };

            case 'Polygon':
            case 'MultiPolygon':
                return {
                    color: 'rgba(43,140,190,0.4)',
                    outline: {
                        color: 'rgb(0,0,0)',
                        size: 1
                    }
                };

            default:
                return null;
        }
    }
});
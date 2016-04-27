/**
 * Created by zhongxiaoming on 2015/9/6.
 * Class canvas瓦片图层
 */
fastmap.mapApi.TileJSON = L.TileLayer.Canvas.extend({
    options: {
        debug: true
    },
    includes: [L.Mixin.Events,fastmap.mapApi.LayerRender],
    tileSize: 256,

    /***
     *
     * @param {Object}options
     */
    initialize: function (url, options) {
        this.options = this.options || {};
        L.Util.setOptions(this, options);
        this.url = url;
        this.style = this.options.style || "";
        this.type = this.options.type || "";
        this.editable = this.options.editable || "";
        this.requestType = this.options.requestType || "";
        this.tiles = {};
        this.directColor = this.options.directColor || "#ff0000";
        this.mecator = this.options.mecator || "";
        this.showNodeLevel = this.options.showNodeLevel;
        this.clickFunction = this.options.clickFunction || null;
        this.eventController = fastmap.uikit.EventController();

        this.redrawTiles = [];
        this.drawTile = function (canvas, tilePoint, zoom) {
            var ctx = {
                canvas: canvas,
                tile: tilePoint,
                zoom: zoom
            };

            if (this.options.debug) {
                this._drawDebugInfo(ctx);
            }
            this._draw(ctx, this.options.boolPixelCrs, this.options.parse);
        };

    },
    /***
     * 根据瓦片id移除瓦片
     * @param {String}key
     * @private
     */
    _removeTile: function (key) {
        var tile = this._tiles[key];

        this.fire('tileunload', {tile: tile, url: tile.src});

        if (this.options.reuseTiles) {
            L.DomUtil.removeClass(tile, 'leaflet-tile-loaded');
            this._unusedTiles.push(tile);

        } else if (tile.parentNode === this._tileContainer) {
            this._tileContainer.removeChild(tile);
        }

        // for https://github.com/CloudMade/Leaflet/issues/137
        if (!L.Browser.android) {
            tile.onload = null;
            tile.src = L.Util.emptyImageUrl;
        }
        if (this.tiles[key] !== undefined) {
            this.tiles[key].xmlhttprequest.abort();
        }

        delete this.tiles[key];
        delete this._tiles[key];
    },

    /***
     * 重置图层
     * @param {Object}e
     * @private
     */
    _reset: function (e) {
        for (var key in this._tiles) {
            this.fire('tileunload', {tile: this._tiles[key]});
            if (this.tiles[key] !== undefined) {
                this.tiles[key].xmlhttprequest.abort();
            }

            delete this.tiles[key];
        }

        this._tiles = {};
        this._tilesToLoad = 0;

        if (this.options.reuseTiles) {
            this._unusedTiles = [];
        }

        this._tileContainer.innerHTML = '';

        if (this._animated && e && e.hard) {
            this._clearBgBuffer();
        }

        this._initContainer();
    },

    /***
     * 打印调试信息
     * @param {Object}ctx
     * @private
     */
    _drawDebugInfo: function (ctx) {
        var max = this.tileSize;
        var g = ctx.canvas.getContext('2d');
        g.strokeStyle = '#000000';
        g.fillStyle = '#FFFF00';
        g.strokeRect(0, 0, max, max);
        g.font = "12px Arial";
        g.fillRect(0, 0, 5, 5);
        g.fillRect(0, max - 5, 5, 5);
        g.fillRect(max - 5, 0, 5, 5);
        g.fillRect(max - 5, max - 5, 5, 5);
        g.fillRect(max / 2 - 5, max / 2 - 5, 10, 10);
        g.strokeText(ctx.tile.x + ' ' + ctx.tile.y + ' ' + ctx.zoom, max / 2 - 30, max / 2 - 10);
    },

    /***
     * 计算tilepoint
     * @param {Object}ctx  {canvas: canvas,tile: tilePoint,zoom: zoom}
     * @param {Array}coords 坐标
     * @returns {{x: number, y: number}}
     * @private
     */
    _tilePoint: function (ctx, coords) {
        // start coords to tile 'space'
        var s = ctx.tile.multiplyBy(this.tileSize);

        // actual coords to tile 'space'
        var p = this._map.project(new L.LatLng(coords[1], coords[0]));

        // point to draw
        var x = Math.round(p.x - s.x);
        var y = Math.round(p.y - s.y);
        return {
            x: x,
            y: y
        };
    },

    /***
     *  根据鼠标坐标计算所处的瓦片编号
     * @param coords
     */
    mousePointToTilepoint: function (coords) {
        var p = this._map.project(new L.LatLng(coords[1], coords[0]));
        return p.divideBy(this.tileSize, false);
    },
    /***
     *
     * @param {Object}ctx {canvas: canvas,tile: tilePoint,zoom: zoom}
     * @param {Array}points 计算瓦片范围内的点
     * @returns {Array}
     * @private
     */
    _clip: function (ctx, points) {
        var nw = ctx.tile.multiplyBy(this.tileSize);
        var se = nw.add(new L.Point(this.tileSize, this.tileSize));
        var bounds = new L.Bounds([nw, se]);
        var len = points.length;
        var out = [];

        for (var i = 0; i < len - 1; i++) {
            var seg = L.LineUtil.clipSegment(points[i], points[i + 1], bounds, i);
            if (!seg) {
                continue;
            }
            out.push(seg[0]);
            // if segment goes out of screen, or it's the last one, it's the end of the line part
            if ((seg[1] !== points[i + 1]) || (i === len - 2)) {
                out.push(seg[1]);
            }
        }
        return out;
    },

    /***
     * 计算点是否可见
     * @param {Array}coords
     * @returns {boolean}
     * @private
     */
    _isActuallyVisible: function (coords) {
        var coord = coords[0];
        var min = [coord.x, coord.y], max = [coord.x, coord.y];
        for (var i = 1; i < coords.length; i++) {
            coord = coords[i];
            min[0] = Math.min(min[0], coord.x);
            min[1] = Math.min(min[1], coord.y);
            max[0] = Math.max(max[0], coord.x);
            max[1] = Math.max(max[1], coord.y);
        }
        var diff0 = max[0] - min[0];
        var diff1 = max[1] - min[1];
        if (this.options.debug) {
            console.log(diff0 + ' ' + diff1);
        }
        var visible = diff0 > 1 || diff1 > 1;
        return visible;
    },


    /**
     * 为了兼容返回的数据不是geojson的形式的情况，增加了一个parse参数处理返回数据
     * @param {Object}ctx
     * @param {Boolean}boolPixelCrs
     * @param parse
     * @private
     */
    _draw: function (ctx, boolPixelCrs, parse) {

        var loader = $.getJSON;
        //
        this.options.zoomlevel = this._map;

        var nwPoint = ctx.tile.multiplyBy(this.tileSize);
        var sePoint = nwPoint.add(new L.Point(this.tileSize, this.tileSize));

        // optionally, enlarge request area.
        // with this I can draw points with coords outside this tile area,
        // but with part of the graphics actually inside this tile.
        // NOTE: that you should use this option only if you're actually drawing points!
        var buf = this.options.buffer;
        if (buf > 0) {
            var diff = new L.Point(buf, buf);
            nwPoint = nwPoint.subtract(diff);
            sePoint = sePoint.add(diff);
        }

        var nwCoord = this._map.unproject(nwPoint, ctx.zoom, true);
        var seCoord = this._map.unproject(sePoint, ctx.zoom, true);
        var bounds = [nwCoord.lng, seCoord.lat, seCoord.lng, nwCoord.lat];

        var url = this.createUrl(bounds);
        if (url) { //如果url未定义的话，不请求
            this.key = ctx.tile.x + ":" + ctx.tile.y;
            var self = this;

            this.tileobj = fastmap.mapApi.tile(url);
            this.tileobj.options.context = ctx.canvas;
            this.tiles[this.key] = this.tileobj;

            this.request = this._ajaxLoader(function (geo) {
                if (parse != null || parse != undefined) {
                    data = parse(geo);
                }
                if (data.length == 0) {
                    return;
                }
                self._drawFeature(data, ctx, boolPixelCrs);
            }, url, this.key, parse);

            this.tiles[this.key].setRequest(this.request);
        }
    },
    /***
     *
     * @param func func回调函数
     * @param url url当前请求的url
     * @param {String}key 瓦片key
     * @param {String}parse 瓦片key
     * @returns parse {XDomainRequest}
     * @private
     */
    _ajaxLoader: function (func, url, key, parse) {
        var self = this
        if (document.getElementById) {
            var x = (window.XDomainRequest) ? new XDomainRequest() : new XMLHttpRequest();
            if (window.XDomainRequest) {
                x.xdomain = 1
            }
        }
        if (x) {
            x.onreadystatechange = function () {
                var el = el || {};
                if (x.xdomain || x.readyState == 4) {
                    var d = 0;
                    var el;
                    if (x.xdomain || x.status == 200) {
                        //el = x.dest;

                        if (x.responseText && x.responseText[0] != "<" && x.responseText != "[0]") {
                            if (window.JSON) {
                                if (window.JSON.parse(x.responseText).data != null) {
                                    d = window.JSON.parse(x.responseText);
                                    d = Object.prototype.toString.call(d.data[self.requestType]) === '[object Array]' ? d.data[self.requestType] : d.data;
                                }

                            } else {
                                d = eval("(" + x.responseText + ")")
                            }
                            if (d.length === 0) {
                                return;
                            }
                            self.tiles[key].setData(parse(d));

                            func(d);
                        }
                    }
                }
            };
            if (x.xdomain) {
                x.onerror = function () {
                    //if (active_loaders[this.seq]) {
                    //    delete active_loaders[this.seq]
                    //}
                };
                x.ontimeout = function () {
                    //if (active_loaders[this.seq]) {
                    //    delete active_loaders[this.seq]
                    //}
                };
                x.onprogress = function () {
                };
                x.onload = x.onreadystatechange
            }
            x.open("GET", url);
            x._url = url;
            x.send()


        }
        return x;
    },
    _loadImg: function (url, callBack) {
        var img = new Image();
        img.onload = function () {
            callBack(img);
        };
        img.src = url;
    },
    /***
     * 绘制要素
     * @param data data绘制的数据
     * @param {Object}ctx {canvas: canvas,tile: tilePoint,zoom: zoom}
     * @param {Boolean}boolPixelCrs 是否像素坐标
     * @private
     */
    _drawFeature: function (data, ctx, boolPixelCrs) {
        for (var i = 0; i < data.length; i++) {
            var feature = data[i];
            var geom = feature.geometry;
            var type = geom.type;
            var style = feature.properties.style;
            switch (type) {
                case 'Point':

                    var icons = feature.properties.markerStyle.icon;
                    for (var item in icons){

                        if(icons[item].iconName){

                            this._drawImg({
                                ctx:ctx,
                                geo:icons[item].location,
                                style:{src:icons[item].iconName},
                                boolPixelCrs:boolPixelCrs,
                                rotate:icons[item].rotate?icons[item].rotate :"",
                                drawx:icons[item].column*icons[item].dx,
                                drawy:icons[item].row*icons[item].dy,
                                scalex:icons[item].scalex?icons[item].scalex:1,
                                scaley:icons[item].scaley?icons[item].scaley:1
                            });
                        }else{
                            var coords = geom.coordinates;
                            var arrowlist = [];
                            var direct = '';
                            for (var index = 0; index < coords.length; index++) {
                                if (index < coords.length - 1) {
                                    var oneArrow = [{x: coords[index][0], y: coords[index][1]}, {x: coords[index+1][0], y: coords[index+1][1]}];
                                    arrowlist.push(oneArrow);
                                }
                            }
                            if (feature.properties.forwarddirect&&feature.properties.forwardtext) {
                                direct = 2;//顺方向
                                this._drawIntRticArrow(ctx, direct, arrowlist,feature.properties.color);
                            } else if (feature.properties.reversedirect) {
                                direct = 3;//逆方向
                                this._drawIntRticArrow(ctx, direct, arrowlist,feature.properties.color);
                            }


                            if(direct == 2){
                                this._drawIntRticText(ctx, geom.coordinates, feature.properties.forwardtext,direct);
                            }
                            if(direct==3){
                                this._drawIntRticText(ctx, geom.coordinates, feature.properties.reversetext,direct);
                            }

                        }


                        if(icons[item].text){
                            this._drawText({
                                ctx:ctx,
                                geo:geom.coordinates,
                                text :icons[item].text,
                                font:'bold 15px Courier New',
                                rotate:icons[item].rotate?icons[item].rotate :"",
                                align:'center',
                                drawx:0,
                                drawy:6
                            })
                        }
                    }
                    break;

                case 'MultiPoint':
                    for (j = 0; j < len; j++) {
                        this._drawPoint(ctx, geom[j], style);
                    }
                    break;

                case 'LineString':
                    this._drawLineString(ctx, geom.coordinates, boolPixelCrs, style, {
                                    color: 'rgba(105,105,105,1)',
                                    radius: 3
                                }, feature.properties);

                    //如果属性中有direct属性则绘制箭头
                    if(feature.properties.direct){
                        var coords = geom.coordinates;
                        var arrowlist = [];
                        for (var index = 0; index < coords.length; index++) {
                            if (index < coords.length - 1) {
                                var oneArrow = [{x: coords[index][0], y: coords[index][1]}, {x: coords[index+1][0], y: coords[index+1][1]}];
                                arrowlist.push(oneArrow);
                            }
                        }
                        this._drawArrow(ctx, feature.properties.direct, arrowlist);
                    }

                    //如果属性中有name属性则绘制名称
                    if(feature.properties.name){
                        this._drawLinkNameText(ctx, geom.coordinates, feature.properties.name);
                    }
                    break;

                case 'MultiLineString':
                    for (var j = 0; j < len; j++) {
                        this._drawLineString(ctx, geom[j], style);
                    }
                    break;

                case 'Polygon':
                    this._drawPolygon(ctx, geom.coordinates, style, true,feature.properties.id);
                    break;

                case 'MultiPolygon':
                    for (j = 0; j < len; j++) {
                        this._drawPolygon(ctx, geom[j], style);
                    }
                    break;

                default:
                    throw new Error('Unmanaged type: ' + type);
            }
        }

        this.eventController.fire(this.eventController.eventTypes.TILEDRAWEND, {layer:this,id: ctx.tile.x + ":" + ctx.tile.y, zoom: ctx.zoom});
    },
    // NOTE: a placeholder for a function that, given a tile context, returns a string to a GeoJSON service that retrieve features for that context
    /***
     * 根据瓦片bounds构建url
     * @param {Array}bounds 瓦片bounds
     * @returns {*}
     */
    createUrl: function (bounds) {
        var url = null;
        var tiles = this.mecator.lonlat2Tile((bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2, this._map.getZoom());
        switch (this.type) {
            case "Point":
                if (this._map.getZoom() >= this.showNodeLevel) {

                    if (this.requestType === "") {
                        url = this.url + 'parameter={"z":' + this._map.getZoom() + ',"x":' + tiles[0] + ',"y":' + tiles[1] + ',"gap":30}'
                    } else {
                        url = this.url + 'parameter={"z":' + this._map.getZoom() + ',"x":' + tiles[0] + ',"y":' + tiles[1] + ',"gap":30,"types":[' + this.requestType + ']}'
                    }
                }
                break;
            case "Marker":
            case "rdSpeedLimitPoint":
            case "rdlaneconnexityPoint":
            case "rdCrossPoint":
            case "Diverge":
            case "rdrticPoint"://互联网RTIC
            case "adAdminPoint":
                if (this._map.getZoom() >= this.showNodeLevel) {

                    url = this.url + 'parameter={"projectId":'+Application.projectid+',"z":' + this._map.getZoom() + ',"x":' + tiles[0] + ',"y":' + tiles[1] + ',"gap":20,"type":["' + this.requestType + '"]}'

                }
                break;
            case "LineString":

                if (this._map.getZoom() >= this.showNodeLevel) {
                    url = this.url + 'parameter={"projectId":'+Application.projectid+',"z":' + this._map.getZoom() + ',"x":' + tiles[0] + ',"y":' + tiles[1] + ',"gap":20,"type":["' + this.requestType + '"]}'

                } else {
                    url = Application.url + '/render/link/getByTileWithGap?parameter=' + '{"projectId":'+Application.projectid+',"z":' + this._map.getZoom() + ',"x":' + tiles[0] + ',"y":' + tiles[1] + '}';
                }

                break;
            case "adLink":
                if (this._map.getZoom() >= this.showNodeLevel) {
                    url = this.url + 'parameter={"projectId":'+Application.projectid+',"z":' + this._map.getZoom() + ',"x":' + tiles[0] + ',"y":' + tiles[1] + ',"gap":20,"type":["' + this.requestType + '"]}'
                }

                break;
            case "gpsLine":
                if (this._map.getZoom() >= this.showNodeLevel) {

                    if (this.requestType === "") {
                        url = this.url + 'parameter={"z":' + this._map.getZoom() + ',"x":' + tiles[0] + ',"y":' + tiles[1] + ',"gap":30}'
                    } else {
                        url = this.url + 'parameter={"z":' + this._map.getZoom() + ',"x":' + tiles[0] + ',"y":' + tiles[1] + ',"gap":30,"types":[' + this.requestType + ']}'
                    }
                }
                break;
            case "fusionroad":

                break;
            case "POI":

                break;
            case "AllList":
                break;
            case "Polygon":
                if (this._map.getZoom() >= this.showNodeLevel) {
                    url = this.url + 'parameter={"projectId":'+Application.projectid+',"z":' + this._map.getZoom() + ',"x":' + tiles[0] + ',"y":' + tiles[1] + ',"gap":20,"type":["' + this.requestType + '"]}'

                    //url = this.url + 'parameter={"z":' + this._map.getZoom() + ',"x":' + tiles[0] + ',"y":' + tiles[1] + ',"gap":30,"types":["' + this.requestType + '"]}'
                }

                break;
        }
        return url;
    },

    // NOTE: a placeholder for a function that, given a feature, returns a style object used to render the feature itself

    /***
     * 根据要素生成绘制样式
     * @param {Object}feature
     * @param {number}value
     * @returns {*}
     */
    styleFor: function (feature, value) {

        var pointRadius = 5;
        switch (this.type) {
            case 'Point':
                if (feature.properties.srctype == "1") {//未处理
                    return {src: '../../images/road/tips/normal/pending.png'}
                } else {//已处理
                    return {src: '../../images/road/tips/normal/processed.png'}
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
                var restrictObj = feature.properties.SpeedDivergenceinfo;
                var geom = feature.geometry.coordinates;
                if (restrictObj) {
                    if (restrictObj.constructor === Array) {
                        for (var theory = 0, theoryLen = restrictObj.length; theory < theoryLen; theory++) {
                            if (theory > 0) {
                                geom[0] = parseInt(geom[0]) + 16;
                            }
                            return {src: '../../images/road/limit/normal/' + restrictObj[theory] + restrictObj[theory] + '.png'};
                        }
                    } else {
                        var restrictArr = restrictObj.split(",");
                        for (var fact = 0, factLen = restrictArr.length; fact < factLen; fact++) {
                            if (fact > 0) {
                                geom[0] = parseInt(geom[0]) + 16;
                            }
                            return {src: '../../images/road/limit/normal/' + restrictArr[fact] + '.png'};
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
                var RD_LINK_TYPE = [this._drawBridge]
                var c = feature.properties.color;
                if (feature.properties.kind === '7') {
                    var rdLinkType = RD_LINK_TYPE[0];
                }

                var color = RD_LINK_Colors[parseInt(c)];
                return {
                    size: 1,
                    color: value,
                    rdLinkType: rdLinkType,
                    mouseOverColor: 'rgba(255,0,0,1)',
                    clickColor: 'rgba(252,0,0,1)'
                };
                break;
            case 'Polygon':
                return {
                    fillstyle:'#' + Number(feature.properties.id).toString(16)+'00',
                    outline:{
                        size:1,
                        color: 'rgba(43,140,190,0.9)'
                    }
                }
                break;
            case 'MultiPolygon':
                return {
                    color: 'rgba(43,140,190,0.4)',
                    outline: {
                        color: 'rgb(0,0,0)',
                        size: 1
                    }
                };
                break;
            case 'gpsLine':
                return {
                    size: 1,
                    color: '#000000'
                }
            default:
                return null;
        }
    },
    //两点之间的距离
    distance: function (pointA, pointB) {
        var len;
        if (pointA.x) {
            len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        } else {
            len = Math.pow((pointA[0] - pointB[0]), 2) + Math.pow((pointA[1] - pointB[1]), 2);
        }

        return Math.sqrt(len);
    },
    /**
     * 根据角度重新获得开始点和结束点
     * @param points
     * @param angle
     * @returns {*[]}
     * @private
     */
    _pointsFromAngle: function (points, angle) {
        var drawPoint, endPoint;
        if (angle === 0) {
            if (points[0][0] < points[1][0]) {
                drawPoint = points[0];
                endPoint = points[1];
            } else {
                drawPoint = points[1];
                endPoint = points[0];
            }
        } else if (angle === (Math.PI / 2)) {
            if (points[0][1] < points[1][1]) {
                drawPoint = points[0];
                endPoint = points[1];
            } else {
                drawPoint = points[1];
                endPoint = points[0];
            }
        } else {
            if (angle > 0) {
                if (points[0][0] < points[1][0]) {
                    drawPoint = points[0];
                    endPoint = points[1];
                } else {
                    drawPoint = points[1];
                    endPoint = points[0];
                }

            } else {
                if (points[0][0] > points[1][0]) {
                    drawPoint = points[1];
                    endPoint = points[0];
                } else {
                    drawPoint = points[0];
                    endPoint = points[1];
                }

            }


        }
        return [drawPoint, endPoint]
    }

});


fastmap.mapApi.TileJSON.addInitHook(function () {
    this.isVisiable = this.options.isVisiable ? true : false;
    this.isSelectable = this.options.isSelectable ? true : false;
});
fastmap.mapApi.tileJSON = function (url, options) {
    return new fastmap.mapApi.TileJSON(url, options);
};

/**
 * Created by zhongxiaoming on 2015/9/6.
 * Class canvas瓦片图层
 */
fastmap.mapApi.TileJSON = L.TileLayer.Canvas.extend({
    options: {
        debug: false
    },

    tileSize: 256,

    /***
     *
     * @param {Object}options
     */
    initialize: function (url, options) {
        this.options = this.options || {};
        L.Util.setOptions(this, options);
        this.url = url;
        this.style = this.options.style||"";
        this.type = this.options.type||"";
        this.editable = this.options.editable || "";
        this.requestType = this.options.requestType||"";
        this.tiles = {};
        this.mecator = this.options.mecator||"";
        this.showNodeLeve = this.options.showNodeLeve;
        this.clickFunction = this.options.clickFunction || null;
        var that = this;

        this.redrawTiles = [];
        this.drawTile = function (canvas, tilePoint, zoom) {
            var ctx = {
                canvas: canvas,
                tile: tilePoint,
                zoom: zoom
            };
            //L.DomEvent
            //    .on(canvas, "mousedown",this.clickFunction
            //
            //    //function (e) {
            //    //
            //    //    //选择之前清除已经选中的线
            //    //    //if(that.redrawTiles.length != 0){
            //    //    //    for(var index in that.redrawTiles){
            //    //    //        var drawObj = that.redrawTiles[index];
            //    //    //        that._drawfeature(drawObj.data, {canvas:drawObj.optionscontext},true);
            //    //    //    }
            //    //    //}
            //    //
            //    //    if(that.type =="LineString"){
            //    //         if(that.options.editable) {
            //    //             if(that.options.selectType == 'link'){
            //    //                 that.drawGeomCanvasHighlight(e, canvas,tilePoint,that._TouchesPath);
            //    //             }else if(that.options.selectType == 'node'){
            //    //                 that.drawGeomCanvasHighlight(e, canvas,tilePoint,that._TouchesNodePoint);
            //    //             }
            //    //
            //    //         }
            //    //    }
            //    //
            //    //    if(that.type =="Point"){
            //    //        if(that.options.editable) {
            //    //            that.drawGeomCanvasHighlight(e, canvas,tilePoint,that._TouchesPoint);
            //    //        }
            //    //    }
            //    //
            //    //}
            //
            //);

            if (this.options.debug) {
                this._drawDebugInfo(ctx);
            }
            this._draw(ctx , this.options.boolPixelCrs, this.options.parse);
        };

    },

    /***
     * 高亮显示当前鼠标点位置的地图要素
     * @param {Event}e
     * @param {Canvas}canvas
     * @param {TilePoint}tilePoint
     */
    drawGeomCanvasHighlight:function(e, canvas,tilePoint,disFun){
        var x = e.offsetX|| e.layerX, y =e.offsetY ||e.layerY;
        var id = null;
        for(var item in this.tiles[tilePoint.x+":"+tilePoint.y].data){
            if(disFun(this.tiles[tilePoint.x+":"+tilePoint.y].data[item].g,x,y ,5)){
                var id = this.tiles[tilePoint.x+":"+tilePoint.y].data[item].i;
                var type = this.tiles[tilePoint.x + ":" + tilePoint.y].data[item].a;
                this._drawHeight(this.options.selectType,id);
                this.fire("getId",{id:id,tips:0})
                console.log(id);
                break;
            }
        }


    },


    /***
     * 绘制选择要素
     * @param type
     * @param id
     * @private
     */
    _drawHeight :function(type,id){
        switch (type){
            case "link":
                for(var obj in this.tiles){
                    for(var key in this.tiles[obj].data){
                        if(this.tiles[obj].data[key].i == id){

                            this.redrawTiles.push(this.tiles[obj]);
                            var geometry = this.tiles[obj].data[key].g;
                            var g = this.tiles[obj].options.context.getContext('2d');
                            g.lineWidth = 3;
                            g.strokeStyle = '#FFFF00';
                            g.beginPath();
                            g.moveTo(geometry[0][0], geometry[0][1]);

                            for (var m = 1, max = geometry.length; m < max; m++) {
                                g.lineTo(geometry[m][0], geometry[m][1]);
                            }
                            g.stroke();
                        }
                    }
                }
                break;
            case "relation":
            case "node":
                for(var obj in this.tiles){
                    for(var key in this.tiles[obj].data){
                        if(this.tiles[obj].data[key].i == id){
                            this.redrawTiles.push(this.tiles[obj]);

                            var geometry = this.tiles[obj].data[key].g;
                            var g = this.tiles[obj].options.context.getContext('2d');

                            g.beginPath();
                            g.fillStyle = '#FFFF00';
                            g.arc(geometry[0], geometry[1], 6, 0, Math.PI * 2);
                            g.closePath();
                            g.fill();
                            g.restore();


                        }
                    }
                }
                break;
        }

    },

    /***
     *
     * @param {Array}d 几何图形
     * @param {number}x 鼠标x
     * @param {number}y 鼠标y
     * @param {number}r 半径
     * @returns {number}
     * @private
     */
    _TouchesPath: function (d, x, y, r) {
        var i;
        var N = d.length;
        var p1x = d[0][0];
        var p1y = d[0][1];
        for (var i = 1; i < N; i += 1) {
            var p2x = d[i][0];
            var p2y = d[i][1];
            var dirx = p2x - p1x;
            var diry = p2y - p1y;
            var diffx = x - p1x;
            var diffy = y - p1y;
            var t = 1 * (diffx * dirx + diffy * diry * 1) / (dirx * dirx + diry * diry * 1);
            if (t < 0) {
                t = 0
            }
            if (t > 1) {
                t = 1
            }
            var closestx = p1x + t * dirx;
            var closesty = p1y + t * diry;
            var dx = x - closestx;
            var dy = y - closesty;
            if ((dx * dx + dy * dy) <= r * r) {
                return 1
            }
            p1x = p2x;
            p1y = p2y
        }
        return 0
    },

    /***
     *
     * @param {Array}d 几何图形
     * @param {number}x 鼠标x
     * @param {number}y 鼠标y
     * @param {number}r 半径
     * @returns {number}
     * @private
     */
    _TouchesPoint: function (d, x, y, r){
        var dx = x - d[0];
        var dy = y - d[1];
        if ((dx * dx + dy * dy) <= r * r) {
            return 1;
        }else{
            return 0;
        }
    },
    /***
     * 点击node点
     * @param d
     * @param x
     * @param y
     * @param r
     * @returns {number}
     * @private
     */
    _TouchesNodePoint: function (d, x, y, r){
        var touched =false;
        for(var i = 0, len = d.length; i < len; i++){
            if(i ==0 || i ==len -1){
                var dx = x - d[0][0];
                var dy = y - d[0][1];
                if ((dx * dx + dy * dy) <= r * r) {
                    touched = true;
                }
            }
        }

        return touched;

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
        this.tiles[key].xmlhttprequest.abort();
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
            this.tiles[key].xmlhttprequest.abort();
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
    mousePointToTilepoint: function(coords){
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

    /***
     * 绘制点
     * @param ctx {canvas: canvas,tile: tilePoint,zoom: zoom}
     * @param geom 点对象
     * @param style 样式
     * @param boolPixelCrs 是否是像素坐标
     * @private
     */
    _drawPoint: function (ctx, geom, style, boolPixelCrs) {
        if (!style) {
            return;
        }
        var p = null;
        if(boolPixelCrs){
            p = {x:geom[0], y:geom[1]}
        }else{
            p = this._tilePoint(ctx, geom);
        }

        var c = ctx.canvas;
        var g = c.getContext('2d');
        g.beginPath();
        g.fillStyle = style.color;
        g.arc(p.x, p.y, style.radius, 0, Math.PI * 2);
        g.closePath();
        g.fill();
        g.restore();
    },


    /***
     * 绘制图片
     * @param ctx
     * @param geom
     * @param src
     * @param boolPixelCrs
     * @private
     */
    _drawImg:function(ctx, geom, imgsrc, boolPixelCrs){
        if (!imgsrc.src) {
            return;
        }
        var p = null;
        if(boolPixelCrs){
            p = {x:geom[0], y:geom[1]}
        }else{
            p = this._tilePoint(ctx, imgsrc);
        }
        var c = ctx.canvas;
        var g = c.getContext('2d');
        var image = new Image();
        image.src=imgsrc.src;
        image.onload = function(){
            //以Canvas画布上的坐标(10,10)为起始点，绘制图像
            g.drawImage(image,p.x, p.y);
        };



    },
    /***
     * 绘制线
     * @param {Object}ctx {canvas: canvas,tile: tilePoint,zoom: zoom}
     * @param {Array}geom 绘制几何对象
     * @param {Object}style 样式
     * @param {Boolean}boolPixelCrs 是否像素坐标
     * @private
     */
    _drawLineString: function (ctx, geom, boolPixelCrs,linestyle,nodestyle) {
        if (!linestyle) {
            return;
        }

        var coords = geom, proj = [], i;
        coords = this._clip(ctx, coords);

        for (i = 0; i < coords.length; i++) {

            if(this._map.getZoom() >= this.showNodeLeve && (i == 0||i == coords.length - 1)){
                this._drawPoint(ctx, coords[i][0], nodestyle,true);
            }

            if(boolPixelCrs){
                proj.push({x:coords[i][0][0],y:coords[i][0][1]});
            }else{
                proj.push(this._tilePoint(ctx, coords[i]));
            }

        }
        //if (!this._isActuallyVisible(proj)) {
        //    return;
        //}
        var g = ctx.canvas.getContext('2d');
        g.strokeStyle = linestyle.color;
        g.lineWidth = linestyle.size;
        g.beginPath();
        for (i = 0; i < proj.length; i++) {
            var method = (i === 0 ? 'move' : 'line') + 'To';
            g[method](proj[i].x, proj[i].y);
        }
        g.stroke();
        g.restore();
    },

    /***
     * 绘制polygon
     * @param {Object}ctx {canvas: canvas,tile: tilePoint,zoom: zoom}
     * @param {Array}geom 几何对象
     * @param {Object}style 样式
     * @private
     */
    _drawPolygon: function (ctx, geom, style) {
        if (!style) {
            return;
        }

        for (var el = 0; el < geom.length; el++) {
            var coords = geom[el], proj = [], i;
            coords = this._clip(ctx, coords);
            for (i = 0; i < coords.length; i++) {
                proj.push(this._tilePoint(ctx, coords[i]));
            }
            if (!this._isActuallyVisible(proj)) {
                continue;
            }

            var g = ctx.canvas.getContext('2d');
            var outline = style.outline;
            g.fillStyle = style.color;
            if (outline) {
                g.strokeStyle = outline.color;
                g.lineWidth = outline.size;
            }
            g.beginPath();
            for (i = 0; i < proj.length; i++) {
                var method = (i === 0 ? 'move' : 'line') + 'To';
                g[method](proj[i].x, proj[i].y);
            }
            g.closePath();
            g.fill();
            if (outline) {
                g.stroke();
            }
        }
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
            var self = this, j;

            this.tileobj = fastmap.mapApi.tile(url);
            this.tileobj.options.context = ctx.canvas;
            this.tiles[this.key] = this.tileobj;

            this.request = this._ajaxLoader(function (geo) {
                if (parse != null || parse != undefined) {
                    data = parse(geo);
                }
                if (data.features == undefined) { return }

                self._drawfeature(data, ctx, boolPixelCrs);
            },url,this.key,parse);

            this.tiles[this.key].setRequest(this.request);
        }
    },

    /***
     *
     * @param {Object}func回调函数
     * @param {String}url当前请求的url
     * @param {String}key 瓦片key
     * @returns {XDomainRequest}
     * @private
     */
    _ajaxLoader: function (func, url,key,parse) {
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
                                d = window.JSON.parse(x.responseText);
                                d = d.data[self.requestType]? d.data[self.requestType]: d.data;

                            } else {
                                d = eval("(" + x.responseText + ")")
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

    /***
     * 绘制要素
     * @param {Object}data绘制的数据
     * @param {Object}ctx {canvas: canvas,tile: tilePoint,zoom: zoom}
     * @param {Boolean}boolPixelCrs 是否像素坐标
     * @private
     */
    _drawfeature :function(data, ctx, boolPixelCrs){
        for (var i = 0; i < data.features.length; i++) {
            var feature = data.features[i];

            var color = null;
            if(feature.hasOwnProperty('properties')){
                color = feature.properties.c;
            }

            var style = this.styleFor(feature, color);

            var type = feature.geometry.type;
            var geom = feature.geometry.coordinates;
            var len = geom.length;
            switch (type) {
                case 'Point':
                    if(this.options.type === 'Marker'){
                        this._drawImg(ctx, geom, style, boolPixelCrs);
                    }else{
                        this._drawPoint(ctx, geom, style, boolPixelCrs);
                    }

                    break;

                case 'MultiPoint':
                    for (j = 0; j < len; j++) {
                        this._drawPoint(ctx, geom[j], style);
                    }
                    break;

                case 'LineString':
                    this._drawLineString(ctx, geom, boolPixelCrs, style,{color:'rgba(105,105,105,1)',radius:3});
                    break;

                case 'MultiLineString':
                    for (j = 0; j < len; j++) {
                        this._drawLineString(ctx, geom[j], style);
                    }
                    break;

                case 'Polygon':
                    this._drawPolygon(ctx, geom, style);
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
    },
    // NOTE: a placeholder for a function that, given a tile context, returns a string to a GeoJSON service that retrieve features for that context
    /***
     * 根据瓦片bounds构建url
     * @param {Array}bounds 瓦片bounds
     * @returns {*}
     */
    createUrl: function (bounds) {
        var url = null;

        switch (this.type) {
            case "Point":
                var tiles = this.mecator.lonlat2Tile((bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2, this._map.getZoom());

                url = this.url +'parameter={"z":'+this._map.getZoom()+',"x":'+tiles[0]+',"y":'+tiles[1]+',"gap":5,"type":["'+this.requestType+'"]}'
                break;
            case "Marker":
                var tiles = this.mecator.lonlat2Tile((bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2, this._map.getZoom());

                url = this.url +'parameter={"projectId":1,"z":'+this._map.getZoom()+',"x":'+tiles[0]+',"y":'+tiles[1]+',"gap":5,"type":["'+this.requestType+'"]}'
                break;
            case "LineString":

                var tiles = this.mecator.lonlat2Tile((bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2, this._map.getZoom());

                url = this.url +'parameter={"projectId":1,"z":'+this._map.getZoom()+',"x":'+tiles[0]+',"y":'+tiles[1]+',"gap":5,"type":["'+this.requestType+'"]}'

                break;
            case "fusionroad":
                var me = new Mercator();
                var tiles = me.lonlat2Tile((bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2, map.getZoom());

                url = 'http://119.29.86.160:8999/lost/getlost/?parameter={' +
                '"z":' + map.getZoom() + ',"x":' + tiles[0] + ',"y":' + tiles[1]+'}';

                break;
            case "POI":

                var me = new Mercator();
                var tiles = me.lonlat2Tile((bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2, map.getZoom());
                if (planningid) {
                    var layer = L.polygon([
                        [bounds[1], bounds[0]],
                        [bounds[3], bounds[0]],
                        [bounds[3], bounds[2]],
                        [bounds[1], bounds[2]]

                    ])
                    tileJson.options.boundsArr.push({
                            polygon: layer,
                            x: tiles[0],
                            y: tiles[1],
                            z: map.getZoom()
                        }
                    );
                    var intersection = greinerHormann.intersection(achievementblocklayers.getLayers().pop(), layer);
                    if (intersection) {


                        url = 'http://192.168.3.155/fos/datum/didi/GetTileData?parameter=' +
                        '{z:' + map.getZoom() + ',"x":' + tiles[0] + ',"y":' + tiles[1] + '}'
                    } else {
                        return;
                    }

                } else {

                    url = Application.url + '/poi/tile?parameter=' +

                    '{z:' + map.getZoom() + ',"x":' + tiles[0] + ',"y":' + tiles[1] + '}';
                }

                break;
            case "AllList":
                url = Application.url + '/dealership/getDealershipBySquare?parameter=' +
                '{zoom:' + map.getZoom() + ',"min_longitude":' + bounds[0] + ',"min_latitude":' + bounds[1] + ',"max_longitude":' + bounds[2] + ',"max_latitude":' + bounds[3] + '}';
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
    styleFor: function(feature, value){

        pointRadius = 5;

        switch (this.type) {
            case 'Point':
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
                return {src:'./css/img/mark_bs.png'};
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


fastmap.mapApi.TileJSON.addInitHook(function () {
    this.isVisiable = this.options.isVisiable ? true : false;
    this.isSelectable = this.options.isSelectable ? true : false;
});
fastmap.mapApi.tileJSON=function(url, options) {
    return new fastmap.mapApi.TileJSON(url, options);
};

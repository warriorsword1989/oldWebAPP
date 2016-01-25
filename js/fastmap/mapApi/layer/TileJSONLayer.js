/**
 * Created by zhongxiaoming on 2015/9/6.
 * Class canvas瓦片图层
 */
fastmap.mapApi.TileJSON = L.TileLayer.Canvas.extend({
    options: {
        debug: true
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
        this.style = this.options.style || "";
        this.type = this.options.type || "";
        this.editable = this.options.editable || "";
        this.requestType = this.options.requestType || "";
        this.tiles = {};
        this.directColor = this.options.directColor || "#ff0000";
        this.mecator = this.options.mecator || "";
        this.showNodeLevel = this.options.showNodeLevel;
        this.clickFunction = this.options.clickFunction || null;
        var that = this;
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
        if (boolPixelCrs) {
            p = {x: geom[0], y: geom[1]}
        } else {
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
    _drawImg: function (ctx, geom, imgsrc, boolPixelCrs) {
        if (!imgsrc.src) {
            return;
        }
        var p = null;
        if (boolPixelCrs) {
            p = {x: geom[0], y: geom[1]}
        } else {
            p = this._tilePoint(ctx, imgsrc);
        }
        var c = ctx.canvas;
        var g = c.getContext('2d');
        var image = new Image();
        image.src = imgsrc.src;
        image.onload = function () {
            //以Canvas画布上的坐标(10,10)为起始点，绘制图像
            g.drawImage(image, p.x, p.y);
        };


    },
    _drawText: function (ctx, geom, name) {
        var c = ctx.canvas;
        var g = c.getContext('2d');
        g.font = "10px Courier New";
        g.textAlign = "center";
        var angle,
            nameArr = name.split(""),
            nameLen = name.length * 10, lineLen = 0;
        if (geom.length === 2) {
            angle = this._rotateAngle(geom[0][0], geom[1][0]);
            lineLen = this.distance(geom[0][0], geom[1][0]);
            if (nameLen < lineLen && lineLen > 60) {
                this._showTextOfAngle(g, 0, nameArr.length, name, angle, geom[0][0]);
            }

        } else {
            var startPoint = geom[0][0], startPointForLen = geom[0][0],
                textLength = 0, startText = 0, textIndex = 0,
                betPointsLen, realLineLen = 0, linkArrLen = geom.length;
            for (var m = 1; m < linkArrLen; m++) {
                betPointsLen = this.distance(geom[m][0], startPointForLen);
                if (betPointsLen > 10) {
                    lineLen += parseInt(betPointsLen / 10);
                    realLineLen += betPointsLen;
                }

                startPointForLen = geom[m][0];
            }
            if (nameLen < lineLen && realLineLen > 1000) {
                for (var linkFLag = 1; linkFLag < linkArrLen; linkFLag++) {
                    if (textLength < nameArr.length) {
                        betPointsLen = this.distance(geom[linkFLag][0], startPoint);
                        angle = this._rotateAngle(startPoint, geom[linkFLag][0]);
                        if (betPointsLen > 10) {
                            textIndex = parseInt(betPointsLen / 10);
                            if (textIndex >= nameArr.length) {
                                this._showTextOfAngle(g, 0, nameArr.length, name, angle, startPoint);
                                break;
                            } else {
                                if ((startText + textIndex) > nameArr.length) {
                                    textIndex = nameArr.length - startText;
                                }
                                this._showTextOfAngle(g, startText, textIndex, name, angle, startPoint);
                                startPoint = geom[linkFLag][0];
                                textLength += textIndex;
                                startText = textLength;
                            }
                        } else {
                            startPoint = geom[linkFLag][0];
                        }

                    }

                }
            }
        }
    },
    _drawBridge: function (cav, geom, that) {
        var c = cav.canvas;
        var ctx = c.getContext('2d');
        var oriStart, oriEnd;
        oriStart = geom[0][0];
        for (var i = 1, len = geom.length; i < len; i++) {
            oriEnd = geom[i][0];
            var angle = that._rotateAngle(oriStart, oriEnd),
                points = [];
            points = that._pointsFromAngle([oriStart, oriEnd], angle);
            that._drawObliqueLine(ctx, points, angle);
            oriStart = geom[i][0];
        }

    },
    _drawObliqueLine: function (ctx, points, angle) {
        var len = Math.floor(this.distance(points[0], points[1]) / 20);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#FF0000";
        ctx.save();
        ctx.translate(points[0][0], points[0][1]);
        ctx.rotate(angle);
        ctx.beginPath();
        for (var i = 0; i < len; i++) {
            ctx.moveTo(i * 20, 0);
            ctx.lineTo(i * 20, -6);
        }
        //最后一个点
        ctx.moveTo(points[1][0] - points[0][0], 0);
        ctx.lineTo(points[1][0] - points[0][0], -6);
        ctx.stroke();
        ctx.restore();

    },
    /**
     * 字体的旋转角度
     * @param startPoint
     * @param endPoint
     * @returns {*}
     * @private
     */
    _rotateAngle: function (startPoint, endPoint) {
        var angle;
        if ((startPoint[0] - endPoint[0]) === 0) {
            angle = Math.PI / 2;
        } else {
            if ((startPoint[1] - endPoint[1]) === 0) {
                angle = 0;
            } else {
                angle = Math.atan((startPoint[1] - endPoint[1]) / (startPoint[0] - endPoint[0]));

            }
        }
        return angle;


    },
    _showTextOfAngle: function (ctx, start, end, name, angle, textGeom) {
        var nameArr = name.split(""), PI = Math.PI;
        if (angle === 0) {
            ctx.fillText(name, textGeom[0], textGeom[1]);
            ctx.save();
        } else if ((angle < PI && angle > 2 * (PI / 5))) {
            for (var i = start; i < end; i++) {
                ctx.fillText(nameArr[i], textGeom[0], textGeom[1] + i * 10);
                ctx.save();
            }
        } else {

            var showName = name.substr(start, end);
            ctx.save();
            ctx.translate(textGeom[0], textGeom[1]);
            ctx.rotate(angle);
            ctx.fillText(showName, 0, 0);
            ctx.restore();

        }

    },
    /***
     * _drawArrow绘制方向箭头
     * @param {Object}ctx
     * @param {Number}direct 绘制方向
     * @param {Array}data 点数组
     * @private
     */
    _drawArrow: function (ctx, direct, data) {
        ctx.linewidth = 2;
        ctx.strokeStyle = this.directColor;
        if (direct == 0 || direct == 1) {
            return;
        }

        for (var i = 0, len = data.length; i < len; i++) {
            for (var j = 0, len2 = data[i].length; j < len2 - 1; j = j + 2) {

                ctx.beginPath();
                ctx.translate(0, 0, 0);

                var point1 = data[i][j];
                var point2 = data[i][j + 1];
                var distance = this.distance(point1, point2);
                if (distance < 30) {
                    return;
                }

                ctx.save()
                var centerPoint = L.point((point1.x + point2.x) / 2, (point1.y + point2.y) / 2);

                ctx.translate(centerPoint.x, centerPoint.y);
                //先计算向量与y轴负方向向量(0,-1)的夹角


                var ang = 0;
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
                        ctx.rotate(-ang);
                    } else if (direct == 3) {
                        ctx.rotate(-ang + Math.PI);
                    }
                } else {
                    if (direct == 2) {
                        ctx.rotate(Math.PI - ang); //加个180度，反过来
                    } else if (direct == 3) {
                        ctx.rotate(-ang);
                    }

                }
                ctx.lineTo(-3, -6);
                ctx.lineTo(0, 1);
                ctx.lineTo(3, -6);
                ctx.lineTo(0, 0);
                ctx.stroke();
                ctx.fill(); //箭头是个封闭图形
                ctx.closePath();
                ctx.restore();   //恢复到堆的上一个状态，其实这里没什么用。
            }
        }
    },
    /**
     * 画区域内的道路
     * @param ctx
     * @param points
     * @param dashLength
     * @param that
     * @private
     */
    _drawDashLineOfAngle: function (ctx, points, dashLength, that) {
        var endPoint,
            startPoint = points[0][0];
        for (var i = 1, len = points.length; i < len; i++) {
            endPoint = points[i][0];
            var angle = that._rotateAngle(startPoint, endPoint);
            that._drawDashLine(ctx, [startPoint, endPoint], angle, dashLength, that);
            startPoint = points[i][0];

        }
    },
    /**
     * 画虚线
     * @param ctx
     * @param points
     * @param angle
     * @param dashLength
     * @param self
     * @private
     */
    _drawDashLine: function (ctx, points, angle, dashLength, self) {

        var pointsOfChange = self._pointsFromAngle(points, angle);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "red";
        var xPos = points[1][0] - points[0][0],
            yPos = points[1][1] - points[0][1];
        var dash = Math.floor(Math.sqrt(xPos * xPos + yPos * yPos) / dashLength);
        ctx.save();
        ctx.translate(pointsOfChange[0][0], pointsOfChange[0][1]);
        ctx.rotate(angle);
        ctx.beginPath();
        for (var i = 0; i < dash; i++) {
            if (i % 2) {

                ctx.lineTo(dashLength * i, 0);
            } else {
                ctx.moveTo(dashLength * i, 0);
            }

        }
        ctx.stroke();
        ctx.restore();
    },
    /***
     * 绘制线
     * @param {Object}ctx {canvas: canvas,tile: tilePoint,zoom: zoom}
     * @param {Array}geom 绘制几何对象
     * @param {Object}style 样式
     * @param {Boolean}boolPixelCrs 是否像素坐标
     * @private
     */
    _drawLineString: function (ctx, geom, boolPixelCrs, linestyle, nodestyle, properties) {
        if (!linestyle) {
            return;
        }
        var direct = properties.direct,
            coords = geom, proj = [],
            arrowlist = [];
        coords = this._clip(ctx, coords);

        for (var i = 0; i < coords.length; i++) {

            if (this._map.getZoom() >= this.showNodeLevel && (i == 0 || i == coords.length - 1)) {
                this._drawPoint(ctx, coords[i][0], nodestyle, true);
            }

            if (boolPixelCrs) {
                proj.push({x: coords[i][0][0], y: coords[i][0][1]});
            } else {
                proj.push(this._tilePoint(ctx, coords[i]));
            }

        }
        var g = ctx.canvas.getContext('2d');
        g.strokeStyle = linestyle.color;
        g.lineWidth = linestyle.size;
        g.beginPath();
        for (var j = 0; j < proj.length; j++) {
            var method = (j === 0 ? 'move' : 'line') + 'To';
            g[method](proj[j].x, proj[j].y);
            if (j < proj.length - 1) {
                var oneArrow = [proj[j], proj[j + 1]];
                arrowlist.push(oneArrow);
            }

        }
        g.stroke();
        g.restore();
        if (direct == null || typeof(direct) == "undefined" || direct == "") {
        } else {
            if (this._map.getZoom() >= this.showNodeLevel) {
                this._drawArrow(g, direct, arrowlist);
            }

        }
        //道路的名字
        if (properties.name) {
            if (this._map.getZoom() >= this.showNodeLevel) {
                this._drawText(ctx, geom, properties.name);
            }

        }
        //if (linestyle.rdLinkType !== undefined) {
        //    linestyle["rdLinkType"](ctx, coords, this);
        //}
        ////画桥
        //if (properties.kind === '2') {
        //    this._drawDashLineOfAngle(g, coords, 5, this);
        //}

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
                if (data.features == undefined) {
                    return
                }
                self._drawfeature(data, ctx, boolPixelCrs);
            }, url, this.key, parse);

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
                                    d = d.data[self.requestType] ? d.data[self.requestType] : d.data;
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

    /***
     * 绘制要素
     * @param {Object}data绘制的数据
     * @param {Object}ctx {canvas: canvas,tile: tilePoint,zoom: zoom}
     * @param {Boolean}boolPixelCrs 是否像素坐标
     * @private
     */
    _drawfeature: function (data, ctx, boolPixelCrs) {

        for (var i = 0; i < data.features.length; i++) {
            var feature = data.features[i];

            var color = null;
            if (feature.hasOwnProperty('properties')) {
                color = feature.properties.c;
            }


            var style = this.styleFor(feature, color);
            var type = feature.geometry.type;

            var geom = feature.geometry.coordinates;
            var len = geom.length;
            switch (type) {
                case 'Point':
                    if (this.options.type === 'Marker') {

                        if (feature.properties.restrictioninfo === undefined) {
                            return;
                        }
                        var newstyle = "";
                        var restrictObj = feature.properties.restrictioninfo;
                        var newgeom = [];
                        if (restrictObj !== undefined) {
                            if (restrictObj.constructor === Array) {
                                for (var theory = 0, theoryLen = restrictObj.length; theory < theoryLen; theory++) {

                                    newstyle = {src: './css/limit/normal/' + restrictObj[theory] + restrictObj[theory] + '.png'};

                                    if (theory > 0) {
                                        newgeom[0] = parseInt(geom[0]) + theory * 16;
                                        newgeom[1] = parseInt(geom[1]);
                                        this._drawImg(ctx, newgeom, newstyle, boolPixelCrs);
                                    } else {
                                        this._drawImg(ctx, geom, newstyle, boolPixelCrs);
                                    }

                                }
                            } else {
                                var restrictArr = restrictObj.split(",");
                                for (var fact = 0, factLen = restrictArr.length; fact < factLen; fact++) {

                                    if (restrictArr[fact].constructor === Array) {
                                        newstyle = {src: './css/limit/normal/' + restrictArr[fact][0] + restrictArr[fact][0] + '.png'};

                                    } else {
                                        if (restrictArr[fact].indexOf("[") > -1) {
                                            restrictArr[fact] = restrictArr[fact].replace("[", "");
                                            restrictArr[fact] = restrictArr[fact].replace("]", "");
                                            newstyle = {src: './css/limit/normal/' + restrictArr[fact] + restrictArr[fact] + '.png'};

                                        } else {
                                            newstyle = {src: './css/limit/normal/' + restrictArr[fact] + '.png'};

                                        }
                                    }
                                    if (fact > 0) {
                                        newgeom[0] = parseInt(geom[0]) + fact * 16;
                                        newgeom[1] = parseInt(geom[1]);
                                        this._drawImg(ctx, newgeom, newstyle, boolPixelCrs);
                                    } else {
                                        this._drawImg(ctx, geom, newstyle, boolPixelCrs);
                                    }

                                }
                            }

                        }
                    }else if(this.options.type === 'Diverge'){
                        if (feature.properties.restrictioncondition === undefined) {
                            return;
                        }
                        var restrictObj = feature.properties.restrictioncondition;
                        function loadImg(url, callBack) {
                            var img = new Image();
                            img.onload = function () {
                                callBack(img);
                            };
                            img.src = url;
                        }
                        if (restrictObj !== undefined) {
                            $.each(restrictObj,function(i,v){
                                var poiX = feature.geometry.coordinates[0][0];
                                var poiY = feature.geometry.coordinates[1][0];
                                var newstyle  = './css/divergence/' + v.type + '.png';
                                var route = feature.properties.rotate*(Math.PI/180);
                                loadImg(newstyle, function (img) {
                                    var g = ctx.canvas.getContext('2d');
                                    g.save();
                                    g.translate(poiX, poiY);
                                    g.rotate(route);
                                    g.drawImage(img, i*30, 0);
                                    g.restore();
                                    $(img).bind('click',function(){
                                        console.log(this)
                                    })
                                });
                            });
                        }
                    } else {
                        this._drawImg(ctx, geom, style, boolPixelCrs);
                    }

                    break;

                case 'MultiPoint':
                    for (j = 0; j < len; j++) {
                        this._drawPoint(ctx, geom[j], style);
                    }
                    break;

                case 'LineString':
                    this._drawLineString(ctx, geom, boolPixelCrs, style, {
                        color: 'rgba(105,105,105,1)',
                        radius: 3
                    }, feature.properties);

                    break;

                case 'MultiLineString':
                    for (var j = 0; j < len; j++) {
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

        this.fire("tileDrawend", {id: ctx.tile.x + ":" + ctx.tile.y, zoom: ctx.zoom});
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
                if (this._map.getZoom() >= this.showNodeLevel) {
                    var tiles = this.mecator.lonlat2Tile((bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2, this._map.getZoom());

                    url = this.url + 'parameter={"z":' + this._map.getZoom() + ',"x":' + tiles[0] + ',"y":' + tiles[1] + ',"gap":25,"type":["' + this.requestType + '"]}'

                }
                break;
            case "Marker":
                if (this._map.getZoom() >= this.showNodeLevel) {
                    var tiles = this.mecator.lonlat2Tile((bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2, this._map.getZoom());


                    url = this.url + 'parameter={"projectId":11,"z":' + this._map.getZoom() + ',"x":' + tiles[0] + ',"y":' + tiles[1] + ',"gap":5,"type":["' + this.requestType + '"]}'
                }
                break;
            case "Diverge":
                if (this._map.getZoom() >= this.showNodeLevel) {
                    var tiles = this.mecator.lonlat2Tile((bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2, this._map.getZoom());

                    url = this.url + 'parameter={"projectId":11,"z":' + this._map.getZoom() + ',"x":' + tiles[0] + ',"y":' + tiles[1] + ',"gap":5,"type":["' + this.requestType + '"]}'

                }
                break;
            case "LineString":
                var tiles = this.mecator.lonlat2Tile((bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2, this._map.getZoom());
                if (this._map.getZoom() >= this.showNodeLevel) {
                    url = this.url + 'parameter={"projectId":11,"z":' + this._map.getZoom() + ',"x":' + tiles[0] + ',"y":' + tiles[1] + ',"gap":25,"type":["' + this.requestType + '"]}'

                } else {
                    url = Application.url + '/pdh/tile?parameter=' + '{z:' + map.getZoom() + ',"x":' + tiles[0] + ',"y":' + tiles[1] + '}';
                }

                break;
            case "fusionroad":
                var me = new Mercator();
                var tiles = me.lonlat2Tile((bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2, map.getZoom());

                url = 'http://119.29.86.160:8999/lost/getlost/?parameter={' +
                '"z":' + map.getZoom() + ',"x":' + tiles[0] + ',"y":' + tiles[1] + '}';

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
                            return {src: './css/limit/normal/' + restrictObj[theory] + restrictObj[theory] + '.png'};
                        }
                    } else {
                        var restrictArr = restrictObj.split(",");
                        for (var fact = 0, factLen = restrictArr.length; fact < factLen; fact++) {
                            if (fact > 0) {
                                geom[0] = parseInt(geom[0]) + 16;
                            }
                            return {src: './css/limit/normal/' + restrictArr[fact] + '.png'};
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
                    color: color,
                    rdLinkType: rdLinkType,
                    mouseOverColor: 'rgba(255,0,0,1)',
                    clickColor: 'rgba(252,0,0,1)'
                };
                break;
            case 'Polygon':
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

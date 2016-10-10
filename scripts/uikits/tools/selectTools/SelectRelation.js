/**
 * Created by zhongxiaoming on 2016/2/2.
 * Class SelectRelation
 */
fastmap.uikit.SelectRelation = L.Handler.extend({
    /**
     * 事件管理器
     * @property includes
     */
    includes: L.Mixin.Events,

    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);

        this._map = this.options.map;
        this.editLayerIds = ['relationData','crfData','rdSame','rdLinkSpeedLimit','rdCross'];

        this.currentEditLayers = [];
        this.tiles = [];
        this._map._container.style.cursor = 'pointer';
        this.transform = new fastmap.mapApi.MecatorTranform();
        this.redrawTiles = [];
        this.layerController = new fastmap.uikit.LayerController();
        this.highlightLayer = this.layerController.getLayerById('highlightLayer');
        this.eventController = fastmap.uikit.EventController();
        for (var item in this.editLayerIds) {
            this.currentEditLayers.push(this.layerController.getLayerById(this.editLayerIds[item]))
        }
        this.popup = L.popup({className:'featuresContent'});
        this.clickcount = 0;

    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('dblclick', this.onDbClick, this);
        if (L.Browser.touch) {
            this._map.on('mousedown', this.onMouseDown, this);
        }
    },


    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('dblclick', this.onDbClick, this);
        if (L.Browser.touch) {
            this._map.off('mousedown', this.onMouseDown, this);
        }
    },
    onMouseDown: function (event) {
        this.clickcount++;
        this.tiles = [];
        var mouseLatlng = event.latlng;
        var tileCoordinate = this.transform.lonlat2Tile(mouseLatlng.lng, mouseLatlng.lat, this._map.getZoom());
        var that = this;
        //双击的时候不执行单击的事件
        setTimeout(function () {
            if(that.clickcount > 1){
                that.clickcount = 0;
                that.onDbClick(event);
                return;
            }else if(that.clickcount == 1){
                that.clickcount = 0;
                that.drawGeomCanvasHighlight(tileCoordinate, event);

            }
        },200);

    },
    onDbClick: function (event) {
        this.tiles = [];
        var mouseLatlng = event.latlng;
        var tileCoordinate = this.transform.lonlat2Tile(mouseLatlng.lng, mouseLatlng.lat, this._map.getZoom());
        this.overlays = [];
        var transform = new fastmap.mapApi.MecatorTranform();
        var PointLoc = transform.lonlat2Tile(event.latlng.lng, event.latlng.lat, map.getZoom());
        var PointPixel = transform.lonlat2Pixel(event.latlng.lng, event.latlng.lat, map.getZoom());
        PointPixel[0] = Math.ceil(PointPixel[0]);
        PointPixel[1] = Math.ceil(PointPixel[1]);

        var x = PointPixel[0] - 256 * PointLoc[0];
        var y = PointPixel[1] - 256 * PointLoc[1];
        for (var layer in this.currentEditLayers) {

            this.tiles = this.tiles.concat(this.getRoundTile(this.currentEditLayers[layer], tileCoordinate));

            if (this.currentEditLayers[layer].tiles[tileCoordinate[0] + ":" + tileCoordinate[1]] && !this.currentEditLayers[layer].tiles[tileCoordinate[0] + ":" + tileCoordinate[1]].data) {
                return;
            }
            if (this.currentEditLayers[layer].tiles[tileCoordinate[0] + ":" + tileCoordinate[1]] && this.currentEditLayers[layer].tiles[tileCoordinate[0] + ":" + tileCoordinate[1]].data) {
                var data = this.currentEditLayers[layer].tiles[tileCoordinate[0] + ":" + tileCoordinate[1]].data;
                // var x = event.originalEvent.offsetX || event.layerX, y = event.originalEvent.offsetY || event.layerY;

                for (var item in data) {
                    if (data[item].properties.featType == 'RDSPEEDLIMIT') {
                        if (this._TouchesPoint(data[item].geometry.coordinates, x, y, 20)) {
                            this.overlays.push({layer: this.currentEditLayers[layer],id:data[item].properties.id, data: data[item]});
                            break;
                        }
                    }
                }
            }
        }
        if(this.overlays && this.overlays.length > 0){
            this.eventController.fire(this.eventController.eventTypes.GETRELATIONID, {
                speedData: this.overlays[0].data,
                optype: 'DBRDLINKSPEEDLIMIT',
                orgtype: 'RDSPEEDLIMIT',
                event:event
            })
        }
    },

    /***
     * 获取鼠标点击周边所有瓦片
     * @param layer
     * @param tilePoint
     * @returns {Array}
     */
    getRoundTile: function (layer, tilePoint) {
        var tiles = [];
        for (var index in layer.tiles) {
            if (Math.abs(layer.tiles[index].options.context.name.split('_')[0] - tilePoint[0]) <= 1 && Math.abs(layer.tiles[index].options.context.name.split('_')[1] - tilePoint[1]) <= 1) {
                tiles.push(layer.tiles[index]);
            }
        }
        return tiles;
    },

    drawGeomCanvasHighlight: function (tilePoint, event) {
        this.overlays = [];
        var transform = new fastmap.mapApi.MecatorTranform();
        var PointLoc = transform.lonlat2Tile(event.latlng.lng, event.latlng.lat, map.getZoom());
        var PointPixel = transform.lonlat2Pixel(event.latlng.lng, event.latlng.lat, map.getZoom());
        PointPixel[0] = Math.ceil(PointPixel[0]);
        PointPixel[1] = Math.ceil(PointPixel[1]);

        var x = PointPixel[0] - 256 * PointLoc[0];
        var y = PointPixel[1] - 256 * PointLoc[1];
        var frs = null;
        for (var layer in this.currentEditLayers) {

            this.tiles = this.tiles.concat(this.getRoundTile(this.currentEditLayers[layer], tilePoint))

            if (this.currentEditLayers[layer].tiles[tilePoint[0] + ":" + tilePoint[1]] && !this.currentEditLayers[layer].tiles[tilePoint[0] + ":" + tilePoint[1]].data) {
                return;
            }
            if (this.currentEditLayers[layer].tiles[tilePoint[0] + ":" + tilePoint[1]] && this.currentEditLayers[layer].tiles[tilePoint[0] + ":" + tilePoint[1]].data) {
                var data = this.currentEditLayers[layer].tiles[tilePoint[0] + ":" + tilePoint[1]].data;
                // var x = event.originalEvent.offsetX || event.layerX, y = event.originalEvent.offsetY || event.layerY;

                for (var item in data) {
                    if (data[item].properties.featType == 'RDCROSS') {

                        for (var key in data[item].geometry.coordinates) {
                            if (this._TouchesPoint(data[item].geometry.coordinates[key], x, y, 20)) {
                                this.overlays.push({layer: this.currentEditLayers[layer],id:data[item].properties.id, data: data[item]});
                            }
                        }
                    }else if(data[item].properties.featType == 'RDGSC'){
                            if( data[item]['geometry']['type']!=="LineString") {
                                if (this._TouchesPoint(data[item].geometry.coordinates[0].g[1], x, y, 20)) {
                                    this.overlays.push({layer: this.currentEditLayers[layer], data: data[item]});
                                }
                            }
                    } else if(data[item].properties.featType == 'RDROAD' || data[item].properties.featType == 'RDINTER'|| data[item].properties.featType == 'RDOBJECT' ||data[item].properties.featType == 'RDSAMELINK'){
                        if(data[item]['geometry']['type'] == "Point") {
                            if (this._TouchesPoint(data[item].geometry.coordinates, x, y, 20)) {
                                this.overlays.push({layer: this.currentEditLayers[layer],id:data[item].properties.id, data: data[item]});
                            }
                        } else if(data[item]['geometry']['type'] == "LineString"){
                            if (this._TouchesPath(data[item].geometry.coordinates, x, y, 5)) {
                                this.overlays.push({
                                    layer: this.currentEditLayers[layer],
                                    id:data[item].properties.id,
                                    data: data[item]
                                });
                            }
                        }
                    }  else if(data[item].properties.featType == 'RDLANE'){
                         if(data[item]['geometry']['type'] == "LineString"){
                            if (this._TouchesPath(data[item].geometry.coordinates, x, y, 5)) {
                                this.overlays.push({
                                    layer: this.currentEditLayers[layer],
                                    id:data[item].properties.id,
                                    data: data[item],
                                    tileId:tilePoint[0] + ":" + tilePoint[1]
                                });
                            }
                        }
                    }else {
                        if (this._TouchesPoint(data[item].geometry.coordinates, x, y, 20)) {
                            this.overlays.push({layer: this.currentEditLayers[layer],id:data[item].properties.id, data: data[item]});
                        }
                    }
                }
            }
        }
        /*过滤框选后的数组，去重*/
        var containObj = [];
        var tempLays = [];
        for (var num = 0, numLen = this.overlays.length; num < numLen; num++) {
            if (!containObj[this.overlays[num].id]) {
                containObj[this.overlays[num].id] = true;
                tempLays.push(this.overlays[num]);
            }
        }
        this.overlays = tempLays;
        if (this.overlays.length == 1) {
            // frs = new fastmap.uikit.SelectObject({highlightLayer: this.highlightLayer, map: this._map});
            // frs.tiles = this.tiles;
            // frs.drawGeomCanvasHighlight(this.overlays[0].data, this.overlays[0].data.properties.featType,event);

            this.eventController.fire(this.eventController.eventTypes.GETRELATIONID, {
                id: this.overlays[0].data.properties.id,
                rowId:this.overlays[0].data.properties.rowId,
                optype: this.overlays[0].data.properties.featType,
                selectData: this.overlays[0].data,
                branchType:this.overlays[0].data.properties.branchType,
                tileId:this.overlays[0].tileId,
                event:event
            })
        } else if (this.overlays.length > 1) {
            var html = '<ul id="layerpopup">';
            //this.overlays = this.unique(this.overlays);
            for (var item in this.overlays) {
                html += '<li><a href="#" id="' + this.overlays[item].data.properties.featType + this.overlays[item].id+'">' +App.Temp.relationNameObj[this.overlays[item].data.properties.featType] + '</a></li>';
            }
            html += '</ul>';
            this.popup
                .setLatLng(event.latlng)
                .setContent(html);
            var that = this;
            this._map.on('popupopen', function () {
                document.getElementById('layerpopup').onclick = function (e) {
                    if (e.target.tagName == 'A') {
                        var layer = '';
                        var d = '';
                        var layertype = '';
                        var tileId = '';
                        for (var key in that.overlays) {
                            if (e.target.id == that.overlays[key].data.properties.featType+that.overlays[key].id) {
                                layer = that.overlays[key].layer;
                                layertype = that.overlays[key].data.properties.featType;
                                d = that.overlays[key].data;
                                tileId = that.overlays[key].tileId;
                            }
                        }
                        that.eventController.fire(that.eventController.eventTypes.GETRELATIONID, {
                            id: d.properties.id,
                            rowId:d.properties.rowId,
                            optype: layertype,
                            selectData: d,
                            branchType:d.properties.branchType,
                            tileId:tileId,
                            event:event
                        })
                    }
                }
            });

            //弹出popup，这里如果不用settimeout,弹出的popup会消失，后期在考虑优化  王屯+
            if (this.overlays && this.overlays.length >= 1) {
                setTimeout(function () {
                    that._map.openPopup(that.popup);
                }, 200)
            }
        }
    },
    unique: function (arr) {
        var result = [], hash = {};
        for (var i = 0; i < arr.length; i++) {
            var elem = arr[i].layer.requestType;
            if (!hash[elem]) {
                result.push(arr[i]);
                hash[elem] = true;
            }
        }
        return result;

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
    _TouchesPoint: function (d, x, y, r) {
        var dx = x - d[0];
        var dy = y - d[1];
        if ((dx * dx + dy * dy) <= r * r) {
            return 1;
        } else {
            return 0;
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
    _TouchesPath: function(d, x, y, r) {
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
    }

});
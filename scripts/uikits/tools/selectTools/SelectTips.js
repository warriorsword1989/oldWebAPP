/**
 * Created by liuyang on 2016/2/2.
 * Class SelectTips
 */
fastmap.uikit.SelectTips = L.Handler.extend({
    /**
     * 事件管理器
     * @property includes
     */
    includes: L.Mixin.Events,

    /** *
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);

        this._map = this.options.map;
        this.editLayerIds = ['workPoint'];

        this.currentEditLayers = [];
        this.tiles = [];
        this._map._container.style.cursor = 'pointer';
        this.transform = new fastmap.mapApi.MecatorTranform();
        this.redrawTiles = [];
        this.layerController = new fastmap.uikit.LayerController();
        this.eventController = fastmap.uikit.EventController();
        this.highlightLayer = this.layerController.getLayerById('highlightLayer');
        for (var item in this.editLayerIds) {
            this.currentEditLayers.push(this.layerController.getLayerById(this.editLayerIds[item]));
        }
        this.popup = L.popup();
    },

    /** *
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        if (L.Browser.touch) {
            this._map.on('click', this.onMouseDown, this);
        }
    },


    /** *
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        if (L.Browser.touch) {
            this._map.off('click', this.onMouseDown, this);
        }
    },
    onMouseDown: function (event) {
        // button：0.左键,1.中键,2.右键
        // 限制为左键点击事件
        if (event.originalEvent.button > 0) {
            return;
        }
        this.tiles = [];
        var mouseLatlng = event.latlng;
        var tileCoordinate = this.transform.lonlat2Tile(mouseLatlng.lng, mouseLatlng.lat, this._map.getZoom());

        this.drawGeomCanvasHighlight(tileCoordinate, event);
    },

    /** *
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
        var ids = [];
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
            this.tiles = this.tiles.concat(this.getRoundTile(this.currentEditLayers[layer], tilePoint));

            if (this.currentEditLayers[layer].tiles[tilePoint[0] + ':' + tilePoint[1]] && !this.currentEditLayers[layer].tiles[tilePoint[0] + ':' + tilePoint[1]].data) {
                return;
            }
            if (this.currentEditLayers[layer].tiles[tilePoint[0] + ':' + tilePoint[1]] && this.currentEditLayers[layer].tiles[tilePoint[0] + ':' + tilePoint[1]].data) {
                var data = this.currentEditLayers[layer].tiles[tilePoint[0] + ':' + tilePoint[1]].data;
                // var x = event.originalEvent.offsetX || event.layerX, y = event.originalEvent.offsetY || event.layerY;

                for (var item in data) {
                    if (data[item].geometry.coordinates) {
                        if (data[item].geometry.coordinates.length <= 2) {
                            if (this._TouchesPoint(data[item].geometry.coordinates, x, y, 27)) {
                                var id = data[item].properties.id;
                                var type = data[item].properties.featType;
                                ids.push({ id: id, type: type });
                                // this.eventController.fire(this.eventController.eventTypes.GETTIPSID, {id: id, tips: 0,optype:"TIPS"})
                                // break;
                            }
                        } else {
                            var temp = [];
                            for (var i = 0; i < data[item].geometry.coordinates.length; i++) {
                                var childArr = [];
                                childArr[0] = data[item].geometry.coordinates[i][0];
                                childArr[1] = data[item].geometry.coordinates[i][1];
                                temp.push(childArr);
                            }
                            for (var i = 0; i < temp.length; i++) {
                                if (this._TouchesPoint(temp[i], x, y, 27)) {
                                    var id = data[item].properties.id;
                                    var type = data[item].properties.featType;
                                    ids.push({ id: id, type: type });
                                    // this.eventController.fire(this.eventController.eventTypes.GETTIPSID, {id: id, tips: 0,optype:"TIPS"})
                                    // break;
                                }
                            }
                        }
                    }
                }
            }
        }
        // ids = Utils.distinctArr(ids);

        /* 过滤框选后的数组，去重*/
        var containObj = [];
        var tempLays = [];
        for (var num = 0, numLen = ids.length; num < numLen; num++) {
            if (!containObj[ids[num].id]) {
                containObj[ids[num].id] = true;
                tempLays.push(ids[num]);
            }
        }
        if (tempLays.length == 1) {
            this.eventController.fire(this.eventController.eventTypes.GETTIPSID, { id: tempLays[0].id, tips: 0, optype: 'TIPS' });
        } else if (tempLays.length > 1) {
            var html = '<ul id="layerpopup">';
            for (var i in tempLays) {
                // html += '<li><a href="#" id="'+ id +'">TIPS ' +Application.relationNameObj[this.overlays[item].data.properties.featType] + '</a></li>';
                var showId = tempLays[i].id;
                if (tempLays[i].id.length > 18) {
                    showId = tempLays[i].id.substr(0, 18) + '...';
                }
                html += '<li><a href="#" id="' + tempLays[i].id + '">TIPS ' + App.Temp.tipsNameObj[tempLays[i].type] + ' ' + showId + '</a></li>';
            }
            html += '</ul>';
            this.popup
                .setLatLng(event.latlng)
                .setContent(html);
            var that = this;
            this._map.on('popupopen', function () {
                document.getElementById('layerpopup').onclick = function (e) {
                    if (e.target.tagName == 'A') {
                        that.eventController.fire(that.eventController.eventTypes.GETTIPSID, { id: e.target.id, tips: 0, optype: 'TIPS' });
                    }
                };
            });
            setTimeout(function () {
                that._map.openPopup(that.popup);
            }, 200);
        }
        // if (this.overlays.length == 1) {
        //     frs = new fastmap.uikit.SelectObject({highlightLayer: this.highlightLayer, map: this._map});
        //     frs.tiles = this.tiles;
        //     frs.drawGeomCanvasHighlight(this.overlays[0].data, this.overlays[0].data.properties.featType);
        // } else if (this.overlays.length > 1) {
        //     var html = '<ul id="layerpopup">';
        //     //this.overlays = this.unique(this.overlays);
        //     for (var item in this.overlays) {
        //         html += '<li><a href="#" id="' + this.overlays[item].data.properties.featType + this.overlays[item].id+'">' +Application.relationNameObj[this.overlays[item].data.properties.featType] + '</a></li>';
        //     }
        //     html += '</ul>';
        //     this.popup
        //         .setLatLng(event.latlng)
        //         .setContent(html);
        //     var that = this;
        //     this._map.on('popupopen', function () {
        //         document.getElementById('layerpopup').onclick = function (e) {
        //             if (e.target.tagName == 'A') {
        //                 var layer = '';
        //                 var d = '';
        //                 var layertype = ''
        //                 for (var key in that.overlays) {
        //                     if (e.target.id == that.overlays[key].data.properties.featType+that.overlays[key].id) {
        //                         layer = that.overlays[key].layer;
        //                         layertype = that.overlays[key].data.properties.featType
        //                         d = that.overlays[key].data;
        //                     }
        //                 }
        //
        //                 frs = new fastmap.uikit.SelectObject({highlightLayer: this.highlightLayer, map: this._map});
        //                 frs.tiles = that.tiles;
        //                 frs.drawGeomCanvasHighlight(d, layertype);
        //             }
        //         }
        //     });
        //
        //     //弹出popup，这里如果不用settimeout,弹出的popup会消失，后期在考虑优化  王屯+
        //     var that = this;
        //     if (this.overlays && this.overlays.length >= 1) {
        //         setTimeout(function () {
        //             that._map.openPopup(that.popup);
        //         }, 200)
        //     }
        // }
    },
    unique: function (arr) {
        var result = [],
            hash = {};
        for (var i = 0; i < arr.length; i++) {
            var elem = arr[i].layer.requestType;
            if (!hash[elem]) {
                result.push(arr[i]);
                hash[elem] = true;
            }
        }
        return result;
    },

    /** *
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
    }

});

/**
 * Created by liuyang on 2016/8/8.
 * Class SelectNodeAndPath
 */
fastmap.uikit.SelectNodeAndPath = L.Handler.extend({
    /**
     * 事件管理器
     * @property includes
     */
    includes: L.Mixin.Events,
    /***
     *
     * @param {Object}options
     */
    initialize: function(options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.map;
        this._map._container.style.cursor = 'pointer';
        this.transform = new fastmap.mapApi.MecatorTranform();
        this.eventController = new fastmap.uikit.EventController();
        this.selectCtrl = new fastmap.uikit.SelectController();
        this.popup = L.popup();
        this.selectLayers = this.options.selectLayers;
        this._setSnapHandler(this.options.snapLayers);
    },

    /***
     * 开启捕捉
     * @param {type} 捕捉的图层
     */
    _setSnapHandler: function(layers) {
        this.snapHandler = new fastmap.mapApi.Snap({
            map: this._map,
            shapeEditor: this.shapeEditor,
            snapLine: true,
            snapNode: true,
            snapVertex: false
        });
        for (var i = 0; i < layers.length; i++) {
            this.snapHandler.addGuideLayer(layers[i]);
        }
        this.snapHandler.enable();
    },
    /***
     * 添加事件处理
     */
    addHooks: function() {
        this._map.on('mousedown', this.onMouseDown_np, this);
        this._map.on('mousemove', this.onMouseMove_np, this);
        if (L.Browser.touch) {
            this._map.on('click', this.onMouseDown_np, this);
            this.snapHandler.disable();
        }
    },
    /***
     * 移除事件
     */
    removeHooks: function() {
        this._map.off('mousedown', this.onMouseDown_np, this);
        this._map.off('mousemove', this.onMouseMove_np, this);
        if (L.Browser.touch) {
            this._map.off('click', this.onMouseDown_np, this);
        }
    },
    onMouseMove_np: function(event) {
        this.snapHandler.setTargetIndex(0);
        if (this.snapHandler.snaped) {
            this.eventController.fire(this.eventController.eventTypes.SNAPED, {
                'snaped': true
            });
            this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1], this.snapHandler.snapLatlng[0])
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback({
                point: {
                    x: this.targetPoint.lng,
                    y: this.targetPoint.lat
                }
            });
        } else {
            this.eventController.fire(this.eventController.eventTypes.SNAPED, {
                'snaped': false
            });
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
        }
    },
    onMouseDown_np: function(event) {
        this._isDrawing = false;
        var mouseLatlng;
        if (this.snapHandler.snaped) {
            mouseLatlng = this.targetPoint
        }
        if(mouseLatlng != undefined){
            var tileCoordinate = this.transform.lonlat2Tile(mouseLatlng.lng, mouseLatlng.lat, this._map.getZoom());
            this.selectFromTile(tileCoordinate, event);
        }
    },
    selectFromTile: function(tilePoint, event) {
        var pixels = null;
        if (!this.snapHandler.snaped) {
            pixels = this.transform.lonlat2Pixel(event.latlng.lng, event.latlng.lat, this._map.getZoom());
        } else {
            pixels = this.transform.lonlat2Pixel(this.targetPoint.lng, this.targetPoint.lat, this._map.getZoom());
        }
        var x = pixels[0] - tilePoint[0] * 256,
            y = pixels[1] - tilePoint[1] * 256;
        // 鼠标点击的位置，用于显示操作按钮面板
        var point = new fastmap.mapApi.Point(this.transform.PixelToLonlat(tilePoint[0] * 256 + x, tilePoint[1] * 256 + y, this._map.getZoom()));
        var data, selectFeatures = [];
        for (var i = 0; i < this.selectLayers.length; i++) {
            if (this.selectLayers[i].options.showNodeLevel > this._map.getZoom()) {
                continue;
            }
            data = this.selectLayers[i].tiles[tilePoint[0] + ":" + tilePoint[1]].data;
            for (var item in data) {
                if (data[item].geometry.type == "LineString") {
                    if (this._TouchesPath(data[item].geometry.coordinates, x, y, 5)) {
                        selectFeatures.push({
                            id: data[item].properties.id,
                            optype: data[item].properties.featType,
                            event: event,
                            point: point,
                            properties: data[item].properties,
                            layer: this.selectLayers[i]
                        });
                    }
                } else if (data[item].geometry.type == "Point"){
                    if (this._TouchesNodePoint(data[item].geometry.coordinates, x, y, 5)) {
                        selectFeatures.push({
                            id: data[item].properties.id,
                            optype: data[item].properties.featType,
                            name: data[item].properties.name,
                            event: event,
                            layer: this.selectLayers[i]
                        });
                    }
                }
            }
        }
        this.selectCtrl.selectedFeatures = selectFeatures[0];
        this.eventController.fire(this.eventController.eventTypes.GETFEATURE, selectFeatures[0]);
        selectFeatures[0].layer.selectedid = selectFeatures[0].id;
        // if (selectFeatures.length == 1) {
        //     this.selectCtrl.selectedFeatures = selectFeatures[0];
        //     this.eventController.fire(this.eventController.eventTypes.GETFEATURE, selectFeatures[0]);
        //     selectFeatures[0].layer.selectedid = selectFeatures[0].id;
        // } else if (selectFeatures.length > 1) {
        //     var html = '<ul id="layerpopup">';
        //     //this.overlays = this.unique(this.overlays);
        //     for (var item in selectFeatures) {
        //         html += '<li><a href="#" id="' + item + '">' + selectFeatures[item].optype + "-" + selectFeatures[item].id + '</a></li>';
        //     }
        //     html += '</ul>';
        //     this.popup.setLatLng(event.latlng).setContent(html);
        //     var that = this;
        //     this._map.on('popupopen', function() {
        //         document.getElementById('layerpopup').onclick = function(e) {
        //             that.selectCtrl.selectedFeatures = selectFeatures[e.target.id];
        //             that.eventController.fire(that.eventController.eventTypes.GETFEATURE, selectFeatures[e.target.id]);
        //             selectFeatures[e.target.id].layer.selectedid = selectFeatures[e.target.id].id;
        //             that._map.closePopup(that.popup);
        //             that._map.off('popupopen');
        //         }
        //     });
        //     setTimeout(function() {
        //         that._map.openPopup(that.popup);
        //     }, 200);
        // }
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
    _TouchesNodePoint: function(d, x, y, r) {
        var touched = false;
        for (var i = 0, len = d.length; i < len; i++) {
            var dx = x - d[0];
            var dy = y - d[1];
            if ((dx * dx + dy * dy) <= r * r) {
                touched = true;
            }
        }
        return touched;
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
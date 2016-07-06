/**
 * Created by zhongxiaoming on 2016/1/12.
 * Class SelectNode
 */
fastmap.uikit.SelectNode = L.Handler.extend({
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
        this.eventController = new fastmap.uikit.EventController();
        this._map._container.style.cursor = 'pointer';
        this.transform = new fastmap.mapApi.MecatorTranform();
        this.selectCtrl = new fastmap.uikit.SelectController();
        this.popup = L.popup();
        this._setWorkLayers(this.options.nodeType || "Point");
        this._setSnapHandler(["Node"]);
    },
    /***
     * 设置工作图层，支持多个
     * @param {layerType} 工作图层类型
     *                    值域：Point, LineString, Polygon, PointFeature, TipPoint, TipLine
     *                    与layerConfig文件中的layer.options.type对应
     */
    _setWorkLayers: function(layerType) {
        this.workLayers = [];
        if (this.options.currentEditLayer) { // 单图层
            this.workLayers.push(this.options.currentEditLayer);
        } else { // 多图层
            var layerCtrl = new fastmap.uikit.LayerController();
            var reqType;
            for (var i = 0; i < layerCtrl.layers.length; i++) {
                //条件：数据图层 + 可见图层 + 包含Point数据的图层
                if (layerCtrl.layers[i].options.groupId == "dataLayers" && layerCtrl.layers[i].options.visible && layerCtrl.layers[i].options.type.split(",").indexOf(layerType) >= 0) {
                    // 如果限制了要素类型
                    if (this.options.featType && this.options.featType.length > 0) {
                        reqType = layerCtrl.layers[i].options.requestType.split(",");
                        for (var j = 0; j < this.options.featType.length; j++) {
                            if (reqType.indexOf(this.options.featType[j]) >= 0) {
                                this.workLayers.push(layerCtrl.layers[i]);
                                break;
                            }
                        }
                    } else {
                        this.workLayers.push(layerCtrl.layers[i]);
                    }
                }
            }
        }
    },
    /***
     * 工作图层开启捕捉
     * @param {type} 捕捉的数据类型
     *               值域：Point(形状点), Line(线), Node(要素点)
     */
    _setSnapHandler: function(types) {
        this.snapHandler = new fastmap.mapApi.Snap({
            map: this._map,
            shapeEditor: this.shapeEditor,
            snapLine: types.indexOf("Line") >= 0,
            snapNode: types.indexOf("Node") >= 0,
            snapVertex: types.indexOf("Point") >= 0
        });
        for (var i = 0; i < this.workLayers.length; i++) {
            this.snapHandler.addGuideLayer(this.workLayers[i]);
        }
        this.snapHandler.enable();
    },
    /***
     * 添加事件处理
     */
    addHooks: function() {
        this._map.on('mousedown', this.onMouseDown, this);
        if (L.Browser.touch) {
            this._map.on("click", this.onMouseDown, this);
            this.snapHandler.disable();
        }
        if (this.id !== "rdcross") {
            this._map.on('mousemove', this.onMouseMove, this);
        }
    },
    /***
     * 移除事件
     */
    removeHooks: function() {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);
        if (L.Browser.touch) {
            this._map.off("click", this.onMouseDown, this);
        }
    },
    onMouseMove: function(event) {
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
    onMouseDown: function(event) {
        var mouseLatlng = event.latlng;
        var tileCoordinate = this.transform.lonlat2Tile(mouseLatlng.lng, mouseLatlng.lat, this._map.getZoom());
        this._lookup(tileCoordinate, event);
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
    _TouchesPoint: function(d, x, y, r) {
        var dx = x - d[0];
        var dy = y - d[1];
        if ((dx * dx + dy * dy) <= r * r) {
            return 1;
        } else {
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
     * 鼠标单击后，在图层的瓦片数据中查找距离最近的点
     * @param tilePoint 鼠标点击位置的tile坐标
     * @param event 鼠标点击事件
     * @returns 如果找到Node，则发送GETNODEID事件
     * @private
     */
    _lookup: function(tilePoint, event) {
        var pixels = this.transform.lonlat2Pixel(event.latlng.lng, event.latlng.lat, this._map.getZoom());
        var x = pixels[0] - tilePoint[0] * 256,
            y = pixels[1] - tilePoint[1] * 256;
        var data, touchedObjects = [];
        for (var i = 0; i < this.workLayers.length; i++) {
            if (this.workLayers[i].options.showNodeLevel > this._map.getZoom()) {
                continue;
            }
            data = this.workLayers[i].tiles[tilePoint[0] + ":" + tilePoint[1]].data;
            for (var item in data) {
                if (data[item].geometry.type == "Point") {
                    if (this._TouchesNodePoint(data[item].geometry.coordinates, x, y, 5)) {
                        touchedObjects.push({
                            id: data[item].properties.id,
                            optype: data[item].properties.featType,
                            event: event,
                            layer: this.workLayers[i]
                        });
                    }
                }
            }
        }
        if (touchedObjects.length == 1) {
            this.eventController.fire(this.eventController.eventTypes.GETNODEID, touchedObjects[0]);
            this.selectCtrl.selectedFeatures = touchedObjects[0];
            touchedObjects[0].layer.selectedid = touchedObjects[0].id;
        } else if (touchedObjects.length > 1) {
            var html = '<ul id="layerpopup">';
            //this.overlays = this.unique(this.overlays);
            for (var item in touchedObjects) {
                html += '<li><a href="#" id="' + item + '">' + touchedObjects[item].optype + "-" + touchedObjects[item].id + '</a></li>';
            }
            html += '</ul>';
            this.popup.setLatLng(event.latlng).setContent(html);
            var that = this;
            this._map.on('popupopen', function() {
                document.getElementById('layerpopup').onclick = function(e) {
                    that.selectCtrl.selectedFeatures = touchedObjects[e.target.id];
                    that.eventController.fire(that.eventController.eventTypes.GETNODEID, touchedObjects[e.target.id]);
                    touchedObjects[e.target.id].layer.selectedid = touchedObjects[e.target.id].id;
                    that._map.closePopup(that.popup);
                    that._map.off('popupopen');
                }
            });
            setTimeout(function() {
                that._map.openPopup(that.popup);
            }, 200);
        }
    }
});
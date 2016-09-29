/**
 * Created by zhongxiaoming on 2015/9/18.
 * Class SelectPath
 */
fastmap.uikit.SelectPath = L.Handler.extend({
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
        this.linksFlag = this.options.linksFlag; // 选择模式：true:选Link,false:选组成
        this.eventController = new fastmap.uikit.EventController();
        this.selectCtrl = new fastmap.uikit.SelectController();
        this.popup = L.popup();
        this._setWorkLayers("LineString");
        this._setSnapHandler(["Line"]);
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
        this._map.on('mousemove', this.onMouseMove, this);
        if (L.Browser.touch) {
            this._map.on('click', this.onMouseDown, this);
            this.snapHandler.disable();
        }
    },
    /***
     * 移除事件
     */
    removeHooks: function() {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);
        if (L.Browser.touch) {
            this._map.off('click', this.onMouseDown, this);
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
        //小于一定级别不让选择
        // if (this.currentEditLayer.showNodeLevel > this._map.getZoom()) {
        //     return;
        // }
        var mouseLatlng;
        if (this.snapHandler.snaped) {
            mouseLatlng = this.targetPoint
        } else {
            mouseLatlng = event.latlng;
        }
        var tileCoordinate = this.transform.lonlat2Tile(mouseLatlng.lng, mouseLatlng.lat, this._map.getZoom());
        this._lookup(tileCoordinate, event);
    },
    _lookup: function(tilePoint, event) {
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
        var data, touchedObjects = [];
        for (var i = 0; i < this.workLayers.length; i++) {
            if (this.workLayers[i].options.showNodeLevel > this._map.getZoom()) {
                continue;
            }
            data = this.workLayers[i].tiles[tilePoint[0] + ":" + tilePoint[1]].data;
            for (var item in data) {
                if (data[item].geometry.type == "LineString") {
                    if (this._TouchesPath(data[item].geometry.coordinates, x, y, 5)) {
                        touchedObjects.push({
                            id: data[item].properties.id,
                            optype: data[item].properties.featType,
                            event: event,
                            point: point,
                            properties: data[item].properties,
                            layer: this.workLayers[i]
                        });
                    }
                }
            }
        }
        if (touchedObjects.length == 1) {
            this.selectCtrl.selectedFeatures = touchedObjects[0];
            if (this.linksFlag) {
                this.eventController.fire(this.eventController.eventTypes.GETLINKID, touchedObjects[0]);
            } else {
                this.eventController.fire(this.eventController.eventTypes.GETOUTLINKSPID, touchedObjects[0]);
            }
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
                    if (that.linksFlag) {
                        that.eventController.fire(that.eventController.eventTypes.GETLINKID, touchedObjects[e.target.id]);
                    } else {
                        that.eventController.fire(that.eventController.eventTypes.GETOUTLINKSPID, touchedObjects[e.target.id]);
                    }
                    touchedObjects[e.target.id].layer.selectedid = touchedObjects[e.target.id].id;
                    that._map.closePopup(that.popup);
                    that._map.off('popupopen');
                }
            });
            setTimeout(function() {
                that._map.openPopup(that.popup);
            }, 200);
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
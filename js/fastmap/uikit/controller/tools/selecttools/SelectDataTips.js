/**
 * Created by liwanchong on 2015/11/4.
 */
fastmap.uikit.SelectDataTips = L.Handler.extend({
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
        this.currentEditLayer = this.options.currentEditLayer;
        this.eventController = fastmap.uikit.EventController();
        this.layerCtrl = fastmap.uikit.LayerController();
        this.highLayer = this.layerCtrl.getLayerById('highlightlayer');
        this.tiles = this.currentEditLayer.tiles;
        this._map._container.style.cursor = 'pointer';
        this.transform = new fastmap.mapApi.MecatorTranform();
        this.redrawTiles = [];
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
    },

    disable: function () {
        if (!this._enabled) {
            return;
        }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },

    onMouseDown: function (event) {
        var mouseLatlng = event.latlng;
        var tileCoordinate = this.transform.lonlat2Tile(mouseLatlng.lng, mouseLatlng.lat, this._map.getZoom());
        this.drawGeomCanvasHighlight(tileCoordinate, event);
    },

    drawGeomCanvasHighlight: function (tilePoint, event) {
        var x = event.originalEvent.offsetX || event.layerX, y = event.originalEvent.offsetY || event.layerY;
        if (this.tiles[tilePoint[0] + ":" + tilePoint[1]] && this.tiles[tilePoint[0] + ":" + tilePoint[1]].hasOwnProperty("data")) {
            var data = this.tiles[tilePoint[0] + ":" + tilePoint[1]].data.features;

            var id = null;
            for (var item in data) {
                if (data[item].geometry.coordinates.length <= 2) {
                    if (this._TouchesPoint(data[item].geometry.coordinates, x, y, 27)) {
                        id = data[item].properties.id;
                        this.eventController.fire(this.eventController.eventTypes.GETTIPSID, {id: id, tips: 0})

                        if (this.redrawTiles.length != 0) {
                            this._cleanHeight();
                        }

                        this._drawHeight(id);
                        break;
                    }
                } else {
                    var temp = [];
                    for (var i = 0; i < data[item].geometry.coordinates.length; i++) {
                        var childArr = [];
                        childArr[0] = data[item].geometry.coordinates[i][0][0];
                        childArr[1] = data[item].geometry.coordinates[i][0][1];
                        temp.push(childArr);
                    }
                    for (var i = 0; i < temp.length; i++) {
                        if (this._TouchesPoint(temp[i], x, y, 27)) {
                            id = data[item].properties.id;
                            this.eventController.fire(this.eventController.eventTypes.GETTIPSID, {id: id, tips: 0})
                            if (this.redrawTiles.length != 0) {
                                this._cleanHeight();
                            }
                            this._drawHeight(id);
                            break;
                        }
                    }
                }

            }

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
    _TouchesPoint: function (d, x, y, r) {
        var dx = x - d[0];
        var dy = y - d[1];
        if ((dx * dx + dy * dy) <= r * r) {
            return 1;
        } else {
            return 0;
        }
    },
    cleanHeight: function () {
        this._cleanHeight();
    },

    /***_drawLineString: function (ctx, geom, style, boolPixelCrs) {
     *清除高亮
     */
    _cleanHeight: function () {
        for (var index in this.highLayer._tiles) {

            this.highLayer._tiles[index].getContext('2d').clearRect(0, 0, 256, 256);
        }

        for (var i = 0, len = this.eventController.eventTypesMap[this.eventController.eventTypes.TILEDRAWEND].length; i < len; i++) {
            this.eventController.off(this.eventController.eventTypes.TILEDRAWEND, this.eventController.eventTypesMap[this.eventController.eventTypes.TILEDRAWEND][i]);
        }
    }
    ,
    /***
     * 绘制高亮
     * @param id
     * @private
     */
    _drawHeight: function (id) {
        this.redrawTiles = this.tiles;
        for (var obj in this.tiles) {
            var data = this.tiles[obj].data.features;
            for (var key in data) {
                var feature = data[key];
                var geom = feature.geometry.coordinates;
                if (data[key].properties.id == id) {
                    var ctx = {
                        canvas: this.highLayer._tiles[this.tiles[obj].options.context.name.replace('_', ":")],
                        tile: L.point(key.split(',')[0], key.split(',')[1]),
                        zoom: this._map.zoom
                    }
                    var newGeom = [];
                    newGeom[0] = (parseInt(geom[0]));
                    newGeom[1] = (parseInt(geom[1]));
                    if (feature.properties.kind) {  //种别
                        if (feature.properties.type == '1201') {
                            this.highLayer._drawBackground({
                                ctx: ctx,
                                geo: newGeom,
                                boolPixelCrs: true,
                                lineColor: 'rgb(4, 187, 245)',
                                fillColor: 'rgba(4, 187, 245, 0.2)',
                                lineWidth: 1,
                                width: 40,
                                height: 20,
                                drawx: -20,
                                drawy: -10

                            });
                        } else if (feature.properties.type == '1203') {
                            this.highLayer._drawBackground({
                                ctx: ctx,
                                geo: newGeom,
                                boolPixelCrs: true,
                                rotate: (feature.properties.kind-90) * (Math.PI / 180),
                                lineColor: 'rgb(4, 187, 245)',
                                fillColor: 'rgba(4, 187, 245, 0.5)',
                                lineWidth: 1,
                                width: 40,
                                height: 20,
                                drawx: -20,
                                drawy: -10
                            });
                        }
                    } else {
                        this.highLayer._drawBackground({
                            ctx: ctx,
                            geo: newGeom,
                            boolPixelCrs: true,
                            lineColor: 'rgb(4, 187, 245)',
                            fillColor: 'rgba(4, 187, 245, 0.5)',
                            lineWidth: 1,
                            width: 40,
                            height: 20,
                            drawx: -35,
                            drawy: -25
                        });
                    }
                }
            }
        }
    }

});


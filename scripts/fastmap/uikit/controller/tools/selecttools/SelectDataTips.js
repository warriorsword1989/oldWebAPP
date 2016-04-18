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
    }

});


/**
 * Created by liwanchong on 2015/11/4.
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
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        //this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.map;
        //this.container = this._map._container;
        //this._mapDraggable = this._map.dragging.enabled();
        this.currentEditLayer = this.options.currentEditLayer;
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

    //disable: function () {
    //    if (!this._enabled) { return; }
    //    this._map.dragging.enable();
    //    this._enabled = false;
    //    this.removeHooks();
    //},

    onMouseDown: function (event) {
        var mouseLatlng = event.latlng;
        var tileCoordinate = this.transform.lonlat2Tile(mouseLatlng.lng, mouseLatlng.lat, this._map.getZoom());

        this.drawGeomCanvasHighlight(tileCoordinate, event);
    },

    drawGeomCanvasHighlight: function (tilePoint, event) {

        var x = event.originalEvent.offsetX || event.layerX, y = event.originalEvent.offsetY || event.layerY;

        var data = this.tiles[tilePoint[0] + ":" + tilePoint[1]].data.features;

        var id = null;
        for (var item in data) {
            if (this._TouchesPoint(data[item].geometry.coordinates, x, y, 20)) {
                id = data[item].properties.id;
                this.currentEditLayer.fire("getNodeId", {id: id, tips: 0})

                if (this.redrawTiles.length != 0) {
                    this._cleanHeight();
                }

                this._drawHeight(id);
                break;
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
        this.currentEditLayer.fire("getNodeId")
    }
    ,

    /***_drawLineString: function (ctx, geom, style, boolPixelCrs) {
     *清除高亮
     */
    _cleanHeight: function () {
        for (var index in this.redrawTiles) {
            var data = this.redrawTiles[index].data;
            this.redrawTiles[index].options.context.getContext('2d').clearRect(0, 0, 256, 256);
            var ctx = {
                canvas: this.redrawTiles[index].options.context,
                tile: this.redrawTiles[index].options.context._tilePoint,
                zoom: this._map.getZoom()
            }

            for (var i = 0; i < data.features.length; i++) {
                var feature = data.features[i];

                var color = null;
                if (feature.hasOwnProperty('properties')) {
                    color = feature.properties.c;
                }
                var style = this.currentEditLayer.styleFor(feature, color);

                var geom = feature.geometry.coordinates;

                this.currentEditLayer._drawImg(ctx, geom, style, true);

            }
        }


    }
    ,
    /***
     * 绘制高亮
     * @param id
     * @private
     */
    _drawHeight: function (id) {
        this.redrawTiles=this.tiles;
        for (var obj in this.tiles) {
            var data = this.tiles[obj].data.features;

            for (var key in data) {

                var feature = data[key];
                var type = feature.geometry.type;
                var geom = feature.geometry.coordinates;
                if (data[key].properties.id == id) {

                    var ctx = {
                        canvas: this.tiles[obj].options.context,
                        tile: L.point(key.split(',')[0], key.split(',')[1]),
                        zoom: this._map.getZoom()
                    }

                    if(type=="Point"){
                        this.currentEditLayer._drawImg(ctx, geom, {src:'./css/limit/selected/'+feature.properties.restrictioninfo+'.png'}, true);
                    }
                }

            }
        }


    }

});
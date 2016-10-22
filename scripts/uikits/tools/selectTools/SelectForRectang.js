/**
 * Created by liuyang on 2016/8/4.
 */
fastmap.uikit.SelectForRectang = L.Handler.extend({
    /**
     * 事件管理器
     * @property includes
     */
    includes: L.Mixin.Events,

    /***
    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;

        this.transform = new fastmap.mapApi.MecatorTranform();

        this.eventController = fastmap.uikit.EventController();
        this._map = this.options.map;
        this.container = this._map._container;
        this._mapDraggable = this._map.dragging.enabled();
        this.boxLayers = this.options.LayersList;//图层数组:点、线

        this.validation = fastmap.uikit.geometryValidation({transform: new fastmap.mapApi.MecatorTranform()});
        this.options.shapeOptions = {
                stroke: true,
                color: '#f06eaa',
                weight: 4,
                opacity: 0.5,
                fill: true,
                fillColor: null, //same as color by default
                fillOpacity: 0.2,
                clickable: true
            },
            this.options.metric = true, // Whether to use the metric meaurement system or imperial
            this.options.repeatMode = true
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._mapDraggable = this._map.dragging.enabled();

        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        this.container.style.cursor = 'crosshair';
        this._map.on('click', this.onMouseDown, this);
        this._map.on('mousemove', this.onMouseMove, this);

    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        if (this._map) {
            if (this._mapDraggable) {
                this._map.dragging.enable();
            }

            //TODO refactor: move cursor to styles
            this.container.style.cursor = '';

            this._map
                .off('click', this.onMouseDown, this)
                .off('mousemove', this.onMouseMove, this);

            L.DomEvent.off(document, 'mouseup', this.onMouseUp, this);
            // If the box element doesn't exist they must not have moved the mouse, so don't need to destroy/return
            if (this._shape) {
                this._map.removeLayer(this._shape);
                this._map.getPanes().overlayPane.style.zIndex = "1";
                delete this._shape;
            }
        }
        this._isDrawing = false;

    },

    onMouseDown: function (e) {
        this._isDrawing = true;
        this._startLatLng = e.latlng;
        if (this._map.getPanes().overlayPane.style.zIndex === "1") {
            this._map.getPanes().overlayPane.style.zIndex = "4";
        }

        L.DomEvent
            .on(document, 'mouseup', this.onMouseUp, this)
            .preventDefault(e.originalEvent);
    },
    onMouseUp: function (e) {
        if (this._shape) {
            this._fireCreatedEvent();
        }
    },
    onMouseMove: function (e) {
        var latlng = e.latlng;
        if (this._isDrawing) {
            this._drawShape(latlng);
        }
    },
    _drawShape: function (latlng) {
        if (!this._shape) {
            this._shape = new L.Rectangle(new L.LatLngBounds(this._startLatLng, latlng), this.options.shapeOptions);
            this._map.addLayer(this._shape);
        } else {
            this._shape.setBounds(new L.LatLngBounds(this._startLatLng, latlng));
        }
    },
    disable: function () {
        if (!this._enabled) {
            return;
        }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },
    _fireCreatedEvent: function () {
        var rectangle = new L.Rectangle(this._shape.getBounds(), this.options.shapeOptions);
        // var dataOfRectangle = this._getDataOfRectangle(rectangle, this.boxLayer.tiles);
        var dataOfRectangle = [];
        for(var i = 0; i<this.boxLayers.length; i++){
            var middleArr = this._getDataOfRectangle(rectangle, this.boxLayers[i].tiles);
            if(middleArr && middleArr.length>0){
                dataOfRectangle = dataOfRectangle.concat(middleArr);
            }
        }
        this.disable();
        if (this.options.repeatMode) {
            this.enable();
        }
        this.eventController.fire(this.eventController.eventTypes.GETRECTDATA,
            {data: dataOfRectangle, layerType: this.type,border:rectangle});
    },
    _getDataOfRectangle: function (layer, tiles) {
        var points = layer._latlngs, dataOfRectangle = [];
        if(points.length < 4){
            return;
        }
        var transform = new fastmap.mapApi.MecatorTranform();
        var startTilePoint = transform.lonlat2Tile(points[1].lng, points[1].lat, map.getZoom()),
            endTilePoint = transform.lonlat2Tile(points[3].lng, points[3].lat, map.getZoom());
        var point0 = new fastmap.mapApi.Point(points[1].lng, points[1].lat);
        var point1 = new fastmap.mapApi.Point(points[2].lng, points[2].lat);
        var point2 = new fastmap.mapApi.Point(points[3].lng, points[3].lat);
        var point3 = new fastmap.mapApi.Point(points[0].lng, points[0].lat);
        var lineString = new fastmap.mapApi.LinearRing([point0, point1, point2, point3, point0]);
        var polygon = new fastmap.mapApi.Polygon([lineString]);
        for (var i = startTilePoint[0]; i <= endTilePoint[0]; i++) {
            for (var j = startTilePoint[1]; j <= endTilePoint[1]; j++) {
                if (tiles[i + ":" + j]) {
                    var data = tiles[i + ":" + j].data;
                    for (var item in data) {
                        if (data[item].geometry.type == "LineString") {
                            var pointsLen = data[item].geometry.coordinates.length;
                            var linePoints = [];
                            for (var n = 0; n < pointsLen; n++) {
                                var linePoint = data[item].geometry.coordinates[n];
                                linePoint = transform.PixelToLonlat(i * 256 + linePoint[0], j * 256 + linePoint[1], map.getZoom());
                                linePoint = new fastmap.mapApi.Point(linePoint[0], linePoint[1]);
                                linePoints.push(linePoint);
                            }
                            var line = new fastmap.mapApi.LineString(linePoints);
                            if (polygon.intersects(line)) {
                                var result = {};
                                result["data"] = data[item];
                                result["line"] = line;
                                dataOfRectangle.push(result);
                            }
                        } else if (data[item].geometry.type == "Point") {
                            var pointsLen = data[item].geometry.coordinates;
                            var linePoint = transform.PixelToLonlat(i * 256 + pointsLen[0], j * 256 + pointsLen[1], map.getZoom());
                            linePoint = new fastmap.mapApi.Point(linePoint[0], linePoint[1]);
                            if (polygon.containsPoint(linePoint)) {
                                var result = {};
                                data[item].point = linePoint;
                                result["data"] = data[item];
                                dataOfRectangle.push(result);
                            }
                        }
                    }
                }
            }
        }

        return dataOfRectangle;
    }

});

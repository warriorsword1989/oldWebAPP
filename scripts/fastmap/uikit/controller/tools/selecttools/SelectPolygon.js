/**
 * Created by zhongxiaoming on 2016/4/14.
 * Class SelectPolygon
 */


fastmap.uikit.SelectPolygon = L.Handler.extend({
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
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.map;
        this.currentEditLayer = this.options.currentEditLayer;
        this.tiles = this.currentEditLayer.tiles;
        this._map._container.style.cursor = 'pointer';
        this.transform = new fastmap.mapApi.MecatorTranform();
        this.redrawTiles = [];

        this.eventController = fastmap.uikit.EventController();
        //this.snapHandler = new fastmap.uikit.Snap({map:this._map,shapeEditor:this.shapeEditor,snapLine:true,snapNode:false,snapVertex:false});
        //this.snapHandler.enable();
        //this.snapHandler.addGuideLayer(new fastmap.uikit.LayerController({}).getLayerById('referenceLine'));
        //this.eventController = fastmap.uikit.EventController();
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('mousemove', this.onMouseMove, this);
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);

    },

    onMouseMove:function(event){

    },

    onMouseDown: function (event) {
        var mouseLatlng;

        mouseLatlng = event.latlng;


        var tileCoordinate = this.transform.lonlat2Tile(mouseLatlng.lng, mouseLatlng.lat, this._map.getZoom());
        this.drawGeomCanvasHighlight(tileCoordinate, event);
    },
    drawGeomCanvasHighlight: function (tilePoint, event) {

        if (this.tiles[tilePoint[0] + ":" + tilePoint[1]]) {
            var pixels = null;

            pixels = this.transform.lonlat2Pixel(event.latlng.lng, event.latlng.lat,this._map.getZoom());


            var x = pixels[0]-tilePoint[0]*256,y=pixels[1]-tilePoint[1]*256
            var data = this.tiles[tilePoint[0] + ":" + tilePoint[1]].data.features;
            var id = null;
            var transform = new fastmap.mapApi.MecatorTranform();
            for (var item in data) {
                if (this._containPoint(data[item].geometry.coordinates, x, y, 5)) {
                    var point= transform.PixelToLonlat(tilePoint[0] * 256 + x, tilePoint[1] * 256 + y, this._map.getZoom());
                    point= new fastmap.mapApi.Point(point[0], point[1]);
                    id = data[item].properties.id;


                        this.eventController.fire(this.eventController.eventTypes.GETLINKID, {id: id,point:point});
                        this.currentEditLayer.selectedid = id;

                    this._cleanHeight();


                        this._drawHeight(id);

                        this.eventController.fire(this.eventController.eventTypes.GETOUTLINKSPID, {id: id});


                    break;
                }
            }

        }


    },


    /***
     * 判断点是否在几何图形内部
     * @param geo
     * @param x
     * @param y
     * @private
     */
    _containPoint:function(geo, x, y){
        var lineRing = fastmap.mapApi.linearRing(geo[0][0]);
        return lineRing.containsPoint(fastmap.mapApi.point(x,y));
    },

    cleanHeight: function () {
        this._cleanHeight();
    },
    /***
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
            if (data.hasOwnProperty("features")) {
                for (var i = 0; i < data.features.length; i++) {
                    var feature = data.features[i];

                    var color = null;
                    if (feature.hasOwnProperty('properties')) {
                        color = feature.properties.c;
                    }

                    var style = this.currentEditLayer.styleFor(feature, color);

                    var geom = feature.geometry.coordinates;

                    this.currentEditLayer._drawPolygon(ctx, geom[0], style, true);

                }
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
        this.redrawTiles = this.tiles;
        for (var obj in this.tiles) {

            var data = this.tiles[obj].data.features;

            for (var key in data) {

                if (data[key].properties.id == id) {

                    var ctx = {
                        canvas: this.tiles[obj].options.context,
                        tile: L.point(key.split(',')[0], key.split(',')[1]),
                        zoom: this._map.getZoom()
                    };
                    this.currentEditLayer._drawPolygon(ctx, data[key].geometry.coordinates[0],
                        {
                            fillstyle:'#00F5FF',
                            outline:{
                                size:1,
                                color: '#00F5FF'
                            }
                        }

                    , true);


                }
            }
        }

    }

});

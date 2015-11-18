/**
 * Created by zhongxiaoming on 2015/9/18.
 * Class PathVertexInsert
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
        this.currentEditLayer.on("getTiles",function(event) {
            var tiles = event.tiles;
        });
        var x = event.originalEvent.offsetX || event.layerX, y = event.originalEvent.offsetY || event.layerY;
        var data = this.tiles[tilePoint[0] + ":" + tilePoint[1]].data.features;
        var id = null;
        for (var item in data) {
            if (this._TouchesPath(data[item].geometry.coordinates, x, y, 5)) {
                id = data[item].properties.id;
                this.currentEditLayer.fire("getId", {id: id})

                if( this.redrawTiles.length != 0){
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
    _TouchesPath: function (d, x, y, r) {
        var i;
        var N = d.length;
        var p1x = d[0][0][0];
        var p1y = d[0][0][1];
        for (var i = 1; i < N; i += 1) {
            var p2x = d[i][0][0];
            var p2y = d[i][0][1];
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
    },
     cleanHeight:function(){
         this._cleanHeight();
         this.currentEditLayer.fire("getId")
     },
    /***_drawLineString: function (ctx, geom, style, boolPixelCrs) {
     *清除高亮
     */
    _cleanHeight:function(){
        console.log("from clear");
        for(var index in this.redrawTiles){
            var data = this.redrawTiles[index].data;
            this.redrawTiles[index].options.context.getContext('2d').clearRect(0,0,256,256);
            var ctx = {
                canvas: this.redrawTiles[index].options.context,
                tile: this.redrawTiles[index].options.context._tilePoint,
                zoom: this._map.getZoom()
            }
          if(data.hasOwnProperty("features")) {
              for (var i = 0; i < data.features.length; i++) {
                  var feature = data.features[i];

                  var color = null;
                  if(feature.hasOwnProperty('properties')){
                      color = feature.properties.c;
                  }

                  var style = this.currentEditLayer.styleFor(feature, color);

                  var geom = feature.geometry.coordinates;

                  this.currentEditLayer._drawLineString(ctx, geom, true,style,{color: '#696969',
                      radius:3},feature.properties.direct);

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
        this.redrawTiles=this.tiles;
        for (var obj in this.tiles) {

            var data = this.tiles[obj].data.features;

            for (var key in data) {

                if (data[key].properties.id == id) {


                    var ctx = {
                        canvas: this.tiles[obj].options.context,
                        tile: L.point(key.split(',')[0], key.split(',')[1]),
                        zoom: this._map.getZoom()
                    }
                    this.currentEditLayer._drawLineString(ctx, data[key].geometry.coordinates, true, {
                        size: 3,
                        color: '#FFFF00'
                    }, {
                        color: '#FFFF00',
                        radius: 3
                    });


                }
            }
        }


    }

});

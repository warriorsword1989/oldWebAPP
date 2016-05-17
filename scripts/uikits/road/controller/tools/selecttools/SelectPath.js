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
        this.linksFlag = this.options.linksFlag;
        this.snapHandler = new fastmap.mapApi.Snap({map:this._map,shapeEditor:this.shapeEditor,snapLine:true,snapNode:false,snapVertex:false});
        this.snapHandler.enable();
        //this.snapHandler.addGuideLayer(new fastmap.uikit.LayerController({}).getLayerById('referenceLine'));
        this.eventController = fastmap.uikit.EventController();
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('mousemove', this.onMouseMove, this);
        if(L.Browser.touch){
            this._map.on('click', this.onMouseDown, this);
            this.snapHandler.disable();
        }
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);
        if(L.Browser.touch){
            this._map.off('click', this.onMouseDown, this);
        }
    },

    onMouseMove:function(event){
        this.snapHandler.setTargetIndex(0);
        if(this.snapHandler.snaped){
            this.eventController.fire(this.eventController.eventTypes.SNAPED,{'snaped':true});
            this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1],this.snapHandler.snapLatlng[0])
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback({point:{x:this.targetPoint.lng,y:this.targetPoint.lat}});
        }else{
            this.eventController.fire(this.eventController.eventTypes.SNAPED,{'snaped':false});
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
        }
    },


    onMouseDown: function (event) {
        //小于一定级别不让选择
        if(this.currentEditLayer.shwoNodeLevel > this._map.getZoom()){
            return;
        }
        var mouseLatlng;
        if(this.snapHandler.snaped){
            mouseLatlng = this.targetPoint
        }else{
            mouseLatlng = event.latlng;
        }

        var tileCoordinate = this.transform.lonlat2Tile(mouseLatlng.lng, mouseLatlng.lat, this._map.getZoom());
        this.drawGeomCanvasHighlight(tileCoordinate, event);
    },
    drawGeomCanvasHighlight: function (tilePoint, event) {
        if (this.tiles[tilePoint[0] + ":" + tilePoint[1]]) {
            var pixels = null;
            if(!this.snapHandler.snaped){
                pixels = this.transform.lonlat2Pixel(event.latlng.lng, event.latlng.lat,this._map.getZoom());
            }else{
                pixels = this.transform.lonlat2Pixel(this.targetPoint.lng, this.targetPoint.lat,this._map.getZoom());
            }

            var x = pixels[0]-tilePoint[0]*256,y=pixels[1]-tilePoint[1]*256
            var data = this.tiles[tilePoint[0] + ":" + tilePoint[1]].data;
            var id = null;
            var transform = new fastmap.mapApi.MecatorTranform();
            for (var item in data) {
                if (this._TouchesPath(data[item].geometry.coordinates, x, y, 5)) {
                    var point= transform.PixelToLonlat(tilePoint[0] * 256 + x, tilePoint[1] * 256 + y, this._map.getZoom());
                    point= new fastmap.mapApi.Point(point[0], point[1]);
                    id = data[item].properties.id;
                    if (this.linksFlag) {
                        this.eventController.fire(this.eventController.eventTypes.GETLINKID, {id: id,point:point,optype:"LINK",event:event});
                        this.currentEditLayer.selectedid = id;
                        if (this.redrawTiles.length != 0) {
                            this._cleanHeight();
                        }
                        this._drawHeight(id);
                    } else {
                        this.eventController.fire(this.eventController.eventTypes.GETOUTLINKSPID, {id: id,event:event});
                    }
                    break;
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
    _TouchesPath: function (d, x, y, r) {
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
            this.currentEditLayer._drawFeature(data, ctx, true);
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

            var data = this.tiles[obj].data;

            for (var key in data) {
                if (data[key].properties.id == id) {
                    var ctx = {
                        canvas: this.tiles[obj].options.context,
                        tile: L.point(key.split(',')[0], key.split(',')[1]),
                        zoom: this._map.getZoom()
                    };
                    this.currentEditLayer._drawLineString(ctx, data[key].geometry.coordinates, true, {
                        strokeWidth: 3,
                        strokeColor: '#00F5FF'
                    }, {
                        color: '#00F5FF',
                        radius: 3
                    }, data[key].properties);
                }
            }
        }
    }
});

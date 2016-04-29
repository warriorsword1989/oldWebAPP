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
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.map;
        this.currentEditLayer = this.options.currentEditLayer;
        this.id = this.currentEditLayer.options.id;
        this.tiles = this.currentEditLayer.tiles;
        this.eventController = fastmap.uikit.EventController();
        this._map._container.style.cursor = 'pointer';
        this.transform = new fastmap.mapApi.MecatorTranform();
        this.redrawTiles = [];
        this.selectCtrl = fastmap.uikit.SelectController();
        this.snapHandler = new fastmap.uikit.Snap({
            map:this._map,
            shapeEditor:this.shapeEditor,
            snapLine:false,
            snapNode:true,
            snapVertex:true
        });
        this.snapHandler.enable();


    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        if(L.Browser.touch){
            this._map.on("click",this.onMouseDown,this);
            this.snapHandler.disable();
        }
        if (this.id !== "rdcross") {
            this._map.on('mousemove',this.onMouseMove,this);
        }
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);
        if(L.Browser.touch){
            this._map.off("click",this.onMouseDown,this);
        }
    },


    onMouseMove:function(event){
        this.snapHandler.setTargetIndex(0);
        if(this.snapHandler.snaped){
            this.eventController.fire( this.eventController.eventTypes.SNAPED,{'snaped':true});
            this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1],this.snapHandler.snapLatlng[0])
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback({point:{x:this.targetPoint.lng,y:this.targetPoint.lat}});
        }else{
            this.eventController.fire( this.eventController.eventTypes.SNAPED,{'snaped':false});
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
        }
    },

    onMouseDown: function (event) {
        var mouseLatlng = event.latlng;
        var tileCoordinate = this.transform.lonlat2Tile(mouseLatlng.lng, mouseLatlng.lat, this._map.getZoom());
        this.newredraw = $.extend({}, this.tiles);
        if(this.id === "adAdmin"){
            this.getadAdminId(tileCoordinate, event);
        } else {
            this.drawGeomCanvasHighlight(tileCoordinate, event);
        }
    },
    getadAdminId: function (tilePoint, event) {
        //var x = event.originalEvent.offsetX || event.layerX, y = event.originalEvent.offsetY || event.layerY;
        var pixels = this.transform.lonlat2Pixel(event.latlng.lng, event.latlng.lat,this._map.getZoom());
        var x = pixels[0]-tilePoint[0]*256,y=pixels[1]-tilePoint[1]*256
        if (this.tiles[tilePoint[0] + ":" + tilePoint[1]].data === undefined) {
            return;
        }
        var data = this.tiles[tilePoint[0] + ":" + tilePoint[1]].data;

        var id = null;
        for (var item in data) {
            var geom = data[item].geometry.coordinates;
            var newGeom = [];
            newGeom[0] = (parseInt(geom[0]));
            newGeom[1] = (parseInt(geom[1]));
            if (this._TouchesPoint(newGeom, x, y, 20)) {
                id = data[item].properties.id;
                this.eventController.fire(this.eventController.eventTypes.GETADADMINNODEID, {id: id, optype:"RDADMINNODE"})
                break;
            }
        }
    },
    drawGeomCanvasHighlight: function (tilePoint, event) {
        var pixels = this.transform.lonlat2Pixel(event.latlng.lng, event.latlng.lat,this._map.getZoom());
        var x = pixels[0]-tilePoint[0]*256,y=pixels[1]-tilePoint[1]*256
        var data = this.tiles[tilePoint[0] + ":" + tilePoint[1]].data;

        for (var item in data) {
            var touchIds = this._TouchesNodePoint(data[item].geometry.coordinates, x, y, 5)
            if (touchIds.length) {
                var id = data[item].properties.id;

                if (touchIds[0] == 0) {
                    this.eventController.fire(this.eventController.eventTypes.GETNODEID, {
                        id: data[item].properties.snode,
                        optype:"RDNODE"
                    })
                    this.selectCtrl.selectedFeatures =data[item].properties.snode;
                    break;
                } else {
                    this.eventController.fire(this.eventController.eventTypes.GETNODEID, {
                        id: data[item].properties.enode,
                        optype:"RDNODE"
                    })
                    this.selectCtrl.selectedFeatures =data[item].properties.enode;
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

    }
    ,

    /***
     *清除高亮
     */
    _cleanHeight: function () {

    }
    ,

    /***
     * 点击node点
     * @param d
     * @param x
     * @param y
     * @param r
     * @returns {number}
     * @private
     */
    _TouchesNodePoint: function (d, x, y, r) {
        var touched = false;
        for (var i = 0, len = d.length; i < len; i++) {
            if (i == 0 || i == len - 1) {
                var dx = x - d[i][0];
                var dy = y - d[i][1];
                if ((dx * dx + dy * dy) <= r * r) {
                    return [i];
                }
            }
        }
        return [];
    }
});
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
        this.snapHandler = new fastmap.uikit.Snap({map:this._map,shapeEditor:this.shapeEditor,snapLine:false,snapNode:true,snapVertex:true});
        this.snapHandler.enable();
        this.snapHandler.addGuideLayer(new fastmap.uikit.LayerController({}).getLayerById('referenceLine'));
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
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
    },


    onMouseMove:function(event){
        this.snapHandler.setTargetIndex(0);
        if(this.snapHandler.snaped == true){
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
        if (this.id === "rdcross") {
            this.getRdCrossId(tileCoordinate, event);
        } else {
            this.drawGeomCanvasHighlight(tileCoordinate, event);
        }
    },
    getRdCrossId: function (tilePoint, event) {
        var x = event.originalEvent.offsetX || event.layerX, y = event.originalEvent.offsetY || event.layerY;
        if (this.tiles[tilePoint[0] + ":" + tilePoint[1]].data === undefined) {
            return;
        }
        var data = this.tiles[tilePoint[0] + ":" + tilePoint[1]].data.features;

        var id = null;
        for (var item in data) {
            var geom = data[item].geometry.coordinates;
            var newGeom = [];
            for (var theory = 0, theoryLen = geom.length; theory < theoryLen; theory++) {
                newGeom[0] = (parseInt(geom[theory][0][0]));
                newGeom[1] = (parseInt(geom[theory][0][1]));
                if (this._TouchesPoint(newGeom, x, y, 20)) {
                    id = data[item].properties.id;
                    this.eventController.fire(this.eventController.eventTypes.GETCROSSNODEID, {id: id, tips: 0})
                    break;
                }
            }
        }

    },
    drawGeomCanvasHighlight: function (tilePoint, event) {
        var pixels = this.transform.lonlat2Pixel(event.latlng.lng, event.latlng.lat,this._map.getZoom());
        var x = pixels[0]-tilePoint[0]*256,y=pixels[1]-tilePoint[1]*256
        var data = this.tiles[tilePoint[0] + ":" + tilePoint[1]].data.features;

        for (var item in data) {
            var touchids = this._TouchesNodePoint(data[item].geometry.coordinates, x, y, 5)
            if (touchids.length) {
                var id = data[item].properties.id;

                if (touchids[0] == 0) {
                    this.eventController.fire(this.eventController.eventTypes.GETNODEID, {
                        id: data[item].properties.snode
                    })
                    this.selectCtrl.selectedFeatures =data[item].properties.snode;
                    break;
                } else {
                    this.eventController.fire(this.eventController.eventTypes.GETNODEID, {
                        id: data[item].properties.enode
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
        //this.currentEditLayer.fire("getNodeId")
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
            if (data.hasOwnProperty("features")) {
                for (var i = 0; i < data.features.length; i++) {
                    var feature = data.features[i];
                    if (feature.properties.restrictioninfo === undefined) {
                        return;
                    }
                    var newStyle = "", newGeom = [];
                    var restrictObj = feature.properties.restrictioninfo;
                    var geom = feature.geometry.coordinates;
                    if (restrictObj !== undefined) {

                            var restrictArr = restrictObj.split(",");
                            for (var fact = 0, factLen = restrictArr.length; fact < factLen; fact++) {


                                if (fact > 0) {
                                    newGeom[0] = (parseInt(geom[0]) + fact * 16);
                                    newGeom[1] = (parseInt(geom[1]));
                                    this.currentEditLayer._drawImg(ctx, newGeom, newStyle, true);
                                } else {
                                    this.currentEditLayer._drawImg(ctx, geom, newStyle, true);
                                }
                            }


                    }

                }
            }
        }
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
                var dx = x - d[i][0][0];
                var dy = y - d[i][0][1];
                if ((dx * dx + dy * dy) <= r * r) {
                    return [i];
                }
            }
        }

        return [];

    }
});
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
        //this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.map;
        //this.container = this._map._container;
        //this._mapDraggable = this._map.dragging.enabled();
        this.currentEditLayer = this.options.currentEditLayer;
        this.eventController = fastmap.uikit.EventController();
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
        if (!this._enabled) { return; }
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
        if(this.tiles[tilePoint[0] + ":" + tilePoint[1]]&&this.tiles[tilePoint[0] + ":" + tilePoint[1]].hasOwnProperty("data")) {
            var data = this.tiles[tilePoint[0] + ":" + tilePoint[1]].data.features;

            var id = null;
            for (var item in data) {
                if(data[item].geometry.coordinates.length <= 2){
                    if (this._TouchesPoint(data[item].geometry.coordinates, x, y, 27)) {
                        id = data[item].properties.id;
                        this.eventController.fire(this.eventController.eventTypes.GETTIPSID, {id: id, tips: 0})

                        if (this.redrawTiles.length != 0) {
                            this._cleanHeight();
                        }

                        this._drawHeight(id);
                        break;
                    }
                }else{
                    var temp = [];
                    for(var i=0;i<data[item].geometry.coordinates.length;i++){
                        var childArr = [];
                        childArr[0] = data[item].geometry.coordinates[i][0][0];
                        childArr[1] = data[item].geometry.coordinates[i][0][1];
                        temp.push(childArr);
                    }
                    for(var i=0;i<temp.length;i++){
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
        //this.currentEditLayer.fire("getNodeId")
    },

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
            if(data.hasOwnProperty("features")) {
                for (var i = 0; i < data.features.length; i++) {
                    var feature = data.features[i];

                    var color = null;
                    if (feature.hasOwnProperty('properties')) {
                        color = feature.properties.srctype;
                    }
                    var style = this.currentEditLayer.styleFor(feature, color);

                    var geom = feature.geometry.coordinates;

                    if(feature.properties.kind){  //种别

                        if(feature.properties.type == '1201'){
                            this.currentEditLayer._drawImg({
                                ctx:ctx,
                                geo:geom,
                                style:{src:'css/tips/kind/K'+feature.properties.kind+'.svg'},
                                boolPixelCrs:true,
                                fillStyle:{
                                    lineColor:'rgb(4, 187, 245)',
                                    fillColor:'rgba(4, 187, 245, 0.2)',
                                    lineWidth:1,
                                    width:30,
                                    height:15,
                                    dx:0,
                                    dy:7.5
                                }

                            });
                        }else if(feature.properties.type == '1203'){

                            this.currentEditLayer._drawImg({
                                ctx:ctx,
                                geo:geom,
                                style:{src:feature.properties.direc == 2?'css/tips/road/1.svg':'css/tips/road/2.svg'},
                                boolPixelCrs:true,
                                fillStyle:{
                                    lineColor:'rgb(4, 187, 245)',
                                    fillColor:'rgba(4, 187, 245, 0.2)',
                                    lineWidth:1,
                                    width:20,
                                    height:20,
                                    dx:5,
                                    dy:5

                                }
                            });
                        }
                    } else {

                        this.currentEditLayer._drawImg({
                            ctx:ctx,
                            geo:geom,
                            style:style,
                            boolPixelCrs:true

                        });
                    }
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

                var feature = data[key];
                var type = feature.geometry.type;
                var geom = feature.geometry.coordinates;
                if (data[key].properties.id == id) {

                    var ctx = {
                        canvas: this.tiles[obj].options.context,
                        tile: L.point(key.split(',')[0], key.split(',')[1]),
                        zoom: this._map.getZoom()
                    }
                    var style=null;
                    if(feature.properties.srctype=="1"){//未处理
                        style= {src:'./css/tips/selected/pending.png'};
                    }else{//已处理
                        style= {src:'./css/tips/selected/processed.png'};
                    }


                    if(feature.properties.kind){  //种别

                        if(feature.properties.type == '1201'){
                            this.currentEditLayer._drawImg({
                                ctx:ctx,
                                geo:geom,
                                style:{src:'css/tips/kind/K'+feature.properties.kind+'.svg'},
                                boolPixelCrs:true,
                                fillStyle:{
                                    lineColor:'rgb(4, 187, 245)',
                                    fillColor:'rgba(4, 187, 245, 0.2)',
                                    lineWidth:1,
                                    width:30,
                                    height:15,
                                    dx:0,
                                    dy:7.5
                                }

                            });
                        }else if(feature.properties.type == '1203'){

                            this.currentEditLayer._drawImg({
                                ctx:ctx,
                                geo:geom,
                                style:{src:feature.properties.direc == 2?'css/tips/road/1.svg':'css/tips/road/2.svg'},
                                boolPixelCrs:true,
                                fillStyle:{
                                    lineColor:'rgb(4, 187, 245)',
                                    fillColor:'rgba(4, 187, 245, 0.5)',
                                    lineWidth:1,
                                    width:20,
                                    height:20,
                                    dx:5,
                                    dy:5

                                }
                            });
                        }
                    } else {

                        this.currentEditLayer._drawImg({
                            ctx:ctx,
                            geo:geom,
                            style:style,
                            boolPixelCrs:true

                        });
                    }



                }

            }
        }


    }

});


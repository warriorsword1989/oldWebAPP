/**
 * Created by liwanchong on 2015/11/4.
 */
fastmap.uikit.SelectRestriction = L.Handler.extend({
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
        this.newredraw= $.extend({},this.tiles);
        this.drawGeomCanvasHighlight(tileCoordinate, event);
    },

    drawGeomCanvasHighlight: function (tilePoint, event) {

        var x = event.originalEvent.offsetX || event.layerX, y = event.originalEvent.offsetY || event.layerY;
        if(this.tiles[tilePoint[0] + ":" + tilePoint[1]].data===undefined) {
            return;
        }
        var data = this.tiles[tilePoint[0] + ":" + tilePoint[1]].data.features;

        var id = null;
        for (var item in data) {
            var restrictObj = data[item].properties.restrictioninfo;
            var geom=data[item].geometry.coordinates;
            var newGeom=[];
            if (restrictObj !== undefined) {
                if (restrictObj.constructor === Array) {
                    for (var theory = 0, theoryLen = restrictObj.length; theory < theoryLen; theory++) {
                        if (theory > 0) {
                            newGeom[0] = (parseInt(geom[0]) + theory * 16);
                            newGeom[1] = (parseInt(geom[1]));
                            if(this._TouchesPoint(newGeom, x, y, 20)){
                                id = data[item].properties.id;
                                this.currentEditLayer.fire("getNodeId", {id: id, tips: 0})

                                if (this.redrawTiles.length != 0) {
                                    this._cleanHeight();
                                }

                                this._drawHeight(id);
                                break;
                            }
                        }else{
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

                    }
                }else{
                    var restrictArr = restrictObj.split(",");
                    for (var fact = 0, factLen = restrictArr.length; fact < factLen; fact++) {
                        if (fact > 0) {
                            newGeom[0] = (parseInt(geom[0]) + fact * 16);
                            newGeom[1] = (parseInt(geom[1]));
                            if(this._TouchesPoint(newGeom, x, y, 20)){
                                id = data[item].properties.id;
                                this.currentEditLayer.fire("getNodeId", {id: id, tips: 0})

                                if (this.redrawTiles.length != 0) {
                                    this._cleanHeight();
                                }

                                this._drawHeight(id);
                                break;
                            }
                        }else{
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
            if (data.hasOwnProperty("features")) {
                for (var i = 0; i < data.features.length; i++) {
                    var feature = data.features[i];
                    if (feature.properties.restrictioninfo === undefined) {
                        return;
                    }
                    var newStyle="", newGeom=[];
                    var restrictObj = feature.properties.restrictioninfo;
                    var geom = feature.geometry.coordinates;
                    if (restrictObj !== undefined) {
                        if (restrictObj.constructor === Array) {
                            for (var theory = 0, theoryLen = restrictObj.length; theory < theoryLen; theory++) {
                                newStyle= {src: './css/limit/normal/' + restrictObj[theory] + restrictObj[theory] + '.png'};
                                if (theory > 0) {
                                    newGeom[0]=(parseInt(geom[0]) + theory*16);
                                    newGeom[1]=(parseInt(geom[1]));
                                    this.currentEditLayer._drawImg(ctx, newGeom, newStyle, true);
                                }else{
                                    this.currentEditLayer._drawImg(ctx, geom, newStyle, true);
                                }
                            }
                        } else {
                            var restrictArr = restrictObj.split(",");
                            for (var fact = 0, factLen = restrictArr.length; fact < factLen; fact++) {

                                if (restrictArr[fact].constructor === Array) {
                                    newStyle= {src: './css/limit/normal/' + restrictArr[fact][0] + restrictArr[fact][0] + '.png'};

                                } else {
                                    if(restrictArr[fact].indexOf("[")>-1){
                                        restrictArr[fact]=restrictArr[fact].replace("[","");
                                        restrictArr[fact]=restrictArr[fact].replace("]","");
                                        newStyle= {src: './css/limit/normal/' + restrictArr[fact] + restrictArr[fact] + '.png'};
                                    }else{
                                        newStyle= {src: './css/limit/normal/' + restrictArr[fact] + '.png'};
                                    }

                                }
                                if(fact>0){
                                    newGeom[0]=(parseInt(geom[0]) + fact*16);
                                    newGeom[1]=(parseInt(geom[1]));
                                    this.currentEditLayer._drawImg(ctx, newGeom, newStyle, true);
                                }else{
                                    this.currentEditLayer._drawImg(ctx, geom, newStyle, true);
                                }
                            }
                        }

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
        this.redrawTiles = this.tiles;
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
                    if (type == "Point") {
                        if (feature.properties.restrictioninfo === undefined) {
                            return;
                        }
                        var newStyle="", newGeom=[];
                        var restrictObj = feature.properties.restrictioninfo;
                        if (restrictObj !== undefined) {
                            if (restrictObj.constructor === Array) {
                                for (var theory = 0, theoryLen = restrictObj.length; theory < theoryLen; theory++) {
                                    newStyle= {src: './css/limit/selected/' + restrictObj[theory] + restrictObj[theory] + '.png'};
                                    if (theory > 0) {
                                        newGeom[0]=(parseInt(geom[0]) + theory*16);
                                        newGeom[1]=(parseInt(geom[1]));
                                        this.currentEditLayer._drawImg(ctx, newGeom, newStyle, true);
                                    }else{
                                        this.currentEditLayer._drawImg(ctx, geom, newStyle, true);
                                    }

                                }
                            } else {
                                var restrictArr = restrictObj.split(",");
                                for (var fact = 0, factLen = restrictArr.length; fact < factLen; fact++) {

                                    if (restrictArr[fact].constructor === Array) {
                                        newStyle= {src: './css/limit/selected/' + restrictArr[fact][0] + restrictArr[fact][0] + '.png'};
                                    } else {
                                        if(restrictArr[fact].indexOf("[")>-1){
                                            restrictArr[fact]=restrictArr[fact].replace("[","");
                                            restrictArr[fact]=restrictArr[fact].replace("]","");
                                            newStyle= {src: './css/limit/selected/' + restrictArr[fact] + restrictArr[fact] + '.png'};
                                        }else{
                                            newStyle= {src: './css/limit/selected/' + restrictArr[fact] + '.png'};
                                        }
                                    }
                                    if(fact>0){
                                        newGeom[0]=(parseInt(geom[0]) + fact*16);
                                        newGeom[1]=(parseInt(geom[1]));
                                        this.currentEditLayer._drawImg(ctx, newGeom, newStyle, true);
                                    }else{
                                        this.currentEditLayer._drawImg(ctx, geom, newStyle, true);
                                    }

                                }
                            }

                        }


                    }
                }
            }
        }


    }

});
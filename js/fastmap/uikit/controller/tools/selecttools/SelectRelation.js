/**
 * Created by zhongxiaoming on 2016/2/2.
 * Class SelectRelation
 */
fastmap.uikit.SelectRelation = L.Handler.extend({
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
        this.editLayerIds = ['speedlimit','rdcross','rdlaneconnexity','restriction','highSpeedDivergence']
        this.currentEditLayers = [];
        this.tiles = [];
        this._map._container.style.cursor = 'pointer';
        this.transform = new fastmap.mapApi.MecatorTranform();
        this.redrawTiles = [];
        this.layerController = new fastmap.uikit.LayerController();

        for(var item in this.editLayerIds){
            this.currentEditLayers.push(this.layerController.getLayerById(this.editLayerIds[item]))
        }
        this.popup = L.popup();

    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('click', this._click,this);
    },


    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('click', this._click,this);
    },

    _click:function(){
        if(this.overlays &&this.overlays.length == 1){
            this._map.openPopup(this.popup);
        }

    }
    ,
    onMouseDown: function (event) {
        this.tiles = [];
        var mouseLatlng = event.latlng;
        var tileCoordinate = this.transform.lonlat2Tile(mouseLatlng.lng, mouseLatlng.lat, this._map.getZoom());

        this.drawGeomCanvasHighlight(tileCoordinate, event);
    },

    drawGeomCanvasHighlight: function (tilePoint, event) {
        this.overlays=[];
        var  frs = null;
        for(var layer in this.currentEditLayers){

            this.tiles.push(this.currentEditLayers[layer].tiles[tilePoint[0] + ":" + tilePoint[1]]);

            if(this.currentEditLayers[layer].tiles[tilePoint[0] + ":" + tilePoint[1]]&&this.currentEditLayers[layer].tiles[tilePoint[0] + ":" + tilePoint[1]].data == undefined){
                return;
            }

            if(this.currentEditLayers[layer].tiles[tilePoint[0] + ":" + tilePoint[1]].data){
                var data = this.currentEditLayers[layer].tiles[tilePoint[0] + ":" + tilePoint[1]].data.features;
                var x = event.originalEvent.offsetX || event.layerX, y = event.originalEvent.offsetY || event.layerY;

                for (var item in data) {
                    if(this.currentEditLayers[layer].requestType =='RDCROSS'){

                        for (var key in data[item].geometry.coordinates) {
                            if (this._TouchesPoint(data[item].geometry.coordinates[key][0], x, y, 20)) {
                                this.overlays.push({layer:this.currentEditLayers[layer],data:data});
                            }
                        }
                    }else{
                        if (this._TouchesPoint(data[item].geometry.coordinates, x, y, 20)) {

                            this.overlays.push({layer:this.currentEditLayers[layer],data:data});
                        }
                    }

                }
            }

       }
        if(this.overlays.length == 1){
            switch (this.overlays[0].layer.requestType) {

                case'RDRESTRICTION':
                    frs= new fastmap.uikit.SelectRestriction({currentEditLayer:this.overlays[0].layer,map:this._map});
                    break;
                case "RDLANECONNEXITY":
                    frs = new fastmap.uikit.SelectRdlane({currentEditLayer:this.overlays[0].layer,map:this._map});
                    break;
                case "RDSPEEDLIMIT":
                    frs = new fastmap.uikit.SelectSpeedLimit({currentEditLayer:this.overlays[0].layer,map:this._map});
                    break;
                case "RDCROSS":
                    frs = new fastmap.uikit.SelectRdCross({currentEditLayer:this.overlays[0].layer,map:this._map});
                    break;
                case "RDBRANCH":
                    frs = new fastmap.uikit.SelectRdBranch({currentEditLayer:this.overlays[0].layer,map:this._map});
                    break;
            }
            frs.tiles = this.tiles;
            frs.drawGeomCanvasHighlight(event, this.overlays[0].data);
        }else if (this.overlays.length > 1){
            var html = '<ul style="list-style:none;padding: 0px" id="layerpopup">';



            this.overlays = this.unique(this.overlays);
            for(var item in this.overlays){
                html += '<li><a href="#" id="'+this.overlays[item].layer.options.requestType+'">'+this.overlays[item].layer.options.layername+'</a></li>';
            }
            html +='</ul>';

            this.popup
                .setLatLng(event.latlng)
                .setContent(html);
            var that = this;

            this._map.on('popupopen',function(){
                document.getElementById('layerpopup').onclick=function(e){
                    if(e.target.tagName == 'A'){

                        var layer = '';
                        var d = '';
                        for(var key in that.overlays){
                            if(e.target.id == that.overlays[key].layer.requestType){
                                layer = that.overlays[key].layer;
                                d = that.overlays[key].data;
                            }
                        }
                        switch (e.target.id) {

                            case'RDRESTRICTION':
                                frs = new fastmap.uikit.SelectRestriction({currentEditLayer:layer,map:that._map});
                                break;
                            case "RDLANECONNEXITY":
                                frs = new fastmap.uikit.SelectRdlane({currentEditLayer:layer,map:that._map});
                                break;
                            case "RDSPEEDLIMIT":
                                frs = new fastmap.uikit.SelectSpeedLimit({currentEditLayer:layer,map:that._map});
                                break;
                            case "RDCROSS":
                                frs = new fastmap.uikit.SelectRdCross({currentEditLayer:layer,map:that._map});
                                break;
                            case "RDBRANCH":
                                frs = new fastmap.uikit.SelectRdBranch({currentEditLayer:layer,map:that._map});
                                break;
                        }
                        frs.tiles = that.tiles;
                        frs.drawGeomCanvasHighlight(event, d);
                    }

                }
            });

        }
    },


     unique:function(arr) {
        var result = [], hash = {};
        for (var i = 0; i<arr.length; i++) {
            var elem = arr[i].layer.requestType;
            if (!hash[elem]) {
                result.push(arr[i]);
                hash[elem] = true;
            }
        }
        return result;

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
    //,
    //cleanHeight: function () {
    //    this._cleanHeight();
    //},
    //
    ///***_drawLineString: function (ctx, geom, style, boolPixelCrs) {
    // *清除高亮
    // */
    //_cleanHeight: function () {
    //
    //    for (var index in this.redrawTiles) {
    //        var data = this.redrawTiles[index].data;
    //        this.redrawTiles[index].options.context.getContext('2d').clearRect(0, 0, 256, 256);
    //        var ctx = {
    //            canvas: this.redrawTiles[index].options.context,
    //            tile: this.redrawTiles[index].options.context._tilePoint,
    //            zoom: this._map.getZoom()
    //        }
    //        if (data.hasOwnProperty("features")) {
    //            for (var i = 0; i < data.features.length; i++) {
    //                var feature = data.features[i];
    //                if (feature.properties.restrictioninfo === undefined) {
    //                    break;
    //                }
    //                var newStyle="", newGeom=[];
    //                var restrictObj = feature.properties.restrictioninfo;
    //                var geom = feature.geometry.coordinates;
    //                if (restrictObj !== undefined) {
    //                    if (restrictObj.constructor === Array) {
    //                        for (var theory = 0, theoryLen = restrictObj.length; theory < theoryLen; theory++) {
    //                            newStyle= {src: './css/limit/normal/' + restrictObj[theory] + restrictObj[theory] + '.png'};
    //                            if (theory > 0) {
    //                                newGeom[0]=(parseInt(geom[0]) + theory*16);
    //                                newGeom[1]=(parseInt(geom[1]));
    //                                this.currentEditLayer._drawImg(ctx, newGeom, newStyle, true);
    //                            }else{
    //                                this.currentEditLayer._drawImg(ctx, geom, newStyle, true);
    //                            }
    //                        }
    //                    } else {
    //                        var restrictArr = restrictObj.split(",");
    //                        for (var fact = 0, factLen = restrictArr.length; fact < factLen; fact++) {
    //
    //                            if (restrictArr[fact].constructor === Array) {
    //                                newStyle= {src: './css/limit/normal/' + restrictArr[fact][0] + restrictArr[fact][0] + '.png'};
    //
    //                            } else {
    //                                if(restrictArr[fact].indexOf("[")>-1){
    //                                    restrictArr[fact]=restrictArr[fact].replace("[","");
    //                                    restrictArr[fact]=restrictArr[fact].replace("]","");
    //                                    newStyle= {src: './css/limit/normal/' + restrictArr[fact] + restrictArr[fact] + '.png'};
    //                                }else{
    //                                    newStyle= {src: './css/limit/normal/' + restrictArr[fact] + '.png'};
    //                                }
    //
    //                            }
    //                            if(fact>0){
    //                                newGeom[0]=(parseInt(geom[0]) + fact*16);
    //                                newGeom[1]=(parseInt(geom[1]));
    //                                this.currentEditLayer._drawImg(ctx, newGeom, newStyle, true);
    //                            }else{
    //                                this.currentEditLayer._drawImg(ctx, geom, newStyle, true);
    //                            }
    //                        }
    //                    }
    //
    //                }
    //
    //            }
    //        }
    //    }
    //}
    //
    /***
     * 绘制高亮
     * @param id
     * @private
     */
    //_drawHeight: function (id) {
    //    this.redrawTiles = this.tiles;
    //    for (var obj in this.tiles) {
    //        var data = this.tiles[obj].data.features;
    //
    //        for (var key in data) {
    //
    //            var feature = data[key];
    //            var type = feature.geometry.type;
    //            var geom = feature.geometry.coordinates;
    //            if (data[key].properties.id == id) {
    //                var ctx = {
    //                    canvas: this.tiles[obj].options.context,
    //                    tile: L.point(key.split(',')[0], key.split(',')[1]),
    //                    zoom: this._map.getZoom()
    //                }
    //                if (type == "Point") {
    //                    if (feature.properties.restrictioninfo === undefined) {
    //                        break;
    //                    }
    //                    var newStyle="", newGeom=[];
    //                    var restrictObj = feature.properties.restrictioninfo;
    //                    if (restrictObj !== undefined) {
    //                        if (restrictObj.constructor === Array) {
    //                            for (var theory = 0, theoryLen = restrictObj.length; theory < theoryLen; theory++) {
    //                                newStyle= {src: './css/limit/selected/' + restrictObj[theory] + restrictObj[theory] + '.png'};
    //                                if (theory > 0) {
    //                                    newGeom[0]=(parseInt(geom[0]) + theory*16);
    //                                    newGeom[1]=(parseInt(geom[1]));
    //                                    this.currentEditLayer._drawImg(ctx, newGeom, newStyle, true);
    //                                }else{
    //                                    this.currentEditLayer._drawImg(ctx, geom, newStyle, true);
    //                                }
    //
    //                            }
    //                        } else {
    //                            var restrictArr = restrictObj.split(",");
    //                            for (var fact = 0, factLen = restrictArr.length; fact < factLen; fact++) {
    //
    //                                if (restrictArr[fact].constructor === Array) {
    //                                    newStyle= {src: './css/limit/selected/' + restrictArr[fact][0] + restrictArr[fact][0] + '.png'};
    //                                } else {
    //                                    if(restrictArr[fact].indexOf("[")>-1){
    //                                        restrictArr[fact]=restrictArr[fact].replace("[","");
    //                                        restrictArr[fact]=restrictArr[fact].replace("]","");
    //                                        newStyle= {src: './css/limit/selected/' + restrictArr[fact] + restrictArr[fact] + '.png'};
    //                                    }else{
    //                                        newStyle= {src: './css/limit/selected/' + restrictArr[fact] + '.png'};
    //                                    }
    //                                }
    //                                if(fact>0){
    //                                    newGeom[0]=(parseInt(geom[0]) + fact*16);
    //                                    newGeom[1]=(parseInt(geom[1]));
    //                                    this.currentEditLayer._drawImg(ctx, newGeom, newStyle, true);
    //                                }else{
    //                                    this.currentEditLayer._drawImg(ctx, geom, newStyle, true);
    //                                }
    //
    //                            }
    //                        }
    //
    //                    }
    //
    //
    //                }
    //            }
    //        }
    //    }
    //
    //
    //}
});
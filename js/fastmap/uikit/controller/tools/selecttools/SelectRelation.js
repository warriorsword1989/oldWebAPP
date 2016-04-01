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
        this.highlightLayer = this.layerController.getLayerById('highlightlayer');
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
        if(this.overlays &&this.overlays.length > 1){
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

    /***
     * 获取鼠标点击周边所有瓦片
     * @param layer
     * @param tilePoint
     * @returns {Array}
     */
    getRoundTile:function(layer, tilePoint){
        var tiles = [];
        for( var index in layer.tiles){
            if(Math.abs(layer.tiles[index].options.context.name.split('_')[0] - tilePoint[0])<=1&&Math.abs(layer.tiles[index].options.context.name.split('_')[1] - tilePoint[1])<=1){
                tiles.push(layer.tiles[index]);
            }
        }

        return tiles;
    },

    drawGeomCanvasHighlight: function (tilePoint, event) {
        this.overlays=[];
        var  frs = null;
        for(var layer in this.currentEditLayers){

            this.tiles = this.tiles.concat(this.getRoundTile(this.currentEditLayers[layer],tilePoint))

            if(this.currentEditLayers[layer].tiles[tilePoint[0] + ":" + tilePoint[1]]&&!this.currentEditLayers[layer].tiles[tilePoint[0] + ":" + tilePoint[1]].data){
                return;
            }

            //
            //this.tiles.push(   this.currentEditLayers[layer].tiles[tilePoint[0] + ":" + tilePoint[1]]);
            //
            //if(this.currentEditLayers[layer].tiles[tilePoint[0] + ":" + tilePoint[1]]&&!this.currentEditLayers[layer].tiles[tilePoint[0] + ":" + tilePoint[1]].data){
            //    return;
            //}

            if(this.currentEditLayers[layer].tiles[tilePoint[0] + ":" + tilePoint[1]]&&this.currentEditLayers[layer].tiles[tilePoint[0] + ":" + tilePoint[1]].data){
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
                    frs= new fastmap.uikit.SelectRestriction({highlightLayer:this.highlightLayer,map:this._map});
                    break;
                case "RDLANECONNEXITY":
                    frs = new fastmap.uikit.SelectRdlane({highlightLayer:this.highlightLayer,map:this._map});
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
            var html = '<ul id="layerpopup">';



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
                                frs = new fastmap.uikit.SelectRestriction({highlightLayer:that.highlightLayer,map:that._map});
                                break;
                            case "RDLANECONNEXITY":
                                frs = new fastmap.uikit.SelectRdlane({highlightLayer:that.highlightLayer,map:that._map});
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

});
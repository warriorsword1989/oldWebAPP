/**
 * Created by zhongxiaoming on 2015/9/16.
 * Class PathVertexMove
 */

fastmap.mapApi.adAdminMove = L.Handler.extend({

    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.shapeEditor.map;
        this.container = this._map._container;
        this._mapDraggable = this._map.dragging.enabled();
        this.targetPoint = null;
        this.targetIndex = null;
        this.interLinks = [];
        this.interNodes = [];
        this.transform = new fastmap.mapApi.MecatorTranform();
        this.selectCtrl = fastmap.uikit.SelectController();
        this.snapHandler = new fastmap.mapApi.Snap({map:this._map,shapeEditor:this.shapeEditor,selectedSnap:false,snapLine:true,snapNode:true,snapVertex:true});
        this.snapHandler.enable();
        this.validation =fastmap.uikit.geometryValidation({transform: new fastmap.mapApi.MecatorTranform()});
        this.eventController = fastmap.uikit.EventController();
        var layerCtrl = fastmap.uikit.LayerController();
        this.currentEditLayer = layerCtrl.getLayerById('referenceLine');
        this.tiles = this.currentEditLayer.tiles;
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('mousemove', this.onMouseMove, this);
        this._map.on('mouseup', this.onMouseUp, this);
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);
        this._map.off('mouseup', this.onMouseUp, this);
    },

    /***
     * 重写disable，加入地图拖动控制
     */
    disable: function () {
        if (!this._enabled) { return; }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },
    /***
     * 鼠标按下处理事件
     * @param event
     */
    onMouseDown: function (event) {
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        var layerPoint = event.layerPoint;

        var points = this.shapeEditor.shapeEditorResult.getFinalGeometry();

        //for (var j = 0, len = points.length; j < len; j++) {
            var disAB = this.distance(this._map.latLngToLayerPoint([points.y,points.x]), layerPoint);
            if (disAB < 20) {
                this.targetIndex = 0;
            }
        //}
        this.snapHandler.setTargetIndex(this.targetIndex);
    },

    onMouseMove: function (event) {
        this.container.style.cursor = 'pointer';
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        var layerPoint = event.layerPoint;
        this.targetPoint = this._map.layerPointToLatLng(layerPoint);
        if(this.targetIndex == null){
            return;
        }

        var that = this;

        if(this.snapHandler.snaped == true){
            this.eventController.fire(this.eventController.eventTypes.SNAPED,{'snaped':true});
            this.snapHandler.targetIndex = this.targetIndex;
            this.selectCtrl.setSnapObj(this.snapHandler);
            this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1],this.snapHandler.snapLatlng[0])

        }else{
            this.eventController.fire(this.eventController.eventTypes.SNAPED,{'snaped':false});

        }

        that.resetVertex(layerPoint);

        that.shapeEditor.shapeEditorResultFeedback.setupFeedback({index:that.targetIndex});
    },

    contains:function(obj,arr){
        for(var item in arr){
            if(arr[item].nodePid == obj.nodePid){
                arr.splice(item,1,obj);
                return true;
            }
        }

        return false;
    },
    onMouseUp: function(event){
        this.targetIndex = null;
        this.snapHandler.setTargetIndex(this.targetIndex);

        this.shapeEditor.shapeEditorResultFeedback.stopFeedback();
        var nodePid = null;

        var tileCoordinate = this.transform.lonlat2Tile(this.targetPoint.lng, this.targetPoint.lat, this._map.getZoom());
        this.drawGeomCanvasHighlight(tileCoordinate, event);
        if(this.snapHandler.snaped == true){
            if(this.snapHandler){
                if(this.snapHandler.targetIndex == 0){
                    nodePid = this.selectCtrl.selectedFeatures.snode;
                }else if(this.snapHandler.targetIndex == this.selectCtrl.selectedFeatures.geometry.components.length-1) {
                    nodePid = this.selectCtrl.selectedFeatures.enode;
                }else{
                    nodePid = null;
                }
            }

            if(this.snapHandler.selectedVertex == true){
                if(this.interNodes.length==0 ||!this.contains(nodePid,this.interNodes )){
                if(this.snapHandler.snapIndex == 0){

                    this.snapHandler.interNodes.push({pid:parseInt(this.snapHandler.properties.snode),nodePid:nodePid});
                }else{
                    this.snapHandler.interNodes.push({pid:parseInt(this.snapHandler.properties.enode),nodePid:nodePid});
                }
                }


            }else{
                if(this.interLinks.length ==0 || !this.contains({pid:parseInt(this.snapHandler.properties.id),nodePid:nodePid},this.interLinks )){
                    this.snapHandler.interLinks.push({pid:parseInt(this.snapHandler.properties.id),nodePid:nodePid});
                }


            }

            if(nodePid == null){
                this.snapHandler.interNodes = [];
                this.snapHandler.interLinks = [];
            }


        }
    },

    //两点之间的距离
     distance:function(pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    },

    /***
     * 重新设置节点
     */
    resetVertex:function(){
        this.shapeEditor.shapeEditorResult.setFinalGeometry(fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat));
        //var distance =0 , distance1 = this.targetIndex!=0?0:this.validation.caculationDistance(this.shapeEditor.shapeEditorResult.getFinalGeometry().components[this.targetIndex-1],this.shapeEditor.shapeEditorResult.getFinalGeometry().components[this.targetIndex]),
        //distance2 = this.targetIndex!=this.shapeEditor.shapeEditorResult.getFinalGeometry().components.length-1?this.validation.caculationDistance(this.shapeEditor.shapeEditorResult.getFinalGeometry().components[this.targetIndex+1],this.shapeEditor.shapeEditorResult.getFinalGeometry().components[this.targetIndex]):0;
        //distance = distance1<distance2?distance1:distance2
        //if(distance < 2){
        //    console.log('形状点之间距离不能小于2米！')
        //}


    },
    drawGeomCanvasHighlight: function (tilePoint, event) {
        if (this.tiles[tilePoint[0] + ":" + tilePoint[1]]) {
            var pixels = null;
            if(this.snapHandler.snaped == true){
                pixels = this.transform.lonlat2Pixel(this.targetPoint.lng, this.targetPoint.lat,this._map.getZoom());
            }else{
                pixels = this.transform.lonlat2Pixel(event.latlng.lng, event.latlng.lat,this._map.getZoom());
            }

            var x = pixels[0]-tilePoint[0]*256,y=pixels[1]-tilePoint[1]*256
            var data = this.tiles[tilePoint[0] + ":" + tilePoint[1]].data;
            var id = null;
            var transform = new fastmap.mapApi.MecatorTranform();

            var temp = 0;
            for (var i = 0; i < data.length; i++)
            {
                for (var j = 0; j < data.length - i; j++)
                {
                    if((j+1)<(data.length - i-1)){
                        if (this._TouchesPath(data[j].geometry.coordinates, x, y) > this._TouchesPath(data[j+1].geometry.coordinates, x, y))
                        {
                            temp = data[j+1];
                            data[j + 1] = data[j];
                            data[j] = temp;
                        }
                    }

                }
            }
            var point= transform.PixelToLonlat(tilePoint[0] * 256 + x, tilePoint[1] * 256 + y, this._map.getZoom());
            point= new fastmap.mapApi.Point(point[0], point[1]);
            //id = data[0].properties.id;
            this.selectCtrl.selectedFeatures.linkPid = data[0].properties.id;
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
    _TouchesPath: function (d, x, y) {
        var N = d.length;
        var p1x = d[0][0][0];
        var p1y = d[0][0][1];
        var arr=[];
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
            //if ((dx * dx + dy * dy) <= r * r) {
            //    return (dx * dx + dy * dy)
            //}
            p1x = p2x;
            p1y = p2y
            arr.push(dx * dx + dy * dy)
        }
        var temp = 0;
        for (var i = 0; i < arr.length; i++)
        {
            for (var j = 0; j < arr.length - i; j++)
            {
                if (arr[j] > arr[j + 1])
                {
                    temp = arr[j + 1];
                    arr[j + 1] = arr[j];
                    arr[j] = temp;
                }
            }
        }
        return arr[0];
    }
})
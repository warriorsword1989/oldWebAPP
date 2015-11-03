/**
 * Created by zhongxiaoming on 2015/9/16.
 * Class PathVertexAdd
 */

fastmap.uikit.PathVertexAdd = L.Handler.extend({
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
        this._map = this.options.shapeEditor.map;
        this.container = this._map._container;
        this._mapDraggable = this._map.dragging.enabled();
        this.targetPoint = null;
        this.targetIndex = null;
        var points = this.shapeEditor.shapeEditorResult.getFinalGeometry()[0].components;

        this.startPoint = points[0].clone();
        this.endPoint = points[points.length - 1].clone();
        this.insertPoint = null;
        this.capture=false;
        this.clickcount=1;
        this.start = false;
        this.end = false;
        this.targetGeoIndex=0;

    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('mousemove', this.onMouseMove, this);
        this._map.on('mouseup', this.onMouseUp, this);
        this._map.on('dblclick', this.onDbClick, this);
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);
        this._map.off('mouseup', this.onMouseUp, this);
        this._map.off('dblclick', this.onDbClick, this);
    },


    onMouseDown: function (event) {
        var geos=this.shapeEditor.shapeEditorResult.getFinalGeometry();
        var layerPoint = event.layerPoint;
        var lenstart=0;
        var lenend=0;
        if(this.clickcount==1){
            for(var i=0;i<geos.length;i++){

                if(i==0){//先初始化距离
                    lenstart=this.distance(this._map.latLngToLayerPoint([geos[i].components[0].y,geos[i].components[0].x]), layerPoint);
                    lenend=this.distance(this._map.latLngToLayerPoint([geos[i].components[geos[i].components.length-1].y,geos[i].components[geos[i].components.length-1].x]), layerPoint);
                    if(lenstart<lenend){
                        this.start=true;
                        this.end=false;
                        this.targetGeoIndex=i;
                        lenend=lenstart;
                    }else{
                        this.start=false;
                        this.end=true;
                        this.targetGeoIndex=i;
                        lenstart=lenend;
                    }
                }else{
                    var startnew=this.distance(this._map.latLngToLayerPoint([geos[i].components[0].y,geos[i].components[0].x]), layerPoint);
                    var endnew=this.distance(this._map.latLngToLayerPoint([geos[i].components[geos[i].components.length-1].y,geos[i].components[geos[i].components.length-1].x]), layerPoint);
                    if(startnew<endnew){
                        if(this.start){
                            if(lenstart>startnew){
                                this.start=true;
                                this.end=false;
                                this.targetGeoIndex=i;
                                lenstart=startnew;
                                lenend=startnew;
                            }
                        }
                        if(this.end){
                            if(lenend>startnew){
                                this.start=true;
                                this.end=false;
                                this.targetGeoIndex=i;
                                lenend=startnew;
                                lenstart=startnew;
                            }
                        }
                    }else{
                        if(this.start){
                            if(lenstart>endnew){
                                this.start=false;
                                this.end=true;
                                this.targetGeoIndex=i;
                                lenstart=endnew;
                                lenend=endnew;
                            }
                        }
                        if(this.end){
                            if(lenend>endnew){
                                this.start=false;
                                this.end=true;
                                this.targetGeoIndex=i;
                                lenend=endnew;
                                lenstart=endnew;
                            }
                        }
                    }
                }
                this.capture=true;
            }

            this.clickcount++;
        }else{
            var mousePoint = this._map.layerPointToLatLng(event.layerPoint);
            if(this.start == true){
                this.shapeEditor.shapeEditorResult.getFinalGeometry()[this.targetGeoIndex].components.splice(0, 0, fastmap.mapApi.point(mousePoint.lng, mousePoint.lat));
                this.startPoint =  fastmap.mapApi.point(mousePoint.lng, mousePoint.lat)
            }else{
                this.shapeEditor.shapeEditorResult.getFinalGeometry()[this.targetGeoIndex].components.splice(this.shapeEditor.shapeEditorResult.getFinalGeometry()[this.targetGeoIndex].components.length-1, 0, fastmap.mapApi.point(mousePoint.lng, mousePoint.lat));
                this.endPoint =  fastmap.mapApi.point(mousePoint.lng, mousePoint.lat)
            }
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
        }

    },

    onMouseMove: function (event) {
        this.container.style.cursor = 'crosshair';

        var layerPoint = event.layerPoint;
        this.targetPoint = this._map.layerPointToLatLng(layerPoint);

        this.insertPoint =  fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat);

        var points= this.shapeEditor.shapeEditorResult.getFinalGeometry()[this.targetGeoIndex].components;
        if(this.capture){
            if(this.start == true){
                this.shapeEditor.shapeEditorResult.getFinalGeometry()[this.targetGeoIndex].components.splice(0,1,this.insertPoint);
            }
            else{
                this.shapeEditor.shapeEditorResult.getFinalGeometry()[this.targetGeoIndex].components.splice(points.length-1,1,this.insertPoint);
            }

        }

        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();

    },
    disable: function () {
        if (!this._enabled) { return; }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },
    onDbClick: function (event) {
        if(this.start == true){
            this.shapeEditor.shapeEditorResult.getFinalGeometry()[this.targetGeoIndex].components.splice(0,1);
        }
        if(this.end == true){
            this.shapeEditor.shapeEditorResult.getFinalGeometry()[this.targetGeoIndex].components.splice(this.shapeEditor.shapeEditorResult.getFinalGeometry()[this.targetGeoIndex].components.length-1,1);
        }
        this.clickcount=1;
        this.capture=false;
        this.shapeEditor.stopEditing();
        fastmap.uikit.ShapeEditorController().stopEditing();
    },
    /***
     * 重新设置节点
     */
    resetVertex:function(){



            if(this.start == true){
                this.shapeEditor.shapeEditorResult.getFinalGeometry()[this.targetGeoIndex].components.splice(0,1);
                this.start == false;
                this.shapeEditor.shapeEditorResult.getFinalGeometry()[this.targetGeoIndex].components.splice(this.targetIndex, 0, fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat));
            }

            this.shapeEditor.shapeEditorResult.getFinalGeometry()[this.targetGeoIndex].components.splice(this.targetIndex, 1, fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat));

    },

    //两点之间的距离
    distance:function(pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    }

});

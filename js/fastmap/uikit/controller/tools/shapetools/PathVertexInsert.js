/**
 * Created by zhongxiaoming on 2015/9/18.
 * Class PathVertexInsert
 */

fastmap.uikit.PathVertexInsert = L.Handler.extend({
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
        this.shapEditor = this.options.shapEditor;
        this._map = this.options.shapEditor.map;
        this._mapDraggable = this._map.dragging.enabled();
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
    removeHooks: function(){
        this._map.off('mousedown', this.onMouseDown, this);
    },

    disable: function () {
        if (!this._enabled) { return; }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },

    onMouseDown: function(event){
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        var layerPoint = event.layerPoint;
        this.resetVertex(layerPoint);
        this.shapEditor.shapeEditorResultFeedback.setupFeedback()
    },

    onMouseMove: function(){},

    drawFeedBack: function(){},

    resetVertex:function(layerPoint){

        var index = 0
        var segments = this.shapEditor.shapeEditorResult.getFinalGeometry().getSortedSegments();
        for(var i = 0,len = segments.length; i< len; i++){
            var distance =  L.LineUtil.pointToSegmentDistance(layerPoint,this._map.latLngToLayerPoint(L.latLng(segments[i].y1,segments[i].x1)),this._map.latLngToLayerPoint(L.latLng(segments[i].y2,segments[i].x2)))
            if(distance < 5){
                latlng =map.layerPointToLatLng(L.LineUtil.closestPointOnSegment(layerPoint,this._map.latLngToLayerPoint(L.latLng(segments[i].y1,segments[i].x1)),this._map.latLngToLayerPoint(L.latLng(segments[i].y2,segments[i].x2))));
                index = i;
                this.shapEditor.shapeEditorResult.getFinalGeometry().points.splice(index*2,0,fastmap.mapApi.point(latlng.lng, latlng.lat))
                this.shapEditor.shapeEditorResult.setFinalGeometry(this.shapEditor.shapeEditorResult.getFinalGeometry());
            }
        }


    }

});

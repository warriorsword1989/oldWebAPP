/**
 * Created by zhoumingrui on 2015/11/3.
 * Class DrawPath
 */

fastmap.uikit.DrawPath = L.Handler.extend({
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

        this.insertPoint = null;
        this.clickcount=1;
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
        if(this.clickcount==1){
            var mousePoint = this._map.layerPointToLatLng(event.layerPoint);
            //var line =new fastmap.mapApi.lineString([fastmap.mapApi.point(mousePoint.lng, mousePoint.lat)]);
            //this.shapeEditor.shapeEditorResult.setFinalGeometry(line);
            this.clickcount++;
            this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(0, 1, fastmap.mapApi.point(mousePoint.lng, mousePoint.lat));
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
        }else{
            var mousePoint = this._map.layerPointToLatLng(event.layerPoint);
            this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.shapeEditor.shapeEditorResult.getFinalGeometry().components.length-1, 0, fastmap.mapApi.point(mousePoint.lng, mousePoint.lat));
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
        }

    },

    onMouseMove: function (event) {
        this.container.style.cursor = 'crosshair';
        var layerPoint = event.layerPoint;
        this.targetPoint = this._map.layerPointToLatLng(layerPoint);
        this.insertPoint =  fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat);
        if(this.clickcount>1){
            var points= this.shapeEditor.shapeEditorResult.getFinalGeometry().components;
            if(points.length==1){
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(points.length-1,0,this.insertPoint);
            }
            if(points.length>1){
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(points.length-1,1,this.insertPoint);
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
        this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.shapeEditor.shapeEditorResult.getFinalGeometry().components.length-2,2);
        this.clickcount=1;
        this.shapeEditor.stopEditing();
        fastmap.uikit.ShapeEditorController().stopEditing();
    },
    /***
     * 重新设置节点
     */
    resetVertex:function(){
        if(this.start == true){
            this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(0,1);
            this.start = false;
            this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.targetIndex, 0, fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat));
        }
        this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.targetIndex, 1, fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat));

    }

});

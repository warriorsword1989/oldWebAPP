/**
 * Created by liwanchong on 2015/12/22.
 */
fastmap.uikit.TransformDirection = L.Handler.extend({
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
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('mouseup', this.onMouseUp, this);
    },
    disable: function () {
        if (!this._enabled) { return; }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },
    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('mouseup', this.onMouseUp, this);
    },


    onMouseDown: function (event) {
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        var layerPoint = event.layerPoint;
        //.components
        var geos = this.shapeEditor.shapeEditorResult.getFinalGeometry();
        var point = this._map.latLngToLayerPoint([geos.point.y, geos.point.x]);
        var orientation = geos.orientation;
        var len = this.distance(layerPoint, point);
        if(len<1000) {
            switch (orientation) {
                case "0":
                    this.shapeEditor.shapeEditorResult.getFinalGeometry().orientation = "1";
                    break;
                case "1":
                    this.shapeEditor.shapeEditorResult.getFinalGeometry().orientation = "2";
                    break;
                case "2":
                    this.shapeEditor.shapeEditorResult.getFinalGeometry().orientation = "0";
                    break;


            }
        }
        //this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
    },
    onMouseUp: function(event){
        this.targetIndex = null;
        this.shapeEditor.shapeEditorResultFeedback.stopFeedback();
        fastmap.uikit.ShapeEditorController().stopEditing();
        console.log("cut");
    },

    drawFeedBack: function () {
    },
    //两点之间的距离
    distance:function(pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    }

})
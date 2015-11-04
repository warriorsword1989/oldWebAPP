/**
 * Created by zhongxiaoming on 2015/9/16.
 * Class PathVertexRemove
 */

fastmap.uikit.PathVertexRemove = L.Handler.extend({
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
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('mousemove', this.onMouseMove, this);
    },

    /***
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);
    },


    onMouseDown: function (event) {
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        var layerPoint = event.layerPoint;

        var points = this.shapeEditor.shapeEditorResult.getFinalGeometry().components;

        for (var j = 0, len = points.length; j < len; j++) {

            //两个端点不能删除
            if(j != 0 && j !=len-1){
                var disAB = this.distance(this._map.latLngToLayerPoint([points[j].y,points[j].x]), layerPoint);

                if (disAB > 0 && disAB < 5) {


                    this.targetIndex = j;
                }
            }

        }
        if(this.targetIndex == null)
            return;
        this.resetVertex(this.targetIndex);
        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
    },

    onMouseMove: function () {
        this.container.style.cursor = 'pointer';
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
        this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.targetIndex, 1);
        this.targetIndex = null;
    }
})
/**
 * Created by zhongxiaoming on 2015/9/17.
 * Class PointVertexAdd
 */
fastmap.uikit.PointVertexAdd = L.Handler.extend({
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
    },

    /***
     * 添加事件处理
     */
    addHooks: function () {
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
    },


    onMouseDown: function () {
    },

    onMouseMove: function () {
    },

    drawFeedBack: function () {
    }

})
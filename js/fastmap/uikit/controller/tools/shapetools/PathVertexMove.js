/**
 * Created by zhongxiaoming on 2015/9/16.
 * Class PathVertexMove
 */

fastmap.uiKit.PathVertexMove = L.Handler.extend({
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
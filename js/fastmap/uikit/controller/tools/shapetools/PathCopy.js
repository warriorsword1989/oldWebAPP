/**
 * Created by zhongxiaoming on 2015/9/16.
 * Class PathCopy
 */

fastmap.uikit.PathCopy = L.Handler.extend({
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
        //获取元素
        //
    },

    onMouseMove: function () {
    },

    drawFeedBack: function () {
    }

})
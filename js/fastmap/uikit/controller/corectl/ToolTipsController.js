/**
 * Created by zhongxiaoming on 2015/9/9.
 * Class ToolTipsController
 */
define(['js/fastmap/fastmap'], function (fastmap) {
    fastmap.uiKit.ToolTipsController =  L.Class.extend({
        /**
         * 事件管理器
         * @property includes
         */
        includes: L.Mixin.Events,
        options: {
        },

        /***
         *
         * @param {Object}options
         */
        initialize: function (options) {
            this.options = options || {};
            L.setOptions(this, options);
        },

        /***
         * 设置tooltip
         * @param {Object}tooltip
         */
        setCurrentTooltip:function(tooltip){

        }

    });
});
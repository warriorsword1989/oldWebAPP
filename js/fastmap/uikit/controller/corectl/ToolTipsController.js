/**
 * Created by zhongxiaoming on 2015/9/9.
 * Class ToolTipsController
 */
define(['js/fastmap/fastmap'], function (fastmap) {
    fastmap.uiKit.ToolTipsController =  L.Class.extend({
        options: {
        },

        /***
         *
         * @param options
         */
        initialize: function (options) {
            this.options = options || {};
            L.setOptions(this, options);
        },

        /***
         * 设置tooltip
         * @param tooltip
         */
        setCurrentTooltip:function(tooltip){

        }

    });
});
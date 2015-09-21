/**
 * Created by zhongxiaoming on 2015/9/9.
 * Class ToolTipsController
 */
fastmap.uiKit.ToolTipsController = L.Class.extend({
    /**
     * 事件管理器
     * @property includes
     */
    includes: L.Mixin.Events,
    options: {},

    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.on("toolStateChanged", this.setCurrentTooltip, this);
    },

    /***
     * 设置tooltip
     * @param {Object}tooltip
     */
    setCurrentTooltip: function (tooltip) {

    }

});
fastmap.uiKit.toolTipsController= function (options) {
    return new fastmap.uiKit.ToolTipsController(options);
};


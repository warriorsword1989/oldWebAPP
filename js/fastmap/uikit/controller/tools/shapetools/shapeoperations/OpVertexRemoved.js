/**
 * Created by zhongxiaoming on 2015/9/23.
 * Class OpVertexRemoved
 */
fastmap.uikit.OpVertexRemoved = L.Class.extend({
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
    }
});
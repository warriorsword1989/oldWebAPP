/**
 * Created by zhongxiaoming on 2015/9/17.
 * Class ShapeEditorResultFeedback
 */

fastmap.uikit.ShapeEditResultFeedback = L.Class.extend({
    /**
     * 事件管理器
     * @property includes
     */
    includes: L.Mixin.Events,

    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.tooltip = {};
        this.map = {};
    },

    /***
     *
     * @param {Object}result
     * @constructor
     */
    setupFeedback: function (result) {
        this.fire('startshapeeditresultfeedback');
    },

    showTooltip: function () {

    },
    stopFeedback: function () {
        this.fire('stopshapeeditresultfeedback');
    }
})

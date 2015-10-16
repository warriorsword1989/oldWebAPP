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
        this.shapeEditor = this.options.shapeEditor;
        this.tooltip = {};
        this.map = {};
    },

    /***
     *开始编辑
     * @param {Object}result
     * @constructor
     */
    setupFeedback: function () {
        this.shapeEditor.fire('startshapeeditresultfeedback');
    },

    /***
     * 放弃编辑
     */
    abortFeedback: function(){
        this.shapeEditor.fire('abortshapeeditresultfeedback');
    },

    showTooltip: function () {

    },

    /***
     * 停止编辑
     */
    stopFeedback: function () {
        this.shapeEditor.fire('stopshapeeditresultfeedback');
    }
})

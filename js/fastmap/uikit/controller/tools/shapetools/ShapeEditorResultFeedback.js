/**
 * Created by zhongxiaoming on 2015/9/17.
 * Class ShapeEditorResultFeedback
 */

fastmap.uiKit.ShapeEditResultFeedback = L.Class.extend({
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
    SetupFeedback: function (result) {

    },

    ShowTooltip: function () {

    },
    StopFeedback: function () {
    }
})

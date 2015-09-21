/**
 * Created by zhongxiaoming on 2015/9/18.
 * Class ShapeEditorResult
 */

fastmap.uiKit.ShapeEditorResult = L.Class.extend({
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.OriginalObject = null
    },

    setOriginalObject: function (value) {
        this.OriginalObject = value;
    },

    getOriginalObject: function () {
        return this.OriginalObject;
    },

    setOriginalGeometry: function (value) {
        this.original = value;
    },

    getOriginalGeometry: function () {
        return this.original;
    },

    setFinalGeometry: function (value) {
        this.final = value;
    },

    getFinalGeometry: function () {
        return this.final;
    }

})

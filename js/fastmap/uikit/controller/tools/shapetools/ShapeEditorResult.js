/**
 * Created by zhongxiaoming on 2015/9/18.
 * Class ShapeEditorResult
 */

fastmap.uikit.ShapeEditorResult = L.Class.extend({
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.originalObject = null
    },

    setOriginalObject: function (value) {
        this.originalObject = value;
    },

    getOriginalObject: function () {
        return this.originalObject;
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

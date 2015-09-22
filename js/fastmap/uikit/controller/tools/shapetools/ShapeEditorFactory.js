/**
 * Created by zhongxiaoming on 2015/9/17.
 * Class ShapeEditorFactory
 */

fastmap.uikit.ShapeEditorFactory = L.Class.extend({
    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
    },

    CreateShapeToolsObject: function () {
        var toolsObject = {
            'pathcopy': new fastmap.uiKit.PathCopy(),
            'pathcut': new fastmap.uiKit.PathCut()
        };

    }


});

fastmap.uikit.shapeeditorfactory = function (options) {
    return new fastmap.uikit.PathCut(options);
}

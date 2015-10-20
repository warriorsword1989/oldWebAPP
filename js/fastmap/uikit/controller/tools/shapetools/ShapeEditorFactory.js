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

    CreateShapeToolsObject: function (shapEditor) {
        var toolsObject = {
            'pathcopy': new fastmap.uikit.PathCopy(),
            'pathcut': new fastmap.uikit.PathCut(),
            'pathVertextInsert': new fastmap.uikit.PathVertexInsert({shapEditor:shapEditor})
        };
        return toolsObject;
    }


});

fastmap.uikit.shapeeditorfactory = function (options) {
    return new fastmap.uikit.ShapeEditorFactory(options);
}

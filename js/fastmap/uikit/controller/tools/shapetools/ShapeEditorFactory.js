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

    CreateShapeToolsObject: function (shapeEditor) {
        var toolsObject = {
            'pathcopy': new fastmap.uikit.PathCopy({shapeEditor:shapeEditor}),
            'pathcut': new fastmap.uikit.PathCut({shapeEditor:shapeEditor}),
            'pathVertexInsert': new fastmap.uikit.PathVertexInsert({shapeEditor:shapeEditor}),
            'pathVertexMove': new fastmap.uikit.PathVertexMove({shapeEditor:shapeEditor}),
            'pathVertexReMove': new fastmap.uikit.PathVertexRemove({shapeEditor:shapeEditor}),
            'pathVertexAdd': new fastmap.uikit.PathVertexAdd({shapeEditor:shapeEditor}),
            'pathBreak': new fastmap.uikit.PathBreak({shapeEditor:shapeEditor})
        };
        return toolsObject;
    }


});

fastmap.uikit.shapeeditorfactory = function (options) {
    return new fastmap.uikit.ShapeEditorFactory(options);
}

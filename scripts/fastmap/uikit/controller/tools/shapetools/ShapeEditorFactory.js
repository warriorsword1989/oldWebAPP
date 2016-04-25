/**
 * Created by zhongxiaoming on 2015/9/17.
 * Class ShapeEditorFactory
 */

fastmap.uikit.ShapeEditorFactory =  L.Class.extend({

            /***
             *
             * @param {Object}options
             */
            initialize: function (options) {
                this.options = options || {};
                L.setOptions(this, options);
                this.toolObjs = this.CreateShapeToolsObject(this.options.shapeEditor);
            },

            CreateShapeToolsObject: function (shapeEditor) {
                var toolsObject = {
                    'drawPath': new fastmap.uikit.DrawPath({shapeEditor:shapeEditor}),
                    'drawAdLink': new fastmap.uikit.DrawPath({shapeEditor:shapeEditor}),
                    'drawPolygon': new fastmap.uikit.DrawPolygon({shapeEditor:shapeEditor}),
                    'pathcopy': new fastmap.uikit.PathCopy({shapeEditor:shapeEditor}),
                    'pathcut': new fastmap.uikit.PathCut({shapeEditor:shapeEditor}),
                    'pathVertexInsert': new fastmap.uikit.PathVertexInsert({shapeEditor:shapeEditor}),
                    'pathVertexMove': new fastmap.uikit.PathVertexMove({shapeEditor:shapeEditor}),
                    'pathVertexReMove': new fastmap.uikit.PathVertexRemove({shapeEditor:shapeEditor}),
                    'pathVertexAdd': new fastmap.uikit.PathVertexAdd({shapeEditor:shapeEditor}),
                    'pathBreak': new fastmap.uikit.PathBreak({shapeEditor:shapeEditor}),
                    'transformDirect':new fastmap.uikit.TransformDirection({shapeEditor:shapeEditor}),
                    'pathNodeMove':new fastmap.uikit.PathNodeMove({shapeEditor:shapeEditor}),
                    'pointVertexAdd':new fastmap.uikit.PointVertexAdd({shapeEditor:shapeEditor}),
                    'addAdAdmin':new fastmap.uikit.adAdminAdd({shapeEditor:shapeEditor})
                };
                return toolsObject;
            }
        });

fastmap.uikit.shapeeditorfactory = function (options) {
    return new fastmap.uikit.ShapeEditorFactory(options);
}

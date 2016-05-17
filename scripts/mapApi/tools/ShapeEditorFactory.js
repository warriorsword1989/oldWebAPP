/**
 * Created by zhongxiaoming on 2015/9/17.
 * Class ShapeEditorFactory
 */

fastmap.mapApi.ShapeEditorFactory = (function() {
    var instantiated;

    function init(options) {


        var createShapeTools = L.Class.extend({
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

                    'drawPath': new fastmap.mapApi.DrawPath({shapeEditor:shapeEditor}),
                    'drawAdLink': new fastmap.mapApi.DrawPath({shapeEditor:shapeEditor}),
                    'drawPolygon': new fastmap.mapApi.DrawPolygon({shapeEditor:shapeEditor}),
                    'pathCopy': new fastmap.mapApi.PathCopy({shapeEditor:shapeEditor}),
                    'pathCut': new fastmap.mapApi.PathCut({shapeEditor:shapeEditor}),
                    'pathVertexInsert': new fastmap.mapApi.PathVertexInsert({shapeEditor:shapeEditor}),
                    'pathVertexMove': new fastmap.mapApi.PathVertexMove({shapeEditor:shapeEditor}),
                    'pathVertexReMove': new fastmap.mapApi.PathVertexRemove({shapeEditor:shapeEditor}),
                    'pathVertexAdd': new fastmap.mapApi.PathVertexAdd({shapeEditor:shapeEditor}),
                    'pathBreak': new fastmap.mapApi.PathBreak({shapeEditor:shapeEditor}),
                    'transformDirect':new fastmap.mapApi.TransformDirection({shapeEditor:shapeEditor}),
                    'pathNodeMove':new fastmap.mapApi.PathNodeMove({shapeEditor:shapeEditor}),
                    'pointVertexAdd':new fastmap.mapApi.PointVertexAdd({shapeEditor:shapeEditor}),
                    'addAdAdmin':new fastmap.mapApi.adAdminAdd({shapeEditor:shapeEditor}),
                    'adAdminMove':new fastmap.mapApi.adAdminMove({shapeEditor:shapeEditor}),
                    'pathBuffer':new fastmap.mapApi.pathBuffer({shapeEditor:shapeEditor})
                };
                return toolsObject;
            }
        })


        return new createShapeTools(options);
    }

    return function(options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }

})()
/**
 * Created by liwanchong on 2016/4/28.
 */
(function() {
    var jsFiles = [
        "geometry/Geometry.js",
        "geometry/Collection.js",
        "geometry/Point.js",
        "geometry/LineString.js",
        "geometry/Polygon.js",
        "geometry/LinearRing.js",
        "geometry/MultiPolygon.js",
        "geometry/MultiPolyline.js",
        // mapapi
        "Bounds.js",
        "Map.js",
        "MecatorTransform.js",
        "Tile.js",
        "ShapeOptionTypeEnum.js",
        // layer
                "layer/Layer.js",
        "layer/WholeLayer.js",
        "layer/MeshLayer.js",
        "LayerRender.js",
        "layer/TileJSONLayer.js",
        "layer/EditLayer-new.js",
        "layer/GuideLineLayer.js",
        "layer/GridLayer.js",
        "ajaxConstruct.js",
        "L.FloatMenu.js",
        // tools
        "tools/adAdminAdd.js",
        "tools/adAdminMove.js",
        "tools/poiLocMove.js",
        "tools/poiGuideMove.js",
        "tools/CrossingAdd.js",
        "tools/DrawPath.js",
        "tools/DrawPolygon.js",
        "tools/GeometryValidation.js",
        //"tools/HighLightRender.js",
        "tools/PathBreak.js",
        "tools/PathCopy.js",
        "tools/PathCut.js",
        "tools/PathMove.js",
        "tools/PathNodeMove.js",
        "tools/PathSmooth.js",
        "tools/PathVertexAdd.js",
        "tools/PathVertexInsert.js",
        "tools/PathVertexMove.js",
        "tools/PathVertexRemove.js",
        "tools/PointVertexAdd.js",
        "tools/PointVertexMove.js",
        "tools/ShapeEditorFactory.js",
        "tools/ShapeEditorResult.js",
        "tools/ShapeEditorResultFeedback.js",
        "tools/PathBuffer.js",
        "tools/Snap.js",
        "tools/TransformDirection.js",
        "symbol/Point.js",
        // symbol
        "symbol/Matrix.js",
        "symbol/Vector.js",
        "symbol/Point.js",
        "symbol/LineSegment.js",
        "symbol/LineString.js",
        "symbol/Template.js",
        "symbol/CirclePointSymbol.js",
        "symbol/SolidCirclePointSymbol.js",
        "symbol/SquarePointSymbol.js",
        "symbol/SolidSquarePointSymbol.js",
        "symbol/CrossPointSymbol.js",
        "symbol/TiltedCrossPointSymbol.js",
        "symbol/PicturePointSymbol.js",
        "symbol/CompositePointSymbol.js",
        "symbol/SampleLineSymbol.js",
        "symbol/CartoLineSymbol.js",
        "symbol/MarkerLineSymbol.js",
        "symbol/HashLineSymbol.js",
        "symbol/CompositeLineSymbol.js",
        "symbol/SymbolsFile.js",
        "symbol/SymbolFactory.js"
    ]; // etc.
    // use "parser-inserted scripts" for guaranteed execution order
    // http://hsivonen.iki.fi/script-execution/
    var scriptTags = new Array(jsFiles.length);
    var host = App.Util.getAppPath() + "/scripts/mapApi/";
    for (var i = 0, len = jsFiles.length; i < len; i++) {
        scriptTags[i] = "<script src='" + host + jsFiles[i] + "'></script>";
    }
    if (scriptTags.length > 0) {
        document.write(scriptTags.join(""));
    }
})();
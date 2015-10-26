/**
 * Created by zhongxiaoming on 2015/9/21.
 * Class fastmapapi
 */


(function() {

    var singleFile = (typeof FastMap == "object" && FastMap.singleFile);

    /**
     * Relative path of this script.
     */
    var scriptName = (!singleFile) ? "fastmap/lib/fastmapapi.js" : "fastmapapi.js";


    var jsFiles = window.FastMap;


    window.FastMap = {

        _getScriptLocation: (function() {
            var r = new RegExp("(^|(.*?\\/))(" + scriptName + ")(\\?|$)"),
                s = document.getElementsByTagName('script'),
                src, m, l = "";
            for(var i=0, len=s.length; i<len; i++) {
                src = s[i].getAttribute('src');
                if(src) {
                    m = src.match(r);
                    if(m) {
                        l = m[1];
                        break;
                    }
                }
            }
            return (function() { return l; });
        })(),

        ImgPath : ''
    };


    if(!singleFile) {
        if (!jsFiles) {
            jsFiles = [
                "fastmap/fastmap.js",
                //dataApi/datamodel
                "fastmap/dataApi/datamodel/GeoDataModel.js",
                "fastmap/dataApi/datamodel/Rdlink.js",
                "fastmap/dataApi/datamodel/Rdnode.js",
                "fastmap/dataApi/ajaxConstruct.js",
                //mapApi/geometry
                "fastmap/mapApi/geometry/Geometry.js",
                "fastmap/mapApi/geometry/Collection.js",
                "fastmap/mapApi/geometry/Point.js",
                "fastmap/mapApi/geometry/LineString.js",
                "fastmap/mapApi/geometry/Polygon.js",
                "fastmap/mapApi/geometry/LinearRing.js",
                "fastmap/mapApi/geometry/MultiPolygon.js",
                "fastmap/mapApi/geometry/MultiPolyline.js",
                //mapApi/
                "fastmap/mapApi/Bounds.js",
                "fastmap/mapApi/Map.js",
                "fastmap/mapApi/MecatorTransform.js",
                "fastmap/mapApi/Tile.js",
                //mapApi/layer
                "fastmap/mapApi/layer/Layer.js",
                "fastmap/mapApi/layer/WholeLayer.js",
                "fastmap/mapApi/layer/MeshLayer.js",
                "fastmap/mapApi/layer/TileJSONLayer.js",
                "fastmap/mapApi/layer/EditLayer.js",
                //uikit/controller/corectl
                "fastmap/uikit/controller/corectl/CheckResultController.js",
                "fastmap/uikit/controller/corectl/DataTipsController.js",
                "fastmap/uikit/controller/corectl/FeatCodeController.js",
                "fastmap/uikit/controller/corectl/LayerController.js",
                "fastmap/uikit/controller/corectl/ObjectEditController.js",
                "fastmap/uikit/controller/corectl/OutPutController.js",
                "fastmap/uikit/controller/corectl/SelectController.js",
                "fastmap/uikit/controller/corectl/ShapeEditorController.js",
                "fastmap/uikit/controller/corectl/ToolTipsController.js",
                //uikit/controller/tools/shapetools
                "fastmap/uikit/controller/tools/shapetools/PathCopy.js",
                "fastmap/uikit/controller/tools/shapetools/PathCut.js",
                "fastmap/uikit/controller/tools/shapetools/PathMove.js",
                "fastmap/uikit/controller/tools/shapetools/PathSmooth.js",
                "fastmap/uikit/controller/tools/shapetools/PathVertexAdd.js",
                "fastmap/uikit/controller/tools/shapetools/PathVertexInsert.js",
                "fastmap/uikit/controller/tools/shapetools/PathVertexMove.js",
                "fastmap/uikit/controller/tools/shapetools/PathVertexRemove.js",
                "fastmap/uikit/controller/tools/shapetools/PointVertexAdd.js",
                "fastmap/uikit/controller/tools/shapetools/PointVertexMove.js",
                "fastmap/uikit/controller/tools/shapetools/ShapeEditorFactory.js",
                "fastmap/uikit/controller/tools/shapetools/ShapeEditorResult.js",
                "fastmap/uikit/controller/tools/shapetools/ShapeEditorResultFeedback.js",
                //uikit/controller/ctlmodel
                "fastmap/uikit/ctlmodel/CheckResult.js",
                "fastmap/uikit/ctlmodel/ContentStyle.js",
                "fastmap/uikit/ctlmodel/DataTip.js",
                "fastmap/uikit/ctlmodel/FeatCode.js",
                "fastmap/uikit/ctlmodel/OutPut.js",
                "fastmap/uikit/ctlmodel/ToolTip.js"
            ]; // etc.
        }

        // use "parser-inserted scripts" for guaranteed execution order
        // http://hsivonen.iki.fi/script-execution/
        var scriptTags = new Array(jsFiles.length);
        var host = FastMap._getScriptLocation() + "js/";
        for (var i=0, len=jsFiles.length; i<len; i++) {
            scriptTags[i] = "<script src='" + host + jsFiles[i] +
            "'></script>";
        }
        if (scriptTags.length > 0) {
            document.write(scriptTags.join(""));

        }
    }
})();

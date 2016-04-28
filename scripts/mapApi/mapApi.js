/**
 * Created by liwanchong on 2016/4/28.
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

     jsFiles = [
         "mapApi/fastmap.js",
        "mapApi/geometry/Geometry.js",
        "mapApi/geometry/Collection.js",
        "mapApi/geometry/Point.js",
        "mapApi/geometry/LineString.js",
        "mapApi/geometry/Polygon.js",
        "mapApi/geometry/LinearRing.js",
        "mapApi/geometry/MultiPolygon.js",
        "mapApi/geometry/MultiPolyline.js",
        //mapApi/
        "mapApi/Bounds.js",
        "mapApi/Map.js",
        "mapApi/MecatorTransform.js",
        "mapApi/Tile.js",
        "mapApi/ShapeOptionTypeEnum.js",
        //mapApi/layer
        "mapApi/layer/Layer.js",
        "mapApi/layer/WholeLayer.js",
        "mapApi/layer/MeshLayer.js",
        "mapApi/layer/LayerRender.js",
        "mapApi/layer/TileJSONLayer.js",
        "mapApi/layer/EditLayer.js",
        "mapApi/layer/GridLayer.js",
        "mapApi/ajaxConstruct.js"
    ]; // etc.


    // use "parser-inserted scripts" for guaranteed execution order
    // http://hsivonen.iki.fi/script-execution/
    var scriptTags = new Array(jsFiles.length);
    var host = "../../scripts/";
    for (var i=0, len=jsFiles.length; i<len; i++) {
        scriptTags[i] = "<script src='" + host + jsFiles[i] +
            "'></script>";
    }
    if (scriptTags.length > 0) {
        document.write(scriptTags.join(""));

    }

})();
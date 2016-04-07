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
                "fastmap/dataApi/datamodel/Rdbranch.js",
                "fastmap/dataApi/datamodel/Rdbranchdetail.js",
                "fastmap/dataApi/datamodel/Rdbranchname.js",
                "fastmap/dataApi/datamodel/Rdbranchrealimage.js",
                "fastmap/dataApi/datamodel/Rdbranchschematic.js",
                "fastmap/dataApi/datamodel/Rdbranchseriesbranch.js",
                "fastmap/dataApi/datamodel/Rdbranchsignasreal.js",
                "fastmap/dataApi/datamodel/Rdbranchsignboard.js",
                "fastmap/dataApi/datamodel/Rdbranchsignboardname.js",
                "fastmap/dataApi/datamodel/Rdbranchvia.js",
                "fastmap/dataApi/datamodel/Rdlink.js",
                "fastmap/dataApi/datamodel/RdlinkForm.js",
                "fastmap/dataApi/datamodel/RdlinkLimit.js",
                "fastmap/dataApi/datamodel/RdlinkName.js",
                "fastmap/dataApi/datamodel/RdlinkRtic.js",
                "fastmap/dataApi/datamodel/RdlinkIntRtics.js",
                "fastmap/dataApi/datamodel/RdlinkSideWalk.js",
                "fastmap/dataApi/datamodel/RdlinkSpeedLimit.js",
                "fastmap/dataApi/datamodel/RdlinkTruckLimit.js",
                "fastmap/dataApi/datamodel/RdlinkWalkStair.js",
                "fastmap/dataApi/datamodel/RdlinkZone.js",
                "fastmap/dataApi/datamodel/Rdnode.js",
                "fastmap/dataApi/datamodel/Rdnodeform.js",
                "fastmap/dataApi/datamodel/RdRestriction.js",
                "fastmap/dataApi/datamodel/RdrestrictionDetail.js",
                "fastmap/dataApi/datamodel/Rdrestrictioncondition.js",
                "fastmap/dataApi/datamodel/Rdcross.js",
                "fastmap/dataApi/datamodel/Rdcrosslink.js",
                "fastmap/dataApi/datamodel/Rdcrossname.js",
                "fastmap/dataApi/datamodel/Rdcrossnode.js",
                "fastmap/dataApi/datamodel/Rdlaneconnexity.js",
                "fastmap/dataApi/datamodel/Rdlanetopology.js",
                "fastmap/dataApi/datamodel/Rdlanevia.js",
                "fastmap/dataApi/datamodel/Rdspeedlimit.js",
                "fastmap/dataApi/datamodel/Adlink.js",
                "fastmap/dataApi/datamodel/Adadminname.js",
                "fastmap/dataApi/datamodel/Adadmin.js",
                "fastmap/dataApi/datamodel/Rdgsc.js",
                "fastmap/dataApi/datamodel/Rdgsclink.js",
                "fastmap/dataApi/datamodel/Adface.js",

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
                "fastmap/mapApi/layer/LayerRender.js",
                "fastmap/mapApi/layer/TileJSONLayer.js",
                "fastmap/mapApi/layer/EditLayer.js",
                "fastmap/mapApi/layer/GridLayer.js",
                //uikit/controller/corectl
                "fastmap/uikit/ctlmodel/EventTypes.js",
                "fastmap/uikit/controller/corectl/CheckResultController.js",
                "fastmap/uikit/controller/corectl/DataTipsController.js",
                "fastmap/uikit/controller/corectl/FeatCodeController.js",
                "fastmap/uikit/controller/corectl/LayerController.js",
                "fastmap/uikit/controller/corectl/ObjectEditController.js",
                "fastmap/uikit/controller/corectl/OutPutController.js",
                "fastmap/uikit/controller/corectl/SelectController.js",
                "fastmap/uikit/controller/corectl/ShapeEditorController.js",
                "fastmap/uikit/controller/corectl/ToolTipsController.js",
                "fastmap/uikit/controller/corectl/HighLightController.js",
                "fastmap/uikit/controller/corectl/EventController.js",
                //uikit/controller/tools/shapetools

                "fastmap/uikit/controller/tools/shapetools/Snap.js",
                "fastmap/uikit/controller/tools/shapetools/PathCopy.js",
                "fastmap/uikit/controller/tools/shapetools/DrawPath.js",
                "fastmap/uikit/controller/tools/shapetools/CrossingAdd.js",
                "fastmap/uikit/controller/tools/shapetools/PathCut.js",
                "fastmap/uikit/controller/tools/shapetools/PathMove.js",
                "fastmap/uikit/controller/tools/shapetools/PathSmooth.js",
                "fastmap/uikit/controller/tools/shapetools/PathBreak.js",
                "fastmap/uikit/controller/tools/shapetools/PathVertexAdd.js",
                "fastmap/uikit/controller/tools/shapetools/PathVertexInsert.js",
                "fastmap/uikit/controller/tools/shapetools/PathVertexMove.js",
                "fastmap/uikit/controller/tools/shapetools/PathVertexRemove.js",
                "fastmap/uikit/controller/tools/shapetools/PointVertexAdd.js",
                "fastmap/uikit/controller/tools/shapetools/PointVertexMove.js",
                "fastmap/uikit/controller/tools/shapetools/TransformDirection.js",
                "fastmap/uikit/controller/tools/shapetools/ShapeEditorFactory.js",
                "fastmap/uikit/controller/tools/shapetools/ShapeEditorResult.js",
                "fastmap/uikit/controller/tools/shapetools/ShapeEditorResultFeedback.js",
                "fastmap/uikit/controller/tools/shapetools/HighLightRender.js",
                "fastmap/uikit/controller/tools/shapetools/PathNodeMove.js",
                "fastmap/uikit/controller/tools/selecttools/SelectNode.js",
                "fastmap/uikit/controller/tools/selecttools/SelectPath.js",
                "fastmap/uikit/controller/tools/selecttools/SelectForRestriction.js",
                "fastmap/uikit/controller/tools/selecttools/SelectRestriction.js",
                "fastmap/uikit/controller/tools/selecttools/SelectRdlane.js",
                "fastmap/uikit/controller/tools/selecttools/SelectSpeedLimit.js",
                "fastmap/uikit/controller/tools/selecttools/SelectDataTips.js",
                "fastmap/uikit/controller/tools/shapetools/GeometryValidation.js",
                "fastmap/uikit/controller/tools/selecttools/SelectRelation.js",
                "fastmap/uikit/controller/tools/selecttools/SelectRdCross.js",
                "fastmap/uikit/controller/tools/selecttools/SelectRdBranch.js",

                //"fastmap/uikit/controller/tools/L.floatMenuControl.js",

                "fastmap/uikit/ctlmodel/CheckResult.js",
                "fastmap/uikit/ctlmodel/ContentStyle.js",
                "fastmap/uikit/ctlmodel/DataTip.js",
                "fastmap/uikit/ctlmodel/FeatCode.js",
                "fastmap/uikit/ctlmodel/OutPut.js",
                "fastmap/uikit/ctlmodel/ToolTip.js",
                "fastmap/dataApi/ajaxConstruct.js"
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

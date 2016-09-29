/**
 * Created by liwanchong on 2016/4/28.
 */
(function() {
    var jsFiles = [
        //uikit/controllers
        "common/FeatureConfig.js",
        "common/EventTypes.js",
        "controllers/CheckResultController.js",
        "controllers/DataTipsController.js",
        "controllers/FeatCodeController.js",
        "controllers/LayerController.js",
        "controllers/ObjectEditController.js",
        "controllers/OutPutController.js",
        "controllers/LogMsgController.js",
        "controllers/SelectController.js",
        "controllers/ShapeEditorController.js",
        "controllers/ToolTipsController.js",
        "controllers/HighRenderController.js",
        "controllers/EventController.js",
        "tools/selectTools/SelectTips.js",
        "tools/selectTools/SelectForRestriction.js",
        "tools/selectTools/SelectNode.js",
        "tools/selectTools/SelectPoi.js",
        "tools/selectTools/SelectObject.js",
        "tools/selectTools/SelectPath.js",
        "tools/selectTools/SelectPolygon.js",
        "tools/selectTools/SelectRelation.js",
        "tools/selectTools/SelectForRectang.js",
        "tools/selectTools/SelectNodeAndPath.js"
    ]; // etc.
    // use "parser-inserted scripts" for guaranteed execution order
    // http://hsivonen.iki.fi/script-execution/
    var scriptTags = new Array(jsFiles.length);
    var host = App.Util.getAppPath() + "/scripts/uikits/";
    for (var i = 0, len = jsFiles.length; i < len; i++) {
        scriptTags[i] = "<script src='" + host + jsFiles[i] + "'></script>";
    }
    if (scriptTags.length > 0) {
        document.write(scriptTags.join(""));
    }
})();

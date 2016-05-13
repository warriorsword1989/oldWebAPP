/**
 * Created by liwanchong on 2016/4/28.
 */
(function() {
    var jsFiles = [
        //uikit/controller/corectl
        "ctlmodel/EventTypes.js",
        "controller/corectl/CheckResultController.js",
        "controller/corectl/DataTipsController.js",
        "controller/corectl/FeatCodeController.js",
        "controller/corectl/LayerController.js",
        "controller/corectl/ObjectEditController.js",
        "controller/corectl/OutPutController.js",
        "controller/corectl/SelectController.js",
        "controller/corectl/ShapeEditorController.js",
        "controller/corectl/ToolTipsController.js",
        "controller/corectl/HighRenderController.js",

        "controller/corectl/EventController.js",

        "controller/tools/selecttools/SelectDataTips.js",
        "controller/tools/selecttools/SelectForRestriction.js",
        "controller/tools/selecttools/SelectNode.js",
        "controller/tools/selecttools/SelectObject.js",
        "controller/tools/selecttools/SelectPath.js",
        "controller/tools/selecttools/SelectPolygon.js",
        "controller/tools/selecttools/SelectRelation.js",


        "ctlmodel/CheckResult.js",
        "ctlmodel/ContentStyle.js",
        "ctlmodel/DataTip.js",
        "ctlmodel/FeatCode.js",
        "ctlmodel/OutPut.js",
        "ctlmodel/ToolTip.js"

    ]; // etc.


    // use "parser-inserted scripts" for guaranteed execution order
    // http://hsivonen.iki.fi/script-execution/
    var scriptTags = new Array(jsFiles.length);
    var host = "../../scripts/uikits/road/";
    for (var i=0, len=jsFiles.length; i<len; i++) {
        scriptTags[i] = "<script src='" + host + jsFiles[i] +
            "'></script>";
    }
    if (scriptTags.length > 0) {
        document.write(scriptTags.join(""));

    }

})();
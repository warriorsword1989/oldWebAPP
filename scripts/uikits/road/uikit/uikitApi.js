/**
 * Created by liwanchong on 2016/4/28.
 */
(function() {
    var jsFiles = [
        //uikit/controller/corectl
        "uikit/ctlmodel/EventTypes.js",
        "uikit/controller/corectl/CheckResultController.js",
        "uikit/controller/corectl/DataTipsController.js",
        "uikit/controller/corectl/FeatCodeController.js",
        "uikit/controller/corectl/LayerController.js",
        "uikit/controller/corectl/ObjectEditController.js",
        "uikit/controller/corectl/OutPutController.js",
        "uikit/controller/corectl/SelectController.js",
        "uikit/controller/corectl/ShapeEditorController.js",
        "uikit/controller/corectl/ToolTipsController.js",

        "uikit/controller/corectl/EventController.js",

        "uikit/controller/tools/selecttools/SelectDataTips.js",
        "uikit/controller/tools/selecttools/SelectForRestriction.js",
        "uikit/controller/tools/selecttools/SelectNode.js",
        "uikit/controller/tools/selecttools/SelectObject.js",
        "uikit/controller/tools/selecttools/SelectPath.js",
        "uikit/controller/tools/selecttools/SelectPolygon.js",
        "uikit/controller/tools/selecttools/SelectRelation.js",


        "uikit/ctlmodel/CheckResult.js",
        "uikit/ctlmodel/ContentStyle.js",
        "uikit/ctlmodel/DataTip.js",
        "uikit/ctlmodel/FeatCode.js",
        "uikit/ctlmodel/OutPut.js",
        "uikit/ctlmodel/ToolTip.js"

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
/**
 * Created by liwanchong on 2016/4/28.
 */
(function() {
    var jsFiles = [
        "Feature.js",
        "RdLink.js",
        "RdBranchPart.js",
        "RdBranch.js",
        "RdGscMarker.js",
        "RdGscPart.js",
        "RdGsc.js",
        "poiMarker.js",
        "Tips.js",
        "TipsRestriction.js",
        "TipsLaneConnexity.js",
        "TipsGSBranch.js",
        "TipsRegionRoad.js",
        "TipsRoadCross.js",
        "TipsConnect.js",
        "TipsMultiDigitized.js",
        "TipsNomalRestriction.js",
        "TipsRoadTypes.js",
        "TipsRoadNames.js",
        "TipsLink.js",
        "TipsRoadDirection.js",
        "Tips3DBranch.js",
        "TipsBridge.js",
        "TipsMaintenance.js",
        "TipsGSC.js"
    ]; // etc.
    // use "parser-inserted scripts" for guaranteed execution order
    // http://hsivonen.iki.fi/script-execution/
    var scriptTags = new Array(jsFiles.length);
    var host = App.Util.getAppPath() + "/scripts/uikits/canvas-feature/";
    for (var i = 0, len = jsFiles.length; i < len; i++) {
        scriptTags[i] = "<script src='" + host + jsFiles[i] + "'></script>";
    }
    if (scriptTags.length > 0) {
        document.write(scriptTags.join(""));
    }
})();
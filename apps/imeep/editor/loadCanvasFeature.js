/**
 * Created by liuyang on 2016/4/28.
 * 图层各个属性和tips
 */
(function() {
    var jsFiles = [
        "Feature.js",
        "RdNode.js",
        "AdNode.js",
        "RdRestriction.js",
        "RdSpeedLimit.js",
        "RdCross.js",
        "RdLaneConnexity.js",
        "AdAdmin.js",
        "AdLink.js",
        "AdFace.js",
        "RwLink.js",
        "RwNode.js",
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
        "TipsRoadNamePart.js",
        "TipsRoadName.js",
        "TipsLinkPart.js",
        "TipsLink.js",
        "TipsLinks.js",
        "TipsRoadDirection.js",
        "Tips3DBranch.js",
        "TipsBridge.js",
        "TipsBridges.js",
        "TipsMaintenance.js",
        "TipsMaintenances.js",
        "TipsGSC.js",
        "TipsRoadCrossProm.js",
        "TipsNormalRoadSide.js",
        "TipsGSCPart.js",
        "TipsGSCMarker.js",
        "TipsNormalCross.js",
        "TipsRoadSE.js",
        "TipsRoadPE.js",
        "TipsRealSign.js",
        "TipsOrientation.js",
        "TipsSketch.js",
        "TipSelectroniceye.js",
        "TipsJVCBranch.js",
        "TipsWarningInfo.js",
        "TipsTollGate.js"
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
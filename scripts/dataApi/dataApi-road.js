/**
 * Created by liwanchong on 2016/04/18.
 */
(function() {
            jsFiles = [
                "dataApi/road/GeoLiveTypeEnum.js",
                "dataApi/road/GeoDataModel.js",
                "dataApi/road/RdBranch.js",
                "dataApi/road/RdBranchDetail.js",
                "dataApi/road/RdBranchName.js",
                "dataApi/road/RdBranchRealImage.js",
                "dataApi/road/RdBranchSchematic.js",
                "dataApi/road/RdBranchSeriesBranch.js",
                "dataApi/road/RdBranchSignAsreal.js",
                "dataApi/road/RdBranchSignBoard.js",
                "dataApi/road/RdBranchSignboardName.js",
                "dataApi/road/RdBranchVia.js",
                "dataApi/road/RdLink.js",
                "dataApi/road/RdLinkForm.js",
                "dataApi/road/RdLinkLimit.js",
                "dataApi/road/RdLinkName.js",
                "dataApi/road/RdLinkRtic.js",
                "dataApi/road/RdLinkIntRtics.js",
                "dataApi/road/RdLinkSideWalk.js",
                "dataApi/road/RdLinkSpeedLimit.js",
                "dataApi/road/RdLinkTruckLimit.js",
                "dataApi/road/RdLinkWalkStair.js",
                "dataApi/road/RdLinkZone.js",
                "dataApi/road/RdNode.js",
                "dataApi/road/RdNodeForm.js",
                "dataApi/road/RdRestriction.js",
                "dataApi/road/RdRestrictionDetail.js",
                "dataApi/road/RdRestrictionCondition.js",
                "dataApi/road/RdCross.js",
                "dataApi/road/RdCrossLink.js",
                "dataApi/road/RdCrossName.js",
                "dataApi/road/RdCrossNode.js",
                "dataApi/road/RdLaneConnexity.js",
                "dataApi/road/RdLaneTopology.js",
                "dataApi/road/RdLaneVia.js",
                "dataApi/road/RdSpeedLimit.js",
                "dataApi/road/AdLink.js",
                "dataApi/road/AdAdminName.js",
                "dataApi/road/AdAdmin.js",
                "dataApi/road/RdGsc.js",
                "dataApi/road/RdGscLink.js",
                "dataApi/road/AdFace.js",
                "dataApi/road/RwLink.js",
                "dataApi/road/RwLinkName.js",
                "dataApi/road/RwNode.js",
                "dataApi/road/AdNode.js",
                "dataApi/road/ZoneNode.js",
                "dataApi/road/ZoneLink.js",
                "dataApi/road/ZoneLinkKind.js",
                "dataApi/road/RdWarningInfo.js",
                "dataApi/road/ZoneFace.js",
                "dataApi/road/LuNode.js",
                "dataApi/road/LuLink.js",
                "dataApi/road/LuFace.js",
                "dataApi/road/LuLinkKind.js",
                "dataApi/road/LuFaceName.js",
                "dataApi/road/LcNode.js",
                "dataApi/road/LcLink.js",
                "dataApi/road/LcLinkKind.js",
                "dataApi/road/LcFace.js",
                "dataApi/road/LcFaceName.js",
                "dataApi/road/RdTrafficSignal.js",
                "dataApi/road/RdElectronicEye.js",
                "dataApi/road/RdSlope.js",
                "dataApi/road/RdSlopeLinks.js",
                "dataApi/road/RdInter.js",
                "dataApi/road/RdInterNodes.js",
                "dataApi/road/RdInterLinks.js",
                "dataApi/road/RdRoad.js",
                "dataApi/road/RdRoadLinks.js",
                "dataApi/road/RdGate.js",
                "dataApi/road/RdGateCondition.js",
                "dataApi/road/RdDirectRoute.js",
                "dataApi/road/RdDirectRouteVia.js",
                "dataApi/road/RdSpeedBump.js",
                "dataApi/road/RdSe.js",
                "dataApi/road/RdSameNode.js",
                "dataApi/road/RdSameNodePart.js",
                "dataApi/road/RdSameLink.js",
                "dataApi/road/RdSameLinkPart.js",
                "dataApi/road/RdTollgate.js",
                "dataApi/road/RdTollgateName.js",
                "dataApi/road/RdTollgatePassage.js",
                "dataApi/road/RdVariableSpeed.js",
                "dataApi/road/RdVariableSpeedLinks.js"
            ]; // etc.


        // use "parser-inserted scripts" for guaranteed execution order
        // http://hsivonen.iki.fi/script-execution/
        var scriptTags = new Array(jsFiles.length);
        var host = "../../../scripts/";
        for (var i=0, len=jsFiles.length; i<len; i++) {
            scriptTags[i] = "<script src='" + host + jsFiles[i] +
                "'></script>";
        }
        if (scriptTags.length > 0) {
            document.write(scriptTags.join(""));
        }
})();
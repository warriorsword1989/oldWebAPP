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
        "RdSlope.js",
        "RdInter.js",
        "RdGate.js",
        "RdCross.js",
        "RdLaneConnexity.js",
        "AdAdmin.js",
        "AdLink.js",
        "AdFace.js",
        "ZoneFace.js",
        "ZoneLink.js",
        "ZoneNode.js",
        "LuFace.js",
        "LuLink.js",
        "LuNode.js",
        "RwLink.js",
        "RwNode.js",
        "RdLink.js",
        "RdBranchPart.js",
        "RdBranch.js",
        "RdGscMarker.js",
        "RdGscPart.js",
        "RdGsc.js",
        "IXPOI.js",
        "RdWarningInfo.js",
        "RdTrafficSignal.js",
        "RdElectronicEye.js",
        "Tips.js",
        "TipsRestrictions.js",
        "TipsLane_Connexity.js",
        "TipsGSBranch.js",
        "TipsRegionRoads.js",
        "TipsRegionRoad.js",
        "TipsRegionRoadPart.js",
        "TipsRoadCross.js",
        "TipsConnect.js",
        "TipsMultiDigitized.js",
        "TipsMultiDigitizeds.js",
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
        "TipsRoadSA.js",
        "TipsRoadPA.js",
        "TipsBusLanes.js",
        "TipsBusLane.js",
        "TipsSideRoad.js",
        "TipsSideRoads.js",
        "TipsRealSign.js",
        "TipsOrientation.js",
        "TipsSketchs.js",
        "TipsSketch.js",
        "TipsSketchPart.js",
        "TipSelectroniceye.js",
        "TipsJVCBranch.js",
        "TipsWarningInfo.js",
        "TipsWarningInfos.js",
        "TipsTollGate.js",
        "TipsTrafficSignal.js",
        "TipsTrafficSignalDir.js",
        "TipsGate.js",
        "TipsSlope.js",
        "TipsSpeedlimit.js",
        "TipsDrivewayLimit.js",
        "TipsDrivewayMount.js",
        "TipsRamp.js",
        "TipsParkinglot.js",
        "TipsNoCrossing.js",
        "TipsNoEntry.js",
        "TipsLeftToRight.js",
        "TipsPavementCover.js",
        "TipsRepairs.js",
        "TipsRepair.js",
        "TipsOverpasses.js",
        "TipsOverpass.js",
        "TipsUnderpasses.js",
        "TipsUnderpass.js",
        "TipsBypaths.js",
        "TipsBypath.js",
        "TipsPOIRoads.js",
        "TipsPOIRoadPart.js",
        "TipsPOIRoad.js",
        "TipsTunnels.js",
        "TipsTunnel.js",
        "TipsSeasonalRoads.js",
        "TipsSeasonalRoad.js",
        "TipsUsageFeeRequireds.js",
        "TipsUsageFeeRequired.js",
        "TipsChargeOpenRoad.js",
        "TipsChargeOpenRoads.js",
        "TipsChargeOpenRoadPart.js",
        "TipsRoundabout.js",
        "TipsRoundabouts.js",
        "TipsRoundaboutPart.js",
        "TipsSpecialTrafficTypes.js",
        "TipsSpecialTrafficType.js",
        "TipsSpecialTrafficTypePart.js",
        "TipsDirect.js",
        "TipsPedestrianStreets.js",
        "TipsPedestrianStreet.js",
        "TipsNarrowChannels.js",
        "TipsNarrowChannel.js",
        "TipsElevatedRoads.js",
        "TipsElevatedRoad.js"
    ]; // etc.
    // use "parser-inserted scripts" for guaranteed execution order
    // http://hsivonen.iki.fi/script-execution/
    var scriptTags = new Array(jsFiles.length);
    var host = App.Util.getAppPath() + "/scripts/dataApi/canvasFeatures/";
    for (var i = 0, len = jsFiles.length; i < len; i++) {
        scriptTags[i] = "<script src='" + host + jsFiles[i] + "'></script>";
    }
    if (scriptTags.length > 0) {
        document.write(scriptTags.join(""));
    }
})();
/**
 * Created by liwanchong on 2016/4/18.
 */
(function() {
            jsFiles = [
                "dataApi/datamodel/GeoDataModel.js",
                "dataApi/datamodel/RdBranch.js",
                "dataApi/datamodel/RdBranchDetail.js",
                "dataApi/datamodel/RdBranchName.js",
                "dataApi/datamodel/RdBranchRealImage.js",
                "dataApi/datamodel/RdBranchSchematic.js",
                "dataApi/datamodel/RdBranchSeriesBranch.js",
                "dataApi/datamodel/RdBranchSignAsreal.js",
                "dataApi/datamodel/RdBranchSignBoard.js",
                "dataApi/datamodel/RdBranchSignboardName.js",
                "dataApi/datamodel/RdBranchVia.js",
                "dataApi/datamodel/RdLink.js",
                "dataApi/datamodel/RdLinkForm.js",
                "dataApi/datamodel/RdLinkLimit.js",
                "dataApi/datamodel/RdLinkName.js",
                "dataApi/datamodel/RdLinkRtic.js",
                "dataApi/datamodel/RdLinkIntRtics.js",
                "dataApi/datamodel/RdLinkSideWalk.js",
                "dataApi/datamodel/RdLinkSpeedLimit.js",
                "dataApi/datamodel/RdLinkTruckLimit.js",
                "dataApi/datamodel/RdLinkWalkStair.js",
                "dataApi/datamodel/RdLinkZone.js",
                "dataApi/datamodel/RdNode.js",
                "dataApi/datamodel/RdNodeForm.js",
                "dataApi/datamodel/RdRestriction.js",
                "dataApi/datamodel/RdRestrictionDetail.js",
                "dataApi/datamodel/RdRestrictionCondition.js",
                "dataApi/datamodel/RdCross.js",
                "dataApi/datamodel/RdCrossLink.js",
                "dataApi/datamodel/RdCrossName.js",
                "dataApi/datamodel/RdCrossNode.js",
                "dataApi/datamodel/RdLaneConnexity.js",
                "dataApi/datamodel/RdLaneTopology.js",
                "dataApi/datamodel/RdLaneVia.js",
                "dataApi/datamodel/RdSpeedLimit.js",
                "dataApi/datamodel/AdLink.js",
                "dataApi/datamodel/AdAdminName.js",
                "dataApi/datamodel/AdAdmin.js",
                "dataApi/datamodel/RdGsc.js",
                "dataApi/datamodel/RdGscLink.js",
                "dataApi/datamodel/AdFace.js",
                "dataApi/datamodel/RwLink.js"
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
/**
 * Created by liwanchong on 2016/4/18.
 */
(function() {
            jsFiles = [
                "dataApi/datamodel/GeoLiveTypeEnum.js",
                "dataApi/datamodel/GeoDataModel.js",
                "dataApi/datamodel/Rdbranch.js",
                "dataApi/datamodel/Rdbranchdetail.js",
                "dataApi/datamodel/Rdbranchname.js",
                "dataApi/datamodel/Rdbranchrealimage.js",
                "dataApi/datamodel/Rdbranchschematic.js",
                "dataApi/datamodel/Rdbranchseriesbranch.js",
                "dataApi/datamodel/Rdbranchsignasreal.js",
                "dataApi/datamodel/Rdbranchsignboard.js",
                "dataApi/datamodel/Rdbranchsignboardname.js",
                "dataApi/datamodel/Rdbranchvia.js",
                "dataApi/datamodel/Rdlink.js",
                "dataApi/datamodel/RdlinkForm.js",
                "dataApi/datamodel/RdlinkLimit.js",
                "dataApi/datamodel/RdlinkName.js",
                "dataApi/datamodel/RdlinkRtic.js",
                "dataApi/datamodel/RdlinkIntRtics.js",
                "dataApi/datamodel/RdlinkSideWalk.js",
                "dataApi/datamodel/RdlinkSpeedLimit.js",
                "dataApi/datamodel/RdlinkTruckLimit.js",
                "dataApi/datamodel/RdlinkWalkStair.js",
                "dataApi/datamodel/RdlinkZone.js",
                "dataApi/datamodel/Rdnode.js",
                "dataApi/datamodel/Rdnodeform.js",
                "dataApi/datamodel/RdRestriction.js",
                "dataApi/datamodel/RdrestrictionDetail.js",
                "dataApi/datamodel/Rdrestrictioncondition.js",
                "dataApi/datamodel/Rdcross.js",
                "dataApi/datamodel/Rdcrosslink.js",
                "dataApi/datamodel/Rdcrossname.js",
                "dataApi/datamodel/Rdcrossnode.js",
                "dataApi/datamodel/Rdlaneconnexity.js",
                "dataApi/datamodel/Rdlanetopology.js",
                "dataApi/datamodel/Rdlanevia.js",
                "dataApi/datamodel/Rdspeedlimit.js",
                "dataApi/datamodel/Adlink.js",
                "dataApi/datamodel/Adadminname.js",
                "dataApi/datamodel/Adadmin.js",
                "dataApi/datamodel/Rdgsc.js",
                "dataApi/datamodel/Rdgsclink.js",
                "dataApi/datamodel/Adface.js",
                "dataApi/datamodel/Rwlink.js"
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
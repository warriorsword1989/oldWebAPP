/**
 * Created by liuyang on 2016/05/04.
 */
(function() {
            jsFiles = [
                "dataApi/common/dataApi-ajax.js",
                "dataApi/common/DataModel.js",
                "dataApi/common/GeoDataModel.js",
                "dataApi/meta/CheckRule.js",
                "dataApi/meta/IxPoiBrand.js",
                "dataApi/meta/IxPoiKind.js",
                "dataApi/meta/IxPoiMediumKind.js",
                "dataApi/meta/IxPoiTopKind.js",
                "dataApi/poi/IxPoi.js",
                "dataApi/poi/IxPoiSnapShot.js",
                "dataApi/poi/IxPoiAddress.js",
                "dataApi/poi/IxPoiChargingPole.js",
                "dataApi/poi/IxPoiChargingStation.js",
                "dataApi/poi/IxPoiContact.js",
                "dataApi/poi/IxPoiImage.js",
                "dataApi/poi/IxPoiName.js",
                "dataApi/poi/IxPoiConstant.js",
                "dataApi/poi/IxCheckResult.js",
                "dataApi/poi/IxEditHistory.js"

            ]; // etc.
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
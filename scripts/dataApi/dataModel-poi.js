/**
 * Created by liuyang on 2016/05/04.
 */
(function() {
            jsFiles = [
                "dataApi/datamodel/common/DataModel.js",
                "dataApi/datamodel/common/GeoDataModel.js",
                "dataApi/datamodel/meta/CheckRule.js",
                "dataApi/datamodel/meta/IxPoiBrand.js",
                "dataApi/datamodel/meta/IxPoiKind.js",
                "dataApi/datamodel/meta/IxPoiMediumKind.js",
                "dataApi/datamodel/meta/IxPoiTopKind.js",
                "dataApi/datamodel/poi/IxPoi.js",
                "dataApi/datamodel/poi/IxPoiAddress.js",
                "dataApi/datamodel/poi/IxPoiChargingPole.js",
                "dataApi/datamodel/poi/IxPoiContact.js",
                "dataApi/datamodel/poi/IxPoiImage.js",
                "dataApi/datamodel/poi/IxPoiName.js"
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
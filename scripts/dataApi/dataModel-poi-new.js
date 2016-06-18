/**
 * Created by liuyang on 2016/05/04.
 */
(function() {
            jsFiles = [
                "dataApi/common/DataModel.js",
                "dataApi/common/GeoDataModel.js",
                "dataApi/meta/CheckRule.js",
                "dataApi/meta/IxPoiBrand.js",
                "dataApi/meta/IxPoiKind.js",
                "dataApi/meta/IxPoiMediumKind.js",
                "dataApi/meta/IxPoiTopKind.js",

                "dataApi/poi-new/IxPoiConstant.js",
                "dataApi/poi-new/IxPoi.js",
                "dataApi/poi-new/IxCheckResult.js",
                "dataApi/poi-new/IxOutput.js",
                "dataApi/poi-new/IxPoiAddress.js",
                "dataApi/poi-new/IxPoiBuilding.js",
                "dataApi/poi-new/IxPoiChildren.js",
                "dataApi/poi-new/IxPoiContact.js",
                "dataApi/poi-new/IxPoiGasstation.js",
                "dataApi/poi-new/IxPoiHotel.js",
                "dataApi/poi-new/IxPoiName.js",
                "dataApi/poi-new/IxPoiParent.js",
                "dataApi/poi-new/IxPoiPhoto.js",
                "dataApi/poi-new/IxPoiRestaurant.js",
                "dataApi/poi-new/IxPoiSnapShot.js",
                "dataApi/poi-new/IxSamePoi.js",
                "dataApi/poi-new/IxSamePoiPart.js",
                "dataApi/poi-new/IxPoiParking.js",

                "dataApi/common/FeatureConfig.js"

            ]; // etc.
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
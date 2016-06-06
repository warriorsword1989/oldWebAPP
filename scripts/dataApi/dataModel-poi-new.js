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
                // "dataApi/poi/IxPoi.js",
                // "dataApi/poi/IxPoiSnapShot.js",
                // "dataApi/poi/IxPoiAddress.js",
                // "dataApi/poi/IxPoiChargingPole.js",
                // "dataApi/poi/IxPoiChargingStation.js",
                //
                // "dataApi/poi/IxPoiImage.js",
                // "dataApi/poi/IxPoiName.js",
                // "dataApi/poi-new/AuIxCheckResult.js",
                //
                // "dataApi/poi/IxPoiConstant.js",
                // "dataApi/poi/IxCheckResult.js",
                //"dataApi/poi/IxEditHistory.js",

                "dataApi/poi/IxPoiConstant.js",
                "dataApi/poi-new/AuIxPoi.js",
                "dataApi/poi-new/AuIxCheckResult.js",
                "dataApi/poi-new/AuIxOutput.js",
                "dataApi/poi-new/AuIxPoiAddress.js",
                "dataApi/poi-new/AuIxPoiBuilding.js",
                "dataApi/poi-new/AuIxPoiChildren.js",
                "dataApi/poi-new/AuIxPoiContact.js",
                "dataApi/poi-new/AuIxPoiGasstation.js",
                "dataApi/poi-new/AuIxPoiHotel.js",
                "dataApi/poi-new/AuIxPoiName.js",
                "dataApi/poi-new/AuIxPoiParent.js",
                "dataApi/poi-new/AuIxPoiPhoto.js",
                "dataApi/poi-new/AuIxPoiRestaurant.js",
                "dataApi/poi-new/AuIxPoiSnapShot.js",
                "dataApi/poi-new/AuIxSamePoi.js",
                "dataApi/poi-new/AuIxSamePoiPart.js"

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
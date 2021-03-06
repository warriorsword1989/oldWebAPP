/**
 * Created by liuyang on 2016/05/04.
 */
(function () {
    jsFiles = [
        'dataApi/common/DataModel.js',
        'dataApi/common/GeoDataModel.js',
        'dataApi/meta/CheckRule.js',
        'dataApi/meta/IxPoiBrand.js',
        'dataApi/meta/IxPoiKind.js',
        'dataApi/meta/IxPoiMediumKind.js',
        'dataApi/meta/IxPoiTopKind.js',

        'dataApi/poi/IxPoiConstant.js',
        'dataApi/poi/IxPoi.js',
        'dataApi/poi/IxCheckResult.js',
        'dataApi/poi/IxSearchResult.js',
        'dataApi/poi/IxOutput.js',
        'dataApi/poi/IxPoiAddress.js',
        'dataApi/poi/IxPoiBuilding.js',
        'dataApi/poi/IxPoiChildren.js',
        'dataApi/poi/IxPoiContact.js',
        'dataApi/poi/IxPoiGasstation.js',
        'dataApi/poi/IxPoiHotel.js',
        'dataApi/poi/IxPoiName.js',
        'dataApi/poi/IxPoiParent.js',
        'dataApi/poi/IxPoiPhoto.js',
        'dataApi/poi/IxPoiRestaurant.js',
        'dataApi/poi/IxPoiSnapShot.js',
        'dataApi/poi/IxSamePoi.js',
        'dataApi/poi/IxSamePoiPart.js',
        'dataApi/poi/IxPoiParking.js',
        'dataApi/poi/IxPoiChargingplot.js',
        'dataApi/poi/IxPoiChargingstation.js',
        'dataApi/poi/IxPoiCarRental.js'

    ]; // etc.
    var scriptTags = new Array(jsFiles.length);
    var host = '../../../scripts/';
    for (var i = 0, len = jsFiles.length; i < len; i++) {
        scriptTags[i] = "<script src='" + host + jsFiles[i] +
                "'></script>";
    }
    if (scriptTags.length > 0) {
        document.write(scriptTags.join(''));
    }
}());

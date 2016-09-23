/**
 * Created by liuyang on 2016/05/04.
 */
(function() {
            jsFiles = [
                "dataApi/common/DataModel.js",
                "dataApi/common/GeoDataModel.js",
                "dataApi/column/ColPoiList.js",
                "dataApi/column/ColPoi.js",
                "dataApi/column/ColPoiName.js",
                "dataApi/column/ColPoiAddress.js"

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

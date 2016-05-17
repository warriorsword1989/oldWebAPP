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
                "dataApi/poi/IxPoiAddress.js",
                "dataApi/poi/IxPoiChargingPole.js",
                "dataApi/poi/IxPoiChargingStation.js",
                "dataApi/poi/IxPoiContact.js",
                "dataApi/poi/IxPoiImage.js",
                "dataApi/poi/IxPoiName.js",
                "dataApi/poi/IxPoiConstant.js",
                "dataApi/poi/IxCheckResult.js",
                "dataApi/poi/IxEditHistory.js",

                "libs/leaflet-0.7.3/leaflet-src.js",
                "fastmap/leaflet-poiUtil.js",
                "libs/leaflet-0.7.3/plugins/Leaflet.NavBar.js",
                "libs/leaflet-0.7.3/plugins/leaflet-search.src.js",
                "libs/leaflet-0.7.3/plugins/leaflet-checkbox.src.js",
                "libs/leaflet-0.7.3/plugins/Toolbar.js",
                "libs/leaflet-0.7.3/plugins/Tooltip.js",
                "libs/leaflet-0.7.3/plugins/draw/DrawToolbar.js",
                "libs/leaflet-0.7.3/plugins/draw/GeometryUtil.js",
                "libs/leaflet-0.7.3/plugins/draw/LatLngUtil.js",
                "libs/leaflet-0.7.3/plugins/Control.Draw.js",
                "libs/leaflet-0.7.3/plugins/draw/Leaflet.draw.js",
                "libs/leaflet-0.7.3/plugins/draw/Draw.Feature.js",
                "libs/leaflet-0.7.3/plugins/draw/Draw.SimpleShape.js",
                "libs/leaflet-0.7.3/plugins/draw/Draw.Marker.js",
                "libs/leaflet-0.7.3/plugins/draw/Draw.Polyline.js",
                "libs/leaflet-0.7.3/plugins/draw/Draw.Polygon.js",
                "libs/leaflet-0.7.3/plugins/draw/Draw.Rectangle.js",
                "libs/leaflet-0.7.3/plugins/draw/LineUtil.Intersect.js",
                "libs/leaflet-0.7.3/plugins/draw/Polygon.Intersect.js",
                "libs/leaflet-0.7.3/plugins/draw/Polyline.Intersect.js"



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
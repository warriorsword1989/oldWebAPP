fastmap.uikit.canvasTips.TipsRoadName = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item) {
        var sidingObj = {};
        sidingObj['geometry'] = {};
        sidingObj['geometry']['coordinates'] = item.g;
        sidingObj['properties'] = {};
        sidingObj['properties']['style'] = {};
        sidingObj['properties']['id'] = item.i;
        sidingObj['properties']["featType"] = item.t;
        sidingObj['geometry']['type'] = "LineString";

        sidingObj['properties']['style'] = {
            'strokeColor': '#7030A0',
            'strokeWidth': 2,
            'strokeOpacity': 0.8
        };
    }
});
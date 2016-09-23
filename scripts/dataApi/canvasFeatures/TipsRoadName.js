fastmap.uikit.canvasTips.TipsRoadName = fastmap.uikit.canvasTips.Tips.extend({
    geometry:null,
    properties:null,
    setAttribute: function (item) {
        this.geometry = {};
        this.geometry['coordinates'] = item.g;
        this.properties = {};
        this.properties['style'] = {};
        this.properties['id'] = item.i;
        this.properties["featType"] = item.t;
        this.geometry['type'] = "LineString";
        this.properties['style'] = {
            'strokeColor': '#7030A0',
            'strokeWidth': 2,
            'strokeOpacity': 0.8
        };
    }
});
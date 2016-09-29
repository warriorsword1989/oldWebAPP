fastmap.uikit.canvasTips.TipsPOIRoadPart = fastmap.uikit.canvasTips.Tips.extend({
    geometry:null,
    properties:null,
    setAttribute: function (item) {
        var sidingObj = {};
        this.geometry = {};
        this.geometry['coordinates'] = item.c;
        this.properties = {};
        this.properties['style'] = {};
        this.properties['id'] = item.i;
        this.properties["featType"] = item.t;
        this.geometry['type'] = "LineString";
        this.properties['style'] = {
            'strokeColor': '#FF0000',
            'strokeWidth': 2,
            'strokeOpacity': 0.8
        };
    }
});
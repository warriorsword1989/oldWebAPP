fastmap.uikit.canvasTips.TipsSketchPart = fastmap.uikit.canvasTips.Tips.extend({
    geometry: null,
    properties: null,
    setAttribute: function (item, num) {
        this.geometry = {};
        this.geometry.type = 'LineString';
        this.geometry.coordinates = [];
        // for (var i = 0, len = item.m.c[num].g.length; i < len; i = i + 1) {
        this.geometry.coordinates = item.m.c[num].g;
        // }
        this.properties = {
            id: item.i,
            featType: item.t
        };
        this.properties.style = {
            strokeColor: '#E36C0A',
            strokeWidth: 2,
            strokeOpacity: 0.8
        };
    }
});

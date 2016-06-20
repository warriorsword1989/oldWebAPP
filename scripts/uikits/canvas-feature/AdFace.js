fastmap.uikit.canvasFeature.AdFace = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(item) {
        var color = "";
        this.properties["featType"] = "ADFACE";
        this.geometry['type'] = 'Polygon';
        if (Number(this.properties.id).toString(16).length > 6) {
            color = Number(this.properties.id).toString(16).substring(Number(this.properties.id).toString(16).length - 4);
        } else {
            color = Number(this.properties.id).toString(16);
        }
        this.properties['style'] = {
            //'fillColor': '#' + Number(obj['properties'].id).toString(16) + '00',
            //'fillColor':'#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).substr(-6),
            'fillColor': '#' + color + '00',
            'fillOpacity': 0.2,
            'strokeColor': '#FBD356',
            'strokeWidth': 1,
            // 'backgroundImage': ""
        };
    }
});
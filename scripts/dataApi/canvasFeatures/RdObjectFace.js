/**
 * Created by liuyang on 2016/8/24.
 */
fastmap.uikit.canvasFeature.RdObjectFace = fastmap.uikit.canvasFeature.Feature.extend({
    geometry: {},
    properties: {},
    setAttribute: function(data,id) {
        this.geometry['coordinates'] = data.g;
        this.properties["featType"] = "RDOBJECT";
        this.geometry['type'] = 'Polygon';
        this.properties['id'] = id;

        this.properties['style'] = {
            //'fillColor': '#' + Number(obj['properties'].id).toString(16) + '00',
            //'fillColor':'#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).substr(-6),
//            'fillColor': '#' + color + '00',
            'fillColor': '#FFFF37',
            'fillOpacity': 0.2,
            'strokeColor': '#FFFF37',
            'strokeWidth': 1,
            'backgroundImage': ""
        };
    }
});
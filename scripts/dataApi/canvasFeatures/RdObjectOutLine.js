/**
 * Created by liuyang on 2016/8/24.
 */
fastmap.uikit.canvasFeature.RdObjectOutLine = fastmap.uikit.canvasFeature.Feature.extend({
    geometry: {},
    properties: {},
    setAttribute: function(data,id) {
        this.geometry['coordinates'] = data[0];
        this.properties["featType"] = "RDOBJECT";
        this.geometry['type'] = 'LineString';
        this.properties['id'] = id;
        this.properties['style']['strokeColor'] = '#F9F900';
        this.properties['style']['strokeWidth'] = 3;
        this.properties['style']['strokeOpacity'] = 1;
    }
});
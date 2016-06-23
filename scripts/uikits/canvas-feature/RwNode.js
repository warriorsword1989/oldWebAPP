/**
 * Created by mali on 2016/6/23.
 */
fastmap.uikit.canvasFeature.RwNode = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(data) {
        this.properties["featType"] = "RwNode";
        this.geometry['type'] = 'Point';
        this.properties['markerStyle'] = {};
        this.properties['style']['strokeColor'] = '#4F4F2F';
        this.properties['style']['strokeWidth'] = 1;
        this.properties['style']['strokeOpacity'] = 1;
        this.properties['style']['radius'] = 5;
        this.properties['style']['fillColor'] = '#4F4F2F';
        this.properties['style']['fillOpacity'] = 0.2;
    }
});
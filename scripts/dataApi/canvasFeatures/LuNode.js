/**
 * Created by mali on 2016/7/25.
 */
fastmap.uikit.canvasFeature.LUNode = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(data) {
        this.properties["featType"] = "LUNODE";
        this.geometry['type'] = 'Point';
        this.properties['markerStyle'] = {};
        this.properties['style']['strokeColor'] = '#DAA520';
        this.properties['style']['strokeWidth'] = 1;
        this.properties['style']['strokeOpacity'] = 1;
        this.properties['style']['radius'] = 8;
        this.properties['style']['fillColor'] = '#DAA520';
        this.properties['style']['fillOpacity'] = 0.2;
    }
});
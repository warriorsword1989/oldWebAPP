fastmap.uikit.canvasFeature.RdSameNode = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(data) {
        this.properties["featType"] = "RDSAMENODE";
        this.geometry['type'] = 'Point';
        this.properties['markerStyle'] = {};
        this.properties['style']['strokeColor'] = '#0033FF';
        this.properties['style']['strokeWidth'] = 1;
        this.properties['style']['strokeOpacity'] = 1;
        this.properties['style']['radius'] = 4;
        this.properties['style']['fillColor'] = 'blue';
        this.properties['style']['fillOpacity'] = 0.2;
    }
});
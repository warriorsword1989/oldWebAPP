fastmap.uikit.canvasFeature.AdNode = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(data) {
        this.properties["featType"] = "ADNODE";
        this.geometry['type'] = 'Point';
        this.properties['markerStyle'] = {};
        this.properties['style']['strokeColor'] = '#CD0000';
        this.properties['style']['strokeWidth'] = 1;
        this.properties['style']['strokeOpacity'] = 1;
        this.properties['style']['radius'] = 3;
        this.properties['style']['fillColor'] = '#CD0000';
        this.properties['style']['fillOpacity'] = 0.2;
    }
});
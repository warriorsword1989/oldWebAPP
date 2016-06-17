fastmap.uikit.canvasFeature.RdNode = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(data) {
        this.properties["featType"] = "RDNODE";
        this.geometry['type'] = 'Point';
        this.properties['markerStyle'] = {};
        this.properties['style']['strokeColor'] = 'black';
        this.properties['style']['strokeWidth'] = 1;
        this.properties['style']['strokeOpacity'] = 1;
        this.properties['style']['radius'] = 3;
        this.properties['style']['fillColor'] = 'black';
        this.properties['style']['fillOpacity'] = 0.2;
    }
});
fastmap.uikit.canvasFeature.RdGscMarker = fastmap.uikit.canvasFeature.Feature.extend({
	geometry: {},
    properties: {},
    setAttribute: function(data) {
        this.geometry['type'] = 'Point';
        this.geometry['coordinates'] = data.m.a;
        this.properties["featType"] = "RDGSC";
        this.properties['style'] = {};
        this.properties['id'] = data.i;
        
    }
});
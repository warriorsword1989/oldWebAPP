fastmap.uikit.canvasFeature.poiMarker = fastmap.uikit.canvasFeature.Feature.extend({
	geometry: {},
    properties: {},
    setAttribute: function(data) {
        this.geometry['type'] = 'Point';
        this.properties["featType"] = "poi";
        this.properties['markerStyle'] = {};
        this.properties['markerStyle']["icon"] = [];
        this.properties['kind'] = data.m.c;
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasFeature.Feature.getIconStyle({
                iconName: '../../../images/poi/map/dot_infor_8.png',
                row: 0,
                column: 1,
                location: this.geometry['coordinates']
            })
        );
    }
});
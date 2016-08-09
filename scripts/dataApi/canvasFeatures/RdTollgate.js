fastmap.uikit.canvasFeature.RdTollgate = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(item) {
        this.geometry['type'] = 'Point';
        this.properties['markerStyle'] = {};
        this.properties['markerStyle']["icon"] = [];
        this.properties["featType"] = "RDTOLLGATE";
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasFeature.Feature.getIconStyle({
                    iconName: '../../../images/road/rdTollgate/0.png',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates']
                }
            )
        );
    }
});
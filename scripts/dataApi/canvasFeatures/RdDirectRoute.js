fastmap.uikit.canvasFeature.RdDirectRoute = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(item) {
        this.geometry['type'] = 'Point';
        this.properties['markerStyle'] = {};
        this.properties['markerStyle']["icon"] = [];
        this.properties["featType"] = "RDDIRECTROUTE";
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasFeature.Feature.getIconStyle({
                    iconName: '../../../images/road/rdDirectRoute/0.png',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates']
                }
            )
        );
    }
});
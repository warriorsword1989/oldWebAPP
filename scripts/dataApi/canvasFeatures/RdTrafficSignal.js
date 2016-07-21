fastmap.uikit.canvasFeature.RdTrafficSignal = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(item) {
        this.geometry['type'] = 'Point';
        this.properties['markerStyle'] = {};
        this.properties["featType"] = "RDTRAFFICSIGNAL";
        this.properties['markerStyle']["icon"] = [];
        for (var trafficNum = 0, trafficLen = this.geometry['coordinates'].length; trafficNum < trafficLen; trafficNum++) {
            var trafficObj = {};
            trafficObj = fastmap.uikit.canvasFeature.Feature.getIconStyle({
                    iconName: '../../../images/road/rdtraffic/0.svg',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates'][trafficNum]
                }
            )
            this.properties['markerStyle']["icon"].push(trafficObj);
        }
    }
});
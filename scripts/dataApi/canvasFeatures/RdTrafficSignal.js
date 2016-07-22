fastmap.uikit.canvasFeature.RdTrafficSignal = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(item) {
        this.geometry['type'] = 'Point';
        this.properties['markerStyle'] = {};
        this.properties['markerStyle']["icon"] = [];
        this.properties["featType"] = "RDTRAFFICSIGNAL";
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasFeature.Feature.getIconStyle({
                    iconName: '../../../images/road/rdtraffic/0.svg',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates']
                }
            )
        );
        console.log(this,item)
    }
});
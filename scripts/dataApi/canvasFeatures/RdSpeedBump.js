fastmap.uikit.canvasFeature.RdSpeedBump = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function (item) {
        this.geometry.type = 'Point';
        this.properties.markerStyle = {};
        this.properties.markerStyle.icon = [];
        this.properties.featType = 'RDSPEEDBUMP';
        this.properties.markerStyle.icon.push(
            fastmap.uikit.canvasFeature.Feature.getIconStyle({
                iconName: '../../../images/road/rdSpeedBump/0.svg',
                row: 0,
                column: 1,
                location: this.geometry.coordinates
            }
            )
        );
    }
});

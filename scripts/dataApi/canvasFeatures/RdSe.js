fastmap.uikit.canvasFeature.RdSe = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function (item) {
        this.geometry.type = 'Point';
        this.properties.markerStyle = {};
        this.properties.markerStyle.icon = [];
        this.properties.featType = 'RDSE';
        this.properties.markerStyle.icon.push(
            fastmap.uikit.canvasFeature.Feature.getIconStyle({
                iconName: '../../../images/road/rdSe/0.svg',
                row: 0,
                column: 1,
                location: this.geometry.coordinates
            }
            )
        );
    }
});

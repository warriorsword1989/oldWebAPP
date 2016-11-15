fastmap.uikit.canvasFeature.RdVoiceGuide = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function (item) {
        this.geometry.type = 'Point';
        this.properties.markerStyle = {};
        this.properties.markerStyle.icon = [];
        this.properties.featType = 'RDVOICEGUIDE';
        this.properties.markerStyle.icon.push(
            fastmap.uikit.canvasFeature.Feature.getIconStyle({
                iconName: '../../../images/road/voiceGuide/1306_0_0.svg',
                row: 0,
                column: 1,
                location: this.geometry.coordinates
            }
            )
        );
    }
});

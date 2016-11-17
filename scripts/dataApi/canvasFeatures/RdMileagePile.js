fastmap.uikit.canvasFeature.RdMileagePile = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function (item) {
        this.geometry.type = 'Point';
        this.properties.markerStyle = {};
        this.properties.markerStyle.icon = [];
        this.properties.featType = 'RDMILEAGEPILE';
        this.properties.markerStyle.icon.push(
            fastmap.uikit.canvasFeature.Feature.getIconStyle({
                iconName: '../../../images/road/variableSpeed/1.svg',
                row: 0,
                column: 10,
                location: this.geometry.coordinates,
                dx: 0,
                dy: 0
            })
        );
        // 里程桩值;
        this.properties.markerStyle.icon.push(
            {
                text: item.m.a?item.m.a:'0'+'KM',
                row: 0,
                column: 2,
                location: this.geometry.coordinates,
                dx: 0,
                dy: 25
            }
        );
    }
});

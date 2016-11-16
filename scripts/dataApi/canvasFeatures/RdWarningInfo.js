fastmap.uikit.canvasFeature.RdWarningInfo = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function (item) {
        this.geometry.type = 'Point';
        this.properties.markerStyle = {};
        this.properties.markerStyle.icon = [];
        this.properties.featType = 'RDWARNINGINFO';
        var imageSrc = '../../../images/road/warningInfo/13701.svg'; // 默认危险信息
        if (item.m.a) {
            imageSrc = '../../../images/road/warningInfo/' + item.m.a + '.svg';
        }
        this.properties.markerStyle.icon.push(
            fastmap.uikit.canvasFeature.Feature.getIconStyle({
                iconName: imageSrc,
                row: 0,
                column: 1,
                location: this.geometry.coordinates
            }
            )
        );
    }
});

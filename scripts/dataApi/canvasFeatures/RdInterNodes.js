fastmap.uikit.canvasFeature.RdInterNodes = fastmap.uikit.canvasFeature.Feature.extend({
    geometry: {},
    properties: {},
    setAttribute: function (data, id) {
        this.geometry.coordinates = data.g;
        this.geometry.type = 'Point';
        this.properties.featType = 'RDINTER';
        this.properties.nodeId = data.i;
        this.properties.id = id;

        this.properties.style = {};
        this.properties.style.strokeColor = 'green';
        this.properties.style.strokeWidth = 1;
        this.properties.style.strokeOpacity = 1;
        this.properties.style.radius = 3;
        this.properties.style.fillColor = 'green';
        this.properties.style.fillOpacity = 0.2;

        this.properties.markerStyle = {};
        this.properties.markerStyle.icon = [];
        this.properties.markerStyle.icon.push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: '../../../images/road/crf/11.png',
                row: 0,
                column: 1,
                location: this.geometry.coordinates
            })
        );
    }
});

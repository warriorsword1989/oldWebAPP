fastmap.uikit.canvasFeature.ZoneNode = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function (data) {
        this.properties.featType = 'ZONENODE';
        this.geometry.type = 'Point';
        this.properties.markerStyle = {};
        this.properties.style.strokeColor = '#00A600';
        this.properties.style.strokeWidth = 1;
        this.properties.style.strokeOpacity = 1;
        this.properties.style.radius = 2;
        this.properties.style.fillColor = '#00A600';
        this.properties.style.fillOpacity = 0.2;
    }
});

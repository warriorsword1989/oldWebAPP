/**
 * Created by linglong on 2016/7/25.
 */
fastmap.uikit.canvasFeature.LCNode = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function (data) {
        this.properties.featType = 'LCNODE';
        this.geometry.type = 'Point';
        this.properties.markerStyle = {};
        this.properties.style.strokeColor = '#483D8B';
        this.properties.style.strokeWidth = 1;
        this.properties.style.strokeOpacity = 1;
        this.properties.style.radius = 2;
        this.properties.style.fillColor = '#483D8B';
        this.properties.style.fillOpacity = 0.2;
    }
});

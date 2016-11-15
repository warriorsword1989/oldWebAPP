/**
 * Created by linglong on 2016/7/25.
 */
fastmap.uikit.canvasFeature.LCFace = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function (item) {
        var color = '';
        this.properties.featType = 'LCFACE';
        this.geometry.type = 'Polygon';
        if (Number(this.properties.id).toString(16).length > 6) {
            color = Number(this.properties.id).toString(16).substring(Number(this.properties.id).toString(16).length - 4);
        } else {
            color = Number(this.properties.id).toString(16);
        }
        this.properties.style = {
            fillColor: '#f90',
            fillOpacity: 0.3,
            strokeColor: '#8B3A3A',
            strokeWidth: 1,
            backgroundImage: ''
        };
    }
});

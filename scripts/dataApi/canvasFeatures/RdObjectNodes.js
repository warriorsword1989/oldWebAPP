/**
 * Created by liuyang on 2016/8/24.
 */
fastmap.uikit.canvasFeature.RdObjectNodes = fastmap.uikit.canvasFeature.Feature.extend({
    geometry: {},
    properties: {},
    setAttribute: function (data, id) {
        this.geometry.coordinates = data.g;
        this.geometry.type = 'Point';
        this.properties.featType = 'RDOBJECT';
        this.properties.nodeId = data.i;
        this.properties.id = id;

        this.properties.style = {};
        this.properties.style.strokeColor = 'blue';
        this.properties.style.strokeWidth = 1;
        this.properties.style.strokeOpacity = 1;
        this.properties.style.radius = 1;
        this.properties.style.fillColor = 'blue';
        this.properties.style.fillOpacity = 0.2;

        this.properties.markerStyle = {};
        this.properties.markerStyle.icon = [];
        this.properties.markerStyle.icon.push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: '../../../images/road/crf/13.png',
                row: 0,
                column: 1,
                location: this.geometry.coordinates
            })
        );
    }
});

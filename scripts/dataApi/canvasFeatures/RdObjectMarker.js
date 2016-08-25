/**
 * Created by liuyang on 2016/8/24.
 */
fastmap.uikit.canvasFeature.RdObjectMarker = fastmap.uikit.canvasFeature.Feature.extend({
	geometry: {},
    properties: {},
    setAttribute: function(data,id) {
        this.geometry['coordinates'] = data;
        this.geometry['type'] = 'Point';
        this.properties["featType"] = "RDOBJECT";
        this.properties['id'] = id;

        this.properties['style'] = {};
        this.properties['style']['strokeColor'] = 'red';
        this.properties['style']['strokeWidth'] = 1;
        this.properties['style']['strokeOpacity'] = 1;
        this.properties['style']['radius'] = 1;
        this.properties['style']['fillColor'] = 'red';
        this.properties['style']['fillOpacity'] = 0.2;

        this.properties['markerStyle'] = {};
        this.properties['markerStyle']["icon"] = [];
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: '../../../images/road/crf/12.png',
                row: 0,
                column: 1,
                location: this.geometry['coordinates']
            })
        );
    }
});
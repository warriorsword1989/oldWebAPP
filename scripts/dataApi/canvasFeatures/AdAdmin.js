fastmap.uikit.canvasFeature.AdAdmin = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(item) {
        this.geometry['type'] = 'Point';
        this.properties["featType"] = "ADADMIN";
        this.properties['markerStyle'] = {};
        this.properties['markerStyle']["icon"] = [];
        this.properties['kind'] = item.m.c;
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasFeature.Feature.getIconStyle({
                iconName: '../../../images/road/img/star.svg',
                row: 0,
                column: 1,
                location: this.geometry['coordinates']

            })
        );
    }
});
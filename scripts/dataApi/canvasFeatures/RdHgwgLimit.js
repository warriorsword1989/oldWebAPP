fastmap.uikit.canvasFeature.RdHgwgLimit = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(item) {
        this.geometry['type'] = 'Point';
        this.properties['markerStyle'] = {};
        this.properties['markerStyle']["icon"] = [];
        this.properties["featType"] = "RDHGWGLIMIT";
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasFeature.Feature.getIconStyle({
                    iconName: '../../../images/road/hgwgLimit/0.svg',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates']
                }
            )
        );
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasFeature.Feature.getIconStyle({
                    iconName: '../../../images/road/1101/1101_0_0_s.svg',
                    row: 0,
                    column: 1,
                    location:  this.geometry['coordinates'],
                    rotate: (item.m.c - 90) * (Math.PI / 180),
                    dx: 6,
                    dy: 0
                }
            )
        );
    }
});
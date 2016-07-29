fastmap.uikit.canvasFeature.RdGate = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(item) {
        this.geometry['type'] = 'Point';
        this.properties['markerStyle'] = {};
        this.properties['markerStyle']["icon"] = [];
        this.properties["featType"] = "RDSLOPE";
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: '../../../images/road/rdGate/' + parseInt(item.m.a) + '.svg',
                row: 0,
                column: 1,
                location: this.geometry['coordinates'],
                rotate: (item.m.b - 180) * (Math.PI / 180)
            })
        );
    }
});
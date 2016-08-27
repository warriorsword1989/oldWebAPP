fastmap.uikit.canvasFeature.RdGate = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(item) {
        this.geometry['type'] = 'Point';
        this.properties['markerStyle'] = {};
        this.properties['markerStyle']["icon"] = [];
        this.properties["featType"] = "RDGATE";
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: item.m.b == 1?'../../../images/road/rdGate/' + parseInt(item.m.a) + '_1.svg':'../../../images/road/rdGate/' + parseInt(item.m.a) + '_1.svg',
                row: 0,
                column: 1,
                location: this.geometry['coordinates']
            })
        );
    }
});

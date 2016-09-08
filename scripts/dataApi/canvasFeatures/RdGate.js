fastmap.uikit.canvasFeature.RdGate = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(item) {
        this.geometry['type'] = 'Point';
        this.properties['markerStyle'] = {};
        this.properties['markerStyle']["icon"] = [];
        this.properties["featType"] = "RDGATE";
        if(item.m.b != "0"){ //b=0是未调查，错误数据
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasTips.Tips.getIconStyle({
                    iconName: '../../../images/road/rdGate/' + parseInt(item.m.a) + '_' + parseInt(item.m.b) + '.svg',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates']
                })
            );
        }
    }
});

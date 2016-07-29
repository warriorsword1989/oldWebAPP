fastmap.uikit.canvasFeature.RdWarningInfo = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(item) {
        this.geometry['type'] = 'Point';
        this.properties['markerStyle'] = {};
        this.properties['markerStyle']["icon"] = [];
        this.properties["featType"] = "RDWARNINGINFO";
        if(item.m.a){
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasFeature.Feature.getIconStyle({
                        iconName: '../../../images/road/warningInfo/'+item.m.a+'.svg',
                        row: 0,
                        column: 1,
                        location: this.geometry['coordinates']
                    }
                )
            );
        }
    }
});
fastmap.uikit.canvasFeature.poiMarker = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(data) {
        this.geometry['type'] = 'Point';
        this.properties["featType"] = "poi";
        this.properties['markerStyle'] = {};
        this.properties['markerStyle']["icon"] = [];
        this.properties['guide'] = data.m.c;
        if(data.m.b == 1){
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasFeature.Feature.getIconStyle({
                    iconName: '../../../images/poi/map/red_10.png',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates']
                })
            );
        }else if(data.m.b == 2){
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasFeature.Feature.getIconStyle({
                    iconName: '../../../images/poi/map/blue_10.png',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates']
                })
            );
        }else if(data.m.b == 3){
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasFeature.Feature.getIconStyle({
                    iconName: '../../../images/poi/map/gray_10.png',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates']
                })
            );
        }
    }
});
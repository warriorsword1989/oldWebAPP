fastmap.uikit.canvasFeature.IXPOI = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(data) {
        this.geometry['type'] = 'Point';
        this.properties["featType"] = "IXPOI";
        this.properties['markerStyle'] = {};
        this.properties['markerStyle']["icon"] = [];
        this.properties['guide'] = data.m.c;
        this.properties['kindCode'] = data.m.d;
        this.properties['name'] = data.m.e;
        this.redFill = {
            lineColor: '#FF0000',
            fillColor: 'rgba(225,225,225,0.5)',
            fillType :'IXPOI'
        };
        this.blueFill = {
            lineColor: '#0000FF',
            fillColor: 'rgba(225,225,225,0.5)',
            fillType :'IXPOI'
        };
        this.grayFill = {
            lineColor: '#999999',
            fillColor: 'rgba(225,225,225,0.5)',
            fillType :'IXPOI'
        };
        var poiColor = this.redFill;
        if(data.m.b == 1){
            poiColor = this.redFill;
        }else if(data.m.b == 2){
            poiColor = this.blueFill;
        }else if(data.m.b == 3){
            poiColor = this.grayFill;
        }
        if(data.m.a == 1){
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasFeature.Feature.getIconStyle({
                    iconName: '../../../images/poi/map/poi_p.bmp',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates']
                    // fillStyle:poiColor
                })
            );
        }else if(data.m.a == 2){
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasFeature.Feature.getIconStyle({
                    iconName: '../../../images/poi/map/poi_c.bmp',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates']
                    // fillStyle:poiColor
                })
            );
        }else if(data.m.a == 3){
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasFeature.Feature.getIconStyle({
                    iconName: '../../../images/poi/map/poi_pc.bmp',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates']
                    // fillStyle:poiColor
                })
            );
        }else {
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasFeature.Feature.getIconStyle({
                    iconName: '../../../images/poi/map/poi_n.bmp',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates']
                    // fillStyle:poiColor
                })
            );
        }
    }
});
fastmap.uikit.canvasFeature.RdCross = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(item) {
        this.geometry['type'] = 'Point';
        this.properties['markerStyle'] = {};
        this.properties["featType"] = "RDCROSS";
        this.properties['markerStyle']["icon"] = [];
        for (var crossNum = 0, crossLen = this.geometry['coordinates'].length; crossNum < crossLen; crossNum++) {
            var crossObj = {};
            if (crossNum === 0) {
                crossObj = fastmap.uikit.canvasFeature.Feature.getIconStyle({
                        iconName: '../../../images/road/rdcross/11.png',
                        row: 0,
                        column: 1,
                        location: this.geometry['coordinates'][crossNum]
                    }
                )
            } else {
                crossObj = fastmap.uikit.canvasFeature.Feature.getIconStyle({
                    iconName: '../../../images/road/rdcross/111.png',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates'][crossNum]

                })
            }
            this.properties['markerStyle']["icon"].push(crossObj);
        }
    }
});
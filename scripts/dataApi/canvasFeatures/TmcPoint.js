fastmap.uikit.canvasFeature.TmcPoint = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(item) {
        this.properties["featType"] = "TMCPOINT";
        this.geometry['type'] = 'Point';
        this.properties['markerStyle'] = {};
        /*this.properties['style']['strokeColor'] = 'black';
        this.properties['style']['strokeWidth'] = 1;
        this.properties['style']['strokeOpacity'] = 1;
        this.properties['style']['radius'] = 2;
        this.properties['style']['fillColor'] = '#272727';
        this.properties['style']['fillOpacity'] = 0.2;*/
        this.geometry['coordinates'] = item.g;
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasFeature.Feature.getIconStyle({
                iconName: '../../../images/road/tmc/tmc.png',
                row: 0,
                column: 1,
                location: this.geometry['coordinates']
            })
        );
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasFeature.Feature.getIconStyle({
                    text: item.m.a + ' ' + item.m.b,
                    row: 0,
                    column: 3,
                    location: this.geometry['coordinates'],
                    dx: 16,
                    dy: 7
                }
            )
        );
        console.log(item)
    }
});
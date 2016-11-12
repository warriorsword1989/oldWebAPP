fastmap.uikit.canvasFeature.TmcLocation = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function (item) {
        var locDirectObj = {
            1: '+',
            2: '-',
            3: 'P',
            4: 'N'
        };
        var directObj = {
            1: 'T',
            2: 'F'
        };
        this.properties.featType = 'RDTMCLOCATION';
        this.geometry.type = 'Point';
        this.properties.markerStyle = {};
        this.properties.markerStyle.icon = [];
        this.geometry.coordinates = item.g;
        this.properties['id'] = item.m.i;
        /*this.properties.markerStyle.icon.push(
            fastmap.uikit.canvasFeature.Feature.getIconStyle({
                iconName: '../../../images/road/tmc/tmc.png',
                row: 0,
                column: 1,
                location: this.geometry.coordinates
            })
        );*/
        this.properties['forwardtext'] = item.m.b + locDirectObj[item.m.c] + item.m.d + directObj[item.m.e];
        this.properties['forwarddirect'] = item.m.c;
        this.properties['color'] = '#2196F3';
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasFeature.Feature.getIconStyle({
                row: 0,
                column: 1,
                color: '#2196F3'
            })
        );
        /*this.properties['reversetext'] = item.m.b + locDirectObj[item.m.c] + item.m.d + directObj[item.m.e];
        this.properties['reversedirect'] = item.m.c;
        this.properties['color'] = '#2196F3';
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasFeature.Feature.getIconStyle({
                row: 0,
                column: 1,
                color: '#2196F3'
            })
        );*/
        /*this.properties.markerStyle.icon.push(
            fastmap.uikit.canvasFeature.Feature.getIconStyle({
                text: item.m.b + locDirectObj[item.m.c] + item.m.d + directObj[item.m.e],
                row: 0,
                column: 3,
                location: this.geometry.coordinates,
                dx: 16,
                dy: 7
            })
        );*/
    }
});
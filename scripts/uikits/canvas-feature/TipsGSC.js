fastmap.uikit.canvasTips.TipsGSC = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item) {
        this.geometry['coordinates'] = item.g;
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: '../../../images/road/tips/overpass/overpass.svg',
                row: 0,
                column: 1,
                location: this.geometry['coordinates']

            })
        );
        for (var num = 0; num < item.m.c.length; num++) {
            var overPassObj = {};
            overPassObj['geometry'] = {};
            overPassObj['geometry']['type'] = 'LineString';
            overPassObj['geometry']['coordinates'] = [];
            //for (var i = 0, len = item.m.c[num].g.length; i < len; i = i + 1) {
            overPassObj['geometry']['coordinates'] = item.m.c[num].g;
            //}
            overPassObj['properties'] = {
                'id': item.i,
                'featType': item.t
            }
            if (item.m.c[num].s === 1) {
                overPassObj['properties']['style'] = {
                    'strokeColor': '#E36C0A',
                    'strokeWidth': 2,
                    'strokeOpacity': 0.8
                };
            } else {
                overPassObj['properties']['style'] = {
                    'strokeColor': 'red',
                    'strokeWidth': 2,
                    'strokeOpacity': 0.8
                };
            }
            this.featArr.push(overPassObj);
        }
    }
});
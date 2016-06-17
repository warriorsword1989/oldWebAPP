fastmap.uikit.canvasTips.TipsLink = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item) {
        this.geometry['coordinates'] = item.m.c;
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: '../../../images/road/tips/2001/0.svg',
                row: 0,
                column: 1,
                location: this.geometry['coordinates'],
                scalex: 0.7,
                scaley: 0.7
            })
        );
        var sidingObj = {};
        sidingObj['geometry'] = {};
        sidingObj['geometry']['coordinates'] = item.g;
        sidingObj['properties'] = {};
        sidingObj['properties']['style'] = {};
        sidingObj['properties']['id'] = item.i;
        sidingObj['properties']["featType"] = item.t;
        sidingObj['geometry']['type'] = "LineString";

        sidingObj['properties']['style'] = {
            'strokeColor': '#000000',
            'strokeWidth': 2,
            'strokeOpacity': 0.8
        };
        this.featArr.push(sidingObj);
    }
});
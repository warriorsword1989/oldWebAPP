fastmap.uikit.canvasTips.TipsBridge = fastmap.uikit.canvasTips.Tips.extend({
    geometry: {},
    properties: {},
    setAttribute: function (item,i) {
        this.properties['markerStyle'] = {};
        this.properties['markerStyle']["icon"] = [];
        this.properties['id'] = item.i;
        this.geometry['type'] = 'Point';
        this.geometry['coordinates'] = [];
        this.properties["featType"] = item.t;
        this.properties['status'] = item.m.a;
        if (i == 0) {
            this.geometry['coordinates'] = item.m.c;
        } else {
            this.geometry['coordinates'] = item.m.d;
        }
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: '../../../images/road/tips/1510/0.svg',
                row: 0,
                column: 1,
                location: this.geometry['coordinates']
            })
        );

        /*        var bridgeObj = {};
         bridgeObj['geometry'] = {};
         bridgeObj['geometry']['coordinates'] = item.g;
         bridgeObj['properties'] = {};
         bridgeObj['properties']['style'] = {};
         bridgeObj['properties']['id'] = item.i;
         bridgeObj['properties']["featType"] = item.t;
         bridgeObj['geometry']['type'] = "LineString";

         bridgeObj['properties']['style'] = {
         'strokeColor': '#336C0A',
         'strokeWidth': 2,
         'strokeOpacity': 0.8
         };
         featArr.push(bridgeObj);*/
    }
});
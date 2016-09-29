fastmap.uikit.canvasTips.TipsRoadNamePart = fastmap.uikit.canvasTips.Tips.extend({
    geometry:null,
    properties:null,
    setAttribute: function (item) {
        this.geometry['coordinates'] = item.m.c;
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: '../../../images/road/tips/1901/0.svg',
                row: 0,
                column: 1,
                location: this.geometry['coordinates'],
                scalex: 1,
                scaley: 1,
                fillStyle:item.m.a == "0"?this.redFill:this.blueFill
            })
        );
    }
});
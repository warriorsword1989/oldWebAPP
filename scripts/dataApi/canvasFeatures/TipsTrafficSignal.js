fastmap.uikit.canvasTips.TipsTrafficSignal = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item) {
        this.geometry['coordinates'] = item.g;
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: '../../../images/road/tips/1102/1102_'+item.m.c+'_0.svg',
                row: 0,
                column: 1,
                location: this.geometry['coordinates'],
                scalex: 0.7,
                scaley: 0.7,
                fillStyle:item.m.a == "0"?this.redFill:this.blueFill
            })
        );
    }
});
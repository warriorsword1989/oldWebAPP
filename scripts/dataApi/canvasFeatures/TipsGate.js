fastmap.uikit.canvasTips.TipsGate = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item) {
        this.geometry['coordinates'] = item.g;
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: item.m.e == 1?'../../../images/road/tips/1104/1104_'+item.m.d+'_1.svg':'../../../images/road/tips/1104/1104_'+item.m.d+'_2.svg',
                row: 0,
                column: 1,
                location: this.geometry['coordinates'],
                scalex: 1,
                scaley: 1,
                rotate: (item.m.c) * (Math.PI / 180),
                fillStyle:item.m.a == "0"?this.redFill:this.blueFill
            })
        );
    }
});

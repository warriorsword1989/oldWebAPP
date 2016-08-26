fastmap.uikit.canvasTips.TipsBanTrucksIn = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item) {
        this.geometry.coordinates = item.g;
        this.properties.markerStyle.icon.push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: item.m.d?'../../../images/road/tips/1308/1308_1_0.svg':'../../../images/road/tips/1308/1308_0_0.svg',
                row: 0,
                column: 1,
                location: this.geometry.coordinates,
                rotate: (item.m.c-180) * (Math.PI / 180),
                fillStyle:item.m.a == "0"?this.redFill:this.blueFill
            })
        );
    }
});

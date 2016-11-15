fastmap.uikit.canvasTips.TipsSpeedBump = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item) {
        this.geometry.coordinates = item.g;
        this.properties.markerStyle.icon.push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: item.m.e == 1 ? '../../../images/road/tips/1108/1108_2_0.svg' : '../../../images/road/tips/1108/1108_1_0.svg',
                row: 0,
                column: 1,
                location: this.geometry.coordinates,
                scalex: 1,
                scaley: 1,
                rotate: (item.m.c) * (Math.PI / 180),
                fillStyle: item.m.a == '0' ? this.redFill : this.blueFill
            })
        );
    }
});

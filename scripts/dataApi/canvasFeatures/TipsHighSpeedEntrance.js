fastmap.uikit.canvasTips.TipsHighSpeedEntrance = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item) {
        this.geometry.coordinates = item.g;
        this.properties.markerStyle.icon.push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: '../../../images/road/tips/1410/1410_0_0.svg',
                row: 0,
                column: 1,
                location: this.geometry.coordinates,
                scalex: 1,
                scaley: 1,
                rotate: (item.m.c - 180) * (Math.PI / 180),
                fillStyle: item.m.a == '0' ? this.redFill : this.blueFill
            })
        );
        this.properties.markerStyle.icon.push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: '../../../images/road/tips/1111/1111_0_0.svg',
                row: 0,
                column: 1,
                location: this.geometry.coordinates,
                rotate: (item.m.c - 90) * (Math.PI / 180),
                dx: ('0' === '1' ? -36 : 6), // 解除限速时，要使箭头冲着自己
                dy: 0
            }
            )
        );
    }
});

fastmap.uikit.canvasTips.TipsRamp = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item) {
        this.geometry.coordinates = item.g;
        this.properties.markerStyle.icon.push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: '../../../images/road/tips/1207/1207_0_0.svg',
                row: 0,
                column: 1,
                location: this.geometry.coordinates,
                scalex: 1,
                scaley: 1,
                fillStyle: item.m.a == '0' ? this.redFill : this.blueFill
            })
        );
    }
});

fastmap.uikit.canvasTips.TipsRoadPA = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item) {
        this.geometry.coordinates = item.g;
        this.properties.markerStyle.icon.push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: '../../../images/road/tips/1206/1206_0_0.svg',
                row: 0,
                column: 1,
                location: this.geometry.coordinates,
                fillStyle: item.m.a == '0' ? this.redFill : this.blueFill
            })
        );
    }
});

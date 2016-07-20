fastmap.uikit.canvasTips.TipsPavementCover = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item) {
        this.geometry['coordinates'] = item.g;
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: '../../../images/road/tips/1502/1502_1_0.svg',
                row: 0,
                column: 1,
                location: this.geometry['coordinates'],
                fillStyle:item.m.a == "0"?this.redFill:this.blueFill
            })
        );
    }
});
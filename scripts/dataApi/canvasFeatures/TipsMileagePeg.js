fastmap.uikit.canvasTips.TipsMileagePeg = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item) {
        this.geometry['coordinates'] = item.g;
        this.properties['rotate'] = item.m.c;
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: '../../../images/road/tips/1107/0.svg',
                rotate: (item.m.c) * (Math.PI / 180),
                row: 0,
                column: 1,
                location: this.geometry['coordinates'],
                fillStyle:item.m.a == "0"?this.redFill:this.blueFill
            })
        );
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                    text: item.m.d,
                    row: 0,
                    column: 3,
                    location: this.geometry['coordinates'],
                    rotate: (item.m.c) * (Math.PI / 180),
                    dx: 16,
                    dy: 7
                }
            )
        );

    }
});

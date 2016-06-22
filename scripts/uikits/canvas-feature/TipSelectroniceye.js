fastmap.uikit.canvasTips.TipSelectroniceye = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item) {
        this.geometry['coordinates'] = item.g;
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: '../../../images/road/tips/1109/0.svg',
                rotate: (item.m.c - 90) * (Math.PI / 180),
                row: 0,
                column: 1,
                location: this.geometry['coordinates']
            })
        );
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                text: item.m.d,
                row: 0,
                column: 1,
                location: this.geometry['coordinates'],
                rotate: (item.m.c) * (Math.PI / 180),
                dx: 0,
                dy: -14
            }
            )
        );
    }
});
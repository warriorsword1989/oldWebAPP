fastmap.uikit.canvasTips.TipsTollGate = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item) {
        this.geometry['coordinates'] = item.g;
        this.properties['rotate'] = item.m.c;
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: '../../../images/road/tips/1107/0.svg',
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
                    column: 3,
                    location: this.geometry['coordinates'],
                    rotate: (item.m.c - 90) * (Math.PI / 180),
                    dx: 22,
                    dy: 7
                }
            )
        );
    }
});
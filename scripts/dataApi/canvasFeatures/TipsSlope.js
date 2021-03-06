fastmap.uikit.canvasTips.TipsSlope = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item) {
        this.geometry.coordinates = item.g;
        switch (item.m.c) {
            case 0:
                this.properties.markerStyle.icon.push(
                    fastmap.uikit.canvasTips.Tips.getIconStyle({
                        iconName: '../../../images/road/tips/1106/1106_0_0.svg',
                        row: 0,
                        column: 1,
                        location: this.geometry.coordinates,
                        scalex: 1,
                        scaley: 1,
                        fillStyle: item.m.a == '0' ? this.redFill : this.blueFill
                    })
                );
                break;
            case 1:
                this.properties.markerStyle.icon.push(
                    fastmap.uikit.canvasTips.Tips.getIconStyle({
                        iconName: '../../../images/road/tips/1106/1106_1_0.svg',
                        row: 0,
                        column: 1,
                        location: this.geometry.coordinates,
                        scalex: 1,
                        scaley: 1,
                        fillStyle: item.m.a == '0' ? this.redFill : this.blueFill
                    })
                );
                break;
            case 2:
                this.properties.markerStyle.icon.push(
                    fastmap.uikit.canvasTips.Tips.getIconStyle({
                        iconName: '../../../images/road/tips/1106/1106_2_0.svg',
                        row: 0,
                        column: 1,
                        location: this.geometry.coordinates,
                        scalex: 1,
                        scaley: 1,
                        fillStyle: item.m.a == '0' ? this.redFill : this.blueFill
                    })
                );
                break;
            case 3:
                this.properties.markerStyle.icon.push(
                    fastmap.uikit.canvasTips.Tips.getIconStyle({
                        iconName: '../../../images/road/tips/1106/1106_3_0.svg',
                        row: 0,
                        column: 1,
                        location: this.geometry.coordinates,
                        scalex: 1,
                        scaley: 1,
                        fillStyle: item.m.a == '0' ? this.redFill : this.blueFill
                    })
                );
                break;
        }
    }
});

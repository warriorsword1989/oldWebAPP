fastmap.uikit.canvasTips.TipsWarningInfo = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item, num) {
        this.geometry.coordinates = [item.g[0], item.g[1] - num * 30];
        if (num == 0) {
            this.properties.markerStyle.icon.push(
                fastmap.uikit.canvasTips.Tips.getIconStyle({
                    iconName: '../../../images/road/tips/1105/1105_' + item.m.d.split('|')[num] + '_0.svg',
                    row: 0,
                    column: 0,
                    location: [item.g[0], item.g[1] - num * 30],
                    rotate: (item.m.c) * (Math.PI / 180),
                    dx: 0,
                    dy: 0,
                    fillStyle: item.m.a == '0' ? this.redFill : this.blueFill
                })
            );
            this.properties.markerStyle.icon.push(
                fastmap.uikit.canvasTips.Tips.getIconStyle({
                    iconName: '../../../images/road/tips/1111/1111_0_0.svg',
                    row: 0,
                    column: 1,
                    location: [item.g[0], item.g[1] - num * 30],
                    rotate: (item.m.c - 90) * (Math.PI / 180),
                    dx: ('0' === '1' ? -36 : 6), // 解除限速时，要使箭头冲着自己
                    dy: 0
                }
                )
            );
        } else {
            this.properties.markerStyle.icon.push(
                fastmap.uikit.canvasTips.Tips.getIconStyle({
                    iconName: '../../../images/road/tips/1105/1105_' + item.m.d.split('|')[num] + '_0.svg',
                    row: 0,
                    column: num,
                    location: [item.g[0], item.g[1] - num * 30],
                    rotate: (item.m.c) * (Math.PI / 180),
                    dx: 0,
                    dy: 0,
                    fillStyle: item.m.a == '0' ? this.redFill : this.blueFill
                })
            );
            this.properties.markerStyle.icon.push(
                fastmap.uikit.canvasTips.Tips.getIconStyle({
                    iconName: '../../../images/road/tips/1111/1111_0_0.svg',
                    row: 0,
                    column: 1,
                    location: [item.g[0], item.g[1] - num * 30],
                    rotate: (item.m.c - 90) * (Math.PI / 180),
                    dx: 6, // 解除限速时，要使箭头冲着自己
                    dy: 0
                }
                )
            );
        }
    }
});

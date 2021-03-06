fastmap.uikit.canvasTips.TipsRepair = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item, i) {
        this.properties.markerStyle = {};
        this.properties.markerStyle.icon = [];
        this.properties.id = item.i;
        this.geometry.type = 'Point';
        this.geometry.coordinates = [];
        this.properties.featType = item.t;
        this.properties.status = item.m.a;
        if (i == 0) {
            this.geometry.coordinates = item.m.c;
        } else {
            this.geometry.coordinates = item.m.d;
        }
        this.properties.markerStyle.icon.push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: '../../../images/road/tips/1515/1515_0_0.svg',
                row: 0,
                column: 1,
                location: this.geometry.coordinates,
                fillStyle: item.m.a == '0' ? this.redFill : this.blueFill
            })
        );
    }
});

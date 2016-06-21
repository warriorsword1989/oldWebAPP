fastmap.uikit.canvasTips.TipsRoadCrossProm = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item) {
        this.geometry['coordinates'] = item.g;
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: '../../../images/road/tips/1703/0.svg',
                row: 0,
                column: 1,
                location: this.geometry['coordinates']
            })
        );
    }
});
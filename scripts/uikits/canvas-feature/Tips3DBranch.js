fastmap.uikit.canvasTips.Tips3DBranch = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item) {
        this.geometry['coordinates'] = item.g;
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: '../../../images/road/tips/1403/0.svg',
                row: 0,
                column: 1,
                location: this.geometry['coordinates']
            })
        );
    }
});
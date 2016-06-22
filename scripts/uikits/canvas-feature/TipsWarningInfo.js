fastmap.uikit.canvasTips.TipsWarningInfo = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item) {
        this.geometry['coordinates'] = item.g;
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: '../../../images/road/tips/1105/1105_'+item.m.d+"_0.svg",
                row: 0,
                column: 1,
                location: this.geometry['coordinates']
            })
        );
    }
});
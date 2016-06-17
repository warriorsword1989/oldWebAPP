fastmap.uikit.canvasTips.TipsRoadTypes = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function(item) {
        this.geometry['coordinates'] = item.g;
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: '../../../images/road/tips/kind/K' + item.m.c + '.svg',
                row: 0,
                column: 1,
                location: this.geometry['coordinates']
            })
        );
    }
});
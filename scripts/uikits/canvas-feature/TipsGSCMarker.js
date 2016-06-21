fastmap.uikit.canvasTips.TipsGSCMarker = fastmap.uikit.canvasTips.Tips.extend({
    geometry:null,
    properties:null,
    setAttribute: function (item) {
        this.geometry['coordinates'] = item.g;
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                iconName: '../../../images/road/tips/overpass/overpass.svg',
                row: 0,
                column: 1,
                location: this.geometry['coordinates']

            })
        );
    }
});
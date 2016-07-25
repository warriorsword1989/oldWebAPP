fastmap.uikit.canvasFeature.RdElectronicEye = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(item) {
        this.geometry['type'] = 'Point';
        this.properties['markerStyle'] = {};
        this.properties['markerStyle']["icon"] = [];
        this.properties["featType"] = "RDELECTRONICEYE";
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasFeature.Feature.getIconStyle({
                    iconName: '../../../images/road/rdElectronic/0.svg',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates'],
                    rotate: (item.m.b - 180) * (Math.PI / 180)
                }
            )
        );
        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                    iconName: '../../../images/road/rdElectronic/arrow.svg',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates'],
                    rotate: (item.m.b - 90) * (Math.PI / 180),
                    dx: ("0" == "1" ? -36 : 6),//解除限速时，要使箭头冲着自己
                    dy: 0
                }
            )
        );
    }
});
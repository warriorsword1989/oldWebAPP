fastmap.uikit.canvasTips.TipsSketch = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item) {
        this.geometry['coordinates'] = item.g;
        if(item.m.a == "0"){
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasTips.Tips.getIconStyle({
                    iconName: '../../../images/road/tips/1806/1806_0_0.svg',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates'],
                    fillStyle:this.redFill
                })
            );
        }else {
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasTips.Tips.getIconStyle({
                    iconName: '../../../images/road/tips/1806/1806_0_0.svg',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates'],
                    fillStyle:this.greenFill
                })
            );
        }
    }
});
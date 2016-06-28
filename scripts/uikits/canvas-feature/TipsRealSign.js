fastmap.uikit.canvasTips.TipsRealSign = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item) {
        this.geometry['coordinates'] = item.g;
        if(item.m.a == "0"){
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasTips.Tips.getIconStyle({
                    iconName: '../../../images/road/tips/1402/1402_0_0.svg',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates'],
                    fillStyle:this.redFill
                })
            );
        }else {
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasTips.Tips.getIconStyle({
                    iconName: '../../../images/road/tips/1402/1402_0_0.svg',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates'],
                    fillStyle:this.greenFill
                })
            );
        }
    }
});
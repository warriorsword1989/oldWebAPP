fastmap.uikit.canvasTips.TipsOrientation = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item) {
        this.geometry['coordinates'] = item.g;
        if(item.m.a == "0"){
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasTips.Tips.getIconStyle({
                    iconName: '../../../images/road/tips/1401/1401_0_0.svg',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates'],
                    fillStyle:this.redFill,
                    scalex:5,
                    scaley:5
                })
            );
        } else {
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasTips.Tips.getIconStyle({
                    iconName: '../../../images/road/tips/1401/1401_0_0.svg',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates'],
                    fillStyle:this.greenFill,
                    scalex:5,
                    scaley:5
                })
            );
        }
    }
});
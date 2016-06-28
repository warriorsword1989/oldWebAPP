fastmap.uikit.canvasTips.TipsLaneConnexity = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function(item) {
        this.geometry['coordinates'] = item.g;
        if(item.m.a == "0"){
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasTips.Tips.getIconStyle({
                    iconName: '../../../images/road/tips/1301/0.svg',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates'],
                    scalex: 0.7,
                    scaley: 0.7,
                    fillStyle:this.redFill
                })
            );
        }else {
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasTips.Tips.getIconStyle({
                    iconName: '../../../images/road/tips/1301/0.svg',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates'],
                    scalex: 0.7,
                    scaley: 0.7,
                    fillStyle:this.greenFill
                })
            );
        }

    }
});
fastmap.uikit.canvasTips.TipsLink = fastmap.uikit.canvasTips.Tips.extend({
    geometry:null,
    properties:null,
    setAttribute: function (item) {
        this.geometry['coordinates'] = item.m.c;
        if(item.m.a == "0"){
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasTips.Tips.getIconStyle({
                    iconName: '../../../images/road/tips/2001/0.svg',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates'],
                    scalex: 0.7,
                    scaley: 0.7,
                    fillStyle:this.redFill
                })
            );
        } else {
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasTips.Tips.getIconStyle({
                    iconName: '../../../images/road/tips/2001/0.svg',
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
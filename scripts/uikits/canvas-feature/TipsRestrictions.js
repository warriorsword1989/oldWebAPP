fastmap.uikit.canvasTips.TipsRestrictions = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function(item) {
        this.geometry['coordinates'] = item.g;
        this.properties['rotate'] = item.m.c;
        if(item.m.a == "0"){
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasTips.Tips.getIconStyle({
                    iconName: '../../../images/road/tips/1101/0.svg',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates'],
                    fillStyle:this.redFill
                })
            );
        }else {
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasTips.Tips.getIconStyle({
                    iconName: '../../../images/road/tips/1101/0.svg',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates'],
                    fillStyle:this.greenFill
                })
            );
        }

        this.properties['markerStyle']["icon"].push(
            fastmap.uikit.canvasTips.Tips.getIconStyle({
                    iconName: '../../../images/road/1101/1101_1_1_s.svg',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates'],
                    rotate: (item.m.c - 90) * (Math.PI / 180),
                    dx: ("0" == "1" ? -36 : 6),//解除限速时，要使箭头冲着自己
                    dy: 0
                }
            )
        );
    }
});
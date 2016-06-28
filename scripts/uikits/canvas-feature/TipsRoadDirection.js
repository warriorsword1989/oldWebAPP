fastmap.uikit.canvasTips.TipsRoadDirection = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item) {
        this.geometry['coordinates'] = item.g;
        //obj['properties']['rotate'] = item.m.c;
        if (item.m.d == 1) {
            if(item.m.a == "0"){
                this.properties['markerStyle']["icon"].push(
                    fastmap.uikit.canvasTips.Tips.getIconStyle({
                        iconName: '../../../images/road/tips/road/1.svg',
                        row: 0,
                        rotate: (item.m.c ) * (Math.PI / 180),
                        column: 1,
                        location: this.geometry['coordinates'],
                        fillStyle:this.redFill
                    })
                );
            }else {
                this.properties['markerStyle']["icon"].push(
                    fastmap.uikit.canvasTips.Tips.getIconStyle({
                        iconName: '../../../images/road/tips/road/1.svg',
                        row: 0,
                        rotate: (item.m.c ) * (Math.PI / 180),
                        column: 1,
                        location: this.geometry['coordinates'],
                        fillStyle:this.greenFill
                    })
                );
            }
        } else {
            if(item.m.a == "0"){
                this.properties['markerStyle']["icon"].push(
                    fastmap.uikit.canvasTips.Tips.getIconStyle({
                        iconName: '../../../images/road/tips/road/2.svg',
                        row: 0,
                        rotate: (item.m.c) * (Math.PI / 180),
                        column: 1,
                        location: this.geometry['coordinates'],
                        fillStyle:this.redFill
                    })
                );
            } else {
                this.properties['markerStyle']["icon"].push(
                    fastmap.uikit.canvasTips.Tips.getIconStyle({
                        iconName: '../../../images/road/tips/road/2.svg',
                        row: 0,
                        rotate: (item.m.c) * (Math.PI / 180),
                        column: 1,
                        location: this.geometry['coordinates'],
                        fillStyle:this.greenFill
                    })
                );
            }
        }
    }
});
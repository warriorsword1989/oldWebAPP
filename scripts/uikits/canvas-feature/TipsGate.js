fastmap.uikit.canvasTips.TipsGate = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item) {
        this.geometry['coordinates'] = item.g;
        switch(item.m.d){
            case 0:
                this.properties['markerStyle']["icon"].push(
                    fastmap.uikit.canvasTips.Tips.getIconStyle({
                        iconName: item.m.e == 1?'../../../images/road/tips/1104/1104_0_1.svg':'../../../images/road/tips/1104/1104_0_2.svg',
                        row: 0,
                        column: 1,
                        location: this.geometry['coordinates'],
                        scalex: 0.7,
                        scaley: 0.7,
                        fillStyle: item.m.a == "0"?this.redFill:this.greenFill
                    })
                );
                break;
            case 1:
                this.properties['markerStyle']["icon"].push(
                    fastmap.uikit.canvasTips.Tips.getIconStyle({
                        iconName: item.m.e == 1?'../../../images/road/tips/1104/1104_1_1.svg':'../../../images/road/tips/1104/1104_1_2.svg',
                        row: 0,
                        column: 1,
                        location: this.geometry['coordinates'],
                        scalex: 0.7,
                        scaley: 0.7,
                        fillStyle: item.m.a == "0"?this.redFill:this.greenFill
                    })
                );
                break;
            case 2:
                this.properties['markerStyle']["icon"].push(
                    fastmap.uikit.canvasTips.Tips.getIconStyle({
                        iconName: item.m.e == 1?'../../../images/road/tips/1104/1104_2_1.svg':'../../../images/road/tips/1104/1104_2_2.svg',
                        row: 0,
                        column: 1,
                        location: this.geometry['coordinates'],
                        scalex: 0.7,
                        scaley: 0.7,
                        fillStyle: item.m.a == "0"?this.redFill:this.greenFill
                    })
                );
                break;
        }
    }
});
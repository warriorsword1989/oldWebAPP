fastmap.uikit.canvasTips.TipsWarningInfo = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item,num) {
        this.geometry['coordinates'] = item.g;
        if (num == 0){
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasTips.Tips.getIconStyle({
                    iconName: '../../../images/road/tips/1105/1105_'+item.m.d.split('|')[num]+"_0.svg",
                    row: 0,
                    column: 0,
                    location: this.geometry['coordinates'],
                    rotate: (item.m.c - 180) * (Math.PI / 180),
                    dx: 0,
                    dy: 0
                })
            );
        } else{
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasTips.Tips.getIconStyle({
                    iconName: '../../../images/road/tips/1105/1105_'+item.m.d.split('|')[num]+"_0.svg",
                    row: 0,
                    column: num,
                    location: this.geometry['coordinates'],
                    rotate: (item.m.c - 180) * (Math.PI / 180),
                    dx: 4,
                    dy: 0
                })
            );
        }

    }
});
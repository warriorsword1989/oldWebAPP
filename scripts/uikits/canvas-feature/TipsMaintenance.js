fastmap.uikit.canvasTips.TipsMaintenance = fastmap.uikit.canvasTips.Tips.extend({
    setAttribute: function (item) {
        this.featArr.pop();
        for (var i = 0; i < 2; i++) {
            var obj = {};
            this.geometry = {};
            this.properties = {};
            this.properties['markerStyle'] = {};
            this.properties['markerStyle']["icon"] = [];
            this.properties['id'] = item.i;
            this.geometry['type'] = 'Point';
            this.geometry['coordinates'] = [];
            this.properties["featType"] = item.t;
            this.properties['status'] = item.m.a;
            if (i == 0) {
                this.geometry['coordinates'] = item.m.c;
            } else {
                this.geometry['coordinates'] = item.m.d;
            }
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasTips.Tips. getIconStyle({
                    iconName: '../../../images/road/tips/1504/0.svg',
                    row: 0,
                    column: 1,
                    location: this.geometry['coordinates']
                })
            );
            this.featArr.push(obj);
        }
    }
});
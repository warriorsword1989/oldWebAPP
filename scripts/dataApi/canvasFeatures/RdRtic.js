fastmap.uikit.canvasFeature.RdRtic = fastmap.uikit.canvasFeature.Feature.extend({
    geometry: {},
    properties: {},
    getrTicColor : function (level) {
        switch (parseInt(level)) {
            case 0:
                return "#808080";
                break;
            case 1:
                return "#FF0000";
                break;
            case 2:
                return "#006400";
                break;
            case 3:
                return "#00008B";
                break;
            case 4:
                return "#FF1493";
                break;
        }
    },
    setAttribute: function(data) {
        this.geometry['type'] = 'Point';
        this.geometry['coordinates'] = data.g;
        this.properties["featType"] = "RDLINKINTRTIC";
        this.properties['markerStyle'] = {};
        this.properties['markerStyle']["icon"] = [];
        // this.properties['forwardInformation'] = data.m.a;//顺向信息
        // this.properties['forwardLevel'] = data.m.b;//顺向等级
        // this.properties['reverseInformation'] = data.m.c;//逆向信息
        // this.properties['reverseLevel'] = data.m.d;//逆向等级
        this.properties['id'] = data.m.i;
        if (data.m.a) {

            this.properties['forwardtext'] = data.m.a;
            this.properties['forwarddirect'] = data.m.b;
            this.properties['color'] = this.getrTicColor(data.m.b);
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasFeature.Feature.getIconStyle({
                    row: 0,
                    column: 1,
                    color: this.getrTicColor(data.m.b)

                })
            );
        }
        if (data.m.c) {

            this.properties['reversetext'] = data.m.c;
            this.properties['reversedirect'] = data.m.d;
            this.properties['color'] = this.getrTicColor(data.m.d);
            this.properties['markerStyle']["icon"].push(
                fastmap.uikit.canvasFeature.Feature.getIconStyle({
                    row: 0,
                    column: 1,
                    color: this.getrTicColor(data.m.d)

                })
            );
        }
    }


});
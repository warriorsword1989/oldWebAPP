fastmap.uikit.canvasFeature.RdLaneConnexity = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function(item) {
        this.geometry['type'] = 'Point';
        this.properties["featType"] = "RDLANECONNEXITY";
        this.properties['markerStyle'] = {};
        this.properties['markerStyle']["icon"] = [];
        this.properties['rotate'] = item.m.c;
        var laneArr = item.m.b.split(",");
        for (var lane = 0, laneNum = laneArr.length; lane < laneNum; lane++) {
            var geom = this.geometry['coordinates'];
            var geomnew = [],
                gjGeo = [];
            geomnew[0] = parseInt(geom[0]) + lane * 10 * Math.cos(item.m.c * (Math.PI / 180));
            geomnew[1] = parseInt(geom[1]) + lane * 10 * Math.sin(item.m.c * (Math.PI / 180));
            gjGeo[0] = geomnew[0] - 17 * Math.sin(item.m.c * (Math.PI / 180));
            gjGeo[1] = geomnew[1] + 17 * Math.cos(item.m.c * (Math.PI / 180));
            if (laneArr[lane].indexOf("[") >= 0) { // 附加车道
                this.properties['markerStyle']["icon"].push(fastmap.uikit.canvasFeature.Feature.getIconStyle({
                    iconName: '../../../images/road/1301/1301_2_' + laneArr[lane].substr(laneArr[lane].indexOf("[") + 1, 1) + '.svg',
                    row: 0,
                    column: lane,
                    location: geomnew,
                    rotate: item.m.c * (Math.PI / 180),
                    scalex: 2 / 3,
                    scaley: 2 / 3
                }));
            } else { // 普通车道
                this.properties['markerStyle']["icon"].push(fastmap.uikit.canvasFeature.Feature.getIconStyle({
                    iconName: '../../../images/road/1301/1301_0_' + laneArr[lane].substr(0, 1) + '.svg',
                    row: lane,
                    column: 0,
                    location: geomnew,
                    rotate: item.m.c * (Math.PI / 180),
                    scalex: 2 / 3,
                    scaley: 2 / 3
                }));
            }
            if (laneArr[lane].indexOf("<") >= 0) { // 公交车道
                this.properties['markerStyle']["icon"].push(fastmap.uikit.canvasFeature.Feature.getIconStyle({
                    iconName: '../../../images/road/1301/1301_1_' + laneArr[lane].substr(laneArr[lane].indexOf("<") + 1, 1) + '.svg',
                    row: 1,
                    column: lane,
                    location: gjGeo,
                    rotate: item.m.c * (Math.PI / 180),
                    scalex: 2 / 3,
                    scaley: 2 / 3
                }));
            }
        }
    }
});
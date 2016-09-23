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
            var geomnew = [];
            geomnew[0] = parseInt(geom[0]) + lane * 10 * Math.cos(item.m.c * (Math.PI / 180));
            geomnew[1] = parseInt(geom[1]) + lane * 10 * Math.sin(item.m.c * (Math.PI / 180));
            if (laneArr[lane].indexOf("[") > -1) {
                this.properties['markerStyle']["icon"].push(
                    fastmap.uikit.canvasFeature.Feature.getIconStyle({
                        iconName: '../../../images/road/1301/1301_2_' + laneArr[lane].substr(1, 1) + '.svg',
                        row: 0,
                        column: lane,
                        location: geomnew,
                        rotate: item.m.c * (Math.PI / 180),
                        scalex: 2 / 3,
                        scaley: 2 / 3
                    })
                );
                if (laneArr[lane].indexOf("<") > -1) {
                    this.properties['markerStyle']["icon"].push(
                        fastmap.uikit.canvasFeature.Feature.getIconStyle({
                            iconName: '../../../images/road/1301/1301_1_' + laneArr[lane].substr(laneArr[lane].indexOf("<") + 1, 1) + '.svg',
                            row: 0,
                            column: lane,
                            location: geomnew,
                            rotate: item.m.c * (Math.PI / 180)
                            ,
                            scalex: 2 / 3,
                            scaley: 2 / 3
                        })
                    );
                }

            } else if (laneArr[lane].indexOf("<") > -1) {
                this.properties['markerStyle']["icon"].push(
                    fastmap.uikit.canvasFeature.Feature.getIconStyle({
                        iconName: '../../../images/road/1301/1301_0_' + laneArr[lane].substr(laneArr[lane].indexOf("<") + 1, 1) + '.svg',
                        row: lane,
                        column: lane,
                        location: geomnew,
                        rotate: item.m.c * (Math.PI / 180),
                        scalex: 2 / 3,
                        scaley: 2 / 3
                    })
                );
                this.properties['markerStyle']["icon"].push(
                    fastmap.uikit.canvasFeature.Feature.getIconStyle({
                        iconName: '../../../images/road/1301/1301_1_' + laneArr[lane].substr(laneArr[lane].indexOf("<") + 1, 1) + '.svg',
                        row: lane,
                        column: lane,
                        location: geomnew,
                        rotate: item.m.c * (Math.PI / 180),
                        scalex: 2 / 3,
                        scaley: 2 / 3
                    })
                );
            } else if (laneArr[lane]) {
                this.properties['markerStyle']["icon"].push(
                    fastmap.uikit.canvasFeature.Feature.getIconStyle({
                        iconName: '../../../images/road/1301/1301_0_' + laneArr[lane] + '.svg',
                        row: lane,
                        column: 0,
                        location: geomnew,
                        rotate: item.m.c * (Math.PI / 180),
                        scalex: 2 / 3,
                        scaley: 2 / 3
                    })
                );
            }
        }
    }
});
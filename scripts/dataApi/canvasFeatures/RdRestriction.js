fastmap.uikit.canvasFeature.RdRestriction = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function (item) {
        this.geometry.type = 'Point';
        this.properties.featType = 'RDRESTRICTION';
        this.properties.markerStyle = {};
        this.properties.markerStyle.icon = [];
        this.properties.rotate = item.m.c;
        this.properties.restrictionType = item.m.a; // 0普通交限 1卡车交限
        var restrictArr = (item.m.b).split(',');
        if (item.m.a === '0') { //  普通交限
            for (var j = 0, lenJ = restrictArr.length; j < lenJ; j++) {
                var geom = this.geometry.coordinates;
                var geomnew = [];
                geomnew[0] = parseInt(geom[0]) + j * 15 * Math.cos(item.m.c * (Math.PI / 180));
                geomnew[1] = parseInt(geom[1]) + j * 15 * Math.sin(item.m.c * (Math.PI / 180));
                var restrictICon = {};

                if (restrictArr[j].indexOf('[') !== -1) {
                    if (restrictArr[j] == '[') {
                        console.info(restrictArr[j]);
                    }

                    restrictICon = fastmap.uikit.canvasFeature.Feature.getIconStyle(
                        {
                            iconName: '../../../images/road/1302/1302_2_' + restrictArr[j][1] + '.svg',
                            row: 0,
                            column: j,
                            location: geomnew,
                            rotate: item.m.c * (Math.PI / 180),
                            scalex: 3 / 4,
                            scaley: 3 / 4
                        }
                    );
                } else {
                    restrictICon = fastmap.uikit.canvasFeature.Feature.getIconStyle({
                        iconName: '../../../images/road/1302/1302_1_' + restrictArr[j] + '.svg',
                        row: 0,
                        column: j,
                        location: geomnew,
                        rotate: item.m.c * (Math.PI / 180),
                        scalex: 3 / 4,
                        scaley: 3 / 4
                    });
                }
                this.properties.markerStyle.icon.push(restrictICon);
            }
        } else { // 卡车交限
            for (var j = 0, lenJ = restrictArr.length; j < lenJ; j++) {
                var geom = this.geometry.coordinates,
                    geomnew = [],
                    restrictICon = {};
                geomnew[0] = parseInt(geom[0]) + j * 15 * Math.cos(item.m.c * (Math.PI / 180));
                geomnew[1] = parseInt(geom[1]) + j * 15 * Math.sin(item.m.c * (Math.PI / 180));


                restrictICon = fastmap.uikit.canvasFeature.Feature.getIconStyle({
                    iconName: '../../../images/road/1302/1302_0_' + restrictArr[j] + '.svg',
                    row: 0,
                    column: j,
                    location: geomnew,
                    rotate: item.m.c * (Math.PI / 180),
                    scalex: 3 / 4,
                    scaley: 3 / 4
                });
                this.properties.markerStyle.icon.push(restrictICon);
            }
        }
    }
});

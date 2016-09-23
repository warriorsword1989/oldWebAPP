fastmap.uikit.canvasFeature.RdBranchPart = fastmap.uikit.canvasFeature.Feature.extend({
    geometry: {},
    properties: {},
    setAttribute: function(data, key, index, count) {
        this.geometry['type'] = 'Point';
        this.geometry['coordinates'] = [data.g[0] + count * 30, data.g[1]];
        this.properties['id'] = data.m.a[key].ids[index].detailId;
        this.properties["featType"] = "RDBRANCH";
        this.properties['rotate'] = data.m.c;
        this.properties['markerStyle'] = {};
        this.properties['markerStyle']["icon"] = [];
        if (data.m.a[key].type == 0) {
            this.properties['markerStyle']["icon"].push(fastmap.uikit.canvasFeature.Feature.getIconStyle({
                iconName: '../../../images/road/1407/' + data.m.a[key].type + '.svg',
                row: 0,
                column: 1,
                location: this.geometry['coordinates'],
                rotate: (data.m.c) * (Math.PI / 180)
            }));
        } else if (data.m.a[key].type == 3) {
            this.properties['markerStyle']["icon"].push(fastmap.uikit.canvasFeature.Feature.getIconStyle({
                iconName: '../../../images/road/tips/3D/' + data.m.a[key].type + 'D.svg',
                row: 0,
                column: 1,
                location: this.geometry['coordinates'],
                rotate: (data.m.c) * (Math.PI / 180)
            }));
        }
    },
});
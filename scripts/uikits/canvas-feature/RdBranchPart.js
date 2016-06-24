fastmap.uikit.canvasFeature.RdBranchPart = fastmap.uikit.canvasFeature.Feature.extend({
    geometry: {},
    properties: {},
    setAttribute: function(data, key, index, count) {
        this.geometry['type'] = 'Point';
        this.geometry['coordinates'] = [data.g[0] + count * 30, data.g[1]];
        this.properties['id'] = data.m.a[key].ids[index].detailId;
        this.properties['rowId'] = data.m.a[key].ids[index].rowId;
        this.properties["featType"] = "RDBRANCH";
        this.properties['rotate'] = data.m.c;
        this.properties['branchType'] = data.m.a[key].type;
        this.properties['markerStyle'] = {};
        this.properties['markerStyle']["icon"] = [];
        this.properties['markerStyle']["icon"].push(fastmap.uikit.canvasFeature.Feature.getIconStyle({
            iconName: '../../../images/road/1407/' + data.m.a[key].type + '.svg',
            row: 0,
            column: 1,
            location: this.geometry['coordinates'],
            rotate: (data.m.c) * (Math.PI / 180)
        }));
        /*if (data.m.a[key].type == 0) {
            this.properties['markerStyle']["icon"].push(fastmap.uikit.canvasFeature.Feature.getIconStyle({
                iconName: '../../../images/road/1407/' + data.m.a[key].type + '.svg',
                row: 0,
                column: 1,
                location: this.geometry['coordinates'],
                rotate: (data.m.c) * (Math.PI / 180)
            }));
        } else if (data.m.a[key].type == 1) {   //方面
            this.properties['markerStyle']["icon"].push(fastmap.uikit.canvasFeature.Feature.getIconStyle({
                iconName: '../../../images/road/1407/' + data.m.a[key].type + '.svg',
                row: 0,
                column: 1,
                location: this.geometry['coordinates'],
                rotate: (data.m.c) * (Math.PI / 180)
            }));
        } else if (data.m.a[key].type == 2) {   //IC
            this.properties['markerStyle']["icon"].push(fastmap.uikit.canvasFeature.Feature.getIconStyle({
                iconName: '../../../images/road/1407/' + data.m.a[key].type + '.svg',
                row: 0,
                column: 1,
                location: this.geometry['coordinates'],
                rotate: (data.m.c) * (Math.PI / 180)
            }));
        } else if (data.m.a[key].type == 3) {   //3D
            this.properties['markerStyle']["icon"].push(fastmap.uikit.canvasFeature.Feature.getIconStyle({
                iconName: '../../../images/road/tips/3D/' + data.m.a[key].type + 'D.svg',
                row: 0,
                column: 1,
                location: this.geometry['coordinates'],
                rotate: (data.m.c) * (Math.PI / 180)
            }));
        } else if (data.m.a[key].type == 4) {   //复杂路口模式图
            this.properties['markerStyle']["icon"].push(fastmap.uikit.canvasFeature.Feature.getIconStyle({
                iconName: '../../../images/road/1407/' + data.m.a[key].type + '.svg',
                row: 0,
                column: 1,
                location: this.geometry['coordinates'],
                rotate: (data.m.c) * (Math.PI / 180)
            }));
        } else if (data.m.a[key].type == 5) {       //实景图
            this.properties['markerStyle']["icon"].push(fastmap.uikit.canvasFeature.Feature.getIconStyle({
                iconName: '../../../images/road/1407/' + data.m.a[key].type + '.svg',
                row: 0,
                column: 1,
                location: this.geometry['coordinates'],
                rotate: (data.m.c) * (Math.PI / 180)
            }));
        } else if (data.m.a[key].type == 6) {   //实景看板
            this.properties['markerStyle']["icon"].push(fastmap.uikit.canvasFeature.Feature.getIconStyle({
                iconName: '../../../images/road/1407/' + data.m.a[key].type + '.svg',
                row: 0,
                column: 1,
                location: this.geometry['coordinates'],
                rotate: (data.m.c) * (Math.PI / 180)
            }));
        } else if (data.m.a[key].type == 7) {   //连续分歧
            this.properties['markerStyle']["icon"].push(fastmap.uikit.canvasFeature.Feature.getIconStyle({
                iconName: '../../../images/road/1407/' + data.m.a[key].type + '.svg',
                row: 0,
                column: 1,
                location: this.geometry['coordinates'],
                rotate: (data.m.c) * (Math.PI / 180)
            }));
        } else if (data.m.a[key].type == 8) {   //大规模交叉点
            this.properties['markerStyle']["icon"].push(fastmap.uikit.canvasFeature.Feature.getIconStyle({
                iconName: '../../../images/road/1407/' + data.m.a[key].type + '.svg',
                row: 0,
                column: 1,
                location: this.geometry['coordinates'],
                rotate: (data.m.c) * (Math.PI / 180)
            }));
        } else if (data.m.a[key].type == 9) {   //方向看板
            this.properties['markerStyle']["icon"].push(fastmap.uikit.canvasFeature.Feature.getIconStyle({
                iconName: '../../../images/road/1407/' + data.m.a[key].type + '.svg',
                row: 0,
                column: 1,
                location: this.geometry['coordinates'],
                rotate: (data.m.c) * (Math.PI / 180)
            }));
        }*/
    },
});
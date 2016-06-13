fastmap.uikit.canvasFeature = {};
fastmap.uikit.canvasFeature.Feature = L.Class.extend({
    geometry: null,
    properties: null,
    initialize: function(data) {
        this.geometry = {};
        this.properties = {};
        this.geometry['coordinates'] = data.g;
        this.properties['id'] = data.i;
        this.properties['style'] = {};
        this.setAttribute.apply(this, arguments);
    },
    setAttribute: function() {},
    statics: {
        create: function(data) {
            var ret = null;
            switch (data.t) {
                case 2: //照片
                    break;
                case 3: //交限
                    break;
                case 4: //rdlink
                    ret = new fastmap.uikit.canvasFeature.RdLink(data);
                    break;
                case 5: //车信
                    break;
                case 6: //点限速
                    break;
                case 7: //分歧
                    ret = new fastmap.uikit.canvasFeature.RdBranch(data);
                    break;
                case 8: //路口
                    break;
                case 9: //线限速
                    break;
                case 10: //rtic
                    break;
                case 11: //立交
                    ret = new fastmap.uikit.canvasFeature.RdGsc(data);
                    break;
                case 21: //poi
                    ret = new fastmap.uikit.canvasFeature.poiMarker(data);
                    break;
            }
            return ret;
        },
        transform: function(data) {
            var list = [];
            if (FM.Util.isObject(data)) {
                for (var key in data) {
                    for (var i = 0, n = data[key].length; i < n; i++) {
                        var tmp = fastmap.uikit.canvasFeature.Feature.create(data[key][i]);
                        if (FM.Util.isObject(tmp)) {
                            list.push(tmp);
                        } else if (FM.Util.isArray(tmp)) {
                            list.concat(tmp);
                        }
                    }
                }
            } else if (FM.Util.isArray(data)) {
                var temp = data;
                if (FM.Util.isArray(data[0])) {
                    temp = data[0];
                }
                for (var i = 0, n = temp.length; i < n; i++) {
                    var tmp = fastmap.uikit.canvasFeature.Feature.create(temp[i]);
                    if (FM.Util.isObject(tmp)) {
                        list.push(tmp);
                    } else if (FM.Util.isArray(tmp)) {
                        list.concat(tmp);
                    }
                }
            }
            return list;
        },
        getIconStyle: function(options) {
            var icon = {};
            icon["iconName"] = options.iconName || "";
            icon["row"] = options.row || "";
            icon["column"] = options.column || "";
            icon["status"] = options.status || null;
            icon["location"] = options.location || "";
            icon["rotate"] = options.rotate || "";
            icon["dx"] = options.dx || "";
            icon["dy"] = options.dy || "";
            icon["scalex"] = options.scalex || 1;
            icon["scaley"] = options.scaley || 1;
            return icon;
        }
    }
});
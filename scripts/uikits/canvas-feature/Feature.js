fastmap.uikit.canvasFeature = {};
fastmap.uikit.canvasFeature.Feature = L.Class.extend({
    geometry: null,
    properties: null,
    featArr:[],
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
                    ret = new fastmap.uikit.canvasFeature.RdRestriction(data);
                    break;
                case 4: //rdlink
                    ret = new fastmap.uikit.canvasFeature.RdLink(data);
                    break;
                case 5: //车信
                    ret = new fastmap.uikit.canvasFeature.RdLaneConnexity(data);
                    break;
                case 6: //点限速
                    ret = new fastmap.uikit.canvasFeature.RdSpeedLimit(data);
                    break;
                case 7: //分歧
                    ret = new fastmap.uikit.canvasFeature.RdBranch(data);
                    break;
                case 8: //路口
                    ret = new fastmap.uikit.canvasFeature.RdCross(data);
                    break;
                case 9: //线限速
                    break;
                case 10: //rtic
                    break;
                case 11: //立交
                    ret = new fastmap.uikit.canvasFeature.RdGsc(data);
                    break;
                case 12://行政区划线
                    ret = new fastmap.uikit.canvasFeature.AdLink(data);
                    break;
                case 13://行政区划面
                    ret = new fastmap.uikit.canvasFeature.AdFace(data);
                    break;
                case 14://铁路
                    ret = new fastmap.uikit.canvasFeature.RwLink(data);
                    break;
                case 15://行政区划点
                    ret = new fastmap.uikit.canvasFeature.AdAdmin(data);
                    break;
                case 16://RDNODE
                    ret = new fastmap.uikit.canvasFeature.RdNode(data);
                    break;
                case 18://AdNode
                    ret = new fastmap.uikit.canvasFeature.AdNode(data);
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
            if(fastmap.uikit.canvasFeature.Feature.featArr){
                list.concat(fastmap.uikit.canvasFeature.Feature.featArr);
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
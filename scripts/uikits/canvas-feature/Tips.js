fastmap.uikit.canvasTips = {};
fastmap.uikit.canvasTips.Tips = L.Class.extend({
    guideLineObj : null,
    linePoint : null,
    transform : null,
    layerCtrl : null,
    guideLayer : null,
    geometry: null,
    properties: null,
    guideLineArr : [],
    initialize: function(item) {
        this.geometry = {};
        this.properties = {};
        this.transform = new fastmap.mapApi.MecatorTranform();
        this.layerCtrl = fastmap.uikit.LayerController();
        this.guideLayer = this.layerCtrl.getLayerById("guideLineLayer");
        this.properties['markerStyle'] = {};
        this.properties['markerStyle']["icon"] = [];
        this.properties['id'] = item.i;
        this.geometry['type'] = 'Point';
        this.geometry['coordinates'] = [];
        this.properties["featType"] = item.t;
        this.properties['status'] = item.m.a;
        this.setAttribute.apply(this, arguments);
    },
    setAttribute: function() {},
    statics: {
        create: function(item) {

            var ret = null;
            switch (item.t) {
                case 1101://限速
                    ret = new fastmap.uikit.canvasTips.TipsRestriction(item);
                    break;
                case 1105://危险信息
                    ret = new fastmap.uikit.canvasTips.TipsWarningInfo(item);
                    break;
                case 1107://收费站
                    ret = new fastmap.uikit.canvasTips.TipsTollGate(item);
                    break;
                case 1109://电子眼
                    ret = new fastmap.uikit.canvasTips.TipSelectroniceye(item);
                    break;
                case 1205://SE
                    ret = new fastmap.uikit.canvasTips.TipsRoadSE(item);
                    break;
                case 1206://PE
                    ret = new fastmap.uikit.canvasTips.TipsRoadSE(item);
                    break;
                case 1301://车信
                    ret = new fastmap.uikit.canvasTips.TipsLaneConnexity(item);
                    break;
                case 1401://方向看板
                    ret = new fastmap.uikit.canvasTips.TipsOrientation(item);
                    break;
                case 1402://Real sign
                    ret = new fastmap.uikit.canvasTips.TipsRealSign(item);
                    break;
                case 1406://实景图
                    ret = new fastmap.uikit.canvasTips.TipsJVCBranch(item);
                    break;
                case 1407://高速分歧
                    ret = new fastmap.uikit.canvasTips.TipsGSBranch(item);
                    break;
                case 1409://普通路口模式图
                    ret = new fastmap.uikit.canvasTips.TipsNormalCross(item);
                    break;
                case 1604://区域内道路
                    ret = new fastmap.uikit.canvasTips.TipsRegionRoad(item);
                    break;
                case 1703://分叉路口提示
                    ret = new fastmap.uikit.canvasTips.TipsRoadCrossProm(item);
                    break;
                case 1704://交叉路口
                    ret = fastmap.uikit.canvasTips.TipsRoadCross(item);
                    break;
                case 1803://挂接
                    ret = new fastmap.uikit.canvasTips.TipsConnect(item);
                    break;
                case 1806://草图
                    ret = new fastmap.uikit.canvasTips.TipsSketch(item);
                    break;
                case 1501://上下线分离
                    ret = new fastmap.uikit.canvasTips.TipsMultiDigitized(item);
                    break;
                case 1302://普通交限
                    ret = new fastmap.uikit.canvasTips.TipsNomalRestriction(item);
                    break;
                case 1201://道路种别
                    ret = new fastmap.uikit.canvasTips.TipsRoadTypes(item);
                    break;
                case 1901://道路名
                    ret = new fastmap.uikit.canvasTips.TipsRoadNames(item);
                    break;
                case 2001://侧线
                    ret = new fastmap.uikit.canvasTips.TipsLinks(item);
                    break;
                case 1203://道路方向
                    ret = new fastmap.uikit.canvasTips.TipsRoadDirection(item);
                    break;
                case 1403://3d分歧
                    ret = new fastmap.uikit.canvasTips.Tips3DBranch(item);
                    break;
                case 1405://一般道路方面
                    ret = new fastmap.uikit.canvasTips.TipsNormalRoadSide(item);
                    break;
                case 1510://桥
                    ret = new fastmap.uikit.canvasTips.TipsBridges(item);
                    break;
                case 1514://施工维修
                    ret = new fastmap.uikit.canvasTips.TipsMaintenance(item);
                    break;
                case 1801://立交
                    ret = new fastmap.uikit.canvasTips.TipsGSC(item);
                    break;
            }
            return ret;
        },
        transformation: function(data) {
            var list = [];
            if (FM.Util.isObject(data)) {
                for (var key in data) {
                    for (var i = 0, n = data[key].length; i < n; i++) {
                        var tmp = fastmap.uikit.canvasTips.Tips.create(data[key][i]);
                        if (FM.Util.isObject(tmp)) {
                            list.push(tmp);
                        } else if (FM.Util.isArray(tmp)) {
                            list = list.concat(tmp);
                        }
                    }
                }
            } else if (FM.Util.isArray(data)) {
                var temp = data;
                if (FM.Util.isArray(data[0])) {
                    temp = data[0];
                }
                for (var i = 0, n = temp.length; i < n; i++) {
                    var tmp = fastmap.uikit.canvasTips.Tips.create(temp[i]);
                    if (FM.Util.isObject(tmp)) {
                        list.push(tmp);
                    } else if (FM.Util.isArray(tmp)) {
                        list = list.concat(tmp);
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
            icon["text"] = options.text || "";
            return icon;
        }
    }
});
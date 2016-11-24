/**
 * Created by zhaohang on 2016/11/12.
 */
fastmap.uikit.canvasTMFeature = {};
fastmap.uikit.canvasTMFeature.TMFeature = L.Class.extend({
    geometry: null,
    properties: null,
    initialize: function (data) {
        this.geometry = {};
        this.properties = {};
        this.geometry.coordinates = data.g;
        this.properties.id = data.i;
        this.properties.style = {};
        this.setAttribute.apply(this, arguments);
    },
    setAttribute: function () {},
    statics: {
        create: function (data) {
            var ret = null;
            switch (data.t) {
            case 501: // 专题图 卡车限制信息
                ret = new fastmap.uikit.canvasTMFeature.TMTruckLimitData(data);
                break;
            case 502: // 专题图 link限制信息数量（普通限制信息）
                ret = new fastmap.uikit.canvasTMFeature.TMLinkLimitNum(data);
                break;
            case 503: // 专题图 普通线限速限速等级
                ret = new fastmap.uikit.canvasTMFeature.TMLinkSpeedlimitSpeedClass(data);
                break;
            case 504: // 专题图 普通线限速限速等级赋值标识
                ret = new fastmap.uikit.canvasTMFeature.TMLinkSpeedlimitSpeedClassWork(data);
                break;
            case 505: // 专题图 普通线限速限速来源
                ret = new fastmap.uikit.canvasTMFeature.TMLinkSpeedlimitSpeedLimitSrc(data);
                break;
            case 506: // 专题图 link车道等级
                ret = new fastmap.uikit.canvasTMFeature.TMLinkLaneClass(data);
                break;
            case 507: // 专题图 link功能等级
                ret = new fastmap.uikit.canvasTMFeature.TMLinkFunctionClass(data);
                break;
            case 508: // 专题图 车道数(总数)
                ret = new fastmap.uikit.canvasTMFeature.TMLinkLaneNum(data);
                break;
            case 509: // 专题图 开发状态
                ret = new fastmap.uikit.canvasTMFeature.TMDevelopState(data);
                break;
            case 510: // 专题图 上下线分离
                ret = new fastmap.uikit.canvasTMFeature.TMMultiDigitized(data);
                break;
            case 511: // 专题图 铺设状态
                ret = new fastmap.uikit.canvasTMFeature.TMPaveStatus(data);
                break;
            case 512: // 专题图 收费信息
                ret = new fastmap.uikit.canvasTMFeature.TMTollInfo(data);
                break;
            case 513: // 专题图 特殊交通
                ret = new fastmap.uikit.canvasTMFeature.TMSpecialTraffic(data);
                break;
            case 514: // 专题图 高架
                ret = new fastmap.uikit.canvasTMFeature.TMIsViaduct(data);
                break;
            case 515: // 专题图 供用信息
                ret = new fastmap.uikit.canvasTMFeature.TMAppInfo(data);
                break;
            case 516: // 专题图 交叉口内道路
                ret = new fastmap.uikit.canvasTMFeature.TMRdLinkForm(data);
                break;
            //case 517: // 专题图 道路名内容
            //    ret = new fastmap.uikit.canvasTMFeature.TMNameContent(data);
            //    break;
            case 518: // 专题图 道路名组数
                ret = new fastmap.uikit.canvasTMFeature.TMNameGroupid(data);
                break;
            case 519: // 专题图 名称类型
                ret = new fastmap.uikit.canvasTMFeature.TMNameType(data);
                break;
            case 520: // 专题图 条件线限速个数
                ret = new fastmap.uikit.canvasTMFeature.TMSpeedlimitConditionCount(data);
                break;
            case 520: // 专题图 禁止穿行
                ret = new fastmap.uikit.canvasTMFeature.TMRdLinkLimitType(data);
                break;
            }
            return ret;
        },
        transform: function (data) {
            var list = [];
            if (FM.Util.isObject(data)) {
                for (var key in data) {
                    for (var i = 0, n = data[key].length; i < n; i++) {
                        var tmp = fastmap.uikit.canvasTMFeature.TMFeature.create(data[key][i]);
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
                    var tmp = fastmap.uikit.canvasTMFeature.TMFeature.create(temp[i]);
                    if (FM.Util.isObject(tmp)) {
                        list.push(tmp);
                    } else if (FM.Util.isArray(tmp)) {
                        list = list.concat(tmp);
                    }
                }
            }
            return list;
        },
        getIconStyle: function (options) {
            var icon = {};
            icon.iconName = options.iconName || '';
            icon.row = options.row || '';
            icon.column = options.column || '';
            icon.status = options.status || null;
            icon.location = options.location || '';
            icon.rotate = options.rotate || '';
            icon.dx = options.dx || '';
            icon.dy = options.dy || '';
            icon.scalex = options.scalex || 1;
            icon.scaley = options.scaley || 1;
            icon.text = options.text || '';
            icon.fillStyle = options.fillStyle || '';
            return icon;
        }
    }
});

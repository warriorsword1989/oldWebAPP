/**
 * Created by wangtun on 2016/3/14.
 */
fastmap.dataApi.rdCross = fastmap.dataApi.rdRestriction.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDCROSS";
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.pid = data["pid"];
        this.type = data["type"] || 0;
        this.signal = data["signal"] || 0;
        this.kgFlag = data["kgFlag"] || 0;
        this.electroeye = data["electroeye"] || 0;
        this.names = [];
        if (data["names"].length > 0) {
            for (var i = 0; i < data["names"].length; i++) {
                var name = new fastmap.dataApi.rdCrossName(data["names"][i]);
                this.names.push(name);
            }
        }
        this.links = [];
        if (data["links"].length > 0) {
            for (var i = 0; i < data["links"].length; i++) {
                var link = new fastmap.dataApi.rdCrossLink(data["links"][i]);
                this.links.push(link);
            }
        }
        this.nodes = [];
        if (data["nodes"].length > 0) {
            for (var i = 0; i < data["nodes"].length; i++) {
                var node = new fastmap.dataApi.rdCrossNode(data["nodes"][i]);
                this.nodes.push(node);
            }
        }
    },

    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["type"] = this.type;
        data["signal"] = this.signal;
        data["electroeye"] = this.electroeye;
        data["geoLiveType"] = this.geoLiveType;
        data["kgflag"] = this.kgflag;
        data["links"] = [];
        for (var i = 0, len = this.data["links"].length; i < len; i++) {
            data["links"].push(this.data["links"][i].getIntegrate())
        }

        data["names"] = [];
        for (var i = 0, len = this.data["names"].length; i < len; i++) {
            data["names"].push(this.data["names"][i].getIntegrate())
        }

        data["nodes"] = [];
        for (var i = 0, len = this.data["nodes"].length; i < len; i++) {
            data["nodes"].push(this.data["nodes"][i].getIntegrate())
        }

        return data;
    },

    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["type"] = this.type;
        data["signal"] = this.signal;
        data["electroeye"] = this.electroeye;
        data["geoLiveType"] = this.geoLiveType;
        data["kgflag"] = this.kgflag;
        data["links"] = [];
        for (var i = 0, len = this.links.length; i < len; i++) {
            data["links"].push(this.links[i].getIntegrate())
        }

        data["names"] = [];
        for (var i = 0, len = this.names.length; i < len; i++) {
            data["names"].push(this.names[i].getIntegrate())
        }

        data["nodes"] = [];
        for (var i = 0, len = this.nodes.length; i < len; i++) {
            data["nodes"].push(this.nodes[i].getIntegrate())
        }

        return data;
    }
});
/***
 * rdCross初始化函数
 * @param data node数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdCross}
 */
fastmap.dataApi.rdcross = function (data, options) {
    return new fastmap.dataApi.rdCross(data, options);
}

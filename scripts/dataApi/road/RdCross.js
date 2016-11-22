/**
 * Created by wangtun on 2016/3/14.
 */
fastmap.dataApi.RdCross = fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        // L.setOptions(this, options);
        this.geoLiveType = 'RDCROSS';
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.pid = data.pid;
        this.type = data.type || 0;
        this.signal = data.signal || 0;
        this.kgFlag = data.kgFlag || 0;
        this.electroeye = data.electroeye || 0;
        this.names = [];
        if (data.names.length > 0) {
            for (var i = 0; i < data.names.length; i++) {
                var name = fastmap.dataApi.rdCrossName(data.names[i]);
                this.names.push(name);
            }
        }
        this.links = [];
        if (data.links.length > 0) {
            for (var j = 0; j < data.links.length; j++) {
                var link = fastmap.dataApi.rdCrossLink(data.links[j]);
                this.links.push(link);
            }
        }
        this.nodes = [];
        if (data.nodes.length > 0) {
            for (var k = 0; k < data.nodes.length; k++) {
                var node = fastmap.dataApi.rdCrossNode(data.nodes[k]);
                this.nodes.push(node);
            }
        }
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.type = this.type;
        data.signal = this.signal;
        data.electroeye = this.electroeye;
        data.geoLiveType = this.geoLiveType;
        data.kgflag = this.kgflag;
        data.links = [];
        for (var i = 0, len = this.data.links.length; i < len; i++) {
            data.links.push(this.data.links[i].getIntegrate());
        }

        data.names = [];
        for (var j = 0, nameLen = this.data.names.length; j < nameLen; j++) {
            data.names.push(this.data.names[j].getIntegrate());
        }

        data.nodes = [];
        for (var k = 0, nodeLen = this.data.nodes.length; k < nodeLen; k++) {
            data.nodes.push(this.data.nodes[k].getIntegrate());
        }

        return data;
    },

    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.type = this.type;
        data.signal = this.signal;
        data.electroeye = this.electroeye;
        data.geoLiveType = this.geoLiveType;
        data.kgflag = this.kgflag;
        data.links = [];
        for (var i = 0, len = this.links.length; i < len; i++) {
            data.links.push(this.links[i].getIntegrate());
        }

        data.names = [];
        for (var j = 0, nameLen = this.names.length; j < nameLen; j++) {
            data.names.push(this.names[j].getIntegrate());
        }

        data.nodes = [];
        for (var k = 0, nodeLen = this.nodes.length; k < nodeLen; k++) {
            data.nodes.push(this.nodes[k].getIntegrate());
        }

        return data;
    }
});
/** *
 * rdCross初始化函数
 * @param data node数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdCross}
 */
fastmap.dataApi.rdCross = function (data, options) {
    return new fastmap.dataApi.RdCross(data, options);
};

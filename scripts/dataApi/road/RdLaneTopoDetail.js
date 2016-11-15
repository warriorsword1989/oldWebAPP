/**
 * Created by liuyang on 2016/11/14.
 * Class RdLaneTopoDetail
 */

fastmap.dataApi.RdLaneTopoDetail = fastmap.dataApi.GeoDataModel.extend({


    /** *
     *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = 'RDLANETOPODETAIL';
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.pid = data.pid;// topoId
        this.inLanePid = data.inLanePid;
        this.outLanePid = data.outLanePid;
        this.inLinkPid = data.inLinkPid;
        this.outLinkPid = data.outLinkPid;
        this.nodePid = data.nodePid;
        this.reachDir = data.reachDir || 0;
        this.vehicle = data.vehicle || 0;
        this.timeDomain = data.timeDomain || null;
        this.processFlag = data.processFlag || 2;
        this.throughTurn = data.throughTurn || 0;
        this.topoVias = [];
        if (data.topoVias && data.topoVias.length > 0) {
            for (var i = 0; i < data.topoVias.length; i++) {
                var topoVias = fastmap.dataApi.rdLaneTopoVia(data.topoVias[i]);
                this.topoVias.push(topoVias);
            }
        }
    },

    /**
     * 获取RdLaneTopoDetail简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.inLanePid = this.inLanePid;
        data.outLanePid = this.outLanePid;
        data.inLinkPid = this.inLinkPid;
        data.outLinkPid = this.outLinkPid;
        data.nodePid = this.nodePid;
        data.reachDir = this.reachDir;
        data.vehicle = this.vehicle;
        data.timeDomain = this.timeDomain;
        data.processFlag = this.processFlag;
        data.throughTurn = this.throughTurn;
        data.topoVias = [];
        for (var i = 0; i < this.topoVias.length; i++) {
            data.topoVias.push(this.topoVias[i].getIntegrate());
        }
        data.geoLiveType = this.geoLiveType;
        return data;
    },

    /**
     * 获取RdLaneTopoDetail详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.inLanePid = this.inLanePid;
        data.outLanePid = this.outLanePid;
        data.inLinkPid = this.inLinkPid;
        data.outLinkPid = this.outLinkPid;
        data.nodePid = this.nodePid;
        data.reachDir = this.reachDir;
        data.vehicle = this.vehicle;
        data.timeDomain = this.timeDomain;
        data.processFlag = this.processFlag;
        data.throughTurn = this.throughTurn;
        data.topoVias = [];
        for (var i = 0; i < this.topoVias.length; i++) {
            data.topoVias.push(this.topoVias[i].getIntegrate());
        }
        data.geoLiveType = this.geoLiveType;
        return data;
    }
});

/** *
 * RdLaneTopoDetail初始化函数
 * @param data
 * @param options 其他可选参数
 * @returns {.dataApi.RdLaneTopoDetail}
 */
fastmap.dataApi.rdLaneTopoDetail = function (data, options) {
    return new fastmap.dataApi.RdLaneTopoDetail(data, options);
};

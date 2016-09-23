/**
 * Created by wuzhen on 2016/8/15.
 * Class RdVoiceGuide 语音引导
 */

fastmap.dataApi.RdVoiceGuide = fastmap.dataApi.GeoDataModel.extend({


    /***
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = "RdVOICEGUIDE";
        this.setAttributeData(data);
    },
    /**
     * 设置信息
     */
    setAttributeData:function(data){
        this.pid = data["pid"];
        this.inLinkPid = data["inLinkPid"];
        this.nodePid = data["nodePid"];
        this.rowId = data["rowId"] || null;

        this.details = [];
        if (data["details"]) {
            for (var i = 0, len = data["details"].length; i < len; i++) {
                this.details.push(fastmap.dataApi.rdVoiceGuideDetail(data["details"][i]));
            }
        }
    },

    /**
     * 获取简略信息
     */
    getSnapShot:function() {
        var data = {};
        data["pid"] = this.pid;
        data["inLinkPid"] = this.inLinkPid;
        data["nodePid"] = this.nodePid;
        data["rowId"] = this.rowId;

        data["details"] = [];
        if (this.details) {
            for (var i = 0, len = this.details.length; i < len; i++) {
                data["details"].push(this.details[i].getIntegrate());
            }
        }

        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["pid"] = this.pid;
        data["inLinkPid"] = this.inLinkPid;
        data["nodePid"] = this.nodePid;
        data["rowId"] = this.rowId;

        data["details"] = [];
        if (this.details) {
            for (var i = 0, len = this.details.length; i < len; i++) {
                data["details"].push(this.details[i].getIntegrate());
            }
        }

        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * RdSameNode初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.RdVoiceGuide}
 */
fastmap.dataApi.rdVoiceGuide = function (data, options) {
    return new fastmap.dataApi.RdVoiceGuide(data, options);
}


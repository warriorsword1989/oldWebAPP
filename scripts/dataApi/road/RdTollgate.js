/**
 * Created by wangmingdong on 2016/8/9.
 * Class Rdnode
 */

fastmap.dataApi.RdTollgate = fastmap.dataApi.GeoDataModel.extend({


    /***
     *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = "RDTOLLGATE";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"] || "";
        this.nodePid = data["nodePid"];
        this.inLinkPid = data["inLinkPid"];
        this.outLinkPid = data["outLinkPid"];
        this.type = data["type"] || 0;
        this.passageNum = data["passageNum"] || 0;
        this.etcFigureCode = data["etcFigureCode"] || null;
        this.hwName = data["hwName"] || null;
        this.feeType = data["feeType"];
        if(data["feeType"] == ''){
            this.feeType = 2;
        }
        this.names = [];
        if(data["names"] && data["names"].length > 0){
            for(var i=0;i<data["names"].length;i++){
                var name = fastmap.dataApi.rdTollgateName(data["names"][i]);
                this.names.push(name);
            }
        }
        this.passages = [];
        if(data["passages"] && data["passages"].length > 0){
            for(var i=0;i<data["passages"].length;i++){
                var passage = fastmap.dataApi.rdTollgatePassage(data["passages"][i]);
                this.passages.push(passage);
            }
        }
        this.feeStd = data["feeStd"] || 0;
        this.systemId = data["systemId"] || 0;
        this.locationFlag = data["locationFlag"] || 0;
        this.uFields = data["uFields"] || null;
        this.uDate = data["uDate"] || null;
        this.rowId = data["rowId"] || null;
        this.uRecord = data["uRecord"] || 0;
    },

    /**
     * 获取RdTollgate简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["pid"] = this.pid;
        data["nodePid"] = this.nodePid;
        data["inLinkPid"]  = this.inLinkPid;
        data["outLinkPid"]  = this.outLinkPid;
        data["type"] = this.type;
        data["passageNum"] = this.passageNum;
        data["etcFigureCode"] = this.etcFigureCode;
        data["hwName"] = this.hwName;
        data["feeType"] = this.feeType;
        data["feeStd"] = this.feeStd;
        data["names"] = [];
        for (var i = 0; i < this.names.length; i++) {
            data["names"].push(this.names[i].getIntegrate());
        }
        data["passages"] = [];
        for (var i = 0; i < this.passages.length; i++) {
            data["passages"].push(this.passages[i].getIntegrate());
        }
        data["systemId"] = this.systemId;
        data["locationFlag"] = this.locationFlag;
        data["uFields"] = this.uFields;
        data["uDate"] = this.uDate;
        data["rowId"] = this.rowId;
        data["uRecord"] = this.uRecord;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取RdTollgate详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["pid"] = this.pid;
        data["nodePid"] = this.nodePid;
        data["inLinkPid"]  = this.inLinkPid;
        data["outLinkPid"]  = this.outLinkPid;
        data["type"] = this.type;
        data["passageNum"] = this.passageNum;
        data["etcFigureCode"] = this.etcFigureCode;
        data["hwName"] = this.hwName;
        data["feeType"] = this.feeType;
        data["feeStd"] = this.feeStd;
        data["names"] = [];
        for (var i = 0; i < this.names.length; i++) {
            data["names"].push(this.names[i].getIntegrate());
        }
        data["passages"] = [];
        for (var i = 0; i < this.passages.length; i++) {
            data["passages"].push(this.passages[i].getIntegrate());
        }
        data["systemId"] = this.systemId;
        data["locationFlag"] = this.locationFlag;
        data["uFields"] = this.uFields;
        data["uDate"] = this.uDate;
        data["rowId"] = this.rowId;
        data["uRecord"] = this.uRecord;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * RdTollgate初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdTollgate = function (data, options) {
    return new fastmap.dataApi.RdTollgate(data, options);
}


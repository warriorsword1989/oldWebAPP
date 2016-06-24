/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.RdBranchSeriesBranch=fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDBRANCHSERIESBRANCH";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.rowId = data["rowId"];
        this.branchPid = data["branchPid"];
        this.voiceDir = data["voiceDir"] || 0;
        this.arrowCode = data["arrowCode"] || "";
        this.type = data["type"] || 0;
        this.patternCode = data["patternCode"] || "";
        this.arrowFlag = data["arrowFlag"] || 0;
    },

    getIntegrate:function(){
        var data={};
        data["rowId"] = this.rowId;
        data["branchPid"] = this.branchPid;
        data["voiceDir"] = this.voiceDir;
        data["arrowCode"] = this.arrowCode;
        data["type"] = this.type;
        data["patternCode"] = this.patternCode;
        data["arrowFlag"] = this.arrowFlag;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    getSnapShot:function(){
        var data={};
        data["rowId"] = this.rowId;
        data["branchPid"] = this.branchPid;
        data["voiceDir"] = this.voiceDir;
        data["arrowCode"] = this.arrowCode;
        data["type"] = this.type;
        data["patternCode"] = this.patternCode;
        data["arrowFlag"] = this.arrowFlag;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
})

fastmap.dataApi.rdBranchSeriesBranch = function (data, options) {
    return new fastmap.dataApi.RdBranchSeriesBranch(data, options);
}
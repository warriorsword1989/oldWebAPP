/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.rdBranchVia=fastmap.dataApi.rdBranch.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDBRANCHVIA";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.rowId = data["rowId"];
        this.groupId = data["groupId"] || 1;
        this.linkPid = data["linkPid"];
        this.seqNum = data["seqNum"] || 1;
    },

    getSnapShot:function(){
        var data={};
        data["rowId"] = this.rowId;
        data["groupId"] = this.groupId;
        data["linkPid"] = this.linkPid;
        data["seqNum"] = this.seqNum;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    getIntegrate:function(){
        var data={};
        data["rowId"] = this.rowId;
        data["groupId"] = this.groupId;
        data["linkPid"] = this.linkPid;
        data["seqNum"] = this.seqNum;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
})
/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.rdBranchVia=fastmap.dataApi.rdBranch.extend({
    branchPid:null,
    groupId:1,
    linkPid:null,
    seqNum:1,

    initialize: function (data, options) {
        L.setOptions(this, options);
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.rowId = data["rowId"];
        this.groupId = data["groupId"];
        this.linkPid = data["linkPid"];
        this.seqNum = data["seqNum"];
    },

    getSnapShot:function(){
        var data={};
        data["rowId"] = this.rowId;
        data["groupId"] = this.groupId;
        data["linkPid"] = this.linkPid;
        data["seqNum"] = this.seqNum;

        return data;
    },

    getIntegrate:function(){
        var data={};
        data["rowId"] = this.rowId;
        data["groupId"] = this.groupId;
        data["linkPid"] = this.linkPid;
        data["seqNum"] = this.seqNum;

        return data;
    }
})
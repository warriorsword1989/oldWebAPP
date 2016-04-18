/**
 * Created by wangtun on 2016/3/14.
 */
fastmap.dataApi.rdLaneVIA=fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.rowId = data["rowId"];
        this.groupId = data["groupId"] || 1;
        this.linkPid = data["linkPid"];
        this.seqNum = data["seqNum"] || 1;
        this.topologyId = data["topologyId"] || 0;
    },

    getSnapShot:function(){
        var data={};
        data["rowId"] = this.rowId;
        data["groupId"] = this.groupId;
        data["linkPid"] = this.linkPid;
        data["seqNum"] = this.seqNum;
        data["topologyId"] = this.topologyId;

        return data;
    },

    getIntegrate:function(){
        var data={};
        data["rowId"] = this.rowId;
        data["groupId"] = this.groupId;
        data["linkPid"] = this.linkPid;
        data["seqNum"] = this.seqNum;
        data["topologyId"] = this.topologyId;

        return data;
    }
})
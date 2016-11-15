/**
 * Created by liuyang on 2016/11/14.
 */
fastmap.dataApi.RdLaneTopoVia=fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDLANETOPOVIA";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.rowId = data["rowId"];
        this.topoId = data["topoId"];
        this.lanePid = data["lanePid"] || 0;
        this.viaLinkPid = data["viaLinkPid"] || 1;
        this.groupId = data["groupId"] || 1;
        this.seqNum = data["seqNum"] || 1;
    },

    getSnapShot:function(){
        var data={};
        data["rowId"] = this.rowId;
        data["topoId"] = this.topoId;
        data["lanePid"] = this.lanePid;
        data["viaLinkPid"] = this.viaLinkPid;
        data["groupId"] = this.groupId;
        data["seqNum"] = this.seqNum;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    getIntegrate:function(){
        var data={};
        data["rowId"] = this.rowId;
        data["topoId"] = this.topoId;
        data["lanePid"] = this.lanePid;
        data["viaLinkPid"] = this.viaLinkPid;
        data["groupId"] = this.groupId;
        data["seqNum"] = this.seqNum;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
})

fastmap.dataApi.rdLaneTopoVia = function (data, options) {
    return new fastmap.dataApi.RdLaneTopoVia(data, options);
}

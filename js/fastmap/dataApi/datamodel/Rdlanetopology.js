/**
 * Created by wangtun on 2016/3/14.
 */
fastmap.dataApi.rdLaneTopology=fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.busLaneInfo = data["busLaneInfo"] || 0;
        this.connexityPid = data["connexityPid"];
        this.inLaneInfo = data["inLaneInfo"] || 0;
        this.outLinkPid = data["outLinkPid"];
        this.reachDir = data["reachDir"] || 0;
        this.relationshipType = data["relationshipType"] || 1;
        this.vias=[];
        for(var i=0;i<data["vias"].length;i++){
            var via=new fastmap.dataApi.rdLaneVIA(data["vias"][i]);
            this.vias.push(via);
        }
    },

    getSnapShot:function(){
        var data={};
        data["pid"] = this.pid;
        data["busLaneInfo"] = this.busLaneInfo;
        data["connexityPid"] = this.connexityPid;
        data["inLaneInfo"] = this.inLaneInfo;
        data["outLinkPid"] = this.outLinkPid;
        data["reachDir"] = this.reachDir;
        data["relationshipType"] = this.relationshipType;
        data["vias"] = [];

        for(var i=0;i<this.vias.length;i++){
            data["vias"].push(this.vias.getIntegrate())
        }

        return data;
    },

    getIntegrate:function(){
        var data={};
        data["pid"] = this.pid;
        data["busLaneInfo"] = this.busLaneInfo;
        data["connexityPid"] = this.connexityPid;
        data["inLaneInfo"] = this.inLaneInfo;
        data["outLinkPid"] = this.outLinkPid;
        data["reachDir"] = this.reachDir;
        data["relationshipType"] = this.relationshipType;
        data["vias"] = [];

        for(var i=0;i<this.vias.length;i++){
            data["vias"].push(this.vias.getIntegrate())
        }
        return data;
    }
})
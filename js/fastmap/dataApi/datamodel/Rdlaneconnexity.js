/**
 * Created by wangtun on 2016/3/14.
 */
fastmap.dataApi.rdLaneConnexity=fastmap.dataApi.GeoDataModel.extend({
    pid:null,
    inLinkPid:null,
    nodePid:null,
    laneInfo:"",
    conflictFlag:0,
    kgFlag:0,
    laneNum:0,
    leftExtend:0,
    rightExtend:0,
    srcFlag:0,
    topos:[],

    initialize: function (data, options) {
        L.setOptions(this, options);
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.inLinkPid = data["inLinkPid"];
        this.nodePid = data["nodePid"];
        this.laneInfo = data["laneInfo"] || "";
        this.conflictFlag = data["conflictFlag"] || 0;
        this.kgFlag = data["kgFlag"] || 0;
        this.laneNum = data["laneNum"] || 0;
        this.leftExtend = data["leftExtend"]|| 0;
        this.rightExtend = data["rightExtend"] || 0;
        this.srcFlag = data["srcFlag"] ||0;
        this.topos=[];
        for(var i=0;i<data["topos"].length;i++){
            var topos= new fastmap.dataApi.rdLaneTopology(data["topos"][i]);
            this.topos.push(topos);
        }
    },

    getSnapShot:function(){
        var data={};
        data["pid"] = this.pid;
        data["inLinkPid"] = this.inLinkPid;
        data["nodePid"] = this.nodePid;
        data["laneInfo"] = this.laneInfo;
        data["conflictFlag"] = this.conflictFlag;
        data["kgFlag"] = this.kgFlag;
        data["laneNum"] = this.laneNum;
        data["leftExtend"] = this.leftExtend;
        data["rightExtend"] = this.rightExtend;
        data["srcFlag"] = this.srcFlag;
        data["topos"]=[];
        for(var i=0;i<this.topos.length;i++){
            data["topos"].push(this.topos[i].getIntegrate())
        }

        return data;
    },

    getIntegrate:function(){
        var data={};
        data["pid"] = this.pid;
        data["inLinkPid"] = this.inLinkPid;
        data["nodePid"] = this.nodePid;
        data["laneInfo"] = this.laneInfo;
        data["conflictFlag"] = this.conflictFlag;
        data["kgFlag"] = this.kgFlag;
        data["laneNum"] = this.laneNum;
        data["leftExtend"] = this.leftExtend;
        data["rightExtend"] = this.rightExtend;
        data["srcFlag"] = this.srcFlag;
        data["topos"]=[];
        for(var i=0;i<this.topos.length;i++){
            data["topos"].push(this.topos[i].getIntegrate())
        }

        return data;
    }
})
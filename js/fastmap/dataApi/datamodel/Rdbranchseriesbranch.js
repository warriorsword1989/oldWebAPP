/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.rdBranchSeriesBranch=fastmap.dataApi.rdBranch.extend({
    pid:null,
    voiceDir:0,
    type:0,
    branchPid:"",
    patternCode:"",
    arrowCode:"",
    arrowFlag:0,

    initialize: function (data, options) {
        L.setOptions(this, options);
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.branchPid = data["branchPid"];
        this.voiceDir = data["voiceDir"];
        this.arrowCode = data["arrowCode"];
        this.type = data["type"];
        this.patternCode = data["patternCode"];
        this.arrowFlag = data["arrowFlag"];
    },

    getIntegrate:function(){
        var data={};
        data["pid"] = this.pid;
        data["branchPid"] = this.branchPid;
        data["voiceDir"] = this.voiceDir;
        data["arrowCode"] = this.arrowCode;
        data["type"] = this.type;
        data["patternCode"] = this.patternCode;
        data["arrowFlag"] = this.arrowFlag;
        return data;
    },

    getSnapShot:function(){
        var data={};
        data["pid"] = this.pid;
        data["branchPid"] = this.branchPid;
        data["voiceDir"] = this.voiceDir;
        data["arrowCode"] = this.arrowCode;
        data["type"] = this.type;
        data["patternCode"] = this.patternCode;
        data["arrowFlag"] = this.arrowFlag;
        return data;
    }
})
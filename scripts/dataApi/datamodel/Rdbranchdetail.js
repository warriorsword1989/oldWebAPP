/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.rdBranchDetail=fastmap.dataApi.rdBranch.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.branchPid = data["branchPid"];
        this.branchType = data["branchType"] || 0;
        this.estabType = data["estabType"]|| 0;
        this.exitNum = data["exitNum"] || "";
        this.guideCode = data["guideCode"] || 0;
        this.nameKind = data["nameKind"] || 0;
        this.patternCode = data["patternCode"] || "";
        this.voiceDir = data["voiceDir"]||0;
        this.arrowCode = data["arrowCode"] || "";
        this.arrowFlag = data["arrowFlag"] || 0;
        this.names=[];
        for(var i=0;i<data["names"].length;i++){
            var name= new fastmap.dataApi.rdBranchName(data["names"][i]);
            this.names.push(name);
        }
    },

    getIntegrate:function(){
        var data={};
        data["pid"] = this.pid;
        data["branchPid"] = this.branchPid;
        data["branchType"] = this.branchType;
        data["estabType"] = this.estabType;
        data["exitNum"] = this.exitNum;
        data["guideCode"] = this.guideCode;
        data["nameKind"] = this.nameKind;
        data["patternCode"] = this.patternCode;
        data["voiceDir"] = this.voiceDir;
        data["arrowCode"] = this.arrowCode;
        data["arrowFlag"] = this.arrowFlag;

        data["names"] = [];
        for(var i=0;i<this.names.length;i++){
            data["names"].push(this.names[i].getIntegrate());
        }

        return data;
    },

    getSnapShot:function(){
        var data={};
        data["pid"] = this.pid;
        data["branchPid"] = this.branchPid;
        data["branchType"] = this.branchType;
        data["estabType"] = this.estabType;
        data["exitNum"] = this.exitNum;
        data["guideCode"] = this.guideCode;
        data["nameKind"] = this.nameKind;
        data["patternCode"] = this.patternCode;
        data["voiceDir"] = this.voiceDir;
        data["arrowCode"] = this.arrowCode;
        data["arrowFlag"] = this.arrowFlag;

        data["names"] = [];
        for(var i=0;i<this.names.length;i++){
            data["names"].push(this.names[i].getIntegrate());
        }

        return data;
    }
})
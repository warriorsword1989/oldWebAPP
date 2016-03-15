/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.rdBranchDetail=fastmap.dataApi.rdBranch.extend({
    pid:null,
    branchPid:null,
    branchType:0,
    estabType:0,
    exitNum:'',
    guideCode:0,
    nameKind:0,
    names:[],
    patternCode:"",
    voiceDir:0,

    initialize: function (data, options) {
        L.setOptions(this, options);
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.branchPid = data["branchPid"];
        this.branchType = data["branchType"];
        this.estabType = data["estabType"];
        this.exitNum = data["exitNum"];
        this.guideCode = data["guideCode"];
        this.nameKind = data["nameKind"];
        this.patternCode = data["patternCode"];
        this.voiceDir = data["voiceDir"];

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

        data["names"] = [];
        for(var i=0;i<this.names.length;i++){
            data["names"].push(this.names[i].getIntegrate());
        }

        return data;
    }
})
/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.rdBranchName=fastmap.dataApi.rdBranch.extend({
    pid:null,
    seqNum:1,
    nameGroupId:1,
    detailId:0,
    nameClass:0,
    langCode:"CHI",
    codeType:0,
    name:"",
    phonetic:"",
    srcFlag:0,
    voiceFile:"",


    initialize: function (data, options) {
        L.setOptions(this, options);
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.seqNum = data["seqNum"];
        this.nameGroupId = data["nameGroupId"];
        this.detailId = data["detailId"];
        this.nameClass = data["nameClass"];
        this.langCode = data["langCode"];
        this.codeType = data["codeType"];
        this.name = data["name"];
        this.phonetic = data["phonetic"];
        this.srcFlag = data["srcFlag"];
        this.voiceFile = data["voiceFile"];
    },

    getIntegrate:function(){
        var data={};
        data["pid"] = this.pid;
        data["seqNum"] = this.seqNum;
        data["nameGroupId"] = this.nameGroupId;
        data["detailId"] = this.detailId;
        data["nameClass"] = this.nameClass;
        data["langCode"] = this.langCode;
        data["codeType"] = this.codeType;
        data["name"] = this.name;
        data["phonetic"] = this.phonetic;
        data["srcFlag"] = this.srcFlag;
        data["voiceFile"] = this.voiceFile;
        return data;
    },

    getSnapShot:function(){
        var data={};
        data["pid"] = this.pid;
        data["seqNum"] = this.seqNum;
        data["nameGroupId"] = this.nameGroupId;
        data["detailId"] = this.detailId;
        data["nameClass"] = this.nameClass;
        data["langCode"] = this.langCode;
        data["codeType"] = this.codeType;
        data["name"] = this.name;
        data["phonetic"] = this.phonetic;
        data["srcFlag"] = this.srcFlag;
        data["voiceFile"] = this.voiceFile;
        return data;
    }
})
/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.rdBranchSignBoardName=fastmap.dataApi.rdBranch.extend({
    pid:null,
    seqNum:1,
    nameGroupId:1,
    signboardId:"",
    nameClass:0,
    langCode:"CHI",
    codeType:0,
    name:"",
    phonetic:"",
    voiceFile:"",
    srcFlag:0,

    initialize: function (data, options) {
        L.setOptions(this, options);
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.seqNum = data["seqNum"];
        this.nameGroupId = data["nameGroupId"];
        this.signboardId = data["signboardId"];
        this.nameClass = data["nameClass"];
        this.langCode = data["langCode"];
        this.codeType = data["codeType"];
        this.name = data["name"];
        this.phonetic = data["phonetic"];
        this.voiceFile = data["voiceFile"];
        this.srcFlag = data["srcFlag"];
    },

    getIntegrate:function(){
        var data={};
        data["pid"] = this.pid;
        data["seqNum"] = this.seqNum;
        data["nameGroupId"] = this.nameGroupId;
        data["signboardId"] = this.signboardId;
        data["nameClass"] = this.nameClass;
        data["langCode"] = this.langCode;
        data["codeType"] = this.codeType;
        data["name"] = this.name;
        data["phonetic"] = this.phonetic;
        data["voiceFile"] = this.voiceFile;
        data["srcFlag"] = this.srcFlag;

        return data;
    },

    getSnapShot:function(){
        var data={};
        data["pid"] = this.pid;
        data["seqNum"] = this.seqNum;
        data["nameGroupId"] = this.nameGroupId;
        data["signboardId"] = this.signboardId;
        data["nameClass"] = this.nameClass;
        data["langCode"] = this.langCode;
        data["codeType"] = this.codeType;
        data["name"] = this.name;
        data["phonetic"] = this.phonetic;
        data["voiceFile"] = this.voiceFile;
        data["srcFlag"] = this.srcFlag;

        return data;
    }
})
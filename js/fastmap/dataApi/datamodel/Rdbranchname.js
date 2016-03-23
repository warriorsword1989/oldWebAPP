/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.rdBranchName=fastmap.dataApi.rdBranch.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.seqNum = data["seqNum"] || 1;
        this.nameGroupid = data["nameGroupid"] || 1;
        this.detailId = data["detailId"];
        this.nameClass = data["nameClass"] || 0;
        this.langCode = data["langCode"] || "CHI";
        this.codeType = data["codeType"] || 0;
        this.name = data["name"] || "";
        this.phonetic = data["phonetic"] || "";
        this.srcFlag = data["srcFlag"] || 0;
        this.voiceFile = data["voiceFile"] || "";
    },

    getIntegrate:function(){
        var data={};
        data["pid"] = this.pid;
        data["seqNum"] = this.seqNum;
        data["nameGroupid"] = this.nameGroupid;
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
        data["nameGroupid"] = this.nameGroupid;
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
/***
 * rdBranchName 名字初始化函数
 * @param data 分歧名字数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdBranchName}
 */
fastmap.dataApi.rdbranchname = function (data, options) {
    return new fastmap.dataApi.rdBranchName(data, options);
}
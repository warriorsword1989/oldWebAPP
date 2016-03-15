/**
 * Created by wangtun on 2016/3/14.
 */
fastmap.dataApi.rdCrossName=fastmap.dataApi.rdRestriction.extend({
    pid:null,
    nameGroupId:1,
    langCode:"CHI",
    name:"",
    phonetic:"",
    srcFlag:0,

    rowId:"",

    initialize: function (data, options) {
        L.setOptions(this, options);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.nameGroupId = data["nameGroupId"];
        this.langCode = data["langCode"];
        this.name = data["name"];
        this.phonetic=data["phonetic"];
        this.srcFlag=data["srcFlag"];
        this.rowId = data["rowId"];
    },

    getSnapShot:function(){
        var data={};
        data["pid"] = this.pid ;
        data["nameGroupId"] = this.nameGroupId;
        data["langCode"] = this.langCode;
        data["name"] = this.name;
        data["phonetic"] = this.phonetic;
        data["srcFlag"] = this.srcFlag;
        data["rowId"] = this.rowId;

        return data;
    },
    getIntegrate:function(){
        var data={};
        data["pid"] = this.pid ;
        data["nameGroupId"] = this.nameGroupId;
        data["langCode"] = this.langCode;
        data["name"] = this.name;
        data["phonetic"] = this.phonetic;
        data["srcFlag"] = this.srcFlag;
        data["rowId"] = this.rowId;

        return data;
    }
})
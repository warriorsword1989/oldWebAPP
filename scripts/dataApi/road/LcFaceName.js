/**
 * Created by linglong on 2016/7/27.
 */
fastmap.dataApi.LcFaceName=fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "LCFACENAME";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.rowId = data["rowId"];
        this.nameGroupid = data["nameGroupid"] || 1;
        this.langCode = data["longCode"] || "CHI";
        this.name = data["name"] || "";
        this.phonetic = data["phonetic"] || "";
        this.srcFlag = data["srcFlag"] || 0;
    },

    getIntegrate:function(){
        var data={};
        data["pid"] = this.pid;
        data["nameGroupid"] = this.nameGroupid;
        data["langCode"] = this.langCode;
        data["name"] = this.name;
        data["phonetic"] = this.phonetic;
        data["srcFlag"] = this.srcFlag;
        data["rowId"] = this.rowId;
        return data;
    },

    getSnapShot:function(){
    	var data={};
        data["pid"] = this.pid;
        data["nameGroupId"] = this.nameGroupId;
        data["langCode"] = this.langCode;
        data["name"] = this.name;
        data["phonetic"] = this.phonetic;
        data["srcFlag"] = this.srcFlag;
        return data;
    }
})

fastmap.dataApi.lcFaceName = function (data, options) {
    return new fastmap.dataApi.LcFaceName(data, options);
}
/**
 * Created by mali on 2016/7/27.
 */
fastmap.dataApi.LuFaceName=fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "LUFACENAME";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.nameGroupId = data["nameGroupId"] || 1;
        this.langCode = data["langCode"] || "CHI";
        this.name = data["name"] || "";
        this.phonetic = data["phonetic"] || "";
        this.srcFlag = data["srcFlag"] || 0;
    },

    getIntegrate:function(){
        var data={};
        data["pid"] = this.pid;
        data["nameGroupId"] = this.nameGroupId;
        data["langCode"] = this.langCode;
        data["name"] = this.name;
        data["phonetic"] = this.phonetic;
        data["srcFlag"] = this.srcFlag;
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

fastmap.dataApi.luFaceName = function (data, options) {
    return new fastmap.dataApi.LuFaceName(data, options);
}
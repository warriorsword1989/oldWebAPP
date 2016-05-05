/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.RdBranchRealImage=fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDBRANCHREALIMAGE";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.branchPid = data["branchPid"];
        this.imageType = data["imageType"] || 0;
        this.realCode = data["realCode"] || "";
        this.arrowCode = data["arrowCode"] || "";
    },

    getIntegrate:function(){
        var data={};
        data["branchPid"] = this.pid;
        data["imageType"] = this.imageType;
        data["realCode"] = this.realCode;
        data["arrowCode"] = this.arrowCode;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    getSnapShot:function(){
        var data={};
        data["branchPid"] = this.pid;
        data["imageType"] = this.imageType;
        data["realCode"] = this.realCode;
        data["arrowCode"] = this.arrowCode;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
})
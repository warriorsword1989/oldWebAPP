/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.RdBranchSignBoard=fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDBRANCHSIGNBOARD";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.branchPid = data["branchPid"];
        this.backimageCode = data["backimageCode"] || "";
        this.arrowCode = data["arrowCode"] || "";
    },

    getIntegrate:function(){
        var data={};
        data["pid"] = this.pid;
        data["branchPid"] = this.branchPid;
        data["backimageCode"] = this.backimageCode;
        data["arrowCode"] = this.arrowCode;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    getSnapShot:function(){
        var data={};
        data["pid"] = this.pid;
        data["branchPid"] = this.branchPid;
        data["backimageCode"] = this.backimageCode;
        data["arrowCode"] = this.arrowCode;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
})

fastmap.dataApi.rdBranchSignBoard = function (data, options) {
    return new fastmap.dataApi.RdBranchSignBoard(data, options);
}
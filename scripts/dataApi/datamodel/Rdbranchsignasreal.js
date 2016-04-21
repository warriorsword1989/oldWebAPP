/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.RdBranchSignAsreal=fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDBRANCHSIGNASREAL";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.branchPid = data["branchPid"];
        this.signboardId = data["signboardId"];
        this.arrowCode = data["arrowCode"] || "";
        this.memo = data["memo"] || "";
        this.svgfileCode = data["svgfileCode"] || "";
    },

    getIntegrate:function(){
        var data={};
        data["pid"] = this.pid;
        data["branchPid"] = this.branchPid;
        data["signboardId"] = this.signboardId;
        data["arrowCode"] = this.arrowCode;
        data["memo"] = this.memo;
        data["svgfileCode"] = this.svgfileCode;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    getSnapShot:function(){
        var data={};
        data["pid"] = this.pid;
        data["branchPid"] = this.branchPid;
        data["signboardId"] = this.signboardId;
        data["arrowCode"] = this.arrowCode;
        data["memo"] = this.memo;
        data["svgfileCode"] = this.svgfileCode;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
})

fastmap.dataApi.RdBranchSignAsreal = function (data, options) {
    return new fastmap.dataApi.RdBranchSignAsreal(data, options);
}
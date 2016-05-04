/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.RdBranchSchematic=fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDBRANCHSCHEMATIC";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.branchPid = data["branchPid"];
        this.schematicCode = data["schematicCode"] || "";
        this.arrowCode = data["arrowCode"] || "";
        this.memo = data["memo"] || "";

    },

    getIntegrate:function(){
        var data={};
        data["pid"] = this.pid;
        data["branchPid"] = this.branchPid;
        data["schematicCode"] = this.schematicCode;
        data["arrowCode"] = this.arrowCode;
        data["memo"] = this.memo;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    getSnapShot:function(){
        var data={};
        data["pid"] = this.pid;
        data["branchPid"] = this.branchPid;
        data["schematicCode"] = this.schematicCode;
        data["arrowCode"] = this.arrowCode;
        data["memo"] = this.memo;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
})

fastmap.dataApi.rdBranchSchematic = function (data, options) {
    return new fastmap.dataApi.RdBranchSchematic(data, options);
}
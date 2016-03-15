/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.rdBranchSchematic=fastmap.dataApi.rdBranch.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
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

        return data;
    },

    getSnapShot:function(){
        var data={};
        data["pid"] = this.pid;
        data["branchPid"] = this.branchPid;
        data["schematicCode"] = this.schematicCode;
        data["arrowCode"] = this.arrowCode;
        data["memo"] = this.memo;

        return data;
    }
})
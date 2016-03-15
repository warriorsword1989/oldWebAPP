/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.rdBranchRealImage=fastmap.dataApi.rdBranch.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
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

        return data;
    },

    getSnapShot:function(){
        var data={};
        data["branchPid"] = this.pid;
        data["imageType"] = this.imageType;
        data["realCode"] = this.realCode;
        data["arrowCode"] = this.arrowCode;

        return data;
    }
})
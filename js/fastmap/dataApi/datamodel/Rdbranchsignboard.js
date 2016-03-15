/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.rdBranchSignBoard=fastmap.dataApi.rdBranch.extend({
    pid:null,
    branchPid:null,
    arrowCode:"",
    backimageCode:"",

    initialize: function (data, options) {
        L.setOptions(this, options);
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.branchPid = data["branchPid"];
        this.backimageCode = data["backimageCode"];
        this.arrowCode = data["arrowCode"];
    },

    getIntegrate:function(){
        var data={};
        data["pid"] = this.pid;
        data["branchPid"] = this.branchPid;
        data["backimageCode"] = this.backimageCode;
        data["arrowCode"] = this.arrowCode;

        return data;
    },

    getSnapShot:function(){
        var data={};
        data["pid"] = this.pid;
        data["branchPid"] = this.branchPid;
        data["backimageCode"] = this.backimageCode;
        data["arrowCode"] = this.arrowCode;

        return data;
    }
})
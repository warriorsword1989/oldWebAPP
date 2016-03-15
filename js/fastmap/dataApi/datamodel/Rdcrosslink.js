/**
 * Created by wangtun on 2016/3/14.
 */
fastmap.dataApi.rdCrossLink=fastmap.dataApi.rdRestriction.extend({
    pid:null,
    linkPid:null,
    rowId:null,

    initialize: function (data, options) {
        L.setOptions(this, options);
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid=data["pid"];
        this.linkPid=data["linkPid"];
        this.rowId = data["rowId"];
    },

    getIntegrate:function(){
        var data = {};
        data["pid"] = this.pid;
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;

        return data;
    },

    getSnapShot:function(){
        var data = {};
        data["pid"] = this.pid;
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;

        return data;
    }
})
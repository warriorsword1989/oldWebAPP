/**
 * Created by wangtun on 2016/3/14.
 */
fastmap.dataApi.rdCrossLink=fastmap.dataApi.rdRestriction.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDCROSSLINK";
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
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    getSnapShot:function(){
        var data = {};
        data["pid"] = this.pid;
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
})
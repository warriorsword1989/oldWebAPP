/**
 * Created by wangtun on 2016/3/14.
 */
fastmap.dataApi.rdCrossNode=fastmap.dataApi.rdRestriction.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.isMain = data["isMain"] || 0;
        this.nodePid = data["nodePid"];
        this.rowId = data["rowId"];
    },

    getIntegrate:function(){
        var data={};
        data["pid"] = this.pid ;
        data["isMain"] = this.isMain;
        data["nodePid"] = this.nodePid ;
        data["rowId"] = this.rowId;

        return data;
    },

    getSnapShot:function(){
        var data={};
        data["pid"] = this.pid ;
        data["isMain"] = this.isMain;
        data["nodePid"] = this.nodePid ;
        data["rowId"] = this.rowId;

        return data;
    }


})
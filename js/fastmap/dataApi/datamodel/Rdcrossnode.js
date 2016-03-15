/**
 * Created by wangtun on 2016/3/14.
 */
fastmap.dataApi.rdCrossNode=fastmap.dataApi.rdRestriction.extend({
    pid:null,
    isMain:1,
    nodePid:null,
    rowId:"",

    initialize: function (data, options) {
        L.setOptions(this, options);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.isMain = data["isMain"];
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
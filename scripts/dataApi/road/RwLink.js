/**
 * Created by zhaohang on 2016/4/7.
 */
fastmap.dataApi.RwLink = fastmap.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RWLINK";
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData:function(data){
        this.pid = data["pid"];
        this.linkPid = data["linkPid"];
        this.featurePid = data["featurePid"] || 0;
        this.sNodePid = data["sNodePid"];
        this.eNodePid = data["eNodePid"];
        this.kind = data["kind"] || 1;
        this.form = data["form"] || 0;
        this.length = data["length"] || 0;
        this.geoemtry = data["geoemtry"];
        this.meshId = data["meshId"] || 0;
        this.scale = data["scale"] || 0;
        this.detailFlag = data["detailFlag"] || 0;
        this.editFlag = data["editFlag"] || 1;
        this.color = data["color"] || null;

       /* this.links = [];
        if (data["links"]&&data["links"].length > 0) {
            for (var i = 0, len = data["links"].length; i < len; i++) {
                var link =fastmap.dataApi.rdgsclink(data["links"][i]);
                this.links.push(link);
            }

        }*/


    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["linkPid"] = this.linkPid;
        data["featurePid"] = this.featurePid;
        data["sNodePid"] = this.sNodePid;
        data["eNodePid"] = this.eNodePid;
        data["kind"] = this.kind;
        data["form"] = this.form;
        data["length"] = this.length;
        data["geometry"] = this.geometry;
        data["meshId"] = this.meshId;
        data["scale"] = this.scale;
        data["detailFlag"] = this.detailFlag;
        data["editFlag"] = this.editFlag;
        data["color"] = this.color;
        data["geoLiveType"] = this.geoLiveType;
      /*  var links = [];
        for (var i = 0, len = this.links.length; i < len; i++) {
            links.push(this.links[i].getIntegrate());
        }
        data["links"] = links;*/
        return data;

    },

    getSnapShot: function () {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["featurePid"] = this.featurePid;
        data["sNodePid"] = this.sNodePid;
        data["eNodePid"] = this.eNodePid;
        data["kind"] = this.kind;
        data["form"] = this.form;
        data["length"] = this.length;
        data["geometry"] = this.geometry;
        data["meshId"] = this.meshId;
        data["scale"] = this.scale;
        data["detailFlag"] = this.detailFlag;
        data["editFlag"] = this.editFlag;
        data["color"] = this.color;
        data["geoLiveType"] = this.geoLiveType;
/*
        var links = [];
        for (var i = 0, len = this.links.length; i < len; i++) {
            links.push(this.links[i].getIntegrate());
        }
        data["links"] = links;*/
        return data;
    },

});

fastmap.dataApi.rwLink = function (data, options) {
    return new fastmap.dataApi.RwLink(data, options);
}


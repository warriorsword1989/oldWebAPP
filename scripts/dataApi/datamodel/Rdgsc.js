/**
 * Created by zhaohang on 2016/4/7.
 */
fastmap.dataApi.rdGsc = fastmap.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDGSC";
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData:function(data){
        this.pid = data["pid"];
        this.geometry = data["geometry"];
        this.processFlag = data["processFlag"] || 1;

        this.links = [];
        if (data["links"]&&data["links"].length > 0) {
            for (var i = 0, len = data["links"].length; i < len; i++) {
                var link =fastmap.dataApi.rdgsclink(data["links"][i]);
                this.links.push(link);
            }

        }


    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["geometry"] = this.geometry;
        data["processFlag"] = this.processFlag;
        data["geoLiveType"] = this.geoLiveType;

        var links = [];
        for (var i = 0, len = this.links.length; i < len; i++) {
            links.push(this.links[i].getIntegrate());
        }
        data["links"] = links;
        return data;

    },

    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["geometry"] = this.geometry;
        data["processFlag"] = this.processFlag;
        data["geoLiveType"] = this.geoLiveType;

        var links = [];
        for (var i = 0, len = this.links.length; i < len; i++) {
            links.push(this.links[i].getIntegrate());
        }
        data["links"] = links;
        return data;
    },

});

fastmap.dataApi.rdgsc = function (data, options) {
    return new fastmap.dataApi.rdGsc(data, options);
}


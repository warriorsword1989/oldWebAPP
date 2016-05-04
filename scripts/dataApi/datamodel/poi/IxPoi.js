/**
 * Created by chenxiao on 2016/4/21.
 */
FM.dataApi.IxPoi = FM.dataApi.GeoDataModel.extend({
    geoLiveType: "IX_POI",
    /*
     * 返回参数赋值
     */
    setAttributes: function(data) {
        this.fid = data["fid"];
        this.pid = data["pid"] || null;
        this.name = data["name"];
        this.kindCode = data["kindCode"];
        this.lifecycle = data['lifecycle'];
        this.auditStatus = data['auditStatus'];
        this.rawFields = data['rawFields'];

        this.chargingPole = [];
        if (data["chargingPole"]&&data["chargingPole"].length > 0) {
            for (var i = 0, len = data["chargingPole"].length; i < len; i++) {
                var name =fastmap.dataApi.adAdminName(data["chargingPole"][i]);
                this.chargingPole.push(name);
            }
        }
    },
    getSnapShot: function() {
        var data = {};
        data["fid"] = this.fid;
        data["pid"] = this.pid;
        data["name"] = this.name;
        data["kindCode"] = this.kindCode;
        data["lifecycle"] = this.lifecycle;
        data["auditStatus"] = this.auditStatus;
        data["rawFields"] = this.rawFields;
        return data;
    },
    statics: {
        getList: function(param, callback) {
            FM.dataApi.ajax.get("editsupport/poi/query", param, function(data) {
                var ret = [],
                    poi;
                for (var i = 0; i < data.data.data.length; i++) {
                    poi = new FM.dataApi.IxTest(data.data.data[i]);
                    ret.push(poi);
                }
                callback(ret);
            });
        },
    },
});
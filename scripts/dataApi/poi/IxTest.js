/**
 * Created by chenxiao on 2016/4/21.
 */
FM.dataApi.IxTest = FM.dataApi.GeoDataModel.extend({
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
    },
    getIntegrate: function () {
        var data = {};
        data["fid"] = this.fid;
        data["pid"] = this.pid;
        data["name"] = this.name;
        data["kindCode"] = this.kindCode;
        data["lifecycle"] = this.lifecycle;
        data["auditStatus"] = this.auditStatus;
        data["rawFields"] = this.rawFields;
        return data;
    }
});
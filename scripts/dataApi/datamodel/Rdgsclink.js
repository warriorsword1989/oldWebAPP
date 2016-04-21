/**
 * Created by zhaohang on 2016/4/7.
 */
fastmap.dataApi.rdGscLink = fastmap.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        if(!data["pid"]){
            throw "form对象没有对应link"
        }
        else{
            this.id = data["pid"];
        }

        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData:function(data){
        this.pid = data["pid"];
        this.zlevel = data["zlevel"] || 0;
        this.linkPid = data["linkPid"] || 0;
        this.tableName = data["tableName"]|| "";
        this.shpSeqNum = data["shpSeqNum"] || 1;
        this.startEnd = data["startEnd"] || 0;

    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["zlevel"] = this.zlevel;
        data["linkPid"] = this.linkPid;
        data["tableName"] = this.tableName;
        data["shpSeqNum"] = this.shpSeqNum;
        data["startEnd"] = this.startEnd;

        return data;

    },

    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["zlevel"] = this.zlevel;
        data["linkPid"] = this.linkPid;
        data["tableName"] = this.tableName;
        data["shpSeqNum"] = this.shpSeqNum;
        data["startEnd"] = this.startEnd;

        return data;
    },

});

fastmap.dataApi.rdgsclink = function (data, options) {
    return new fastmap.dataApi.rdGscLink(data, options);
}

/**
 * Created by linglong on 2016/4/29.
 */
 FM.dataApi.IxPoiImage = FM.dataApi.GeoDataModel.extend({
    /*
     * 初始化
     */
    initialize: function(data, options) {
        FM.setOptions(this, options);
        this.geoLiveType = "IxPoiImage";
        this.setAttributeData(data);
    },
    /*
     * 设置参数赋值;
     */
    setAttributeData: function(data) {
        this.type = data["type"];
        this.url = data["url"] || null;
        this.tag = data["tag"];
    },
    /*
     *获取的PoiImage信息
     */
    getIntegrate: function() {
        var data = {};
        data["type"] = this.type;
        data["url"] = this.url;
        data["tag"] = this.tag;
        return data;
    }
});
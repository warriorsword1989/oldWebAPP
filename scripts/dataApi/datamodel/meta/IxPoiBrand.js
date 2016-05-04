/**
 * Created by liuyang on 2016/4/29.
 */
FM.dataApi.IxPoiBrand = FM.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function(data, options) {
        FM.setOptions(this, options);
        this.geoLiveType = "IXPOIBRAND";
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData:function(data){
        this.category = data["category"] || 0;
        this.chainCode = data["chainCode"] || null;
        this.chainName = data["chainName"] || null;
        this.weight = data["weight"] || 0;
    },

    /*
     *获取的道路信息
     */
    getChain: function () {
        var data = {};
        data["category"] = this.category;
        data["chainCode"] = this.chainCode;
        data["chainName"] = this.chainName;
        data["weight"] = this.weight;
        return data;
    }

});

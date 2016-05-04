/**
 * Created by linglong on 2016/4/29.
 */
 FM.dataApi.IxPoiImage = FM.dataApi.GeoDataModel.extend({

    geoLiveType: "IX_POI_IMAGE",
    
    /*
     * 初始化
     */
    // initialize: function(data, options) {
    //     FM.setOptions(this, options);
    //     this.geoLiveType = "IxPoiImage";
    //     this.setAttributeData(data);
    // },
    /*
     * 设置参数赋值;
     */
    setAttributes: function(data) {
        this.type = data["type"];
        this.url = data["url"] || null;
        this.tag = data["tag"];
    },
});
/**
 * Created by linglong on 2016/4/29.
 */
 FM.dataApi.IxPoiImage = FM.dataApi.DataModel.extend({

    dataModelType: "IX_POI_IMAGE",

    /*
     * UI-->DB
     */
     getIntegrate: function (){
        var ret = {};
        ret['type'] = this.type;
        ret['url'] = this.url; 
        ret['tag'] = this.tag;  
        return ret;
     },
    /*
     *  DB-->UI
     */
    setAttributes: function(data) {
        this.type = data["type"];
        this.url = data["url"] || null;
        this.tag = data["tag"];
    },
});
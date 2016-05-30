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
        if(this.url && this.url.indexOf('?') > -1){
            this.url = this.url.substring(0,this.url.indexOf('?'));
        }
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
        this.tagName = function (){
            var temp = FM.dataApi.Constant.IMAGE_TAG;
            var val = "";
            for (var i = 0 ;i < temp.length ; i++){
                if(temp[i].key == this.tag){
                    val = temp[i].value;
                    break;
                }
            }
            return val;
        }
    },
});
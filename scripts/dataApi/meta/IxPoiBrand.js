/**
 * Created by liuyang on 2016/4/29.
 */
FM.dataApi.IxPoiBrand = FM.dataApi.DataModel.extend({
    dataModelType: "IX_POIBRAND",
    /*
     * 返回参数赋值
     */
    setAttributeData:function(data){
        this.category = data["category"] || 0;
        this.chainCode = data["chainCode"] || null;
        this.chainName = data["chainName"] || null;
        this.weight = data["weight"] || 0;
    },
    statics: {
        getChain: function(param, callback) {
            FM.dataApi.ajax.get("meta/queryChain/", param, function(data) {
                var ret = [],
                    poi;
                for (var i = 0; i < data.data.length; i++) {
                    poi = new FM.dataApi.IxPoiBrand(data.data[i]);
                    ret.push(poi);
                }
                callback(ret);
            });
        },
        getChargeChain: function(param, callback) {
            FM.dataApi.ajax.get("charge/row_edit/queryChain/", param, function(data) {
                var ret = [],
                    poi;
                for (var i = 0; i < data.data.length; i++) {
                    poi = new FM.dataApi.IxPoiBrand(data.data[i]);
                    ret.push(poi);
                }
                callback(ret);
            });
        }
    }


});

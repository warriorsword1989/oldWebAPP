/**
 * Created by wangmingdong on 2016/4/29.
 */
FM.dataApi.IxPoiTopKind = FM.dataApi.DataModel.extend({
    dataModelType: "IX_POI_TOP_KIND",

    /*
     * 返回参数赋值
     */
    setAttributes: function(data) {
        this.id = data["id"];
        this.code = data["code"] || 0;
        this.name = data["name"];
    },

    statics: {
        getList: function(callback) {
            FM.dataApi.ajax.get("meta/queryTopKind/", {}, function(data) {
                var topKinds = [],
                    kind;
                for (var i = 0; i < data.data.length; i++) {
                    kind = new FM.dataApi.IxPoiTopKind(data.data[i]);
                    topKinds.push(kind);
                }
                callback(topKinds);
            });
        }
    }
});
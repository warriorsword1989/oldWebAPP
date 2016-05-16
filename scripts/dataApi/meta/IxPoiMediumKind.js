/**
 * Created by wangmingdong on 2016/4/29.
 */
FM.dataApi.IxPoiMediumKind = FM.dataApi.DataModel.extend({
    dataModelType: "IX_POI_MEDIUM_KIND",

    /*
     * 返回参数赋值
     */
    setAttributes: function(data) {
        this.id = data["id"];
        this.code = data["code"];
        this.name = data["name"];
        this.topId = data["topId"];
    },

    statics: {
        getList: function(callback) {
            FM.dataApi.ajax.get("meta/queryMediumKind/", {}, function(data) {
                var mediumKinds = [],
                    kind;
                for (var i = 0; i < data.data.length; i++) {
                    kind = new FM.dataApi.IxPoiMediumKind(data.data[i]);
                    mediumKinds.push(kind);
                }
                callback(mediumKinds);
            });
        }
    }
});
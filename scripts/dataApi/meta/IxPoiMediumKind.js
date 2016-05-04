/**
 * Created by wangmingdong on 2016/4/29.
 */
FM.dataApi.ixPoiMediumKind = FM.dataApi.DataModel.extend({
    dataModelType: "IX_POI_MEDIUM_KIND",

    /*
     * 返回参数赋值
     */
    setAttributeData: function(data) {
        this.id = data["id"];
        this.code = data["code"];
        this.name = data["name"];
        this.topId = data["topId"];
    },

    statics: {
        getList: function(param, callback) {
            FM.dataApi.ajax.get("fos/meta/queryMediumKind/", param, function(data) {
                var mediumKinds = [],
                    kind;
                for (var i = 0; i < data.data.length; i++) {
                    kind = new FM.dataApi.ixPoiMediumKind(data.data[i]);
                    mediumKinds.push(kind);
                }
                callback(mediumKinds);
            });
        }
    }
});
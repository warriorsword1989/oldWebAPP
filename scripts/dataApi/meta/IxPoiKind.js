/**
 * Created by wangmingdong on 2016/4/29.
 */
FM.dataApi.IxPoiKind = FM.dataApi.DataModel.extend({
    dataModelType: "IX_POI_KIND",

    /*
     * 返回参数赋值
     */
    setAttributes: function(data) {
        this.id = data["id"];
        this.mediumId = data["mediumId"];
        this.kindName = data["kindName"];
        this.kindCode = data["kindCode"];
        this.dispOnLink = data["dispOnLink"];
        this.chainFlag = data['chainFlag'];
        this.level = data['level'];
        this.extend = data['extend'];
        this.parent = data['parent'];
    },

    statics: {
        getList: function(param, callback) {
            FM.dataApi.ajax.get("fos/meta/queryKind/", param, function(data) {
                var kinds = [],
                    kind;
                for (var i = 0; i < data.data.length; i++) {
                    kind = new FM.dataApi.ixPoiKind(data.data[i]);
                    kinds.push(kind);
                }
                callback(kinds);
            });
        }
    }
});
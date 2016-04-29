/**
 * Created by wangmingdong on 2016/4/29.
 */
FM.dataApi.ixPoiTopKind = FM.dataApi.GeoDataModel.extend({

    /*
     * 初始化
     */
    initialize: function(data, options) {
        FM.setOptions(this, options);
        this.geoLiveType = "IXPOITOPKIND";
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData: function(data) {
        this.id = data["id"];
        this.code = data["code"];
        this.name = data["name"];
    },
    /*
     *获取的一级菜单信息
     */
    getIntegrate: function() {
        var data = {};
        data["id"] = this.id;
        data["code"] = this.code;
        data["name"] = this.name;
        return data;
    },
    statics: {
        getList: function(param, callback) {
            FM.dataApi.ajax.get("fos/meta/queryTopKind", param, function(data) {
                var topKinds = [],
                    kind;
                for (var i = 0; i < data.data.length; i++) {
                    kind = new FM.dataApi.ixPoiTopKind(data.data[i]);
                    topKinds.push(kind);
                }
                callback(topKinds);
            });
        }
    }
});
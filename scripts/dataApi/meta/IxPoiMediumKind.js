/**
 * Created by wangmingdong on 2016/4/29.
 */
FM.dataApi.ixPoiMediumKind = FM.dataApi.GeoDataModel.extend({

    /*
     * 初始化
     */
    initialize: function(data, options) {
        FM.setOptions(this, options);
        this.geoLiveType = "IXPOIMEDIUMKIND";
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData: function(data) {
        this.id = data["id"];
        this.code = data["code"];
        this.name = data["name"];
        this.topId = data["topId"];
    },
    /*
     *获取的二级菜单信息
     */
    getIntegrate: function() {
        var data = {};
        data["id"] = this.id;
        data["code"] = this.code;
        data["name"] = this.name;
        data["topId"] = this.topId;
        return data;
    },
    getSnapShot: function() {
        var data = {};
        data["id"] = this.id;
        data["code"] = this.code;
        data["name"] = this.name;
        data["topId"] = this.topId;
        return data;
    },
    statics: {
        getList: function(param, callback) {
            FM.dataApi.ajax.get("fos/meta/queryMediumKind", param, function(data) {
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
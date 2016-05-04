/**
 * Created by wangmingdong on 2016/4/29.
 */
FM.dataApi.ixPoiKind = FM.dataApi.GeoDataModel.extend({

    /*
     * 初始化
     */
    initialize: function(data, options) {
        FM.setOptions(this, options);
        this.geoLiveType = "IXPOIKIND";
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData: function(data) {
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
    /*
     *获取的三级菜单信息
     */
    getIntegrate: function() {
        var data = {};
        data["id"] = this.id;
        data["mediumId"] = this.mediumId;
        data["kindName"] = this.kindName;
        data["kindCode"] = this.kindCode;
        data["dispOnLink"] = this.dispOnLink;
        data["chainFlag"] = this.chainFlag;
        data["level"] = this.level;
        data["extend"] = this.extend;
        data["parent"] = this.parent;
        return data;
    },
    statics: {
        getList: function(param, callback) {
            FM.dataApi.ajax.get("fos/meta/queryKind", param, function(data) {
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
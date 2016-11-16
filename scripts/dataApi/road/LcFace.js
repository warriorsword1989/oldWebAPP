/**
 * Created by linglong on 2016/8/12.
 */
fastmap.dataApi.LCFace = fastmap.dataApi.GeoDataModel.extend({
    //
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = 'LCFACE';
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData: function (data) {
        this.pid = data.pid;
        this.featurePid = data.featurePid || 0;
        this.geometry = data.geometry;
        this.meshId = data.meshId || 0;
        this.kind = data.kind || 0;
        this.form = data.form || 0;
        this.displayClass = data.displayClass || 0;
        this.area = data.area || 0;
        this.perimeter = data.perimeter || 0;
        this.scale = data.scale || 0;
        this.detailFlag = data.detailFlag || 0;
        this.names = [];
        if (data.names) {
            for (var i = 0, len = data.names.length; i < len; i++) {
                this.names.push(fastmap.dataApi.lcFaceName(data.names[i]));
            }
        }
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.featureId = this.featurePid;
        data.geometry = this.geometry;
        data.meshId = this.meshId;
        data.kind = this.kind;
        data.form = this.form;
        data.displayClass = this.displayClass;
        data.area = this.area;
        data.perimeter = this.perimeter;
        data.scale = this.scale;
        data.detailFlag = this.detailFlag;
        data.names = [];
        if (this.names) {
            for (var i = 0, len = this.names.length; i < len; i++) {
                data.names.push(this.names[i].getIntegrate());
            }
        }
        data.geoLiveType = this.geoLiveType;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.featureId = this.featureId;
        data.geometry = this.geometry;
        data.area = this.area;
        data.perimeter = this.perimeter;
        data.meshId = this.meshId;
        data.geoLiveType = this.geoLiveType;
        data.names = [];
        if (this.names) {
            for (var i = 0, len = this.names.length; i < len; i++) {
                data.names.push(this.names[i].getIntegrate());
            }
        }
        return data;
    }

});

fastmap.dataApi.lcFace = function (data, options) {
    return new fastmap.dataApi.LCFace(data, options);
};

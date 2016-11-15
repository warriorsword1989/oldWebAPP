/**
 * Created by wuz on 2016/8/25.
 */
FM.dataApi.ColPoiList = FM.dataApi.GeoDataModel.extend({
    geoLiveType: 'COL_POI_LIST',
    /*
     * DB-->UI
     */
    setAttributes: function (dataArr) { // 参数是数组
        this.dataList = [];
        if (dataArr && dataArr.length > 0) {
            for (var i = 0, len = dataArr.length; i < len; i++) {
                var obj = new FM.dataApi.ColPoi(dataArr[i]);
                this.dataList.push(obj);
            }
        }
    },
    /*
     * UI-->DB
     */
    getIntegrate: function () {
        var ret = [];
        if (this.dataList && this.dataList.length > 0) {
            for (var i = 0, len = this.dataList.length; i < len; i++) {
                ret.push(this.dataList[i].getIntegrate());
            }
        }
        // ret["geoLiveType"] = this.geoLiveType;
        return ret;
    }
});

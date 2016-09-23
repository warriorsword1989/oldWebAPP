/**
 * Created by wangmingdong on 2016/5/26.
 */
FM.dataApi.IxSamepoiPart = FM.dataApi.DataModel.extend({
    dataModelType: "IX_SAMEPOI_PART",
    /*
     * 返回参数赋值
     */
    setAttributes: function(data) {
        this.groupId = data['groupId'] || 0;
        this.poiPid = data['poiPid'] || 0;
        this.rowId = data["rowId"];
    },
    getIntegrate: function() {
        var ret = {};
        ret["groupId"] = this.groupId;
        ret["poiPid"] = this.poiPid;
        ret["rowId"] = this.rowId;
        return ret;
    }
});
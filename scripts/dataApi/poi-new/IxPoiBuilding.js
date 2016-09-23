/**
 * Created by mali on 2016/5/27.
 */
FM.dataApi.IxPoiBuilding = FM.dataApi.DataModel.extend({
    dataModelType: "IX_POI_BUILDING",
    /*
     * 返回参数赋值
     */
    setAttributes: function(data) {
        this.poiPid = data['poiPid'] || 0;
        this.floorUsed = data['floorUsed'];
        this.floorEmpty = data['floorEmpty'];
        this.memo = data['memo'];
        this.uRecord = data['uRecord'] || 0;
        this.uFields = data['uFields'];
    },
    getIntegrate: function(){
        var ret = {};
        ret['poiPid'] = this.poiPid;
        ret['floorUsed'] = this.floorUsed;
        ret['floorEmpty'] = this.floorEmpty;
        ret['memo'] = this.memo;
        ret['uRecord'] = this.uRecord;
        ret['uFields'] = this.uFields;
        return ret;
    }
});
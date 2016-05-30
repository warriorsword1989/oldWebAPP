/**
 * Created by mali on 2016/5/27.
 */
FM.dataApi.AuIxPoiBuilding = FM.dataApi.DataModel.extend({
    dataModelType: "AU_IX_POI_BUILDING",
    /*
     * 返回参数赋值
     */
    setAttributes: function(data) {
        this.audataId = data['audataId'];
        this.poiPid = data['poiPid'] || 0;
        this.floorUsed = data['floorUsed'];
        this.floorEmpty = data['floorEmpty'];
        this.memo = data['memo'];
        this.attTaskId = data['attTaskId'] || 0;
        this.fieldTaskId = data['fieldTaskId'] || 0;
        this.attOprstatus = data['attOprstatus'] || 0;
        this.attCheckstatus = data['attCheckstatus'] || 0;
    },
    getIntegrate: function(){
        var ret = {};
        ret['audataId'] = this.audataId;
        ret['poiPid'] = this.poiPid;
        ret['floorUsed'] = this.floorUsed;
        ret['floorEmpty'] = this.floorEmpty;
        ret['memo'] = this.memo;
        ret['attTaskId'] = this.attTaskId;
        ret['fieldTaskId'] = this.fieldTaskId;
        ret['attOprstatus'] = this.attOprstatus;
        ret['attCheckstatus'] = this.attCheckstatus;
        return ret;
    }
});
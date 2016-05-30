/**
 * Created by mali on 2016/5/27.
 */
FM.dataApi.AuIxPoiRestaurant = FM.dataApi.DataModel.extend({
    dataModelType: "AU_IX_POI_RESTAURANT",
    /*
     * 返回参数赋值
     */
    setAttributes: function(data) {
        this.audataId = data['audataId'];
        this.restaurantId = data['restaurantId'] || 0;
        this.poiPid = data['poiPid'] || 0;
        this.foodType = data['foodType'];
        this.creditCard = data['creditCard'];
        this.avgCost = data['avgCost'] || 0;
        this.parking = data['parking'] || 0;
    },
    getIntegrate: function(){
        var ret = {};
        ret['audataId'] = this.audataId;
        ret['restaurantId'] = this.restaurantId;
        ret['poiPid'] = this.poiPid;
        ret['foodType'] = this.foodType;
        ret['creditCard'] = this.creditCard;
        ret['avgCost'] = this.avgCost;
        ret['parking'] = this.parking;
        return ret;
    }
});
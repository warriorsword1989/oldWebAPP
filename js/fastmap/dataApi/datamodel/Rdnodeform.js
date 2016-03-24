/**
 * Created by wangtun on 2016/3/23.
 */
/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.rdNodeForm = fastmap.dataApi.GeoDataModel.extend({


    /***
     *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"] || "";
        this.formOfWay = data["formOfWay"] || 1;
        this.auxiFlag = data["auxiFlag"] || 0;
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["pid"] = this.pid;
        data["formOfWay"] = this.formOfWay;
        data["auxiFlag"]  = this.auxiFlag;
        return data;
    },

    /**
     * 获取Node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["pid"] = this.pid;
        data["formOfWay"] = this.formOfWay;
        data["auxiFlag"]  = this.auxiFlag;
        return data;
    }
});

/***
 * Rdnode初始化函数
 * @param id
 * @param point 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdnodeform = function (data, options) {
    return new fastmap.dataApi.rdNodeForm(data, options);
}


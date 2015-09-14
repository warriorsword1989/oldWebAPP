/**
         * Created by zhongxiaoming on 2015/9/10.
         * Class GeoDataModel 数据模型基类
         */
        define(['js/fastmap/fastmap'], function (fastmap) {
            fastmap.dataApi.GeoDataModel = L.Class.extend({
                options: {
                },

                /***
                 *
                 * @param options
                 */
                initialize: function (options) {
                    this.options = options ||{};
                    L.setOptions(this, options);
                    this.snapShot = {};
                    this.integrate = {};
                },

                /***
                 * 设置对象概要属性信息
                 * @param snapshot
                 */
                setSnapShot:function(snapshot){
                    this.snapShot = snapshot;
                },

                /***
                 * 设置对象完整信息
                 * @param integrate
                 */
                setIntegrate:function(integrate){

                }
    });

});

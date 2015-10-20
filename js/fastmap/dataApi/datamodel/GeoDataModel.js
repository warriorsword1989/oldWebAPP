/**
 * Created by zhongxiaoming on 2015/9/10.
 * Class GeoDataModel 数据模型基类
 */

fastmap.dataApi.GeoDataModel = L.Class.extend({
    options: {},

    /***
     *
     * @param id
     * 模型ID
     */
    id:null,
    /***
     *
     * @param id
     * 模型几何
     */
    geometry:null,
    /***
     *
     * @param options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.snapShot = {};
        this.integrate = {};
    },

    /***
     * 设置对象概要属性信息
     * @param snapshot
     */
    getSnapShot: function (snapshot) {
        this.snapShot = snapshot;
    },

    /***
     * 设置对象完整信息
     * @param integrate
     */
    getIntegrate: function (integrate) {
    },

    getDiffProperties:function(integrateJson){
        var difJson={};
        var originJson = this.getIntegrate();
        for  (property in originJson.hasOwnProperty()) {
            if (typeof originJson[property]=="number"){
                if(originJson[property]!=integrateJson[property]){
                    difJson[property] = originJson[property];
                }
            }
            else if(typeof originJson[property]=="string"){
                if(originJson[property]!=integrateJson[property]){
                    difJson[property] = originJson[property];
                }
            }
            else if(typeof originJson[property]=="boolean"){
                if(originJson[property]!=integrateJson[property]){
                    difJson[property] = originJson[property];
                }
            }
            else if(typeof originJson[property]=="object"){
                if(JSON.stringify(originJson[property]) != JSON.stringify(integrateJson[property])){
                    difJson[property] = originJson[property];
                }
            }
        }
        return difJson;
    }
});


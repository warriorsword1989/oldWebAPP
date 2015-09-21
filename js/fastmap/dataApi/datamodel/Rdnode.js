/**
 * Created by zhongxiaoming on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.rdNode = fastmap.dataApi.GeoDataModel.extend({

    options: {},
    /***
     *
     * @param id id
     * @param point 初始化rdnode的点
     * @param options 其他可选参数
     */
    initialize: function (id, point, options) {
        L.setOptions(this, options);
        this.id = id;
        this._latlng = point;
    }
});

/***
 * Rdnode初始化函数
 * @param id id
 * @param point 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdnode = function (id, point, options) {
    return new fastmap.dataApi.rdNode(id, point, options);
}


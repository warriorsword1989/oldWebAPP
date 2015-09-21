/**
 * Created by zhongxiaoming on 2015/9/9.
 * Class Rdlink
 */

fastmap.dataApi.rdLind = fastmap.dataApi.GeoDataModel.extend({

    options: {},

    /***
     *
     * @param linkId id
     * @param startNodeId 开始点nodeid
     * @param endNodeId 结束点nodeid
     * @param points 构成rdlink的点数组
     * @param options 其他可选参数
     */
    initialize: function (linkId, startNodeId, endNodeId, points, options) {
        L.setOptions(this, options);
        this.id = linkId;
        if (points.length == 0) {
            throw "the length of points is 0";
        }
        this.points = points;
        this.startNode = fastmap.dataApi.rdnode(startNodeId, points[0]);
        this.endNode = fastmap.dataApi.rdnode(endNodeId, points[points.length - 1]);
    }
})


/**
 * Created by zhongxiaoming on 2015/9/1.
 */
define(['js/fastmap/fastmap'], function (fastmap) {
    fastmap.dataApi.rdLind = L.Class.extend({

        options: {
        },

        initialize: function (linkId, startNodeId, endNodeId, points, options) {
            L.setOptions(this, options);
            this.id = linkId;
            if(points.length == 0){
                throw "the length of points is 0";
            }
            this.points = points;
            this.startNode = fastmap.dataApi.rdnode(startNodeId,points[0]);
            this.endNode = fastmap.dataApi.rdnode(endNodeId,points[points.length-1]);
        }
    })
});

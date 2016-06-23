/**
 * Created by zhongxiaoming on 2016/4/26.
 * Class SelectObject 将所有的选择数据的工具进行合并
 */

fastmap.uikit.SelectObject = (function () {

    var instantiated;

    function init(options) {
        var SelectObject = L.Class.extend({

                /***
                 *
                 * @param {Object}options
                 */
                initialize: function (options) {
                    this.options = options || {};
                    L.setOptions(this, options);
                    this._map = this.options.map;
                    this.highlightLayer = this.options.highlightLayer;
                    this.eventController = fastmap.uikit.EventController();
                    this.tiles = this.options.tiles;
                    this.transform = new fastmap.mapApi.MecatorTranform();
                    this.redrawTiles = [];
                },

                /***
                 *
                 * @param data tile中缓存的data
                 * @param type 当前高亮的图层类型
                 */
                drawGeomCanvasHighlight: function (data, type) {

                    this.eventController.fire(this.eventController.eventTypes.GETRELATIONID, {
                        id: data.properties.id,
                        rowId:data.properties.rowId,
                        optype: type,
                        branchType:data.properties.branchType

                    })
                }

            }
        )
        return new SelectObject(options);
    }

    return function (options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }

})();
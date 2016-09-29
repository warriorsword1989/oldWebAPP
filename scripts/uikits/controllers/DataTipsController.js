/**
 * Created by liwanchong on 2015/9/9.
 * 操作dataTip
 * @namespace fastmap
 * @class DataTipsController 单例
 */

fastmap.uikit.DataTipsController = (function () {
    var instantiated;

    function init() {

        var dataTipsController = L.Class.extend({
            /**
             * 事件管理器
             * @property includes
             */
            includes: L.Mixin.Events,
            /**
             *相关属性
             */
            options: {},
            /**
             *构造函数
             * @class DataTipsController
             * @constructor
             * @namespace  fastmap
             * @param {Object}options
             */
            initialize: function (options) {
                this.options = options || {};
                L.setOptions(this, options);
                this.dataTipsData = {};
                this.on("dataFromScene", this.OnSetDataTips, this);
            },
            OnSetDataTips: function (event) {
                this.setDataTipsData(event.id);
            },
            /**
             * 转换数据
             * @method toDataMode
             */
            toDataMode: function (data) {
                var switchData = {};
                if (data === null || data === undefined) {
                    var outLink = "", info = [];
                    switchData.pid = this.dataTipsData.id;
                    switchData.inLinkPid = this.dataTipsData.id;
                    var arr = this.dataTipsData.o_array;
                    for (var i = 0, len = arr.length; i < len; i++) {
                        var obj = {};
                        obj.flag = arr[i].oInfo;
                        info.push(obj);
                        outLink += arr[i].id;
                    }
                    switchData.restricInfo = info;
                    switchData.outLinkPid = outLink;
                    switchData.flag = 1;
                    switchData.relationshipType = 1;
                    switchData.type = 1;
                    switchData.time = [{startTime: "20121212", endTime: "20121213"}, {
                        startTime: "20141214",
                        endTime: "20141215"
                    }],
                    switchData.vehicleExpression = 14;


                } else {
                    if (data.type === "rdLink") {
                        alert(data.name);
                    } else if (data.type === "tips") {

                    }
                }
            },
            /**
             * 增加数据
             * @method copy
             */
            increase: function (data) {

            },
            /**
             *
             * @param data
             */
            setDataTipsData: function (data) {
                this.dataTipsData = data;
            },
            /**
             *
             * @returns {null|*}
             */
            getDataTipsData: function () {
                var data = this.dataTipsData;
                return data;
            }
        });


        return new dataTipsController();
    }

    return function () {
        if (!instantiated) {
            instantiated = init();
        }
        return instantiated;
    }
})();




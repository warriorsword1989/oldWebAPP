/**
 * fastmap模块
 *
 * @module fastmap
 */
define(['js/lib/leaflet-0.7.3/leaflet'],function (leaflet) {
    return window.fastmap ? window.fastmap : window.fastmap = {
        /**
         * mapApi类
         * 封装地图相关操作
         *
         * @namespace fastmap
         * @class mapApi
         */
        mapApi: {},
        /**
         * dataApi类
         * 封装相关地图数据类
         *
         * @namespace fastmap
         * @class dataApi
         */
        dataApi: {},
        /**
         * uiKit类
         * 封装地图界面类
         *
         * @namespace fastmap
         * @class uiKit
         */
        uiKit: {},
        /**
         * fastmapApi版本号
         * @property version
         * @type String
         */
        version: "1.1.0"
    };
});

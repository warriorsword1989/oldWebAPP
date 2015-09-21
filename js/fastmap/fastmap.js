/**
 * fastmap模块
 *
 * @module fastmap
 */

var FastMap = (function() {
    var instantiated;
    function init() {
        return {
            /**
             * fastmapApi版本号
             * @property version
             * @type String
             */
            version: "1.1.0"
        };
    }
    return function() {
        if (!instantiated) {
            instantiated = init();
        }
        return instantiated;
    }
})();

var fastmap=new FastMap();


/**
 * mapApi类
 * 封装地图相关操作
 *
 * @namespace fastmap
 * @class mapApi
 */
var MapApi = (function() {
    var instantiated;
    function init() {
        return { };
    }
    return function() {
        if (!instantiated) {
            instantiated = init();
        }
        return instantiated;
    }
})();

fastmap.mapApi = new MapApi();

/**
 * uiKit类
 * 封装地图界面类
 *
 * @namespace fastmap
 * @class uiKit
 */
var UIKit = (function() {
    var instantiated;
    function init() {
        return { };
    }
    return function() {
        if (!instantiated) {
            instantiated = init();
        }
        return instantiated;
    }
})();

fastmap.uikit=new UIKit();

/**
 * dataApi类
 * 封装相关地图数据类
 *
 * @namespace fastmap
 * @class dataApi
 */
var DataApi=(function() {
    var instantiated;
    function init() {
        return { };
    }
    return function() {
        if (!instantiated) {
            instantiated = init();
        }
        return instantiated;
    }
})();

fastmap.dataApi=new DataApi();

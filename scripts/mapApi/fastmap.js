/**
 * fastmap模块
 *
 * @module fastmap
 */
var fastmap = (function () {
    var instantiated;

    function init() {
        return {
            /**
             * fastmapApi版本号
             * @property version
             * @type String
             */
            version: '1.1.0'
        };
    }
    instantiated = (!instantiated ? instantiated = init() : instantiated);
    return instantiated;
}());
/**
 * mapApi类
 * 封装地图相关操作
 *
 * @namespace fastmap
 * @class mapApi
 */
fastmap.mapApi = (function () {
    var instantiated;

    function init() {
        return {};
    }
    instantiated = (!instantiated ? instantiated = init() : instantiated);
    return instantiated;
}());
/**
 * symbol类
 * 封装符号库相关操作
 */
fastmap.mapApi.symbol = (function () {
    var instantiated;

    function init() {
        return {};
    }
    instantiated = (!instantiated ? instantiated = init() : instantiated);
    return instantiated;
}());
/**
 * uiKit类
 * 封装地图界面类
 *
 * @namespace fastmap
 * @class uiKit
 */
fastmap.uikit = (function () {
    var instantiated;

    function init() {
        return {};
    }
    instantiated = (!instantiated ? instantiated = init() : instantiated);
    return instantiated;
}());
/**
 * dataApi类
 * 封装相关地图数据类
 *
 * @namespace fastmap
 * @class dataApi
 */
fastmap.dataApi = (function () {
    var instantiated;

    function init() {
        return {
            id: 'test'
        };
    }
    instantiated = (!instantiated ? instantiated = init() : instantiated);
    return instantiated;
}());

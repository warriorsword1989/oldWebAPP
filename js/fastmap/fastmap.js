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
        uiKit: {
            ShapEditController:new fastmap.uikit.ShapEditController(),
            ToolTipsController:new fastmap.uikit.ToolTipsController(),
            CheckResultController:new fastmap.uikit.CheckResultController(),
            OutputController:new fastmap.uikit.OutputController(),
            SelectController:new fastmap.uikit.SelectController(),
            DataTipsController:new fastmap.uikit.DataTipsController(),
            FeatCodeController:new fastmap.uikit.FeatCodeController(),
            ObjectEditController:new fastmap.uikit.ObjectEditController(),
            Tools:[]
        },
        /**
         * fastmapApi版本号
         * @property version
         * @type String
         */
        version: "1.1.0"
    };
});
